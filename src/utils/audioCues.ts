// Web Audio API Synthesizer for M.A.P.A.™ Organic Audio Cues
// Tibetan bells, soft muted piano chords, and gentle harps

let audioCtx: AudioContext | null = null;

function getAudioContext(): AudioContext | null {
  if (typeof window === "undefined") return null;
  if (!audioCtx) {
    const AudioCtxClass = window.AudioContext || (window as any).webkitAudioContext;
    if (AudioCtxClass) {
      audioCtx = new AudioCtxClass();
    }
  }
  if (audioCtx && audioCtx.state === "suspended") {
    audioCtx.resume();
  }
  return audioCtx;
}

/**
 * Play a gentle muted piano pluck for standard button clicks
 */
export function playClickCue() {
  try {
    const ctx = getAudioContext();
    if (!ctx) return;

    const now = ctx.currentTime;
    
    // Low frequency body (70Hz sine) for warmth
    const subOsc = ctx.createOscillator();
    subOsc.type = "sine";
    subOsc.frequency.setValueAtTime(120, now);
    
    // Primary harmonic pluck (F#4 - 369.99 Hz)
    const pluckOsc = ctx.createOscillator();
    pluckOsc.type = "triangle";
    pluckOsc.frequency.setValueAtTime(369.99, now);

    const gainNode = ctx.createGain();
    const filterNode = ctx.createBiquadFilter();

    filterNode.type = "lowpass";
    filterNode.frequency.setValueAtTime(450, now);
    filterNode.frequency.exponentialRampToValueAtTime(150, now + 0.15);

    gainNode.gain.setValueAtTime(0, now);
    gainNode.gain.linearRampToValueAtTime(0.04, now + 0.01);
    gainNode.gain.exponentialRampToValueAtTime(0.0001, now + 0.18);

    subOsc.connect(filterNode);
    pluckOsc.connect(filterNode);
    filterNode.connect(gainNode);
    gainNode.connect(ctx.destination);

    subOsc.start(now);
    pluckOsc.start(now);
    subOsc.stop(now + 0.2);
    pluckOsc.stop(now + 0.2);
  } catch (err) {
    console.warn("Could not play click audio cue:", err);
  }
}

/**
 * Play a deep, resonant Tibetan Bell chime for alerts and notifications
 */
export function playAlertCue() {
  try {
    const ctx = getAudioContext();
    if (!ctx) return;

    const now = ctx.currentTime;
    
    // Tibetan bells are rich in overtones (not integer multiples, slightly inharmonic)
    // Fundamental frequency (Db5 - 554.37 Hz)
    const frequencies = [
      554.37,          // Fundamental
      554.37 * 1.48,   // Ring overtone 1
      554.37 * 2.12,   // Ring overtone 2
      554.37 * 2.95,   // Shimmer overtone 3
    ];

    const masterGain = ctx.createGain();
    masterGain.gain.setValueAtTime(0, now);
    masterGain.gain.linearRampToValueAtTime(0.08, now + 0.02);
    masterGain.gain.exponentialRampToValueAtTime(0.0001, now + 2.5); // long ring decay

    // Bandpass filter to isolate the sweet ringing spot of the bell
    const filter = ctx.createBiquadFilter();
    filter.type = "bandpass";
    filter.frequency.setValueAtTime(1200, now);
    filter.Q.setValueAtTime(1.0, now);

    frequencies.forEach((freq, idx) => {
      const osc = ctx.createOscillator();
      const oscGain = ctx.createGain();

      // Slightly alter wave types for richer harmonic blend
      osc.type = idx === 0 ? "sine" : "triangle";
      osc.frequency.setValueAtTime(freq, now);

      // Higher frequencies decay faster in metal
      const decayTime = 2.5 / (1 + idx * 0.4);
      oscGain.gain.setValueAtTime(idx === 0 ? 0.6 : 0.4 / idx, now);
      oscGain.gain.exponentialRampToValueAtTime(0.0001, now + decayTime);

      osc.connect(oscGain);
      oscGain.connect(filter);
      
      osc.start(now);
      osc.stop(now + decayTime + 0.1);
    });

    // LFO (Low Frequency Oscillator) to add a gentle rolling vibrato/tremolo to the tail
    const lfo = ctx.createOscillator();
    lfo.frequency.setValueAtTime(4.5, now); // 4.5 Hz tremolo
    const lfoGain = ctx.createGain();
    lfoGain.gain.setValueAtTime(0.15, now);
    
    lfo.connect(lfoGain);
    lfoGain.connect(masterGain.gain);
    lfo.start(now);
    lfo.stop(now + 2.5);

    filter.connect(masterGain);
    masterGain.connect(ctx.destination);
  } catch (err) {
    console.warn("Could not play alert audio cue:", err);
  }
}

/**
 * Play a beautiful ascending arpeggio chord of Tibetan bells/piano (F# Major 9)
 * for success and completed challenges, providing deep emotional release
 */
export function playSuccessCue() {
  try {
    const ctx = getAudioContext();
    if (!ctx) return;

    const now = ctx.currentTime;
    
    // F# Major 9: F#4 (369.99 Hz), A#4 (466.16 Hz), C#5 (554.37 Hz), F#5 (739.99 Hz), G#5 (830.61 Hz)
    const notes = [369.99, 466.16, 554.37, 739.99, 830.61];

    const masterGain = ctx.createGain();
    masterGain.gain.setValueAtTime(0, now);
    masterGain.gain.linearRampToValueAtTime(0.06, now + 0.05);
    masterGain.gain.exponentialRampToValueAtTime(0.0001, now + 3.0); // very soft long release

    // Lowpass filter for smooth organic warmth
    const filter = ctx.createBiquadFilter();
    filter.type = "lowpass";
    filter.frequency.setValueAtTime(900, now);
    filter.frequency.exponentialRampToValueAtTime(300, now + 2.0);

    notes.forEach((freq, idx) => {
      // Stagger notes to build a beautiful ascending harp-like ripple
      const noteDelay = idx * 0.15;
      const noteStart = now + noteDelay;

      const osc = ctx.createOscillator();
      const oscGain = ctx.createGain();

      osc.type = "sine";
      osc.frequency.setValueAtTime(freq, noteStart);

      // Gentle vibrato on each note
      const vibrato = ctx.createOscillator();
      vibrato.frequency.setValueAtTime(5 + idx, noteStart);
      const vibratoGain = ctx.createGain();
      vibratoGain.gain.setValueAtTime(2.5, noteStart);
      
      vibrato.connect(vibratoGain);
      vibratoGain.connect(osc.frequency);

      oscGain.gain.setValueAtTime(0, noteStart);
      oscGain.gain.linearRampToValueAtTime(0.5, noteStart + 0.02);
      oscGain.gain.exponentialRampToValueAtTime(0.0001, noteStart + 1.8);

      osc.connect(oscGain);
      oscGain.connect(filter);

      vibrato.start(noteStart);
      osc.start(noteStart);

      vibrato.stop(noteStart + 2.0);
      osc.stop(noteStart + 2.0);
    });

    filter.connect(masterGain);
    masterGain.connect(ctx.destination);
  } catch (err) {
    console.warn("Could not play success audio cue:", err);
  }
}
