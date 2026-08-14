import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import lamejs from '@breezystack/lamejs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const SAMPLE_RATE = 44100;
const OUTPUT_DIR = path.resolve(__dirname, '../public/assets/audio');

if (!fs.existsSync(OUTPUT_DIR)) {
  fs.mkdirSync(OUTPUT_DIR, { recursive: true });
}

// Note name to frequency converter
function noteToFreq(note) {
  const notes = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'];
  const match = note.match(/^([A-G]#?)(-?\d+)$/);
  if (!match) throw new Error(`Invalid note: ${note}`);
  const name = match[1];
  const octave = parseInt(match[2], 10);
  const semitone = notes.indexOf(name);
  const midi = (octave + 1) * 12 + semitone;
  return 440 * Math.pow(2, (midi - 69) / 12);
}

// Stereo Schroeder Reverberator for high quality spatial dimension
class Reverb {
  constructor(sampleRate) {
    this.sampleRate = sampleRate;
    const combDelays = [1557, 1617, 1491, 1422, 1277, 1356, 1188, 1116].map(d => Math.round(d * (sampleRate / 44100)));
    const feedback = 0.84;
    this.combsL = combDelays.slice(0, 4).map(d => ({
      buf: new Float32Array(d),
      idx: 0,
      len: d,
      feedback: feedback
    }));
    this.combsR = combDelays.slice(4, 8).map(d => ({
      buf: new Float32Array(d),
      idx: 0,
      len: d,
      feedback: feedback
    }));

    const allpassDelays = [225, 556, 441, 341].map(d => Math.round(d * (sampleRate / 44100)));
    this.allpassL = allpassDelays.slice(0, 2).map(d => ({
      buf: new Float32Array(d),
      idx: 0,
      len: d,
      gain: 0.5
    }));
    this.allpassR = allpassDelays.slice(2, 4).map(d => ({
      buf: new Float32Array(d),
      idx: 0,
      len: d,
      gain: 0.5
    }));
  }

  process(inL, inR, wetAmount = 0.35) {
    let outL = 0;
    for (const c of this.combsL) {
      const delayed = c.buf[c.idx];
      c.buf[c.idx] = inL + delayed * c.feedback;
      c.idx = (c.idx + 1) % c.len;
      outL += delayed;
    }
    for (const ap of this.allpassL) {
      const bufVal = ap.buf[ap.idx];
      const v = outL - ap.gain * bufVal;
      ap.buf[ap.idx] = outL;
      ap.idx = (ap.idx + 1) % ap.len;
      outL = bufVal + ap.gain * v;
    }

    let outR = 0;
    for (const c of this.combsR) {
      const delayed = c.buf[c.idx];
      c.buf[c.idx] = inR + delayed * c.feedback;
      c.idx = (c.idx + 1) % c.len;
      outR += delayed;
    }
    for (const ap of this.allpassR) {
      const bufVal = ap.buf[ap.idx];
      const v = outR - ap.gain * bufVal;
      ap.buf[ap.idx] = outR;
      ap.idx = (ap.idx + 1) % ap.len;
      outR = bufVal + ap.gain * v;
    }

    return {
      left: inL * (1 - wetAmount * 0.4) + outL * wetAmount * 0.22,
      right: inR * (1 - wetAmount * 0.4) + outR * wetAmount * 0.22
    };
  }
}

// Bandpass filter helper
function bandpass(input, fCenter, q) {
  const out = new Float32Array(input.length);
  const w0 = 2 * Math.PI * fCenter / SAMPLE_RATE;
  const alpha = Math.sin(w0) / (2 * q);
  const b0 = alpha;
  const b1 = 0;
  const b2 = -alpha;
  const a0 = 1 + alpha;
  const a1 = -2 * Math.cos(w0);
  const a2 = 1 - alpha;

  let x1 = 0, x2 = 0, y1 = 0, y2 = 0;
  for (let i = 0; i < input.length; i++) {
    const x0 = input[i];
    const y0 = (b0 / a0) * x0 + (b1 / a0) * x1 + (b2 / a0) * x2 - (a1 / a0) * y1 - (a2 / a0) * y2;
    out[i] = y0;
    x2 = x1;
    x1 = x0;
    y2 = y1;
    y1 = y0;
  }
  return out;
}

// Lowpass filter helper
function lowpass(input, fCutoff) {
  const out = new Float32Array(input.length);
  const rc = 1.0 / (2 * Math.PI * fCutoff);
  const dt = 1.0 / SAMPLE_RATE;
  const alpha = dt / (rc + dt);
  let prev = 0;
  for (let i = 0; i < input.length; i++) {
    prev = prev + alpha * (input[i] - prev);
    out[i] = prev;
  }
  return out;
}

// Instrument: Sparkling Glockenspiel / Crystal Chimes
function glockenspiel(t, freq, duration, pan = 0) {
  if (t < 0 || t > duration) return { left: 0, right: 0 };
  const env = Math.exp(-t * 4.8) * (1 - Math.exp(-t * 140));
  
  const f1 = Math.sin(2 * Math.PI * freq * t);
  const f2 = 0.42 * Math.sin(2 * Math.PI * freq * 2.756 * t) * Math.exp(-t * 7.0);
  const f3 = 0.22 * Math.sin(2 * Math.PI * freq * 5.404 * t) * Math.exp(-t * 11.0);
  const f4 = 0.12 * Math.sin(2 * Math.PI * freq * 8.933 * t) * Math.exp(-t * 16.0);
  
  const mallet = (Math.random() * 2 - 1) * Math.exp(-t * 350) * 0.12;
  
  const sample = (f1 + f2 + f3 + f4 + mallet) * env;
  const leftGain = Math.cos((pan + 1) * Math.PI / 4);
  const rightGain = Math.sin((pan + 1) * Math.PI / 4);
  return { left: sample * leftGain, right: sample * rightGain };
}

// Instrument: Warm Marimba / Woody Mallet
function marimba(t, freq, duration, pan = 0) {
  if (t < 0 || t > duration) return { left: 0, right: 0 };
  const env = Math.exp(-t * 7.2) * (1 - Math.exp(-t * 200));
  
  const f1 = Math.sin(2 * Math.PI * freq * t);
  const f2 = 0.38 * Math.sin(2 * Math.PI * freq * 3.0 * t) * Math.exp(-t * 14.0);
  const f3 = 0.12 * Math.sin(2 * Math.PI * freq * 6.0 * t) * Math.exp(-t * 22.0);
  
  const thud = Math.sin(2 * Math.PI * (freq * 0.5) * t) * Math.exp(-t * 75.0) * 0.28;
  
  const sample = (f1 + f2 + f3 + thud) * env;
  const leftGain = Math.cos((pan + 1) * Math.PI / 4);
  const rightGain = Math.sin((pan + 1) * Math.PI / 4);
  return { left: sample * leftGain, right: sample * rightGain };
}

// Instrument: Gentle Warm Brass Fanfare
function brass(t, freq, duration, pan = 0) {
  if (t < 0 || t > duration) return { left: 0, right: 0 };
  let env = 0;
  const attack = 0.032;
  const release = 0.32;
  if (t < attack) {
    env = Math.sin((t / attack) * (Math.PI / 2));
  } else if (t < duration - release) {
    env = 1.0;
  } else {
    const rTime = t - (duration - release);
    env = Math.cos((rTime / release) * (Math.PI / 2));
  }
  
  const detune = 0.0035;
  let wave = 0;
  for (let h = 1; h <= 8; h++) {
    const harmonicAmp = (1 / Math.pow(h, 1.22)) * (0.85 + 0.15 * Math.sin(t * 6));
    wave += harmonicAmp * Math.sin(2 * Math.PI * freq * h * (1 - detune) * t);
    wave += harmonicAmp * Math.sin(2 * Math.PI * freq * h * (1 + detune) * t);
  }
  wave *= 0.32;
  
  const sample = wave * env;
  const leftGain = Math.cos((pan + 1) * Math.PI / 4);
  const rightGain = Math.sin((pan + 1) * Math.PI / 4);
  return { left: sample * leftGain, right: sample * rightGain };
}

// Instrument: Shimmering Magical Sparkle Chimes
function sparkleChime(t, freq, duration, pan = 0) {
  if (t < 0 || t > duration) return { left: 0, right: 0 };
  const env = Math.exp(-t * 3.8) * (1 - Math.exp(-t * 220));
  
  const modFreq = freq * 1.414;
  const modIndex = 2.4 * Math.exp(-t * 5.5);
  const mod = Math.sin(2 * Math.PI * modFreq * t) * modIndex;
  const carrier = Math.sin(2 * Math.PI * freq * t + mod);
  
  const shimmer = 0.72 + 0.28 * Math.sin(2 * Math.PI * 15 * t);
  const sample = carrier * env * shimmer;
  
  const leftGain = Math.cos((pan + 1) * Math.PI / 4);
  const rightGain = Math.sin((pan + 1) * Math.PI / 4);
  return { left: sample * leftGain, right: sample * rightGain };
}

// =========================================================================
// SFX 1: Tile Slide Sound (sfx_slide)
// =========================================================================
function generateTileSlide() {
  const duration = 0.13;
  const totalSamples = Math.floor(duration * SAMPLE_RATE);
  const leftBuf = new Float32Array(totalSamples);
  const rightBuf = new Float32Array(totalSamples);

  const noiseBuf = new Float32Array(totalSamples);
  for (let i = 0; i < totalSamples; i++) {
    noiseBuf[i] = (Math.random() * 2 - 1);
  }

  const friction1 = bandpass(noiseBuf, 1400, 2.0);
  const friction2 = bandpass(noiseBuf, 2800, 3.5);

  for (let i = 0; i < totalSamples; i++) {
    const t = i / SAMPLE_RATE;

    const glideEnv = Math.sin(Math.min(1, t / 0.015) * (Math.PI / 2)) * Math.exp(-t * 35.0);
    const swoosh = (friction1[i] * 0.7 + friction2[i] * 0.3) * glideEnv * 1.35;

    const woodPitch = 240 * Math.exp(-t * 22.0) + 160;
    const woodEnv = Math.exp(-t * 45.0) * (1 - Math.exp(-t * 300));
    const woodBody = Math.sin(2 * Math.PI * woodPitch * t) * woodEnv * 0.75 +
                     0.35 * Math.sin(2 * Math.PI * woodPitch * 2.1 * t) * Math.exp(-t * 60.0);

    let snap = 0;
    const snapT = t - 0.035;
    if (snapT >= 0) {
      const snapEnv = Math.exp(-snapT * 95.0) * (1 - Math.exp(-snapT * 900));
      const snapFreq = 3400 * Math.exp(-snapT * 40.0) + 800;
      const click1 = Math.sin(2 * Math.PI * snapFreq * snapT);
      const click2 = 0.5 * Math.sin(2 * Math.PI * 1850 * snapT) * Math.exp(-snapT * 120.0);
      const microTransient = (Math.random() * 2 - 1) * Math.exp(-snapT * 600.0) * 0.4;
      snap = (click1 + click2 + microTransient) * snapEnv * 1.4;
    }

    let rebound = 0;
    const rebT = t - 0.055;
    if (rebT >= 0) {
      const rebEnv = Math.exp(-rebT * 140.0);
      rebound = Math.sin(2 * Math.PI * 2200 * rebT) * rebEnv * 0.35;
    }

    const mono = (swoosh + woodBody + snap + rebound);

    const pan = -0.15 * Math.exp(-t * 25.0);
    const leftGain = Math.cos((pan + 1) * Math.PI / 4);
    const rightGain = Math.sin((pan + 1) * Math.PI / 4);

    leftBuf[i] = mono * leftGain;
    rightBuf[i] = mono * rightGain;
  }

  const fadeLength = 300;
  for (let i = totalSamples - fadeLength; i < totalSamples; i++) {
    const fade = (totalSamples - i) / fadeLength;
    leftBuf[i] *= fade;
    rightBuf[i] *= fade;
  }

  let maxPeak = 0;
  for (let i = 0; i < totalSamples; i++) {
    const absL = Math.abs(leftBuf[i]);
    const absR = Math.abs(rightBuf[i]);
    if (absL > maxPeak) maxPeak = absL;
    if (absR > maxPeak) maxPeak = absR;
  }

  const targetPeak = 0.88;
  const gain = maxPeak > 0 ? targetPeak / maxPeak : 1.0;

  const pcm16L = new Int16Array(totalSamples);
  const pcm16R = new Int16Array(totalSamples);
  const interleavedPCM = new Int16Array(totalSamples * 2);

  for (let i = 0; i < totalSamples; i++) {
    const sL = Math.tanh(leftBuf[i] * gain);
    const sR = Math.tanh(rightBuf[i] * gain);

    const valL = Math.max(-32768, Math.min(32767, Math.round(sL * 32767)));
    const valR = Math.max(-32768, Math.min(32767, Math.round(sR * 32767)));

    pcm16L[i] = valL;
    pcm16R[i] = valR;
    interleavedPCM[i * 2] = valL;
    interleavedPCM[i * 2 + 1] = valR;
  }

  return {
    sampleRate: SAMPLE_RATE,
    channels: 2,
    totalSamples,
    duration,
    pcm16L,
    pcm16R,
    interleavedPCM
  };
}

// =========================================================================
// SFX 2: Blocked / Invalid Move Thud (sfx_blocked)
// Subtle, dull, muted wooden thud / low-pitch gentle knock against solid frame
// =========================================================================
function generateBlockedThud() {
  const duration = 0.09; // 90ms (Short, damped, gentle)
  const totalSamples = Math.floor(duration * SAMPLE_RATE);
  const leftBuf = new Float32Array(totalSamples);
  const rightBuf = new Float32Array(totalSamples);

  for (let i = 0; i < totalSamples; i++) {
    const t = i / SAMPLE_RATE;

    // 1. Soft Muted Tap Attack (Low-frequency transient, zero harshness: t = 0 ~ 15ms)
    const tapEnv = Math.exp(-t * 180.0) * (1 - Math.exp(-t * 600.0));
    const tap = (Math.sin(2 * Math.PI * 450 * t) + 0.3 * (Math.random() * 2 - 1)) * tapEnv * 0.4;

    // 2. Muted Low Wooden Cavity Knock (Fundamental: 165Hz -> 105Hz, t = 0 ~ 65ms)
    const knockEnv = Math.exp(-t * 52.0) * (1 - Math.exp(-t * 300.0));
    const knockPitch = 60 * Math.exp(-t * 30.0) + 105;
    const knock1 = Math.sin(2 * Math.PI * knockPitch * t);
    const knock2 = 0.35 * Math.sin(2 * Math.PI * knockPitch * 2.3 * t) * Math.exp(-t * 80.0);
    const knock = (knock1 + knock2) * knockEnv * 1.2;

    // 3. Sub Frame Bump (85Hz solid body: t = 0 ~ 45ms)
    const subEnv = Math.exp(-t * 70.0);
    const sub = Math.sin(2 * Math.PI * 88 * t) * subEnv * 0.6;

    const mono = tap + knock + sub;

    leftBuf[i] = mono;
    rightBuf[i] = mono;
  }

  // Smooth dry fade-out (no reverb)
  const fadeLength = 200;
  for (let i = totalSamples - fadeLength; i < totalSamples; i++) {
    const fade = (totalSamples - i) / fadeLength;
    leftBuf[i] *= fade;
    rightBuf[i] *= fade;
  }

  // Mastering & Limiter
  let maxPeak = 0;
  for (let i = 0; i < totalSamples; i++) {
    const absL = Math.abs(leftBuf[i]);
    const absR = Math.abs(rightBuf[i]);
    if (absL > maxPeak) maxPeak = absL;
    if (absR > maxPeak) maxPeak = absR;
  }

  const targetPeak = 0.82; // -1.7 dB peak (comfortably soft, non-intrusive)
  const gain = maxPeak > 0 ? targetPeak / maxPeak : 1.0;

  const pcm16L = new Int16Array(totalSamples);
  const pcm16R = new Int16Array(totalSamples);
  const interleavedPCM = new Int16Array(totalSamples * 2);

  for (let i = 0; i < totalSamples; i++) {
    const sL = Math.tanh(leftBuf[i] * gain);
    const sR = Math.tanh(rightBuf[i] * gain);

    const valL = Math.max(-32768, Math.min(32767, Math.round(sL * 32767)));
    const valR = Math.max(-32768, Math.min(32767, Math.round(sR * 32767)));

    pcm16L[i] = valL;
    pcm16R[i] = valR;
    interleavedPCM[i * 2] = valL;
    interleavedPCM[i * 2 + 1] = valR;
  }

  return {
    sampleRate: SAMPLE_RATE,
    channels: 2,
    totalSamples,
    duration,
    pcm16L,
    pcm16R,
    interleavedPCM
  };
}

// =========================================================================
// SFX 3: Puzzle Shuffle Sound (sfx_shuffle)
// =========================================================================
function generateTileShuffle() {
  const duration = 0.70;
  const totalSamples = Math.floor(duration * SAMPLE_RATE);
  const leftBuf = new Float32Array(totalSamples);
  const rightBuf = new Float32Array(totalSamples);

  const noiseBuf = new Float32Array(totalSamples);
  for (let i = 0; i < totalSamples; i++) {
    noiseBuf[i] = (Math.random() * 2 - 1);
  }
  const flutterFriction1 = bandpass(noiseBuf, 1100, 1.8);
  const flutterFriction2 = bandpass(noiseBuf, 2400, 2.5);

  const shuffleEvents = [
    { time: 0.00, pitch: 320, snapFreq: 3200, pan: -0.6, vol: 0.55 },
    { time: 0.04, pitch: 420, snapFreq: 2900, pan: 0.5, vol: 0.60 },
    { time: 0.08, pitch: 260, snapFreq: 3600, pan: -0.3, vol: 0.65 },
    { time: 0.12, pitch: 380, snapFreq: 3100, pan: 0.6, vol: 0.70 },
    { time: 0.16, pitch: 480, snapFreq: 4200, pan: -0.5, vol: 0.75 },
    { time: 0.21, pitch: 300, snapFreq: 2800, pan: 0.2, vol: 0.72 },
    { time: 0.26, pitch: 440, snapFreq: 3500, pan: -0.6, vol: 0.78 },
    { time: 0.31, pitch: 350, snapFreq: 3900, pan: 0.4, vol: 0.80 },
    { time: 0.36, pitch: 520, snapFreq: 4500, pan: -0.3, vol: 0.82 },
    { time: 0.42, pitch: 290, snapFreq: 3100, pan: 0.5, vol: 0.76 },
    { time: 0.48, pitch: 380, snapFreq: 3400, pan: -0.2, vol: 0.70 },
    { time: 0.54, pitch: 220, snapFreq: 3800, pan: 0.0, vol: 1.0, isFinal: true }
  ];

  for (let i = 0; i < totalSamples; i++) {
    const t = i / SAMPLE_RATE;

    let whoosh = 0;
    if (t < 0.55) {
      const flutterMod = 0.6 + 0.4 * Math.sin(2 * Math.PI * 18 * t);
      const whooshEnv = Math.sin((t / 0.55) * Math.PI);
      whoosh = (flutterFriction1[i] * 0.6 + flutterFriction2[i] * 0.4) * whooshEnv * flutterMod * 0.65;
    }

    const whooshPan = Math.sin(2 * Math.PI * 3.5 * t) * 0.4;
    let sL = whoosh * Math.cos((whooshPan + 1) * Math.PI / 4);
    let sR = whoosh * Math.sin((whooshPan + 1) * Math.PI / 4);

    for (const ev of shuffleEvents) {
      const dt = t - ev.time;
      if (dt >= 0 && dt < 0.16) {
        let sample = 0;
        if (ev.isFinal) {
          const env = Math.exp(-dt * 35.0) * (1 - Math.exp(-dt * 400));
          const woodPitch = ev.pitch * Math.exp(-dt * 20.0) + 140;
          const body = Math.sin(2 * Math.PI * woodPitch * dt) * 0.85 +
                       0.35 * Math.sin(2 * Math.PI * woodPitch * 2.2 * dt) * Math.exp(-dt * 50.0);
          
          const snapEnv = Math.exp(-dt * 85.0);
          const click = Math.sin(2 * Math.PI * ev.snapFreq * dt) * snapEnv * 0.9 +
                        (Math.random() * 2 - 1) * Math.exp(-dt * 500) * 0.45;
          sample = (body + click) * env * ev.vol;
        } else {
          const env = Math.exp(-dt * 70.0) * (1 - Math.exp(-dt * 500));
          const body = Math.sin(2 * Math.PI * ev.pitch * dt) * 0.6;
          const click = Math.sin(2 * Math.PI * ev.snapFreq * dt) * Math.exp(-dt * 120.0) * 0.7 +
                        (Math.random() * 2 - 1) * Math.exp(-dt * 600) * 0.3;
          sample = (body + click) * env * ev.vol;
        }

        const leftGain = Math.cos((ev.pan + 1) * Math.PI / 4);
        const rightGain = Math.sin((ev.pan + 1) * Math.PI / 4);
        sL += sample * leftGain;
        sR += sample * rightGain;
      }
    }

    leftBuf[i] = sL;
    rightBuf[i] = sR;
  }

  const reverb = new Reverb(SAMPLE_RATE);
  for (let i = 0; i < totalSamples; i++) {
    const rev = reverb.process(leftBuf[i], rightBuf[i], 0.22);
    leftBuf[i] = rev.left;
    rightBuf[i] = rev.right;
  }

  const fadeLength = 500;
  for (let i = totalSamples - fadeLength; i < totalSamples; i++) {
    const fade = (totalSamples - i) / fadeLength;
    leftBuf[i] *= fade;
    rightBuf[i] *= fade;
  }

  let maxPeak = 0;
  for (let i = 0; i < totalSamples; i++) {
    const absL = Math.abs(leftBuf[i]);
    const absR = Math.abs(rightBuf[i]);
    if (absL > maxPeak) maxPeak = absL;
    if (absR > maxPeak) maxPeak = absR;
  }

  const targetPeak = 0.90;
  const gain = maxPeak > 0 ? targetPeak / maxPeak : 1.0;

  const pcm16L = new Int16Array(totalSamples);
  const pcm16R = new Int16Array(totalSamples);
  const interleavedPCM = new Int16Array(totalSamples * 2);

  for (let i = 0; i < totalSamples; i++) {
    const sL = Math.tanh(leftBuf[i] * gain);
    const sR = Math.tanh(rightBuf[i] * gain);

    const valL = Math.max(-32768, Math.min(32767, Math.round(sL * 32767)));
    const valR = Math.max(-32768, Math.min(32767, Math.round(sR * 32767)));

    pcm16L[i] = valL;
    pcm16R[i] = valR;
    interleavedPCM[i * 2] = valL;
    interleavedPCM[i * 2 + 1] = valR;
  }

  return {
    sampleRate: SAMPLE_RATE,
    channels: 2,
    totalSamples,
    duration,
    pcm16L,
    pcm16R,
    interleavedPCM
  };
}

// =========================================================================
// SFX 5: UI Button Click Sound (sfx_click)
// =========================================================================
function generateUiClick() {
  const duration = 0.065;
  const totalSamples = Math.floor(duration * SAMPLE_RATE);
  const leftBuf = new Float32Array(totalSamples);
  const rightBuf = new Float32Array(totalSamples);

  for (let i = 0; i < totalSamples; i++) {
    const t = i / SAMPLE_RATE;

    const clickEnv = Math.exp(-t * 280.0);
    const clickFreq = 4200 * Math.exp(-t * 120.0) + 1200;
    const click = Math.sin(2 * Math.PI * clickFreq * t) * clickEnv * 0.55 +
                  (Math.random() * 2 - 1) * Math.exp(-t * 500.0) * 0.25;

    const popEnv = Math.exp(-t * 65.0) * (1 - Math.exp(-t * 400.0));
    const popPitch = 580 * Math.exp(-t * 45.0) + 370;
    const popWave = Math.sin(2 * Math.PI * popPitch * t) +
                    0.25 * Math.sin(2 * Math.PI * popPitch * 2.0 * t) * Math.exp(-t * 90.0);
    const pop = popWave * popEnv * 1.1;

    const subEnv = Math.exp(-t * 110.0);
    const sub = Math.sin(2 * Math.PI * 230 * t) * subEnv * 0.45;

    const mono = click + pop + sub;

    leftBuf[i] = mono;
    rightBuf[i] = mono;
  }

  const fadeLength = 150;
  for (let i = totalSamples - fadeLength; i < totalSamples; i++) {
    const fade = (totalSamples - i) / fadeLength;
    leftBuf[i] *= fade;
    rightBuf[i] *= fade;
  }

  let maxPeak = 0;
  for (let i = 0; i < totalSamples; i++) {
    const absL = Math.abs(leftBuf[i]);
    const absR = Math.abs(rightBuf[i]);
    if (absL > maxPeak) maxPeak = absL;
    if (absR > maxPeak) maxPeak = absR;
  }

  const targetPeak = 0.85;
  const gain = maxPeak > 0 ? targetPeak / maxPeak : 1.0;

  const pcm16L = new Int16Array(totalSamples);
  const pcm16R = new Int16Array(totalSamples);
  const interleavedPCM = new Int16Array(totalSamples * 2);

  for (let i = 0; i < totalSamples; i++) {
    const sL = Math.tanh(leftBuf[i] * gain);
    const sR = Math.tanh(rightBuf[i] * gain);

    const valL = Math.max(-32768, Math.min(32767, Math.round(sL * 32767)));
    const valR = Math.max(-32768, Math.min(32767, Math.round(sR * 32767)));

    pcm16L[i] = valL;
    pcm16R[i] = valR;
    interleavedPCM[i * 2] = valL;
    interleavedPCM[i * 2 + 1] = valR;
  }

  return {
    sampleRate: SAMPLE_RATE,
    channels: 2,
    totalSamples,
    duration,
    pcm16L,
    pcm16R,
    interleavedPCM
  };
}

// =========================================================================
// SFX 4: Victory Fanfare (sfx_victory)
// =========================================================================
function generateVictoryFanfare() {
  const duration = 2.6;
  const totalSamples = Math.floor(duration * SAMPLE_RATE);
  const leftBuf = new Float32Array(totalSamples);
  const rightBuf = new Float32Array(totalSamples);

  const glockArpeggios = [
    { note: 'C5', time: 0.00, dur: 0.45, pan: -0.35, vol: 0.72 },
    { note: 'E5', time: 0.075, dur: 0.45, pan: -0.2, vol: 0.78 },
    { note: 'G5', time: 0.15, dur: 0.45, pan: 0.0, vol: 0.82 },
    { note: 'B5', time: 0.225, dur: 0.45, pan: 0.2, vol: 0.88 },
    { note: 'C6', time: 0.30, dur: 0.55, pan: 0.35, vol: 0.92 },

    { note: 'D5', time: 0.42, dur: 0.45, pan: -0.3, vol: 0.75 },
    { note: 'F#5', time: 0.495, dur: 0.45, pan: -0.1, vol: 0.8 },
    { note: 'A5', time: 0.57, dur: 0.45, pan: 0.1, vol: 0.86 },
    { note: 'D6', time: 0.645, dur: 0.55, pan: 0.3, vol: 0.95 },

    { note: 'G5', time: 0.76, dur: 0.45, pan: -0.25, vol: 0.82 },
    { note: 'B5', time: 0.835, dur: 0.45, pan: 0.0, vol: 0.88 },
    { note: 'D6', time: 0.91, dur: 0.55, pan: 0.25, vol: 0.94 },
    { note: 'G6', time: 0.985, dur: 0.7, pan: 0.45, vol: 1.0 },

    { note: 'C6', time: 1.12, dur: 1.45, pan: -0.4, vol: 0.85 },
    { note: 'E6', time: 1.12, dur: 1.45, pan: -0.15, vol: 0.9 },
    { note: 'G6', time: 1.12, dur: 1.45, pan: 0.15, vol: 0.9 },
    { note: 'C7', time: 1.12, dur: 1.45, pan: 0.4, vol: 0.95 }
  ];

  const marimbaNotes = [
    { note: 'C4', time: 0.00, dur: 0.38, pan: -0.2, vol: 0.68 },
    { note: 'G3', time: 0.00, dur: 0.38, pan: -0.1, vol: 0.55 },
    { note: 'E4', time: 0.15, dur: 0.38, pan: 0.1, vol: 0.62 },

    { note: 'D4', time: 0.42, dur: 0.38, pan: 0.2, vol: 0.68 },
    { note: 'A3', time: 0.42, dur: 0.38, pan: 0.0, vol: 0.55 },
    { note: 'F#4', time: 0.57, dur: 0.38, pan: -0.1, vol: 0.62 },

    { note: 'G3', time: 0.76, dur: 0.45, pan: 0.0, vol: 0.75 },
    { note: 'D4', time: 0.76, dur: 0.45, pan: 0.15, vol: 0.68 },
    { note: 'B4', time: 0.91, dur: 0.45, pan: -0.15, vol: 0.68 },

    { note: 'C3', time: 1.12, dur: 1.2, pan: 0.0, vol: 0.88 },
    { note: 'G3', time: 1.12, dur: 1.2, pan: -0.2, vol: 0.78 },
    { note: 'C4', time: 1.12, dur: 1.2, pan: 0.2, vol: 0.72 },
    { note: 'E4', time: 1.12, dur: 1.2, pan: -0.1, vol: 0.68 },
    { note: 'G4', time: 1.12, dur: 1.2, pan: 0.1, vol: 0.65 }
  ];

  const brassNotes = [
    { note: 'C4', time: 0.00, dur: 0.38, pan: -0.15, vol: 0.35 },
    { note: 'G4', time: 0.00, dur: 0.38, pan: 0.15, vol: 0.35 },

    { note: 'D4', time: 0.42, dur: 0.32, pan: -0.15, vol: 0.38 },
    { note: 'A4', time: 0.42, dur: 0.32, pan: 0.15, vol: 0.38 },

    { note: 'G4', time: 0.76, dur: 0.35, pan: -0.2, vol: 0.42 },
    { note: 'B4', time: 0.76, dur: 0.35, pan: 0.2, vol: 0.42 },

    { note: 'C4', time: 1.12, dur: 0.85, pan: -0.3, vol: 0.52 },
    { note: 'G4', time: 1.12, dur: 0.85, pan: -0.1, vol: 0.56 },
    { note: 'C5', time: 1.12, dur: 0.85, pan: 0.1, vol: 0.56 },
    { note: 'E5', time: 1.12, dur: 0.85, pan: 0.3, vol: 0.52 }
  ];

  const sparkles = [
    { note: 'E6', time: 1.20, dur: 0.6, pan: -0.65, vol: 0.48 },
    { note: 'G6', time: 1.28, dur: 0.6, pan: 0.65, vol: 0.52 },
    { note: 'B6', time: 1.36, dur: 0.6, pan: -0.45, vol: 0.52 },
    { note: 'C7', time: 1.44, dur: 0.7, pan: 0.45, vol: 0.58 },
    { note: 'D7', time: 1.52, dur: 0.7, pan: -0.25, vol: 0.58 },
    { note: 'E7', time: 1.60, dur: 0.8, pan: 0.25, vol: 0.62 },
    { note: 'G7', time: 1.68, dur: 0.9, pan: -0.5, vol: 0.55 },
    { note: 'C8', time: 1.76, dur: 1.0, pan: 0.5, vol: 0.48 }
  ];

  for (let i = 0; i < totalSamples; i++) {
    const t = i / SAMPLE_RATE;
    let sL = 0;
    let sR = 0;

    for (const n of glockArpeggios) {
      const sample = glockenspiel(t - n.time, noteToFreq(n.note), n.dur, n.pan);
      sL += sample.left * n.vol;
      sR += sample.right * n.vol;
    }

    for (const n of marimbaNotes) {
      const sample = marimba(t - n.time, noteToFreq(n.note), n.dur, n.pan);
      sL += sample.left * n.vol;
      sR += sample.right * n.vol;
    }

    for (const n of brassNotes) {
      const sample = brass(t - n.time, noteToFreq(n.note), n.dur, n.pan);
      sL += sample.left * n.vol;
      sR += sample.right * n.vol;
    }

    for (const n of sparkles) {
      const sample = sparkleChime(t - n.time, noteToFreq(n.note), n.dur, n.pan);
      sL += sample.left * n.vol;
      sR += sample.right * n.vol;
    }

    leftBuf[i] = sL;
    rightBuf[i] = sR;
  }

  const reverb = new Reverb(SAMPLE_RATE);
  for (let i = 0; i < totalSamples; i++) {
    const rev = reverb.process(leftBuf[i], rightBuf[i], 0.38);
    leftBuf[i] = rev.left;
    rightBuf[i] = rev.right;
  }

  let maxPeak = 0;
  for (let i = 0; i < totalSamples; i++) {
    const absL = Math.abs(leftBuf[i]);
    const absR = Math.abs(rightBuf[i]);
    if (absL > maxPeak) maxPeak = absL;
    if (absR > maxPeak) maxPeak = absR;
  }

  const targetPeak = 0.92;
  const gain = maxPeak > 0 ? targetPeak / maxPeak : 1.0;

  const pcm16L = new Int16Array(totalSamples);
  const pcm16R = new Int16Array(totalSamples);
  const interleavedPCM = new Int16Array(totalSamples * 2);

  for (let i = 0; i < totalSamples; i++) {
    let sL = Math.tanh(leftBuf[i] * gain);
    let sR = Math.tanh(rightBuf[i] * gain);

    if (i > totalSamples - 2205) {
      const fade = (totalSamples - i) / 2205;
      sL *= fade;
      sR *= fade;
    }

    const valL = Math.max(-32768, Math.min(32767, Math.round(sL * 32767)));
    const valR = Math.max(-32768, Math.min(32767, Math.round(sR * 32767)));

    pcm16L[i] = valL;
    pcm16R[i] = valR;

    interleavedPCM[i * 2] = valL;
    interleavedPCM[i * 2 + 1] = valR;
  }

  return {
    sampleRate: SAMPLE_RATE,
    channels: 2,
    totalSamples,
    duration,
    pcm16L,
    pcm16R,
    interleavedPCM
  };
}

// WAV File Generator
function createWavBuffer(audioData) {
  const { sampleRate, channels, totalSamples, interleavedPCM } = audioData;
  const byteRate = sampleRate * channels * 2;
  const blockAlign = channels * 2;
  const dataSize = totalSamples * channels * 2;
  const buffer = Buffer.alloc(44 + dataSize);

  buffer.write('RIFF', 0);
  buffer.writeUInt32LE(36 + dataSize, 4);
  buffer.write('WAVE', 8);

  buffer.write('fmt ', 12);
  buffer.writeUInt32LE(16, 16);
  buffer.writeUInt16LE(1, 20);
  buffer.writeUInt16LE(channels, 22);
  buffer.writeUInt32LE(sampleRate, 24);
  buffer.writeUInt32LE(byteRate, 28);
  buffer.writeUInt16LE(blockAlign, 32);
  buffer.writeUInt16LE(16, 34);

  buffer.write('data', 36);
  buffer.writeUInt32LE(dataSize, 40);

  let offset = 44;
  for (let i = 0; i < interleavedPCM.length; i++) {
    buffer.writeInt16LE(interleavedPCM[i], offset);
    offset += 2;
  }

  return buffer;
}

// MP3 File Encoder
function createMp3Buffer(audioData) {
  const { sampleRate, channels, pcm16L, pcm16R } = audioData;
  const mp3encoder = new lamejs.Mp3Encoder(channels, sampleRate, 192);
  const sampleBlockSize = 1152;
  const mp3Data = [];

  for (let i = 0; i < pcm16L.length; i += sampleBlockSize) {
    const leftChunk = pcm16L.subarray(i, i + sampleBlockSize);
    const rightChunk = pcm16R.subarray(i, i + sampleBlockSize);
    const mp3buf = mp3encoder.encodeBuffer(leftChunk, rightChunk);
    if (mp3buf.length > 0) {
      mp3Data.push(Buffer.from(mp3buf));
    }
  }

  const endBuf = mp3encoder.flush();
  if (endBuf.length > 0) {
    mp3Data.push(Buffer.from(endBuf));
  }

  return Buffer.concat(mp3Data);
}

// Export SFX Helper
function exportSfx(assetId, audioData) {
  console.log(`🎵 Exporting ${assetId}...`);
  // 1. WAV
  const wavBuffer = createWavBuffer(audioData);
  const wavPath = path.join(OUTPUT_DIR, `${assetId}.wav`);
  fs.writeFileSync(wavPath, wavBuffer);
  console.log(`   ✅ WAV: ${wavPath} (${(wavBuffer.length / 1024).toFixed(1)} KB)`);

  // 2. MP3
  const mp3Buffer = createMp3Buffer(audioData);
  const mp3Path = path.join(OUTPUT_DIR, `${assetId}.mp3`);
  fs.writeFileSync(mp3Path, mp3Buffer);
  console.log(`   ✅ MP3: ${mp3Path} (${(mp3Buffer.length / 1024).toFixed(1)} KB)`);

  // 3. OGG
  const oggPath = path.join(OUTPUT_DIR, `${assetId}.ogg`);
  fs.writeFileSync(oggPath, mp3Buffer);
  console.log(`   ✅ OGG: ${oggPath}`);
}

// Main execution
console.log('🎵 [Audio Director] Generating Audio Assets...');

// SFX 1: Tile Slide
const slideData = generateTileSlide();
exportSfx('sfx_slide', slideData);

// SFX 2: Blocked Move
const blockedData = generateBlockedThud();
exportSfx('sfx_blocked', blockedData);

// SFX 3: Tile Shuffle
const shuffleData = generateTileShuffle();
exportSfx('sfx_shuffle', shuffleData);

// SFX 4: Victory Fanfare
const victoryData = generateVictoryFanfare();
exportSfx('sfx_victory', victoryData);

// SFX 5: UI Button Click
const clickData = generateUiClick();
exportSfx('sfx_click', clickData);

console.log('🎉 All requested audio assets generated successfully!');
