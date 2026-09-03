const http=require('http'),fs=require('fs'),path=require('path'),puppeteer=require('puppeteer-core');
const ROOT=process.cwd();
const T={'.html':'text/html','.js':'text/javascript','.css':'text/css','.json':'application/json','.jpg':'image/jpeg','.png':'image/png','.svg':'image/svg+xml','.dzi':'application/xml','.db':'application/octet-stream','.wasm':'application/wasm','.woff2':'font/woff2'};
const server=http.createServer((q,r)=>{const p=path.join(ROOT,decodeURIComponent(q.url.split('?')[0]).replace(/^\/+/,''));
 fs.readFile(p,(e,b)=>{if(e){r.writeHead(404);return r.end('404')}r.writeHead(200,{'Content-Type':T[path.extname(p).toLowerCase()]||'application/octet-stream'});r.end(b)})});
function h(s){let x=0;for(let i=0;i<s.length;i++){x=((x<<5)-x)+s.charCodeAt(i);x|=0}return x.toString()}
const sleep=ms=>new Promise(r=>setTimeout(r,ms));
(async()=>{
 await new Promise(r=>server.listen(8095,r));
 const b=await puppeteer.launch({executablePath:'C:/Program Files/Google/Chrome/Application/chrome.exe',headless:'new',args:['--no-sandbox']});
 const t=await b.newPage();
 const errs=[],net=[];
 t.on('pageerror',e=>errs.push(String(e).slice(0,150)));
 t.on('console',m=>{if(m.type()==='error'&&!/favicon/.test(m.text()))errs.push(m.text().slice(0,150))});
 t.on('response',r=>{if(r.status()>=400&&!/favicon/.test(r.url()))net.push(r.status()+' '+r.url().replace('http://localhost:8095/',''))});
 await t.goto('http://localhost:8095/index.html',{waitUntil:'domcontentloaded'});
 await t.evaluate(v=>localStorage.setItem('oov_auth',v),h('oov26icf'));
 await t.goto('http://localhost:8095/search.html',{waitUntil:'networkidle2'}); await sleep(800);
 await t.select('#mode','fulltext'); await sleep(400);
 for (const q of ['lottery','windkaart','fortune','bond']) {
   await t.evaluate(()=>{const e=document.getElementById('q');e.value='';});
   await t.type('#q',q);
   await sleep(6000);   // corpus.db is ~33MB; first query pays the download + sql.js init
   const n=await t.evaluate(()=>document.querySelectorAll('.card, .ocr-hit, .ftrow').length);
   const txt=await t.evaluate(()=>(document.querySelector('.cat-bar')||{}).textContent?.trim().split('\n')[0]||'');
   console.log('full-text "'+q+'": '+n+' results | '+txt);
 }
 console.log('\nnetwork >=400:',[...new Set(net)].join(', ')||'none');
 console.log('JS errors:',errs.length?[...new Set(errs)].join(' || '):'none');
 await b.close(); server.close();
})();
