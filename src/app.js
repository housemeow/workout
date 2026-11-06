/* Browser adapter; audio and wake-lock failures must never block timing. */
'use strict';
const $ = id => document.getElementById(id);
const timer = new HiitCore.Timer();
const names = ['蛙跳', '深蹲', '動作 3（待取回）', '動作 4（待取回）', '動作 5（待取回）'];
let lastSegment = -1, lastCount = -1, context, beat = 0, nextBeat = 0;
let wakeLock = null, wakePending = false, wakeEpoch = 0;
const now = () => performance.now();
function refreshNames() {
  const selected = $('exercise').value || '0';
  $('exercise').replaceChildren(...names.map((name, i) => { const o = document.createElement('option'); o.value = i; o.textContent = name; return o; }));
  $('exercise').value = selected;
}
refreshNames();
names.forEach((name, i) => {
  const label = document.createElement('label'); label.textContent = `第 ${i + 1} 組`;
  const input = document.createElement('input'); input.type = 'text'; input.value = name; input.id = `name${i}`; input.maxLength = 32; input.disabled = i <= 1;
  label.append(input); $('names').append(label);
});
function say(text) {
  if (!$('voice').checked || !('speechSynthesis' in window)) return;
  try { speechSynthesis.cancel(); const u = new SpeechSynthesisUtterance(text); u.lang = 'zh-TW'; u.rate = 1.05; speechSynthesis.speak(u); } catch (_) { $('audioStatus').textContent = '語音不可用；計時照常運作'; }
}
function cancelVoice() { try { window.speechSynthesis?.cancel(); } catch (_) {} }
function unlockAudio() {
  try {
    const AC = window.AudioContext || window.webkitAudioContext;
    if (!AC) { $('audioStatus').textContent = '不支援合成節奏；計時照常運作'; return; }
    context ||= new AC();
    context.resume().then(() => { $('audioStatus').textContent = context.state === 'running' ? '音訊已就緒；語音依系統支援' : '音訊受限；請再次按開始'; }).catch(() => { $('audioStatus').textContent = '音訊啟用失敗；計時照常運作'; });
    nextBeat = 0;
  } catch (_) { $('audioStatus').textContent = '音訊不可用；計時照常運作'; }
}
function tone(freq, duration, volume) {
  if (!context || context.state !== 'running') return;
  const osc = context.createOscillator(), gain = context.createGain(), t = context.currentTime;
  osc.frequency.setValueAtTime(freq, t); osc.frequency.exponentialRampToValueAtTime(freq / 2, t + duration);
  gain.gain.setValueAtTime(Math.max(.0001, volume), t); gain.gain.exponentialRampToValueAtTime(.0001, t + duration);
  osc.connect(gain); gain.connect(context.destination); osc.start(t); osc.stop(t + duration);
  osc.onended = () => { osc.disconnect(); gain.disconnect(); };
}
function rhythm() {
  if (!timer.running || !$('music').checked || !context || context.state !== 'running') return;
  if (context.currentTime >= nextBeat) { tone(beat++ % 4 === 0 ? 150 : 700, .10, Number($('volume').value) / 100 * .25); nextBeat = context.currentTime + 60 / 128; }
}
async function releaseWake() {
  wakeEpoch++;
  const old = wakeLock; wakeLock = null;
  if (old) { try { await old.release(); } catch (_) {} }
}
async function acquireWake() {
  if (!timer.running || !$('wake').checked || document.hidden || wakeLock || wakePending) return;
  if (!window.isSecureContext || !navigator.wakeLock) { $('wakeStatus').textContent = '此環境不支援常亮或不是安全環境；計時照常運作'; return; }
  wakePending = true; const epoch = wakeEpoch;
  try {
    const lock = await navigator.wakeLock.request('screen');
    if (epoch !== wakeEpoch || !timer.running || !$('wake').checked || document.hidden) { await lock.release(); return; }
    wakeLock = lock; $('wakeStatus').textContent = '已取得常亮請求；系統仍可能釋放';
    lock.addEventListener('release', () => { if (wakeLock === lock) { wakeLock = null; $('wakeStatus').textContent = '常亮已被系統釋放；可暫停後繼續重試'; } });
  } catch (e) { $('wakeStatus').textContent = `常亮未取得（${e.name || 'Error'}）；計時照常運作`; }
  finally { wakePending = false; if (epoch !== wakeEpoch && timer.running && $('wake').checked && !document.hidden) void acquireWake(); }
}
function phaseText(s) { return s.phase ? (s.exercise === 1 ? '靜態深蹲' : '休息') : '運動'; }
function stop(message) {
  timer.pause(now()); cancelVoice(); void releaseWake();
  $('wakeStatus').textContent = '常亮已停止'; $('status').textContent = message;
}
function render() {
  const s = timer.snapshot(now());
  if (s.done && timer.running) { stop('20 分鐘課表完成'); say('運動完成'); }
  $('clock').textContent = s.remaining;
  $('activity').textContent = s.done ? '完成！' : (s.phase && s.exercise === 1 ? '靜態深蹲' : names[s.exercise]);
  $('phase').textContent = s.done ? '課表完成' : phaseText(s);
  $('position').textContent = `第 ${s.exercise + 1} / 5 組 · 第 ${s.round + 1} / 4 輪`;
  $('total').textContent = `${Math.floor(s.totalRemaining / 60).toString().padStart(2, '0')}:${(s.totalRemaining % 60).toString().padStart(2, '0')}`;
  $('progress').value = s.elapsed; $('pause').disabled = !timer.running; $('start').disabled = timer.running || s.done;
  $('start').textContent = s.elapsed ? '▶ 繼續' : '▶ 開始';
  if (timer.running) {
    if (lastSegment !== s.segment) { say(`${names[s.exercise]}，第${s.round + 1}輪，${phaseText(s)}`); lastSegment = s.segment; lastCount = -1; }
    else if (s.remaining <= 3 && lastCount !== s.remaining) { say(String(s.remaining)); lastCount = s.remaining; }
  }
}
$('start').onclick = () => { unlockAudio(); timer.start(now()); lastSegment = -1; $('status').textContent = '進行中'; void acquireWake(); render(); };
$('pause').onclick = () => { stop('已暫停'); render(); };
$('reset').onclick = () => { stop('已重置'); timer.reset(); lastSegment = -1; lastCount = -1; $('exercise').value = '0'; $('round').value = '0'; $('segment').value = '0'; render(); };
$('jump').onclick = () => { cancelVoice(); timer.seek(Number($('exercise').value), Number($('round').value), Number($('segment').value), now()); lastSegment = -1; lastCount = -1; $('status').textContent = timer.running ? '已切換，繼續計時' : '已切換，等待開始'; render(); };
$('voice').onchange = () => { if (!$('voice').checked) cancelVoice(); };
$('music').onchange = () => { if ($('music').checked && timer.running) unlockAudio(); };
$('wake').onchange = () => { if ($('wake').checked) void acquireWake(); else { void releaseWake(); $('wakeStatus').textContent = '常亮已關閉'; } };
$('saveNames').onclick = () => { for (let i = 2; i < 5; i++) names[i] = $(`name${i}`).value.trim() || `動作 ${i + 1}（未命名）`; refreshNames(); lastSegment = -1; render(); };
document.addEventListener('visibilitychange', () => { if (document.hidden && timer.running) { stop('畫面離開前景，已自動暫停；返回後請按繼續'); render(); } });
window.addEventListener('pagehide', () => { stop('頁面離開，已暫停'); });
setInterval(() => { render(); rhythm(); }, 100);
render();

function moveRound(delta) {
  const s = timer.snapshot(now());
  const target = Math.max(0, Math.min(19, s.exercise * 4 + s.round + delta));
  $('exercise').value = String(Math.floor(target / 4)); $('round').value = String(target % 4); $('segment').value = '0'; $('jump').onclick();
}
$('previous').onclick = () => moveRound(-1);
$('next').onclick = () => moveRound(1);
