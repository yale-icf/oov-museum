const http=require('http'),fs=require('fs'),path=require('path'),puppeteer=require('puppeteer-core');
const ROOT=process.cwd();
const T={'.html':'text/html','.js':'text/javascript','.css':'text/css','.json':'application/json','.jpg':'image/jpeg','.png':'image/png','.svg':'image/svg+xml','.geojson':'application/json','.woff2':'font/woff2'};
const server=http.createServer((q,r)=>{const p=path.join(ROOT,decodeURIComponent(q.url.split('?')[0]).replace(/^\/+/,''));
 fs.readFile(p,(e,b)=>{if(e){r.writeHead(404);return r.end('404')}r.writeHead(200,{'Content-Type':T[path.extname(p).toLowerCase()]||'application/octet-stream'});r.end(b)})});
function h(s){let x=0;for(let i=0;i<s.length;i++){x=((x<<5)-x)+s.charCodeAt(i);x|=0}return x.toString()}
(async()=>{await new Promise(r=>server.listen(8089,r));
 const b=await puppeteer.launch({executablePath:'C:/Program Files/Google/Chrome/Application/chrome.exe',headless:'new',args:['--no-sandbox']});
 const t=await b.newPage(); await t.setViewport({width:1280,height:800});
 await t.goto('http://localhost:8089/index.html',{waitUntil:'domcontentloaded'});
 await t.evaluate(v=>localStorage.setItem('oov_auth',v),h('oov26icf'));
 await t.goto('http://localhost:8089/map.html',{waitUntil:'networkidle2'});
 await new Promise(r=>setTimeout(r,2000));
 await t.evaluate(()=>window.scrollBy(0,260));
 await new Promise(r=>setTimeout(r,700));
 // what actually paints at a point inside the topbar?
 const probe=await t.evaluate(()=>{
   const bar=document.querySelector('.topbar').getBoundingClientRect();
   const pts=[[27,bar.top+20],[27,bar.bottom-6],[200,bar.bottom-6],[1150,bar.bottom-6],[1150,bar.top+20]];
   return pts.map(([x,y])=>{const el=document.elementFromPoint(x,y);
     if(!el) return 'none';
     const z=getComputedStyle(el).zIndex;
     return '('+x+','+Math.round(y)+') '+el.tagName.toLowerCase()+'.'+((el.className.baseVal!==undefined?el.className.baseVal:el.className||'').toString().split(' ')[0])+' z='+z;});
 });
 console.log('elements painting inside the topbar strip:',probe);
 await t.screenshot({path:process.argv[2]||'scratchpad/map-scroll.png'});
 await b.close();server.close();})();
