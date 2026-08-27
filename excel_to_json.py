"""
excel_to_json.py
Regenerate data/museum-data.json and data/filter-index.json from the workbook.

WHICH WORKBOOK. The default is `oov_data_new_edit_2.xlsx`, which is the live source:
it holds the user's own edited descriptions (rows 1-381), the 356 rewritten labels
(rows 382-869), the corrected issueDate cells, the duplicate / off-the-website notes
and the `identifiers` column. The older `oov_data_new.xlsx` predates all of that, so
importing from it would silently revert the lot -- pass --file only when you mean it.
Preserves: namedIndividuals, transcription, pages structure from existing JSON.
Updates: title, description, type, location, period, keywords, owner from Excel.

`identifiers` (internal, search-only: serial / loan / certificate numbers) comes from
an optional Excel column of the same name. While that column is absent from the sheet,
whatever the JSON already holds is preserved -- so the seeded values survive an import
from an older workbook. Once the column exists, a blank cell clears the field.
"""

import argparse
import json
import os
import re
import sys

import pandas as pd

EXCEL_PATH = "oov_data_new_edit_2.xlsx"
JSON_PATH = "data/museum-data.json"
FILTER_PATH = "data/filter-index.json"


# Spelling variants that would otherwise split out as their own facet value alongside the
# form the rest of the collection uses. Not a full currency vocabulary -- codes and names
# still coexist (USD alongside "United States dollar"), which is a separate cleanup.
CURRENCY_ALIASES = {
    'Russian rubles': 'Russian ruble',
    'British pounds sterling': 'British pound sterling',
    'French livres tournois': 'Livres Tournois',
}


def parse_list(val, sep=None):
    """Split a cell value into a list, stripping whitespace and blanks."""
    if not val or (isinstance(val, float)):
        return []
    s = str(val).strip()
    if not s or s.lower() == 'nan':
        return []
    if sep:
        parts = re.split(sep, s)
    else:
        # Try | first, then ;, then ,
        if '|' in s:
            parts = s.split('|')
        elif ';' in s:
            parts = s.split(';')
        else:
            parts = s.split(',')
    return [p.strip() for p in parts if p.strip()]


def str_val(val):
    if val is None or (isinstance(val, float)):
        return ''
    s = str(val).strip()
    return '' if s.lower() == 'nan' else s


def build_excel_lookup(df):
    """Build a dict: item_id -> row data"""
    lookup = {}
    for _, row in df.iterrows():
        fn = str_val(row.get('filename', ''))
        if not fn.endswith('.jpg'):
            continue
        item_id = fn[:-4]  # remove .jpg
        lookup[item_id] = row
    return lookup


def update_item(item, row, has_identifiers_col=False):
    """Update JSON item fields from Excel row, preserving namedIndividuals/transcription/pages."""
    item['title'] = str_val(row.get('title', ''))
    item['description'] = str_val(row.get('description', ''))

    # type: comma-separated in Excel
    item['type'] = parse_list(row.get('type', ''), sep=r',\s*')

    # location: subjectCountry + issuingCountry, each split on | or , and deduplicated
    loc = []
    for cell in [row.get('subjectCountry', ''), row.get('issuingCountry', '')]:
        for v in parse_list(cell):
            if v not in loc:
                loc.append(v)
    item['location'] = loc

    # issuingCountry and subjectCountry: separate fields
    item['issuingCountry'] = parse_list(row.get('issuingCountry', ''))
    item['subjectCountry'] = parse_list(row.get('subjectCountry', ''))

    # currency: separate field for filter. Multi-currency cells are written inconsistently
    # -- "USD; FRF", "British pound sterling|French franc", "Russian rubles / British pounds
    # sterling" -- so split on all of them. Splitting only on commas left the whole cell as a
    # single facet value, and the filter offered "Russian ruble; German mark; French franc;
    # British pound sterling; Dutch guilder" as though it were one currency.
    item['currency'] = [
        CURRENCY_ALIASES.get(c, c)
        for c in parse_list(row.get('currency', ''), sep=r'\s*[|;]\s*|\s+/\s+|,\s*')
    ]

    # language: separate field for filter
    item['language'] = parse_list(row.get('language', ''), sep=r',\s*')

    # issueYear: extract first 4-digit year from issueDate
    raw_date = str_val(row.get('issueDate', ''))
    m = re.search(r'(?<!\d)(\d{4})(?!\d)', raw_date)
    item['issueYear'] = [m.group(1)] if m else []

    # period: single value wrapped in list
    period = str_val(row.get('period', ''))
    item['period'] = [period] if period else []

    # keywords: pipe or semicolon separated
    item['keywords'] = parse_list(row.get('keywords', ''))

    # owner
    item['owner'] = str_val(row.get('owner', ''))

    # creator and notes (record display only, not filter)
    item['creator'] = str_val(row.get('creator', ''))
    item['notes'] = str_val(row.get('notes', ''))

    # identifiers: internal only -- searched by museum-search.js, never rendered by
    # viewer.js. Serial / certificate / series / loan designations. Split on | or ;
    # ONLY: these values carry their own commas and periods ("No. 008,255",
    # "Serie 1,790"), so parse_list's default comma fallback would shred them.
    if has_identifiers_col:
        item['identifiers'] = parse_list(row.get('identifiers', ''), sep=r'\s*[|;]\s*')
    else:
        item.setdefault('identifiers', [])

    return item


