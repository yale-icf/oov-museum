const http=require('http'),fs=require('fs'),path=require('path'),puppeteer=require('puppeteer-core');
const ROOT=process.cwd();
const T={'.html':'text/html','.js':'text/javascript','.css':'text/css','.json':'application/json','.jpg':'image/jpeg','.png':'image/png','.svg':'image/svg+xml','.dzi':'application/xml','.woff2':'font/woff2'};
const server=http.createServer((q,r)=>{const p=path.join(ROOT,decodeURIComponent(q.url.split('?')[0]).replace(/^\/+/,''));
 fs.readFile(p,(e,b)=>{if(e){r.writeHead(404);return r.end('404')}r.writeHead(200,{'Content-Type':T[path.extname(p).toLowerCase()]||'application/octet-stream'});r.end(b)})});
function h(s){let x=0;for(let i=0;i<s.length;i++){x=((x<<5)-x)+s.charCodeAt(i);x|=0}return x.toString()}
(async()=>{await new Promise(r=>server.listen(8098,r));
 const b=await puppeteer.launch({executablePath:'C:/Program Files/Google/Chrome/Application/chrome.exe',headless:'new',args:['--no-sandbox']});
 for(const pg of ['exhibit-financing-war.html','exhibit-stock-market.html','exhibit-women-investors.html']){
  const t=await b.newPage();
  await t.goto('http://localhost:8098/index.html',{waitUntil:'domcontentloaded'});
  await t.evaluate(v=>localStorage.setItem('oov_auth',v),h('oov26icf'));
  await t.goto('http://localhost:8098/'+pg,{waitUntil:'networkidle2'});
  await new Promise(r=>setTimeout(r,800));
  const bad=await t.evaluate(()=>[...document.images].filter(i=>i.complete&&i.naturalWidth===0)
    .map(i=>({src:i.getAttribute('src'),cls:i.className,parent:i.parentElement?.className})));
  console.log(pg); bad.forEach(x=>console.log('   broken:',JSON.stringify(x)));
  await t.close();
 }
 await b.close();server.close();})();
