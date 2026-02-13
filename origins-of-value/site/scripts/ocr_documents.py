"""
Batch OCR + translation for Origins of Value museum documents.

Reads each document thumbnail, sends it to Claude's vision API to extract
visible text, translates non-English text, and saves results into
museum-data.json as a new "transcription" field.

Resumable: saves progress to a checkpoint file so it can be restarted
without re-processing completed documents.

Usage:
    python scripts/ocr_documents.py

Requires ANTHROPIC_API_KEY environment variable.
"""

import json
import os
import sys
import time
import base64

import anthropic

SITE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
DATA_PATH = os.path.join(SITE_DIR, "data", "museum-data.json")
THUMBS_DIR = os.path.join(SITE_DIR, "thumbnails")
CHECKPOINT_PATH = os.path.join(SITE_DIR, "scripts", "ocr_checkpoint.json")

MODEL = "claude-haiku-4-5-20251001"
MAX_RETRIES = 3
RETRY_DELAY = 5  # seconds


def load_checkpoint():
    if os.path.exists(CHECKPOINT_PATH):
        with open(CHECKPOINT_PATH, "r", encoding="utf-8") as f:
            return json.load(f)
    return {}


def save_checkpoint(checkpoint):
    with open(CHECKPOINT_PATH, "w", encoding="utf-8") as f:
        json.dump(checkpoint, f, ensure_ascii=False)


def extract_text(client, image_path, title, description, location):
    """Send an image to Claude and get transcribed/translated text."""
    with open(image_path, "rb") as f:
        image_data = base64.standard_b64encode(f.read()).decode("utf-8")

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

    for attempt in range(MAX_RETRIES):
        try:
            message = client.messages.create(
                model=MODEL,
                max_tokens=2048,
                messages=[
                    {
                        "role": "user",
                        "content": [
                            {
                                "type": "image",
                                "source": {
                                    "type": "base64",
                                    "media_type": "image/jpeg",
                                    "data": image_data,
                                },
                            },
                            {
                                "type": "text",
                                "text": prompt,
                            },
                        ],
                    }
                ],
            )
            return message.content[0].text
        except anthropic.RateLimitError:
            wait = RETRY_DELAY * (2 ** attempt)
            print(f"    Rate limited, waiting {wait}s...")
            time.sleep(wait)
        except anthropic.APIError as e:
            if attempt < MAX_RETRIES - 1:
                wait = RETRY_DELAY * (2 ** attempt)
                print(f"    API error: {e}. Retrying in {wait}s...")
                time.sleep(wait)
            else:
                print(f"    Failed after {MAX_RETRIES} attempts: {e}")
                return None

    return None


def main():
    api_key = os.environ.get("ANTHROPIC_API_KEY")
    if not api_key:
        print("Error: ANTHROPIC_API_KEY environment variable not set.")
        print('Set it with: $env:ANTHROPIC_API_KEY = "sk-ant-..."')
        sys.exit(1)

    client = anthropic.Anthropic(api_key=api_key)

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

    for i, item in enumerate(items):
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

        # Small delay to be kind to rate limits
        time.sleep(0.5)

    # Write transcriptions back into museum-data.json
    print(f"\nWriting transcriptions to {DATA_PATH}...")
    for item in items:
        item["transcription"] = checkpoint.get(item["id"], "")

    with open(DATA_PATH, "w", encoding="utf-8") as f:
        json.dump(items, f, indent=2, ensure_ascii=False)

    print(f"\nComplete!")
    print(f"  Processed: {processed}")
    print(f"  Skipped (already done): {skipped}")
    print(f"  Errors: {errors}")
    print(f"  Total documents: {total}")


if __name__ == "__main__":
    main()
