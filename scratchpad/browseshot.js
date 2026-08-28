const http=require('http'),fs=require('fs'),path=require('path'),puppeteer=require('puppeteer-core');
const ROOT=process.cwd();
const T={'.html':'text/html','.js':'text/javascript','.css':'text/css','.json':'application/json','.jpg':'image/jpeg','.png':'image/png','.svg':'image/svg+xml','.woff2':'font/woff2','.db':'application/octet-stream'};
const server=http.createServer((q,r)=>{const p=path.join(ROOT,decodeURIComponent(q.url.split('?')[0]).replace(/^\/+/,''));
 fs.readFile(p,(e,b)=>{if(e){r.writeHead(404);return r.end('404')}r.writeHead(200,{'Content-Type':T[path.extname(p).toLowerCase()]||'application/octet-stream'});r.end(b)})});
function h(s){let x=0;for(let i=0;i<s.length;i++){x=((x<<5)-x)+s.charCodeAt(i);x|=0}return x.toString()}
(async()=>{await new Promise(r=>server.listen(8080,r));
 const b=await puppeteer.launch({executablePath:'C:/Program Files/Google/Chrome/Application/chrome.exe',headless:'new',args:['--no-sandbox']});
 const t=await b.newPage(); await t.setViewport({width:1280,height:900});
 await t.goto('http://localhost:8080/index.html',{waitUntil:'domcontentloaded'});
 await t.evaluate(v=>localStorage.setItem('oov_auth',v),h('oov26icf'));
 await t.goto('http://localhost:8080/search.html',{waitUntil:'networkidle2'});
 await new Promise(r=>setTimeout(r,1200));
 const box=await t.evaluate(()=>{const e=document.getElementById('browse-all');
   const r=e.getBoundingClientRect(); const s=getComputedStyle(e);
   return {top:Math.round(r.top+window.scrollY)-70,h:Math.round(r.height),w:Math.round(r.width),
           font:s.fontSize,weight:s.fontWeight,color:s.color};});
 console.log('browse-all:',box.w+'x'+box.h,'font',box.font,'weight',box.weight,'colour',box.color);
 await t.screenshot({path:process.argv[2]||'scratchpad/browse.png',clip:{x:0,y:Math.max(0,box.top),width:1280,height:640}});
 await b.close();server.close();})();
