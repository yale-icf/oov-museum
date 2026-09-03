const http=require('http'),fs=require('fs'),path=require('path'),puppeteer=require('puppeteer-core');
const ROOT=process.cwd();
const T={'.html':'text/html','.js':'text/javascript','.css':'text/css','.json':'application/json','.jpg':'image/jpeg','.png':'image/png','.svg':'image/svg+xml','.dzi':'application/xml','.db':'application/octet-stream','.woff2':'font/woff2','.jpeg':'image/jpeg'};
const server=http.createServer((q,r)=>{const p=path.join(ROOT,decodeURIComponent(q.url.split('?')[0]).replace(/^\/+/,''));
 fs.readFile(p,(e,b)=>{if(e){r.writeHead(404);return r.end('404')}r.writeHead(200,{'Content-Type':T[path.extname(p).toLowerCase()]||'application/octet-stream'});r.end(b)})});
function h(s){let x=0;for(let i=0;i<s.length;i++){x=((x<<5)-x)+s.charCodeAt(i);x|=0}return x.toString()}
const sleep=ms=>new Promise(r=>setTimeout(r,ms));
(async()=>{
 await new Promise(r=>server.listen(8096,r));
 const b=await puppeteer.launch({executablePath:'C:/Program Files/Google/Chrome/Application/chrome.exe',headless:'new',args:['--no-sandbox']});
 const t=await b.newPage();
 const errs=[]; t.on('pageerror',e=>errs.push(String(e).slice(0,140)));
 await t.goto('http://localhost:8096/index.html',{waitUntil:'domcontentloaded'});
 await t.evaluate(v=>localStorage.setItem('oov_auth',v),h('oov26icf'));

 for (const id of ['goetzmann1100','goetzmann1112','goetzmann1132']) {
   await t.goto('http://localhost:8096/viewer.html?id='+id,{waitUntil:'networkidle2'}); await sleep(1200);
   const n=await t.evaluate(()=>document.querySelectorAll('#alsofiles .f').length);
   const texts=[];
   const clickable=Math.min(n,5);
   for(let i=0;i<clickable;i++){
     await t.evaluate(i=>{const el=document.querySelectorAll('#alsofiles .f')[i]; el&&el.click();},i);
     await sleep(600);
     texts.push(await t.evaluate(()=>(document.getElementById('desc')||{}).textContent.trim().slice(0,58)));
   }
   console.log(id+'  ('+n+' leaf thumbnails in #alsofiles)');
   texts.forEach((s,i)=>console.log('   leaf '+(i+1)+': '+s+'…'));
   console.log('   distinct: '+new Set(texts).size+'/'+texts.length+
     (new Set(texts).size===texts.length?'  ✓ description changes per image':'  ✗ REPEATS'));
 }

 // browse-all from a clean page load
 await t.goto('http://localhost:8096/search.html',{waitUntil:'networkidle2'}); await sleep(900);
 await t.evaluate(()=>document.getElementById('browse-all').click()); await sleep(1800);
 console.log('\nBROWSE ALL from clean load: '+await t.evaluate(()=>document.querySelectorAll('.card').length)+
   ' cards | count line: '+await t.evaluate(()=>(document.querySelector('.cat-bar')||{}).textContent?.trim().split('\n')[0]||''));

 // full-text mode exercises corpus.db, which I edited
 const ft=await t.evaluate(()=>!!document.querySelector('[data-mode="fulltext"], #mode-fulltext, .modetab'));
 console.log('full-text toggle present:',ft);
 console.log('\nJS ERRORS:',errs.length?errs.join(' || '):'none');
 await b.close(); server.close();
})();
