const http=require('http'),fs=require('fs'),path=require('path'),puppeteer=require('puppeteer-core');
const ROOT=process.cwd();
const T={'.html':'text/html','.js':'text/javascript','.css':'text/css','.json':'application/json','.jpg':'image/jpeg','.png':'image/png','.svg':'image/svg+xml','.dzi':'application/xml','.woff2':'font/woff2','.jpeg':'image/jpeg'};
const server=http.createServer((q,r)=>{const p=path.join(ROOT,decodeURIComponent(q.url.split('?')[0]).replace(/^\/+/,''));
 fs.readFile(p,(e,b)=>{if(e){r.writeHead(404);return r.end('404')}r.writeHead(200,{'Content-Type':T[path.extname(p).toLowerCase()]||'application/octet-stream'});r.end(b)})});
function h(s){let x=0;for(let i=0;i<s.length;i++){x=((x<<5)-x)+s.charCodeAt(i);x|=0}return x.toString()}
const sleep=ms=>new Promise(r=>setTimeout(r,ms));
(async()=>{await new Promise(r=>server.listen(8092,r));
 const b=await puppeteer.launch({executablePath:'C:/Program Files/Google/Chrome/Application/chrome.exe',headless:'new',args:['--no-sandbox']});
 const t=await b.newPage(); const errs=[];
 t.on('pageerror',e=>errs.push(String(e).slice(0,120)));
 await t.goto('http://localhost:8092/index.html',{waitUntil:'domcontentloaded'});
 await t.evaluate(v=>localStorage.setItem('oov_auth',v),h('oov26icf'));
 // one of each owner value, plus a record with none
 for(const id of ['goetzmann0669','goetzmann0904','goetzmann0181','goetzmann0518','goetzmann1000']){
   await t.goto('http://localhost:8092/viewer.html?id='+id,{waitUntil:'networkidle2'}); await sleep(700);
   const d=await t.evaluate(()=>[...document.querySelectorAll('#details .row')].map(
     r=>r.querySelector('.k').textContent+': '+r.querySelector('.v').textContent));
   console.log(id+'  '+d.join('  |  '));
 }
 console.log('\nJS errors:',errs.length?errs.join(' || '):'none');
 await b.close();server.close();})();
