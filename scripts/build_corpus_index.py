"""
Build a SQLite FTS5 full-text search index for the OOV corpus.

Reads OCR text from scripts/ocr/*.txt (falling back to ocr_checkpoint.json)
and metadata from data/museum-data.json, then creates scripts/corpus.db with:

  - docs          — one row per museum item (545 rows)
  - docs_fts      — FTS5 virtual table (Porter stemming) over ocr_text
  - boxes         — word bounding boxes from scripts/ocr_boxes/*.json (868 rows)
  - corpus_stats  — summary key/value pairs

Usage:
    python scripts/build_corpus_index.py

Run after ocr_documents.py and google_ocr.py have produced their output files.
"""

import json
import os
import re
import sqlite3
import datetime


def clean_for_index(text):
    """Strip Claude's metadata from OCR text, keeping only the transcribed content."""
    # 1. Remove the Notable Markings section entirely (visual descriptions, not transcribed text)
    #    Also removes any **Note:** paragraphs Claude appends there
    text = re.sub(r'##?\s*Notable [Mm]arkings?:?.*$', '', text, flags=re.DOTALL)
    # 2. Remove markdown headers (# Title, ## Section)
    text = re.sub(r'^#+\s+.*$', '', text, flags=re.MULTILINE)
    # 3. Remove horizontal rules
    text = re.sub(r'^---+$', '', text, flags=re.MULTILINE)
    # 4. Remove bold labels like **Header:** or **Original (Dutch):**
    text = re.sub(r'\*\*[^*\n]+\*\*:?', '', text)
    # 5. Remove remaining bold/italic markers and bullet dashes
    text = re.sub(r'\*+', '', text)
    text = re.sub(r'^[-•]\s+', '', text, flags=re.MULTILINE)
    # 6. Collapse multiple blank lines
    text = re.sub(r'\n{3,}', '\n\n', text)
    return text.strip()

SITE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
DATA_PATH = os.path.join(SITE_DIR, "data", "museum-data.json")
CHECKPOINT_PATH = os.path.join(SITE_DIR, "scripts", "ocr_checkpoint.json")
OCR_DIR = os.path.join(SITE_DIR, "scripts", "ocr")
BOXES_DIR = os.path.join(SITE_DIR, "scripts", "ocr_boxes")
DB_PATH = os.path.join(SITE_DIR, "scripts", "corpus.db")


def load_ocr_text(doc_id):
    """Return OCR text for doc_id: prefer .txt file, fall back to checkpoint."""
    txt_path = os.path.join(OCR_DIR, f"{doc_id}.txt")
    if os.path.exists(txt_path):
        with open(txt_path, "r", encoding="utf-8") as f:
            return f.read().strip()
    return ""


def load_checkpoint():
    if os.path.exists(CHECKPOINT_PATH):
        with open(CHECKPOINT_PATH, "r", encoding="utf-8") as f:
            return json.load(f)
    return {}


def first_int(arr):
    """Extract first integer from an array field, or None."""
    if not arr:
        return None
    try:
        year = int(str(arr[0])[:4])
        return year if 1000 <= year <= 2100 else None
    except (ValueError, TypeError):
        return None


def comma_join(arr):
    """Join an array field as comma-separated string, normalizing mixed separators."""
    if not arr:
        return ""
    # Each element may itself contain pipe or semicolon separators from the Excel source
    values = []
    for x in arr:
        for part in re.split(r'[|;,]', str(x)):
            part = part.strip()
            if part:
                values.append(part)
    return ", ".join(values)


def get_item_ocr(item, checkpoint):
    """
    Assemble full OCR text for a museum item.
    Single-page: direct lookup.
    Multi-page: concatenate all sub-page texts.
    """
    pages = item.get("pages", [])
    if not pages:
        # Single image — try .txt first, then checkpoint
        text = load_ocr_text(item["id"])
        if not text:
            text = checkpoint.get(item["id"], "")
        return text.strip()
    else:
        parts = []
        for page in pages:
            text = load_ocr_text(page["id"])
            if not text:
                text = checkpoint.get(page["id"], "")
            if text.strip():
                parts.append(text.strip())
        return "\n\n---\n\n".join(parts)


