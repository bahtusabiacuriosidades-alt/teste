const { chromium } = require('playwright'); const fs=require('fs');
(async()=>{
  const [dir, mode]=process.argv.slice(2);
  const b=await chromium.launch(); const p=await b.newPage({viewport:{width:1080,height:1920}});
  await p.goto('file://'+dir+'/anim.html'); await p.evaluate(async()=>{await document.fonts.load('900 100px Montserrat');await document.fonts.load('800 100px Montserrat');await document.fonts.ready;});
  await p.waitForTimeout(800);
  await p.evaluate(d=>window.setData(d), JSON.parse(fs.readFileSync(dir+'/data.json','utf8')));
  const c=await p.$('canvas');
  const times = mode==='test' ? [0.15,2.0,5.0,6.7,7.8,9.2] : [...Array(300).keys()].map(i=>i/30);
  for(let i=0;i<times.length;i++){ await p.evaluate(t=>window.render(t), times[i]);
    const buf=await c.screenshot({type: mode==='test'?'png':'jpeg', quality: mode==='test'?undefined:92});
    fs.writeFileSync(`${dir}/frames/${mode==='test'?'test':'f'}_${String(i).padStart(4,'0')}.${mode==='test'?'png':'jpg'}`, buf); }
  await b.close();
})();
