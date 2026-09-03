const http=require('http'),fs=require('fs'),path=require('path'),puppeteer=require('puppeteer-core');
const ROOT=process.cwd();
const T={'.html':'text/html','.js':'text/javascript','.css':'text/css','.json':'application/json','.jpg':'image/jpeg','.png':'image/png','.svg':'image/svg+xml','.dzi':'application/xml','.db':'application/octet-stream','.woff2':'font/woff2'};
const server=http.createServer((q,r)=>{const p=path.join(ROOT,decodeURIComponent(q.url.split('?')[0]).replace(/^\/+/,''));
 fs.readFile(p,(e,b)=>{if(e){r.writeHead(404);return r.end('404')}r.writeHead(200,{'Content-Type':T[path.extname(p).toLowerCase()]||'application/octet-stream'});r.end(b)})});
function h(s){let x=0;for(let i=0;i<s.length;i++){x=((x<<5)-x)+s.charCodeAt(i);x|=0}return x.toString()}
const sleep=ms=>new Promise(r=>setTimeout(r,ms));
(async()=>{
 await new Promise(r=>server.listen(8097,r));
 const b=await puppeteer.launch({executablePath:'C:/Program Files/Google/Chrome/Application/chrome.exe',headless:'new',args:['--no-sandbox']});
 const t=await b.newPage();
 const errs=[]; t.on('pageerror',e=>errs.push(String(e).slice(0,120)));
 t.on('console',m=>{if(m.type()==='error'&&!/favicon/.test(m.text()))errs.push(m.text().slice(0,120))});
 await t.goto('http://localhost:8097/index.html',{waitUntil:'domcontentloaded'});
 await t.evaluate(v=>localStorage.setItem('oov_auth',v),h('oov26icf'));

 // --- search page ---
 await t.goto('http://localhost:8097/search.html',{waitUntil:'networkidle2'}); await sleep(900);
 console.log('BROWSE SECTIONS: '+await t.evaluate(()=>[...document.querySelectorAll('.browse-head .lbl')].map(e=>e.textContent.trim()).join(' | ')));
 console.log('  publications container present:',await t.evaluate(()=>!!document.getElementById('browse-pubs')));
 console.log('  type shelves rendered:',await t.evaluate(()=>document.querySelectorAll('#browse-depts > *').length),'| highlights:',await t.evaluate(()=>document.querySelectorAll('#browse-hl > *').length),'| countries:',await t.evaluate(()=>document.querySelectorAll('#browse-country > *').length),'| eras:',await t.evaluate(()=>document.querySelectorAll('#browse-era > *').length));

 await t.type('#q','bond'); await sleep(1200);
 console.log('QUERY "bond": '+await t.evaluate(()=>document.querySelectorAll('.card').length)+' cards, count line: "'+
   await t.evaluate(()=>(document.querySelector('.cat-bar, .resultcount, #count')||{}).textContent?.trim().slice(0,60)||'')+'"');

 // a removed record must not be findable
 await t.evaluate(()=>{document.getElementById('q').value='';});
 await t.type('#q','south sea bubble'); await sleep(1200);
 console.log('QUERY "south sea bubble" (deck was removed): '+await t.evaluate(()=>document.querySelectorAll('.card').length)+' cards');

 await t.evaluate(()=>{document.getElementById('q').value='';});
 await t.type('#q','windkaart'); await sleep(1200);
 console.log('QUERY "windkaart" (survivor 0079): '+await t.evaluate(()=>document.querySelectorAll('.card').length)+' cards');

 // browse-all
 await t.evaluate(()=>{document.getElementById('q').value='';}); await sleep(400);
 const hasBrowseAll=await t.evaluate(()=>!!document.getElementById('browse-all'));
 if(hasBrowseAll){await t.evaluate(()=>document.getElementById('browse-all').click()); await sleep(1800);
   console.log('BROWSE ALL: '+await t.evaluate(()=>document.querySelectorAll('.card').length)+' cards on page 1');}

 // --- viewer: does the description change per image? ---
 await t.goto('http://localhost:8097/viewer.html?id=goetzmann0560',{waitUntil:'networkidle2'}); await sleep(1200);
 const seen=[];
 for(let i=0;i<4;i++){
   seen.push(await t.evaluate(()=>(document.getElementById('desc')||{}).textContent.trim().slice(0,52)));
   await t.keyboard.press('ArrowRight'); await sleep(700);
 }
 console.log('VIEWER 0560 leaf-by-leaf description:');
 seen.forEach((s,i)=>console.log('   leaf '+(i+1)+': '+s+'…'));
 console.log('   all four distinct:',new Set(seen).size===4);
 console.log('   #pagenote in DOM:',await t.evaluate(()=>!!document.getElementById('pagenote')));

 console.log('\nJS ERRORS: '+(errs.length?errs.join(' || '):'none'));
 await b.close(); server.close();
})();
