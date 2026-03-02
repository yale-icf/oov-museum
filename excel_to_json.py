"""
excel_to_json.py
Regenerate data/museum-data.json and data/filter-index.json from oov_data_new.xlsx.
Preserves: namedIndividuals, transcription, pages structure from existing JSON.
Updates: title, description, type, location, period, keywords, owner from Excel.
"""

import json
import re
import pandas as pd

EXCEL_PATH = "oov_data_new.xlsx"
JSON_PATH = "data/museum-data.json"
FILTER_PATH = "data/filter-index.json"


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


def update_item(item, row):
    """Update JSON item fields from Excel row, preserving namedIndividuals/transcription/pages."""
    item['title'] = str_val(row.get('title', ''))
    item['description'] = str_val(row.get('description', ''))

    # type: comma-separated in Excel
    item['type'] = parse_list(row.get('type', ''), sep=r',\s*')

    # location: subjectCountry + issuingCountry, deduplicated
    subject = str_val(row.get('subjectCountry', ''))
    issuing = str_val(row.get('issuingCountry', ''))
    loc = []
    if subject:
        loc.append(subject)
    if issuing and issuing not in loc:
        loc.append(issuing)
    item['location'] = loc

    # period: single value wrapped in list
    period = str_val(row.get('period', ''))
    item['period'] = [period] if period else []

    # keywords: pipe or semicolon separated
    item['keywords'] = parse_list(row.get('keywords', ''))

    # owner
    item['owner'] = str_val(row.get('owner', ''))

    return item


def build_filter_index(items):
    facets = {
        'type': {},
        'location': {},
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
    print("Reading Excel...")
    df = pd.read_excel(EXCEL_PATH)
    excel = build_excel_lookup(df)
    print(f"  {len(excel)} rows loaded from Excel")

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
            update_item(item, row)
            updated += 1
        else:
            not_found += 1
            # If not found by primary id, try to find via pages
            if item.get('pages'):
                primary_id = item['pages'][0].get('id', '')
                row = excel.get(primary_id)
                if row is not None:
                    update_item(item, row)
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
