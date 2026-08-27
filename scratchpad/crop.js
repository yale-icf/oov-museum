// crop.js <src> <out> [left top w h] [--w N]  -- fractions 0..1 for the box
const sharp=require('sharp');
const [,,src,out,...rest]=process.argv;
const wi=rest.indexOf('--w'); const W=wi>=0?parseInt(rest[wi+1],10):1500;
const box=rest.filter(x=>x!=='--w'&&x!==String(W)).map(Number);
(async()=>{const m=await sharp(src).metadata();
 let img=sharp(src);
 if(box.length===4){const [l,t,w,h]=box;
   img=img.extract({left:Math.round(l*m.width),top:Math.round(t*m.height),
                    width:Math.round(w*m.width),height:Math.round(h*m.height)});}
 await img.resize({width:W}).jpeg({quality:88}).toFile(out);
 console.log(out,'from',m.width+'x'+m.height,box.length?('box '+box.join(' ')):'full');})();
