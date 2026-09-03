// Loads every page of the site in a real browser and reports console errors,
// failed network requests and a few DOM assertions. Serves the repo over HTTP so
// fetch() works (file:// would fail CORS) and so tiles resolve locally rather than
// from R2, which only sends CORS headers to yale-icf.github.io.
const http = require('http');
const fs = require('fs');
const path = require('path');
const puppeteer = require('puppeteer-core');

const ROOT = process.cwd();
const TYPES = {'.html':'text/html','.js':'text/javascript','.css':'text/css','.json':'application/json',
  '.jpg':'image/jpeg','.jpeg':'image/jpeg','.png':'image/png','.svg':'image/svg+xml',
  '.dzi':'application/xml','.db':'application/octet-stream','.woff2':'font/woff2','.txt':'text/plain'};

const server = http.createServer((req, res) => {
  const p = path.join(ROOT, decodeURIComponent(req.url.split('?')[0]).replace(/^\/+/, ''));
  fs.readFile(p, (err, buf) => {
    if (err) { res.writeHead(404); return res.end('404'); }
    res.writeHead(200, {'Content-Type': TYPES[path.extname(p).toLowerCase()] || 'application/octet-stream'});
    res.end(buf);
  });
});

// hash of the site password, so the gate lets the headless browser through
function getHash(str){let h=0;for(let i=0;i<str.length;i++){h=((h<<5)-h)+str.charCodeAt(i);h|=0}return h.toString()}

const PAGES = [
  'index.html', 'search.html', 'about.html', 'map.html', 'exhibits.html', 'gallery.html',
  'exhibit-financing-war.html', 'exhibit-stock-market.html', 'exhibit-women-investors.html',
  'viewer.html?id=goetzmann0079',   // multi-page: 55 leaves, per-image descriptions
  'viewer.html?id=goetzmann0560',   // multi-page: 4 leaves, the one rewritten today
  'viewer.html?id=goetzmann1025',   // single page, and the record whose period changed
];

(async () => {
  await new Promise(r => server.listen(8099, r));
  const browser = await puppeteer.launch({
    executablePath: 'C:/Program Files/Google/Chrome/Application/chrome.exe',
    headless: 'new', args: ['--no-sandbox']
  });
  let fail = 0;
  for (const page of PAGES) {
    const tab = await browser.newPage();
    const errs = [], net = [];
    tab.on('console', m => { if (m.type() === 'error') errs.push(m.text().slice(0, 160)); });
    tab.on('pageerror', e => errs.push('UNCAUGHT ' + String(e).slice(0, 160)));
    tab.on('requestfailed', r => net.push(r.url().replace('http://localhost:8099/', '')));
    tab.on('response', r => { if (r.status() >= 400) net.push(r.status() + ' ' + r.url().replace('http://localhost:8099/', '')); });

    await tab.goto('http://localhost:8099/index.html', {waitUntil: 'domcontentloaded'});
    await tab.evaluate(h => localStorage.setItem('oov_auth', h), getHash('oov26icf'));
    await tab.goto('http://localhost:8099/' + page, {waitUntil: 'networkidle2', timeout: 45000});
    await new Promise(r => setTimeout(r, 1200));

    const info = await tab.evaluate(() => ({
      url: location.pathname.split('/').pop() + location.search,
      title: (document.querySelector('h1') || {}).textContent?.trim().slice(0, 54) || '',
      cards: document.querySelectorAll('.card, .excard, .objcard, .gal-card').length,
      brokenImgs: [...document.images].filter(i => i.complete && i.naturalWidth === 0).length,
      desc: (document.getElementById('desc') || {}).textContent?.trim().slice(0, 46) || null,
      pagenote: !!document.getElementById('pagenote'),
      pubs: !!document.getElementById('browse-pubs'),
    }));
    const bad = errs.length || net.length || info.brokenImgs;
    if (bad) fail++;
    console.log((bad ? 'FAIL ' : 'ok   ') + page.padEnd(38) +
      'cards ' + String(info.cards).padStart(3) + '  brokenImg ' + info.brokenImgs +
      (info.desc !== null ? '  desc "' + info.desc + '…"' : '') +
      (info.pagenote ? '  ⚠pagenote-present' : '') + (info.pubs ? '  ⚠pubs-present' : ''));
    errs.slice(0, 4).forEach(e => console.log('       console: ' + e));
    [...new Set(net)].slice(0, 6).forEach(e => console.log('       network: ' + e));
    await tab.close();
  }
  await browser.close();
  server.close();
  console.log('\n' + (fail ? fail + ' page(s) with problems' : 'all ' + PAGES.length + ' pages clean'));
})();
