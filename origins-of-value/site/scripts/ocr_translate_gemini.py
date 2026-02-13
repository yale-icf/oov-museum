"""
Batch OCR + translation for Origins of Value museum documents using Google Gemini.

Uses the Gemini API (gemini-2.0-flash) via the google-genai package to extract
visible text from document thumbnails, translate non-English text, and save
results into museum-data.json as a "transcription" field.

Free tier: 15 requests/minute, 1M tokens/day — sufficient for gradual processing.

Resumable: saves progress to a checkpoint file so it can be restarted
without re-processing completed documents.

Usage:
    python scripts/ocr_translate_gemini.py [--limit N]

Requires:
    pip install google-genai
    Set GEMINI_API_KEY environment variable (free from https://aistudio.google.com/apikey)
"""

import argparse
import json
import os
import sys
import time

from google import genai

SITE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
DATA_PATH = os.path.join(SITE_DIR, "data", "museum-data.json")
THUMBS_DIR = os.path.join(SITE_DIR, "thumbnails")
CHECKPOINT_PATH = os.path.join(SITE_DIR, "scripts", "gemini_ocr_checkpoint.json")

MODEL = "gemini-2.0-flash"
MAX_RETRIES = 3
RETRY_DELAY = 5  # seconds
REQUEST_DELAY = 4.5  # seconds between requests (15 RPM free tier = 1 per 4s)


def load_checkpoint():
    if os.path.exists(CHECKPOINT_PATH):
        with open(CHECKPOINT_PATH, "r", encoding="utf-8") as f:
            return json.load(f)
    return {}


def save_checkpoint(checkpoint):
    with open(CHECKPOINT_PATH, "w", encoding="utf-8") as f:
        json.dump(checkpoint, f, ensure_ascii=False)


def extract_text(client, image_path, title, description, location):
    """Send an image to Gemini and get transcribed/translated text."""
    context_parts = []
    if title:
        context_parts.append(f"Title: {title}")
    if description:
        context_parts.append(f"Description: {description}")
    if location:
        context_parts.append(f"Country: {', '.join(location)}")
    context = "\n".join(context_parts)

    prompt = f"""This is a scan of a historical financial document (bond, stock certificate, banknote, etc.).

Document context:
{context}

Please:
1. Read and transcribe ALL visible text in the image as accurately as possible.
2. If the text is in a language other than English, provide the original text first, then an English translation.
3. Note any visible signatures, stamps, serial numbers, or other markings.
4. If parts of the text are illegible or unclear, indicate this with [illegible] or [unclear].

Format your response as:
- If the document is in English: just provide the transcribed text.
- If in another language: provide the original text under "Original:" and the translation under "English translation:".
- End with any notable visual elements (stamps, seals, signatures) under "Notable markings:" if present.

Be concise but thorough. Focus on the actual text content."""

    image_file = genai.types.Part.from_uri(
        file_uri="",  # placeholder, we'll use inline data
        mime_type="image/jpeg",
    )

    # Read image and create inline data
    with open(image_path, "rb") as f:
        image_bytes = f.read()

    image_part = genai.types.Part.from_bytes(data=image_bytes, mime_type="image/jpeg")

    for attempt in range(MAX_RETRIES):
        try:
            response = client.models.generate_content(
                model=MODEL,
                contents=[image_part, prompt],
            )
            return response.text
        except Exception as e:
            error_str = str(e)
            if "429" in error_str or "RESOURCE_EXHAUSTED" in error_str:
                wait = RETRY_DELAY * (2 ** attempt)
                print(f"    Rate limited, waiting {wait}s...")
                time.sleep(wait)
            elif attempt < MAX_RETRIES - 1:
                wait = RETRY_DELAY * (2 ** attempt)
                print(f"    API error: {e}. Retrying in {wait}s...")
                time.sleep(wait)
            else:
                print(f"    Failed after {MAX_RETRIES} attempts: {e}")
                return None

    return None


def main():
    parser = argparse.ArgumentParser(
        description="OCR and translate museum documents using Gemini API"
    )
    parser.add_argument(
        "--limit",
        type=int,
        default=0,
        help="Maximum number of documents to process (0 = all)",
    )
    args = parser.parse_args()

    api_key = os.environ.get("GEMINI_API_KEY")
    if not api_key:
        print("Error: GEMINI_API_KEY environment variable not set.")
        print("Get a free key from https://aistudio.google.com/apikey")
        print('Set it with: $env:GEMINI_API_KEY = "your-key-here"')
        sys.exit(1)

    client = genai.Client(api_key=api_key)

    # Load museum data
    with open(DATA_PATH, "r", encoding="utf-8") as f:
        items = json.load(f)

    # Load checkpoint (already-processed document IDs -> transcriptions)
    checkpoint = load_checkpoint()
    print(f"Loaded {len(checkpoint)} previously processed documents from checkpoint.")

    total = len(items)
    skipped = 0
    processed = 0
    errors = 0
    limit = args.limit if args.limit > 0 else float("inf")

    for i, item in enumerate(items):
        if processed >= limit:
            print(f"\nReached limit of {args.limit} documents.")
            break

        doc_id = item["id"]

        # Skip if already processed
        if doc_id in checkpoint:
            skipped += 1
            continue

        image_path = os.path.join(THUMBS_DIR, f"{doc_id}.jpg")
        if not os.path.exists(image_path):
            print(f"[{i+1}/{total}] {doc_id}: thumbnail not found, skipping")
            checkpoint[doc_id] = ""
            save_checkpoint(checkpoint)
            continue

        print(f"[{i+1}/{total}] Processing {doc_id}: {item.get('title', 'Untitled')}...")

        result = extract_text(
            client,
            image_path,
            item.get("title", ""),
            item.get("description", ""),
            item.get("location", []),
        )

        if result is not None:
            checkpoint[doc_id] = result
            processed += 1
            print(f"    Done ({len(result)} chars)")
        else:
            checkpoint[doc_id] = ""
            errors += 1
            print(f"    Error - saved empty transcription")

        save_checkpoint(checkpoint)

        # Delay between requests to stay within free tier rate limits
        time.sleep(REQUEST_DELAY)

    # Write transcriptions back into museum-data.json
    print(f"\nWriting transcriptions to {DATA_PATH}...")
    for item in items:
        if item["id"] in checkpoint and checkpoint[item["id"]]:
            item["transcription"] = checkpoint[item["id"]]

    with open(DATA_PATH, "w", encoding="utf-8") as f:
        json.dump(items, f, indent=2, ensure_ascii=False)

    print(f"\nComplete!")
    print(f"  Processed: {processed}")
    print(f"  Skipped (already done): {skipped}")
    print(f"  Errors: {errors}")
    print(f"  Total documents: {total}")


if __name__ == "__main__":
    main()
