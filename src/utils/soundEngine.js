// Native Web Audio API Sound Synthesizer
// Zero external MP3 downloads - instantaneous, offline, and lightweight.

class SoundEngine {
  constructor() {
    this.audioCtx = null;
    this.enabled = false;
    
    // Check initial preference from localStorage
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('portfolio_sound_enabled');
      this.enabled = saved === 'true';
    }
  }

  init() {
    if (!this.audioCtx && typeof window !== 'undefined') {
      const AudioContextClass = window.AudioContext || window.webkitAudioContext;
      if (AudioContextClass) {
        this.audioCtx = new AudioContextClass();
      }
    }
    if (this.audioCtx && this.audioCtx.state === 'suspended') {
      this.audioCtx.resume();
    }
  }

  setEnabled(val) {
    this.enabled = val;
    if (typeof window !== 'undefined') {
      localStorage.setItem('portfolio_sound_enabled', val ? 'true' : 'false');
    }
    if (val) {
      this.init();
      this.playSuccess();
    }
  }

  toggle() {
    this.setEnabled(!this.enabled);
    return this.enabled;
  }

  isEnabled() {
    return this.enabled;
  }

  // Soft mechanical click for buttons and links
  playClick() {
    if (!this.enabled) return;
    this.init();
    if (!this.audioCtx) return;

    try {
      const osc = this.audioCtx.createOscillator();
      const gain = this.audioCtx.createGain();
      
      osc.type = 'sine';
      osc.frequency.setValueAtTime(800, this.audioCtx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(300, this.audioCtx.currentTime + 0.025);

      gain.gain.setValueAtTime(0.06, this.audioCtx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, this.audioCtx.currentTime + 0.025);

      osc.connect(gain);
      gain.connect(this.audioCtx.destination);

      osc.start();
      osc.stop(this.audioCtx.currentTime + 0.026);
    } catch {
      // AudioContext policy suppression fallback
    }
  }

  // Smooth futuristic blip for tab navigation & filters
  playTabSwitch() {
    if (!this.enabled) return;
    this.init();
    if (!this.audioCtx) return;

    try {
      const now = this.audioCtx.currentTime;
      const osc = this.audioCtx.createOscillator();
      const gain = this.audioCtx.createGain();

      osc.type = 'triangle';
      osc.frequency.setValueAtTime(540, now);
      osc.frequency.exponentialRampToValueAtTime(1080, now + 0.04);

      gain.gain.setValueAtTime(0.04, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.045);

      osc.connect(gain);
      gain.connect(this.audioCtx.destination);

      osc.start();
      osc.stop(now + 0.05);
    } catch {
      // Ignore audio suppression
    }
  }

  // Subtle airy sweep when opening ⌘K console or modals
  playModalOpen() {
    if (!this.enabled) return;
    this.init();
    if (!this.audioCtx) return;

    try {
      const now = this.audioCtx.currentTime;
      const osc = this.audioCtx.createOscillator();
      const gain = this.audioCtx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(220, now);
      osc.frequency.exponentialRampToValueAtTime(660, now + 0.09);

      gain.gain.setValueAtTime(0.04, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.095);

      osc.connect(gain);
      gain.connect(this.audioCtx.destination);

      osc.start();
      osc.stop(now + 0.1);
    } catch {
      // Ignore
    }
  }

  // High-tech two-tone chime for success / copied / victory
  playSuccess() {
    if (!this.enabled) return;
    this.init();
    if (!this.audioCtx) return;

    try {
      const now = this.audioCtx.currentTime;
      
      [
        { freq: 587.33, start: now, duration: 0.07 },      // D5
        { freq: 880.00, start: now + 0.07, duration: 0.12 } // A5
      ].forEach(({ freq, start, duration }) => {
        const osc = this.audioCtx.createOscillator();
        const gain = this.audioCtx.createGain();

        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, start);

        gain.gain.setValueAtTime(0.05, start);
        gain.gain.exponentialRampToValueAtTime(0.001, start + duration);

        osc.connect(gain);
        gain.connect(this.audioCtx.destination);

        osc.start(start);
        osc.stop(start + duration + 0.01);
      });
    } catch {
      // Ignore
    }
  }

  // Deep resonant warp sweep for hyperspace Easter egg
  playWarp() {
    if (!this.enabled) return;
    this.init();
    if (!this.audioCtx) return;

    try {
      const now = this.audioCtx.currentTime;
      const osc = this.audioCtx.createOscillator();
      const gain = this.audioCtx.createGain();

      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(110, now);
      osc.frequency.exponentialRampToValueAtTime(1760, now + 0.35);

      gain.gain.setValueAtTime(0.07, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.38);

      osc.connect(gain);
      gain.connect(this.audioCtx.destination);

      osc.start(now);
      osc.stop(now + 0.4);
    } catch {
      // Ignore
    }
  }
}

export const soundEngine = new SoundEngine();
