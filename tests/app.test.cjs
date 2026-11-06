const {test}=require('node:test');const assert=require('node:assert/strict');const fs=require('node:fs');const vm=require('node:vm');
function harness(wakeLock){
 let time=0;const nodes=new Map(),events={};
 const node=()=>({value:'0',checked:true,textContent:'',disabled:false,append(){},replaceChildren(){}});
 const get=id=>{if(!nodes.has(id))nodes.set(id,node());return nodes.get(id);};
 get('volume').value='25';
 const document={hidden:false,getElementById:get,createElement:node,addEventListener:(k,v)=>events[k]=v};
 const c={document,navigator:{wakeLock},performance:{now:()=>time},setInterval:fn=>events.tick=fn,console,SpeechSynthesisUtterance:function(t){this.text=t;}};
 c.window=c;c.isSecureContext=true;c.addEventListener=(k,v)=>events[k]=v;c.speechSynthesis={speak(){},cancel(){}};
 vm.createContext(c);for(const file of ['core.js','app.js'])vm.runInContext(fs.readFileSync(`${__dirname}/../src/${file}`,'utf8'),c);
 return {get,events,document,setTime:t=>time=t};
}
test('start, static squat, pause, resume, seek, finish, reset via handlers',()=>{
 const h=harness();h.get('start').onclick();assert.equal(h.get('pause').disabled,false);
 h.get('exercise').value='1';h.get('round').value='0';h.get('segment').value='0';h.get('jump').onclick();h.setTime(30000);h.events.tick();assert.equal(h.get('activity').textContent,'靜態深蹲');
 h.get('pause').onclick();h.setTime(90000);h.events.tick();assert.equal(h.get('clock').textContent,30);
 h.get('start').onclick();h.get('exercise').value='4';h.get('round').value='3';h.get('segment').value='1';h.get('jump').onclick();
 h.setTime(120000);h.events.tick();assert.equal(h.get('activity').textContent,'完成！');assert.equal(h.get('start').disabled,true);
 h.get('reset').onclick();assert.equal(h.get('total').textContent,'20:00');assert.equal(h.get('start').disabled,false);
});
test('missing audio/wake APIs do not block timing; hidden pauses',()=>{
 const h=harness();h.get('start').onclick();h.setTime(5000);h.events.tick();assert.equal(h.get('clock').textContent,25);
 h.document.hidden=true;h.events.visibilitychange();h.setTime(90000);h.events.tick();assert.equal(h.get('clock').textContent,25);assert.equal(h.get('pause').disabled,true);
});
test('wake rejection leaves timer running',async()=>{
 const h=harness({request:async()=>{const e=new Error();e.name='NotAllowedError';throw e;}});h.get('start').onclick();await new Promise(setImmediate);assert.match(h.get('wakeStatus').textContent,/NotAllowedError/);assert.equal(h.get('pause').disabled,false);
});
test('late wake grant after pause is released',async()=>{
 let resolve,released=false;const h=harness({request:()=>new Promise(r=>resolve=r)});h.get('start').onclick();h.get('pause').onclick();resolve({release:async()=>{released=true;},addEventListener(){}});await new Promise(setImmediate);assert.equal(released,true);assert.equal(h.get('pause').disabled,true);
});
