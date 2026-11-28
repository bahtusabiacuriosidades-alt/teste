const {chromium}=require('playwright');const http=require('http'),fs=require('fs'),path=require('path');
const root=process.argv[2], out=process.argv[3], from=+process.argv[4], to=+process.argv[5], step=+(process.argv[6]||1), port=+(process.argv[7]||8780);
const types={'.js':'text/javascript','.html':'text/html; charset=utf-8','.json':'application/json','.png':'image/png'};
const srv=http.createServer((q,s)=>{const f=path.join(root,decodeURIComponent(q.url.split('?')[0]));fs.readFile(f,(e,b)=>{if(e){s.writeHead(404);return s.end();}s.writeHead(200,{'Content-Type':types[path.extname(f)]||'application/octet-stream'});s.end(b);});}).listen(port);
(async()=>{const b=await chromium.launch({args:['--use-gl=angle','--use-angle=swiftshader','--enable-unsafe-swiftshader']});const p=await b.newPage({viewport:{width:1080,height:1920}});
p.on('pageerror',e=>console.log('ERRO',e.message));
await p.goto(`http://localhost:${port}/v09.html`);await p.waitForFunction('window.DONE',null,{timeout:300000});
fs.mkdirSync(out,{recursive:true});
for(let f=Math.max(0,from-60);f<to;f+=1){await p.evaluate(f=>window.renderAt(f),f); if(f>=from && (f-from)%step===0) await p.screenshot({path:`${out}/f${String(f).padStart(4,'0')}.jpg`,type:'jpeg',quality:90});}
console.log('ok',from,to);await b.close();srv.close();})();
