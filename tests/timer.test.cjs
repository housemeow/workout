const {test} = require('node:test');
const assert = require('node:assert/strict');
const {Timer,TOTAL} = require('../src/core.js');
test('40 phases, five groups, four rounds, exactly 20 minutes',()=>{
 const t=new Timer();t.start(0);
 for(let i=0;i<40;i++) {const s=t.snapshot(i*30000);assert.equal(s.segment,i);assert.equal(s.exercise,Math.floor(i/8));assert.equal(s.round,Math.floor(i/2)%4);assert.equal(s.phase,i%2);assert.equal(s.remaining,30);}
 assert.equal(t.snapshot(TOTAL-1).done,false);assert.equal(t.snapshot(TOTAL).done,true);assert.equal(t.snapshot(TOTAL+100000).totalRemaining,0);
});
test('pause and resume preserve fractional seconds; repeated start is harmless',()=>{
 const t=new Timer();t.start(100);t.start(1000);t.pause(1334);assert.equal(t.snapshot(100000).elapsed,1234);t.start(9000);assert.equal(t.snapshot(10000).elapsed,2234);
});
test('seek while running/paused, final rest, reset, invalid input',()=>{
 const t=new Timer();t.seek(4,3,1,0);assert.equal(t.elapsed,1170000);assert.equal(t.running,false);t.start(0);assert.equal(t.snapshot(30000).done,true);
 t.seek(0,0,1,40000);assert.equal(t.running,true);assert.equal(t.snapshot(40000).remaining,30);t.reset();assert.equal(t.snapshot(9).elapsed,0);assert.equal(t.running,false);assert.throws(()=>t.seek(5,0,0,0),RangeError);
});
