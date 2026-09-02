import glob, os, sys

BASE = 'C:/Users/ks2479/Documents/my-project/origins-of-value/JPEG Files'
want = set(a.lower() for a in sys.argv[1:]) or {'goetzmann1027', 'goetzmann1031'}
found = {}
for p in glob.glob(BASE + '/**/*.jpg', recursive=True):
    b = os.path.basename(p).lower()[:-4]
    if b in want:
        found[b] = p
        rel = os.path.relpath(p, BASE)
        print('  %-16s %6.1f MB  %s' % (b, os.path.getsize(p) / 1e6, rel))
for w in sorted(want - set(found)):
    print('  %-16s NOT FOUND' % w)
