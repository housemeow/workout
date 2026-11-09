const {test} = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const vm = require('node:vm');
const path = require('node:path');
const root = path.resolve(__dirname, '..');
const html = fs.readFileSync(path.join(root, 'src/hiit.html'), 'utf8');
const script = html.match(/<script>([\s\S]*?)<\/script>/)[1];
function harness(wakeLock) {
  let time = 0, nextTimer = 0;
  const nodes = new Map(), intervals = new Map(), spoken = [], events = {};
  function node() { return {textContent:'',value:'0',checked:true,style:{},handlers:{},classList:{toggle(){}},addEventListener(k,f){this.handlers[k]=f;}}; }
  const get = id => {if (!nodes.has(id)) nodes.set(id,node());return nodes.get(id);};
  get('volume').value = '35';
  const groups = Array.from({length:5},(_,i)=>{const n=node(),b=node();n.dataset={group:String(i)};n.querySelector=()=>b;return n;});
  const document = {visibilityState:'visible',getElementById:get,querySelectorAll:()=>groups,addEventListener:(k,f)=>events[k]=f};
  const c = {document,navigator:{wakeLock},Date:{now:()=>time},console,
    setInterval:f=>{intervals.set(++nextTimer,f);return nextTimer;},clearInterval:id=>intervals.delete(id),
    SpeechSynthesisUtterance:function(text){this.text=text;},speechSynthesis:{cancel(){},speak(u){spoken.push(u.text);}}};
  c.window=c;c.isSecureContext=true;
  vm.createContext(c);vm.runInContext(script,c);
  return {get,groups,spoken,events,document,click:id=>get(id).handlers.click(),change:(id,value)=>{get(id).value=String(value);get(id).handlers.change({target:get(id)});},tick:t=>{time=t;for(const f of [...intervals.values()])f();}};
}
test('active source matches user-supplied original byte for byte',()=>{
 assert.deepEqual(fs.readFileSync(path.join(root,'src/hiit.html')),fs.readFileSync(path.join(root,'original/HIIT_運動計時器_修復版.html')));
 new vm.Script(script);
});
test('all groups and four rounds preserve original rest labels and voice',()=>{
 const h=harness();h.click('start');
 const names=['蛙跳','分腿跳','波比跳','伏地挺身','深蹲'];
 for(let g=0;g<5;g++)for(let r=0;r<4;r++){
  h.tick((g*240+r*60)*1000);assert.equal(h.get('name').textContent,names[g]);assert.equal(h.get('round').value,String(r));assert.match(h.spoken.at(-1),new RegExp(names[g]));
  h.tick((g*240+r*60+30000/1000)*1000);assert.equal(h.get('phase').textContent,g===4?'🧎 深蹲停留':'🌿 休息中');assert.equal(h.spoken.at(-1),g===4?'深蹲停留三十秒':'休息三十秒');
 }
 h.tick(1200000);assert.equal(h.get('name').textContent,'全部完成！');assert.equal(h.get('total').textContent,'剩餘 00:00');
});
test('pause, resume, round selection, group card, previous/next, reset',()=>{
 const h=harness();h.click('start');h.tick(10000);h.click('start');h.tick(50000);assert.equal(h.get('clock').textContent,'20');
 h.click('start');h.tick(55000);assert.equal(h.get('clock').textContent,'15');
 h.change('exercise',4);h.change('round',2);assert.equal(h.get('name').textContent,'深蹲');assert.equal(h.get('round').value,'2');
 h.click('prev');assert.equal(h.get('round').value,'1');h.click('next');assert.equal(h.get('round').value,'2');
 h.groups[1].handlers.click();assert.equal(h.get('name').textContent,'分腿跳');assert.equal(h.get('round').value,'0');
 h.click('reset');assert.equal(h.get('total').textContent,'剩餘 20:00');assert.equal(h.get('name').textContent,'蛙跳');
});
test('missing audio and rejected wake lock do not block timer',async()=>{
 const h=harness({request:async()=>{throw new Error('denied');}});h.click('start');await new Promise(setImmediate);h.tick(5000);assert.equal(h.get('clock').textContent,'25');assert.match(h.get('wakeStatus').textContent,/系統未允許/);
});
test('late wake grant after pause releases lock',async()=>{
 let resolve,released=false;const h=harness({request:()=>new Promise(r=>resolve=r)});h.click('start');h.click('start');resolve({release:async()=>{released=true;},addEventListener(){}});await new Promise(setImmediate);assert.equal(released,true);
});
test('original background behavior continues elapsed time and reacquires wake on return',async()=>{
 let requests=0;const h=harness({request:async()=>{requests++;throw new Error('denied');}});h.click('start');await new Promise(setImmediate);
 h.document.visibilityState='hidden';h.events.visibilitychange();h.tick(90000);assert.equal(h.get('round').value,'1');
 h.document.visibilityState='visible';h.events.visibilitychange();await new Promise(setImmediate);assert.equal(requests,2);
});