def build_filter_index(items):
    facets = {
        'type': {},
        'location': {},
        'issuingCountry': {},
        'currency': {},
        'language': {},
        'period': {},
        'namedIndividuals': {}
    }
    for item in items:
        for field in facets:
            values = item.get(field, [])
            if isinstance(values, list):
                for v in values:
                    facets[field][v] = facets[field].get(v, 0) + 1
    result = {}
    for field, counts in facets.items():
        result[field] = sorted(
            [{'value': v, 'count': c} for v, c in counts.items()],
            key=lambda x: -x['count']
        )
    return result


def main():
    ap = argparse.ArgumentParser(description=__doc__)
    ap.add_argument('--file', default=EXCEL_PATH, help='workbook to import (default: %(default)s)')
    args = ap.parse_args()

    lock = os.path.join(os.path.dirname(os.path.abspath(args.file)),
                        '~$' + os.path.basename(args.file))
    if os.path.exists(lock):
        sys.exit('REFUSING: %s is open in Excel. Close it first.' % args.file)

    print("Reading Excel from %s ..." % args.file)
    df = pd.read_excel(args.file)
    excel = build_excel_lookup(df)
    has_ids = 'identifiers' in df.columns
    print(f"  {len(excel)} rows loaded from Excel")
    print("  identifiers column: " + ("present" if has_ids else "absent -- keeping existing JSON values"))

    print("Reading existing museum-data.json...")
    with open(JSON_PATH, encoding='utf-8') as f:
        items = json.load(f)
    print(f"  {len(items)} items in existing JSON")

    updated = 0
    not_found = 0

    for item in items:
        item_id = item.get('id', '')

        # For combined multi-page items, pages[] may include sub-ids
        # Update from the primary item's Excel row
        row = excel.get(item_id)

        if row is not None:
            update_item(item, row, has_ids)
            updated += 1
        else:
            not_found += 1
            # If not found by primary id, try to find via pages
            if item.get('pages'):
                primary_id = item['pages'][0].get('id', '')
                row = excel.get(primary_id)
                if row is not None:
                    update_item(item, row, has_ids)
                    updated += 1
                    not_found -= 1

    print(f"  Updated: {updated}, Not found in Excel: {not_found}")

    print("Writing museum-data.json...")
    with open(JSON_PATH, 'w', encoding='utf-8') as f:
        json.dump(items, f, indent=2, ensure_ascii=False)
    print(f"  Wrote {JSON_PATH}")

    print("Building filter-index.json...")
    filter_index = build_filter_index(items)
    with open(FILTER_PATH, 'w', encoding='utf-8') as f:
        json.dump(filter_index, f, ensure_ascii=False)
    print(f"  Wrote {FILTER_PATH}")

    print("Done.")


if __name__ == '__main__':
    main()
