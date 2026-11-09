/* Reconstructed 2026-11-06. Not recovered original source. */
(function (root) {
  'use strict';
  const DURATION = 30000, COUNT = 40, TOTAL = DURATION * COUNT;
  class Timer {
    constructor() { this.reset(); }
    reset() { this.elapsed = 0; this.running = false; this.anchor = 0; }
    value(now) { return Math.min(TOTAL, this.elapsed + (this.running ? Math.max(0, now - this.anchor) : 0)); }
    start(now) { if (this.running || this.elapsed >= TOTAL) return; this.anchor = now; this.running = true; }
    pause(now) { this.elapsed = this.value(now); this.running = false; }
    seek(exercise, round, phase, now) {
      if (![exercise, round, phase].every(Number.isInteger) || exercise < 0 || exercise > 4 || round < 0 || round > 3 || phase < 0 || phase > 1) throw new RangeError('Invalid position');
      this.elapsed = ((exercise * 4 + round) * 2 + phase) * DURATION;
      this.anchor = now;
    }
    snapshot(now) {
      const elapsed = this.value(now), done = elapsed >= TOTAL;
      const segment = Math.min(COUNT - 1, Math.floor(elapsed / DURATION));
      return { elapsed, done, segment, exercise: Math.floor(segment / 8), round: Math.floor(segment / 2) % 4,
        phase: segment % 2, remaining: done ? 0 : Math.ceil((DURATION - elapsed % DURATION) / 1000),
        totalRemaining: Math.ceil((TOTAL - elapsed) / 1000) };
    }
  }
  const api = { Timer, DURATION, TOTAL, COUNT };
  if (typeof module !== 'undefined' && module.exports) module.exports = api;
  else root.HiitCore = api;
})(globalThis);
