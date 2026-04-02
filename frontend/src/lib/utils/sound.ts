/**
 * Web Audio API sound engine — zero deps, procedural synthesis.
 * All sounds are synthesized with oscillators so they work offline.
 */

let ctx: AudioContext | null = null;
let masterGain: GainNode | null = null;
let enabled = true;

function getCtx(): AudioContext | null {
  if (typeof window === 'undefined') return null;
  if (!ctx) {
    try {
      ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
      masterGain = ctx.createGain();
      masterGain.gain.value = 0.4;
      masterGain.connect(ctx.destination);
    } catch {
      return null;
    }
  }
  if (ctx.state === 'suspended') ctx.resume().catch(() => {});
  return ctx;
}

function gain(db = 0) {
  const c = getCtx();
  if (!c || !masterGain || !enabled) return null;
  const g = c.createGain();
  g.gain.value = Math.pow(10, db / 20);
  g.connect(masterGain);
  return g;
}

/** Short click / tap — used on every interactive element */
export function playClick(volume = 0): void {
  const c = getCtx();
  const g = gain(volume - 18);
  if (!c || !g) return;
  const osc = c.createOscillator();
  osc.type = 'sine';
  osc.frequency.setValueAtTime(880, c.currentTime);
  osc.frequency.exponentialRampToValueAtTime(440, c.currentTime + 0.04);
  g.gain.setValueAtTime(0.8, c.currentTime);
  g.gain.exponentialRampToValueAtTime(0.001, c.currentTime + 0.06);
  osc.connect(g);
  osc.start(c.currentTime);
  osc.stop(c.currentTime + 0.07);
}

/** Soft leaf-rustle hover — destination cards */
export function playHover(): void {
  const c = getCtx();
  const g = gain(-28);
  if (!c || !g) return;
  const bufSize = c.sampleRate * 0.08;
  const buf = c.createBuffer(1, bufSize, c.sampleRate);
  const data = buf.getChannelData(0);
  for (let i = 0; i < bufSize; i++) data[i] = (Math.random() * 2 - 1) * 0.3;
  const src = c.createBufferSource();
  src.buffer = buf;
  const filter = c.createBiquadFilter();
  filter.type = 'bandpass';
  filter.frequency.value = 2400;
  filter.Q.value = 0.5;
  src.connect(filter);
  filter.connect(g);
  g.gain.setValueAtTime(0.6, c.currentTime);
  g.gain.exponentialRampToValueAtTime(0.001, c.currentTime + 0.08);
  src.start(c.currentTime);
}

/** Success chime — unlock / correct password */
export function playSuccess(): void {
  const c = getCtx();
  const g = gain(-12);
  if (!c || !g) return;
  const freqs = [523.25, 659.25, 783.99]; // C5 E5 G5 triad
  freqs.forEach((freq, i) => {
    const osc = c.createOscillator();
    osc.type = 'sine';
    osc.frequency.value = freq;
    const oscGain = c.createGain();
    oscGain.gain.setValueAtTime(0, c.currentTime + i * 0.12);
    oscGain.gain.linearRampToValueAtTime(0.5, c.currentTime + i * 0.12 + 0.02);
    oscGain.gain.exponentialRampToValueAtTime(0.001, c.currentTime + i * 0.12 + 0.6);
    osc.connect(oscGain);
    oscGain.connect(g);
    osc.start(c.currentTime + i * 0.12);
    osc.stop(c.currentTime + i * 0.12 + 0.7);
  });
}

/** Error shake — wrong password */
export function playError(): void {
  const c = getCtx();
  const g = gain(-16);
  if (!c || !g) return;
  const osc = c.createOscillator();
  osc.type = 'sawtooth';
  osc.frequency.setValueAtTime(160, c.currentTime);
  osc.frequency.exponentialRampToValueAtTime(80, c.currentTime + 0.15);
  g.gain.setValueAtTime(0.5, c.currentTime);
  g.gain.exponentialRampToValueAtTime(0.001, c.currentTime + 0.2);
  osc.connect(g);
  osc.start(c.currentTime);
  osc.stop(c.currentTime + 0.2);
}

/** Confetti whoosh — CTA action / birthday */
export function playWhoosh(): void {
  const c = getCtx();
  const g = gain(-14);
  if (!c || !g) return;
  const bufSize = c.sampleRate * 0.35;
  const buf = c.createBuffer(1, bufSize, c.sampleRate);
  const data = buf.getChannelData(0);
  for (let i = 0; i < bufSize; i++) {
    const envelope = Math.exp(-i / (bufSize * 0.3));
    data[i] = (Math.random() * 2 - 1) * envelope;
  }
  const src = c.createBufferSource();
  src.buffer = buf;
  const filter = c.createBiquadFilter();
  filter.type = 'highpass';
  filter.frequency.value = 800;
  src.connect(filter);
  filter.connect(g);
  src.start(c.currentTime);
}

/** Deep jungle ambient tone — hero section entrance */
export function playAmbientRise(): void {
  const c = getCtx();
  const g = gain(-22);
  if (!c || !g) return;
  const osc = c.createOscillator();
  osc.type = 'sine';
  osc.frequency.setValueAtTime(55, c.currentTime);
  osc.frequency.exponentialRampToValueAtTime(110, c.currentTime + 2.5);
  g.gain.setValueAtTime(0, c.currentTime);
  g.gain.linearRampToValueAtTime(0.6, c.currentTime + 1.2);
  g.gain.linearRampToValueAtTime(0, c.currentTime + 2.5);
  osc.connect(g);
  osc.start(c.currentTime);
  osc.stop(c.currentTime + 2.6);
}

/** Scroll milestone tone — deep resonant hit on section breaks */
export function playMilestone(): void {
  const c = getCtx();
  const g = gain(-20);
  if (!c || !g) return;
  const osc = c.createOscillator();
  osc.type = 'sine';
  osc.frequency.setValueAtTime(220, c.currentTime);
  osc.frequency.exponentialRampToValueAtTime(110, c.currentTime + 0.8);
  g.gain.setValueAtTime(0.5, c.currentTime);
  g.gain.exponentialRampToValueAtTime(0.001, c.currentTime + 0.9);
  osc.connect(g);
  osc.start(c.currentTime);
  osc.stop(c.currentTime + 1.0);
}

/** Resume AudioContext after user gesture (required by browser policy) */
export function unlockAudio(): void {
  getCtx();
}

export function setSoundEnabled(on: boolean): void {
  enabled = on;
  if (masterGain) {
    masterGain.gain.value = on ? 0.4 : 0;
  }
}

export function isSoundEnabled(): boolean {
  return enabled;
}