def build_db(items, checkpoint):
    # Remove existing DB
    if os.path.exists(DB_PATH):
        os.remove(DB_PATH)
        print(f"Removed existing {DB_PATH}")

    conn = sqlite3.connect(DB_PATH)
    conn.row_factory = sqlite3.Row
    cur = conn.cursor()

    # --- Schema ---
    cur.executescript("""
        CREATE TABLE docs (
            id              TEXT PRIMARY KEY,
            title           TEXT,
            description     TEXT,
            type            TEXT,
            period          TEXT,
            issuing_country TEXT,
            subject_country TEXT,
            issue_year      INTEGER,
            language        TEXT,
            owner           TEXT,
            ocr_text        TEXT,
            word_count      INTEGER
        );

        CREATE VIRTUAL TABLE docs_fts USING fts5(
            ocr_text,
            content='docs',
            content_rowid='rowid',
            tokenize='porter unicode61'
        );

        CREATE TABLE boxes (
            image_id   TEXT PRIMARY KEY,
            words_json TEXT
        );

        CREATE TABLE corpus_stats (
            key   TEXT PRIMARY KEY,
            value TEXT
        );
    """)

    # --- Insert docs ---
    inserted = 0
    with_ocr = 0

    for item in items:
        ocr_text = clean_for_index(get_item_ocr(item, checkpoint))

        cur.execute(
            """INSERT INTO docs
               (id, title, description, type, period,
                issuing_country, subject_country, issue_year, language,
                owner, ocr_text, word_count)
               VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)""",
            (
                item["id"],
                item.get("title", ""),
                item.get("description", ""),
                comma_join(item.get("type", [])),
                comma_join(item.get("period", [])),
                comma_join(item.get("issuingCountry", [])),
                comma_join(item.get("subjectCountry", [])),
                first_int(item.get("issueYear")),
                comma_join(item.get("language", [])),
                item.get("owner", ""),
                ocr_text,
                len(ocr_text.split()) if ocr_text else 0,
            ),
        )
        inserted += 1
        if ocr_text:
            with_ocr += 1

    conn.commit()
    print(f"Inserted {inserted} documents ({with_ocr} with OCR text).")

    # --- Build FTS index ---
    cur.execute("INSERT INTO docs_fts(docs_fts) VALUES('rebuild')")
    conn.commit()
    print("FTS5 index built.")

    # --- Load bounding boxes ---
    # Only for images the collection still shows. ocr_boxes/ keeps files for
    # records that were later removed or merged away, and without this filter
    # they rode into the index: 138 of 866 rows pointed at ids that are neither
    # a record nor a leaf. Unreachable (the lightbox needs a docs row) but they
    # bloat a file every full-text search downloads.
    live_images = set()
    for item in items:
        live_images.add(item["id"])
        for page in item.get("pages") or []:
            if page.get("id"):
                live_images.add(page["id"])

    boxes_loaded = 0
    boxes_skipped = 0
    if os.path.isdir(BOXES_DIR):
        for fname in sorted(os.listdir(BOXES_DIR)):
            if not fname.endswith(".json"):
                continue
            image_id = fname[:-5]
            if image_id not in live_images:
                boxes_skipped += 1
                continue
            try:
                with open(os.path.join(BOXES_DIR, fname), "r", encoding="utf-8") as f:
                    data = json.load(f)
                words = data.get("words", [])
                if words:
                    cur.execute(
                        "INSERT OR IGNORE INTO boxes (image_id, words_json) VALUES (?, ?)",
                        (image_id, json.dumps(words, ensure_ascii=False, separators=(",", ":"))),
                    )
                    boxes_loaded += 1
            except Exception as e:
                print(f"  Warning: {fname}: {e}")
        conn.commit()
        print(f"Loaded {boxes_loaded} bounding box files into boxes table"
              + (f"; skipped {boxes_skipped} for ids no longer in the collection." if boxes_skipped
                 else "."))
    else:
        print("No ocr_boxes directory found; boxes table empty.")

    # --- Corpus stats ---
    total_words = sum(
        r[0] for r in cur.execute("SELECT word_count FROM docs").fetchall()
    )
    year_min = cur.execute(
        "SELECT MIN(issue_year) FROM docs WHERE issue_year IS NOT NULL"
    ).fetchone()[0]
    year_max = cur.execute(
        "SELECT MAX(issue_year) FROM docs WHERE issue_year IS NOT NULL"
    ).fetchone()[0]

    stats = {
        "total_docs": str(inserted),
        "docs_with_ocr": str(with_ocr),
        "total_words": str(total_words),
        "year_min": str(year_min) if year_min else "",
        "year_max": str(year_max) if year_max else "",
        "built_at": datetime.datetime.now().isoformat(timespec="seconds"),
    }
    cur.executemany(
        "INSERT INTO corpus_stats (key, value) VALUES (?, ?)", stats.items()
    )
    conn.commit()

    conn.close()
    return stats


def main():
    print(f"Loading museum data from {DATA_PATH}...")
    with open(DATA_PATH, "r", encoding="utf-8") as f:
        items = json.load(f)
    print(f"  {len(items)} items loaded.")

    checkpoint = load_checkpoint()
    print(f"  Checkpoint has {len(checkpoint)} entries.")

    print(f"\nBuilding {DB_PATH}...")
    stats = build_db(items, checkpoint)

    print(f"\nCorpus stats:")
    for k, v in stats.items():
        print(f"  {k}: {v}")
    print(f"\nDone. Run: python scripts/corpus_search.py")


if __name__ == "__main__":
    main()
