"""Verify a freshly tiled batch: every id has a .dzi and thumbnail, the .dzi dimensions
match the master, the pyramid is complete, and the layout matches the rest of the site."""
import glob, json, os, re, sys
import xml.etree.ElementTree as ET

src = json.load(open('scratchpad/new-batch-paths.json', encoding='utf-8'))
ids = sorted('goetzmann' + n for n in src)
try:
    from PIL import Image
    have_pil = True
except ImportError:
    have_pil = False

bad = []
levels_seen = {}
for rid in ids:
    d = os.path.join('tiles', rid)
    dzi = os.path.join(d, rid + '.dzi')
    thumb = os.path.join('thumbnails', rid + '.jpg')
    if not os.path.exists(dzi):
        bad.append(rid + ': no .dzi'); continue
    if not os.path.exists(thumb):
        bad.append(rid + ': no thumbnail'); continue
    root = ET.parse(dzi).getroot()
    a = root.attrib
    size = root[0].attrib
    if a.get('TileSize') != '512' or a.get('Overlap') != '2' or a.get('Format') != 'jpeg':
        bad.append('%s: layout %s/%s/%s' % (rid, a.get('TileSize'), a.get('Overlap'), a.get('Format')))
    fdir = os.path.join(d, rid + '_files')
    lv = sorted(int(x) for x in os.listdir(fdir) if x.isdigit())
    levels_seen[rid] = (lv[0], lv[-1])
    if lv != list(range(lv[0], lv[-1] + 1)):
        bad.append(rid + ': level gap ' + str(lv))
    if not os.listdir(os.path.join(fdir, str(lv[-1]))):
        bad.append(rid + ': top level empty')
    if have_pil:
        with Image.open(src[rid.replace('goetzmann', '')]) as im:
            mw, mh = im.size
            ex = im.getexif().get(274, 1)
        if ex in (6, 8):
            mw, mh = mh, mw
        if (int(size['Width']), int(size['Height'])) != (mw, mh):
            bad.append('%s: dzi %sx%s vs master %dx%d' % (rid, size['Width'], size['Height'], mw, mh))

print('%d ids checked' % len(ids))
print('  problems: %d' % len(bad))
for b in bad[:12]:
    print('    ' + b)
tops = sorted({v[1] for v in levels_seen.values()})
print('  top pyramid levels present: %s' % tops)
print('  dimension check vs masters: %s' % ('run' if have_pil else 'SKIPPED (Pillow not installed)'))
tot = sum(os.path.getsize(p) for rid in ids
          for p in glob.glob(os.path.join('tiles', rid, '**', '*'), recursive=True) if os.path.isfile(p))
print('  tiles on disk for this batch: %.2f GB' % (tot / 1e9))
