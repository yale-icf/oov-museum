const http=require('http'),fs=require('fs'),path=require('path'),puppeteer=require('puppeteer-core');
const ROOT=process.cwd();
const T={'.html':'text/html','.js':'text/javascript','.css':'text/css','.json':'application/json','.jpg':'image/jpeg','.png':'image/png','.svg':'image/svg+xml','.geojson':'application/json','.woff2':'font/woff2'};
const server=http.createServer((q,r)=>{const p=path.join(ROOT,decodeURIComponent(q.url.split('?')[0]).replace(/^\/+/,''));
 fs.readFile(p,(e,b)=>{if(e){r.writeHead(404);return r.end('404')}r.writeHead(200,{'Content-Type':T[path.extname(p).toLowerCase()]||'application/octet-stream'});r.end(b)})});
function h(s){let x=0;for(let i=0;i<s.length;i++){x=((x<<5)-x)+s.charCodeAt(i);x|=0}return x.toString()}
(async()=>{await new Promise(r=>server.listen(8091,r));
 const b=await puppeteer.launch({executablePath:'C:/Program Files/Google/Chrome/Application/chrome.exe',headless:'new',args:['--no-sandbox']});
 const t=await b.newPage(); await t.setViewport({width:1280,height:900});
 const errs=[],net=[];
 t.on('pageerror',e=>errs.push(String(e).slice(0,140)));
 t.on('console',m=>{if(m.type()==='error'&&!/favicon/.test(m.text()))errs.push(m.text().slice(0,140))});
 t.on('response',r=>{if(r.status()>=400&&!/favicon/.test(r.url()))net.push(r.status()+' '+r.url().slice(0,90))});
 await t.goto('http://localhost:8091/index.html',{waitUntil:'domcontentloaded'});
 await t.evaluate(v=>localStorage.setItem('oov_auth',v),h('oov26icf'));
 await t.goto('http://localhost:8091/map.html',{waitUntil:'networkidle2'});
 await new Promise(r=>setTimeout(r,2500));
 const info=await t.evaluate(()=>({
   tiles:document.querySelectorAll('.leaflet-tile').length,
   loaded:[...document.querySelectorAll('.leaflet-tile')].filter(i=>i.complete&&i.naturalWidth>0).length,
   paths:document.querySelectorAll('.leaflet-overlay-pane path').length,
   bodyHasKeyText:/api key/i.test(document.body.innerText),
   snippet:document.body.innerText.replace(/\s+/g,' ').slice(0,200)
 }));
 console.log(info);
 console.log('errors:',errs.length?errs:'none');
 console.log('net>=400:',net.length?[...new Set(net)]:'none');
 await t.screenshot({path:'scratchpad/map.png'});
 await b.close();server.close();})();
