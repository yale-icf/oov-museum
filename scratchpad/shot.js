const http=require('http'),fs=require('fs'),path=require('path'),puppeteer=require('puppeteer-core');
const ROOT=process.cwd();
const T={'.html':'text/html','.js':'text/javascript','.css':'text/css','.json':'application/json','.jpg':'image/jpeg','.png':'image/png','.svg':'image/svg+xml','.woff2':'font/woff2'};
const server=http.createServer((q,r)=>{const p=path.join(ROOT,decodeURIComponent(q.url.split('?')[0]).replace(/^\/+/,''));
 fs.readFile(p,(e,b)=>{if(e){r.writeHead(404);return r.end('404')}r.writeHead(200,{'Content-Type':T[path.extname(p).toLowerCase()]||'application/octet-stream'});r.end(b)})});
function h(s){let x=0;for(let i=0;i<s.length;i++){x=((x<<5)-x)+s.charCodeAt(i);x|=0}return x.toString()}
(async()=>{await new Promise(r=>server.listen(8093,r));
 const b=await puppeteer.launch({executablePath:'C:/Program Files/Google/Chrome/Application/chrome.exe',headless:'new',args:['--no-sandbox']});
 const t=await b.newPage(); await t.setViewport({width:1280,height:900});
 const errs=[]; t.on('pageerror',e=>errs.push(String(e).slice(0,120)));
 await t.goto('http://localhost:8093/index.html',{waitUntil:'domcontentloaded'});
 await t.evaluate(v=>localStorage.setItem('oov_auth',v),h('oov26icf'));
 await t.goto('http://localhost:8093/about.html',{waitUntil:'networkidle2'});
 await new Promise(r=>setTimeout(r,900));
 const box=await t.evaluate(()=>{const n=document.querySelectorAll('.abnote');
   const a=n[0].getBoundingClientRect(),z=n[n.length-1].getBoundingClientRect();
   return {count:n.length,top:Math.round(a.top+window.scrollY-40),height:Math.round(z.bottom-a.top+80),
           heads:[...document.querySelectorAll('.abnote .h')].map(e=>e.textContent.trim())};});
 console.log('abnote sections:',box.count,'|',box.heads.join('  /  '));
 await t.screenshot({path:'scratchpad/about-notes.png',clip:{x:0,y:box.top,width:1280,height:Math.min(box.height,1400)}});
 console.log('JS errors:',errs.length?errs.join(' | '):'none');
 await b.close();server.close();})();
