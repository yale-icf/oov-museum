"""
Run Google Cloud Vision document_text_detection on all 868 museum images
and save word-level bounding boxes to scripts/ocr_boxes/<id>.json.

Output format per file:
{
  "img_w": 1500,
  "img_h": 1125,
  "words": [
    {"text": "SOCIETE", "x0": 0.10, "y0": 0.05, "x1": 0.30, "y1": 0.09},
    ...
  ]
}
Coordinates are fractions (0-1) of the resized image dimensions.

Usage:
    python scripts/google_ocr.py [--limit N]

Requires GOOGLE_APPLICATION_CREDENTIALS environment variable.
"""

import argparse
import io
import json
import os
import sys
import time

from google.cloud import vision
from PIL import Image
Image.MAX_IMAGE_PIXELS = None  # disable decompression bomb check (we resize anyway)

SITE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
DATA_PATH = os.path.join(SITE_DIR, "data", "museum-data.json")
BOXES_DIR = os.path.join(SITE_DIR, "scripts", "ocr_boxes")
JPEG_DIR = r"C:\Users\ks2479\Documents\my-project\origins-of-value\JPEG Files"

MAX_IMAGE_SIZE = 1500
MAX_RETRIES = 3
RETRY_DELAY = 5


def build_image_index(jpeg_dir):
    index = {}
    for root, _dirs, files in os.walk(jpeg_dir):
        for fname in files:
            if fname.lower().endswith(".jpg"):
                stem = os.path.splitext(fname)[0].lower()
                index[stem] = os.path.join(root, fname)
    print(f"Found {len(index)} JPEG files.")
    return index


def resize_image_bytes(image_path, max_size=MAX_IMAGE_SIZE):
    """Open image, resize so long edge <= max_size, return (JPEG bytes, (w, h))."""
    img = Image.open(image_path)
    if img.mode != "RGB":
        img = img.convert("RGB")
    w, h = img.size
    if max(w, h) > max_size:
        scale = max_size / max(w, h)
        img = img.resize((int(w * scale), int(h * scale)), Image.LANCZOS)
    buf = io.BytesIO()
    img.save(buf, format="JPEG", quality=85)
    return buf.getvalue(), img.size


def collect_work_items(items):
    """Return flat list of image IDs to process (868 total)."""
    work = []
    seen = set()
    for item in items:
        pages = item.get("pages", [])
        if not pages:
            doc_id = item["id"]
            if doc_id not in seen:
                work.append(doc_id)
                seen.add(doc_id)
        else:
            for page in pages:
                page_id = page["id"]
                if page_id not in seen:
                    work.append(page_id)
                    seen.add(page_id)
    return work


def extract_boxes(client, image_bytes, img_w, img_h):
    """Call Vision API; return list of {text, x0, y0, x1, y1} dicts."""
    image = vision.Image(content=image_bytes)

    for attempt in range(MAX_RETRIES):
        try:
            response = client.document_text_detection(image=image)
            break
        except Exception as e:
            if attempt < MAX_RETRIES - 1:
                wait = RETRY_DELAY * (2 ** attempt)
                print(f"\n    Retrying in {wait}s ({e})...")
                time.sleep(wait)
            else:
                raise

    if response.error.message:
        raise RuntimeError(f"Vision API error: {response.error.message}")

    annotation = response.full_text_annotation
    if not annotation:
        return []

    words = []
    for page in annotation.pages:
        pw = page.width or img_w
        ph = page.height or img_h
        for block in page.blocks:
            for paragraph in block.paragraphs:
                for word in paragraph.words:
                    word_text = "".join(s.text for s in word.symbols)
                    if not word_text.strip():
                        continue
                    verts = word.bounding_box.vertices
                    xs = [v.x for v in verts]
                    ys = [v.y for v in verts]
                    words.append({
                        "text": word_text,
                        "x0": round(min(xs) / pw, 5),
                        "y0": round(min(ys) / ph, 5),
                        "x1": round(max(xs) / pw, 5),
                        "y1": round(max(ys) / ph, 5),
                    })
    return words


def main():
    parser = argparse.ArgumentParser(
        description="Google Vision bounding-box OCR for OOV corpus"
    )
    parser.add_argument("--limit", type=int, default=0,
                        help="Max new images to process (0 = all)")
    args = parser.parse_args()

    if hasattr(sys.stdout, "reconfigure"):
        sys.stdout.reconfigure(encoding="utf-8", errors="replace")

    if not os.environ.get("GOOGLE_APPLICATION_CREDENTIALS"):
        print("Error: GOOGLE_APPLICATION_CREDENTIALS not set.")
        print('Set it with: $env:GOOGLE_APPLICATION_CREDENTIALS = "path\\to\\key.json"')
        sys.exit(1)

    client = vision.ImageAnnotatorClient()

    if not os.path.isdir(JPEG_DIR):
        print(f"Error: JPEG directory not found: {JPEG_DIR}")
        sys.exit(1)
    image_index = build_image_index(JPEG_DIR)

    os.makedirs(BOXES_DIR, exist_ok=True)

    with open(DATA_PATH, "r", encoding="utf-8") as f:
        items = json.load(f)

    work_items = collect_work_items(items)
    total = len(work_items)
    already_done = sum(
        1 for doc_id in work_items
        if os.path.exists(os.path.join(BOXES_DIR, f"{doc_id}.json"))
    )
    print(f"Total images: {total}  |  Already done: {already_done}  |  Remaining: {total - already_done}")

    processed = 0
    errors = 0
    limit = args.limit if args.limit > 0 else float("inf")

    for i, doc_id in enumerate(work_items):
        if processed >= limit:
            print(f"\nReached limit of {args.limit}.")
            break

        boxes_path = os.path.join(BOXES_DIR, f"{doc_id}.json")
        if os.path.exists(boxes_path):
            continue

        image_path = image_index.get(doc_id.lower())
        if not image_path:
            print(f"[{i+1}/{total}] {doc_id}: image not found, skipping")
            continue

        print(f"[{i+1}/{total}] {doc_id}...", end=" ", flush=True)

        try:
            image_bytes, (img_w, img_h) = resize_image_bytes(image_path)
            words = extract_boxes(client, image_bytes, img_w, img_h)
            data = {"img_w": img_w, "img_h": img_h, "words": words}
            with open(boxes_path, "w", encoding="utf-8") as f:
                json.dump(data, f, ensure_ascii=False, separators=(",", ":"))
            processed += 1
            print(f"{len(words)} words")
        except Exception as e:
            print(f"ERROR: {e}")
            errors += 1

        time.sleep(0.1)

    print(f"\nComplete. Processed: {processed}, Errors: {errors}")
    print(f"Box files in: {BOXES_DIR}")


if __name__ == "__main__":
    main()
