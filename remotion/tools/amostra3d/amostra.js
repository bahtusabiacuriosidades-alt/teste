const {chromium}=require('playwright');const http=require('http'),fs=require('fs'),path=require('path');
const root=process.argv[2], out=process.argv[3], N=+process.argv[4], from=+(process.argv[5]||0), step=+(process.argv[6]||1);
const types={'.js':'text/javascript','.html':'text/html; charset=utf-8','.json':'application/json','.png':'image/png','.woff2':'font/woff2'};
const srv=http.createServer((q,s)=>{const f=path.join(root,decodeURIComponent(q.url.split('?')[0]));fs.readFile(f,(e,b)=>{if(e){s.writeHead(404);return s.end();}s.writeHead(200,{'Content-Type':types[path.extname(f)]||'application/octet-stream'});s.end(b);});}).listen(8770);
(async()=>{const b=await chromium.launch({args:['--use-gl=angle','--use-angle=swiftshader','--enable-unsafe-swiftshader']});const p=await b.newPage({viewport:{width:1080,height:1920}});
p.on('console',m=>{const t=m.text(); if(!t.includes('GL Driver'))console.log(t)}); p.on('pageerror',e=>console.log('ERRO',e.message));
await p.goto('http://localhost:8770/amostra.html');await p.waitForFunction('window.DONE',null,{timeout:300000});
fs.mkdirSync(out,{recursive:true});
for(let f=from;f<N;f+=step){await p.evaluate(f=>window.renderAt(f),f);await p.screenshot({path:`${out}/f${String(f).padStart(4,'0')}.png`});}
await b.close();srv.close();})();
