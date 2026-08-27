"""
drop-from-corpus.py <goetzmannNNNN>

Removes one record from scripts/corpus.db, the ~33 MB SQLite index the search page
fetches for full-text search. Dropping a record from museum-data.json does NOT touch
this file, so without it the dropped document still answers full-text queries and
sends the visitor to a record that no longer exists.

Deletes from docs (the FTS5 index is content='docs', so its row goes with it via an
explicit docs_fts delete), and from boxes, which holds the word coordinates used for
highlighting.

  py scratchpad/drop-from-corpus.py goetzmann0393                # dry run
  py scratchpad/drop-from-corpus.py goetzmann0393 --write
"""
import os, shutil, sqlite3, sys

target = next((a for a in sys.argv[1:] if a.startswith('goetzmann')), None)
if not target:
    sys.exit('usage: drop-from-corpus.py goetzmann0393 [--write]')
WRITE = '--write' in sys.argv
DB = 'scripts/corpus.db'

con = sqlite3.connect(DB)
row = con.execute('select rowid, id, title from docs where id = ?', (target,)).fetchone()
box = con.execute('select count(*) from boxes where image_id like ?', (target + '%',)).fetchone()[0]
hits = con.execute("select count(*) from docs_fts where docs_fts match ?", (target,)).fetchone()[0] \
    if row else 0
print('docs   : %s' % (('rowid %d  %s' % (row[0], row[2])) if row else 'not present'))
print('boxes  : %d row(s)' % box)
print('before : %d docs' % con.execute('select count(*) from docs').fetchone()[0])
if not row and not box:
    sys.exit('nothing to remove')
if not WRITE:
    print('\ndry run -- pass --write to apply'); sys.exit(0)

con.close()
shutil.copy2(DB, DB + '.bak-before-' + target)
con = sqlite3.connect(DB)
cur = con.cursor()
if row:
    # content= tables need the FTS row deleted explicitly, before the base row goes
    cur.execute("insert into docs_fts(docs_fts, rowid, ocr_text) "
                "select 'delete', rowid, ocr_text from docs_fts where rowid = ?", (row[0],))
    cur.execute('delete from docs where rowid = ?', (row[0],))
cur.execute('delete from boxes where image_id like ?', (target + '%',))
con.commit()
print('after  : %d docs, %d boxes rows for %s'
      % (cur.execute('select count(*) from docs').fetchone()[0],
         cur.execute('select count(*) from boxes where image_id like ?', (target + '%',)).fetchone()[0],
         target))
cur.execute('vacuum')
con.close()
print('vacuumed; backup kept as %s.bak-before-%s' % (DB, target))
