const http=require('http'),fs=require('fs'),path=require('path'),puppeteer=require('puppeteer-core');
const ROOT=process.cwd();
const T={'.html':'text/html','.js':'text/javascript','.css':'text/css','.json':'application/json','.jpg':'image/jpeg','.png':'image/png','.svg':'image/svg+xml','.geojson':'application/json','.woff2':'font/woff2'};
const server=http.createServer((q,r)=>{const p=path.join(ROOT,decodeURIComponent(q.url.split('?')[0]).replace(/^\/+/,''));
 fs.readFile(p,(e,b)=>{if(e){r.writeHead(404);return r.end('404')}r.writeHead(200,{'Content-Type':T[path.extname(p).toLowerCase()]||'application/octet-stream'});r.end(b)})});
function h(s){let x=0;for(let i=0;i<s.length;i++){x=((x<<5)-x)+s.charCodeAt(i);x|=0}return x.toString()}
const sleep=ms=>new Promise(r=>setTimeout(r,ms));
(async()=>{await new Promise(r=>server.listen(8090,r));
 const b=await puppeteer.launch({executablePath:'C:/Program Files/Google/Chrome/Application/chrome.exe',headless:'new',args:['--no-sandbox']});
 const t=await b.newPage(); await t.setViewport({width:1280,height:900});
 const ext=[]; const errs=[];
 t.on('pageerror',e=>errs.push(String(e).slice(0,120)));
 t.on('request',r=>{const u=r.url(); if(!/localhost|data:|fonts\.(googleapis|gstatic)|unpkg/.test(u)) ext.push(u.slice(0,80));});
 await t.goto('http://localhost:8090/index.html',{waitUntil:'domcontentloaded'});
 await t.evaluate(v=>localStorage.setItem('oov_auth',v),h('oov26icf'));
 await t.goto('http://localhost:8090/map.html',{waitUntil:'networkidle2'}); await sleep(2000);
 console.log('attribution text:',JSON.stringify(await t.evaluate(()=>{
   const a=document.querySelector('.leaflet-control-attribution'); return a?a.textContent.trim():'(no attribution control)';})));
 console.log('external requests (non-font, non-leaflet):',[...new Set(ext)].length?[...new Set(ext)]:'none');
 // click a country that is in the collection
 const clicked=await t.evaluate(()=>{
   const p=[...document.querySelectorAll('.leaflet-overlay-pane path')]
     .find(x=>{const f=x.getAttribute('fill')||''; return f && f.toLowerCase()!=='#d8d4cd';});
   if(!p) return null; p.dispatchEvent(new MouseEvent('click',{bubbles:true})); return p.getAttribute('fill');});
 await sleep(600);
 console.log('clicked a shaded country (fill '+clicked+'); popup:',
   JSON.stringify(await t.evaluate(()=>{const p=document.querySelector('.leaflet-popup-content');return p?p.textContent.replace(/\s+/g,' ').slice(0,90):'(none)';})));
 // period filter
 await t.evaluate(()=>{const c=document.querySelectorAll('.map-controls input[type=checkbox]');if(c[2])c[2].click();});
 await sleep(700);
 console.log('after unchecking a period, legend reads:',
   JSON.stringify(await t.evaluate(()=>{const e=[...document.querySelectorAll('.map-controls *')].map(x=>x.textContent).find(x=>/documents/.test(x));return (e||'').replace(/\s+/g,' ').trim().slice(0,60);})));
 console.log('JS errors:',errs.length?errs:'none');
 await b.close();server.close();})();
