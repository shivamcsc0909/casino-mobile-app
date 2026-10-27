/**
 * Web Audio API Zero-Asset Sound Synthesizer
 * Generates crisp, realistic casino audio cues directly in browser memory without external mp3 files.
 */

class SoundEngine {
  private ctx: AudioContext | null = null;
  private isMuted: boolean = false;
  private volume: number = 0.6;
  private audioCache: Map<string, HTMLAudioElement> = new Map();

  constructor() {
    if (typeof window !== 'undefined') {
      const soundFiles = [
        ['win', '/sounds/win.mp3'],
        ['lose', '/sounds/lose.mp3'],
        ['place', '/sounds/chip_place.mp3'],
        ['pickup', '/sounds/chip_pickup.mp3'],
        ['tick', '/sounds/tick.mp3'],
      ];
      soundFiles.forEach(([key, src]) => {
        try {
          const audio = new Audio(src);
          audio.preload = 'auto';
          this.audioCache.set(key, audio);
        } catch {
          // ignore audio preload error
        }
      });
    }
  }

  private playSoundFile(key: string, volMultiplier: number = 1): boolean {
    if (this.isMuted) return false;
    try {
      const audio = this.audioCache.get(key);
      if (audio) {
        audio.currentTime = 0;
        audio.volume = Math.max(0, Math.min(1, this.volume * volMultiplier));
        audio.play().catch(() => {});
        return true;
      }
    } catch {
      // Fallback
    }
    return false;
  }

  private getContext(): AudioContext | null {
    if (typeof window === 'undefined') return null;
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (AudioCtx) {
        this.ctx = new AudioCtx();
      }
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume().catch(() => {});
    }
    return this.ctx;
  }

  public setMuted(muted: boolean) {
    this.isMuted = muted;
  }

  public setVolume(vol: number) {
    this.volume = Math.max(0, Math.min(1, vol));
  }

  public getMuted() {
    return this.isMuted;
  }

  // Tactile button tap
  public playButtonTap() {
    if (this.isMuted) return;
    const ctx = this.getContext();
    if (!ctx) return;

    try {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      const now = ctx.currentTime;

      osc.type = 'sine';
      osc.frequency.setValueAtTime(400, now);
      osc.frequency.exponentialRampToValueAtTime(150, now + 0.04);

      gain.gain.setValueAtTime(0.12 * this.volume, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.04);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(now);
      osc.stop(now + 0.05);
    } catch {
      // Audio playback silently failed
    }
  }

  // Realistic clay chip clinking sound
  public playChipSound() {
    if (this.isMuted) return;
    this.playSoundFile(Math.random() > 0.5 ? 'place' : 'pickup', 0.85);

    const ctx = this.getContext();
    if (!ctx) return;

    try {
      const now = ctx.currentTime;
      // High ping
      const osc1 = ctx.createOscillator();
      const gain1 = ctx.createGain();
      osc1.type = 'triangle';
      osc1.frequency.setValueAtTime(2400 + Math.random() * 300, now);
      osc1.frequency.exponentialRampToValueAtTime(800, now + 0.06);

      gain1.gain.setValueAtTime(0.25 * this.volume, now);
      gain1.gain.exponentialRampToValueAtTime(0.001, now + 0.06);

      osc1.connect(gain1);
      gain1.connect(ctx.destination);
      osc1.start(now);
      osc1.stop(now + 0.07);

      // Clack body
      const osc2 = ctx.createOscillator();
      const gain2 = ctx.createGain();
      osc2.type = 'sine';
      osc2.frequency.setValueAtTime(1100, now);
      osc2.frequency.exponentialRampToValueAtTime(300, now + 0.04);

      gain2.gain.setValueAtTime(0.2 * this.volume, now);
      gain2.gain.exponentialRampToValueAtTime(0.001, now + 0.04);

      osc2.connect(gain2);
      gain2.connect(ctx.destination);
      osc2.start(now);
      osc2.stop(now + 0.05);
    } catch {
      // Ignore audio error
    }
  }

  // Card slide / deal sound
  public playCardFlip() {
    if (this.isMuted) return;
    const ctx = this.getContext();
    if (!ctx) return;

    try {
      const bufferSize = ctx.sampleRate * 0.08;
      const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
      const data = buffer.getChannelData(0);
      for (let i = 0; i < bufferSize; i++) {
        data[i] = Math.random() * 2 - 1;
      }

      const noise = ctx.createBufferSource();
      noise.buffer = buffer;

      const filter = ctx.createBiquadFilter();
      filter.type = 'bandpass';
      filter.frequency.value = 1800;
      filter.Q.value = 1.8;

      const gain = ctx.createGain();
      const now = ctx.currentTime;
      gain.gain.setValueAtTime(0.2 * this.volume, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.08);

      noise.connect(filter);
      filter.connect(gain);
      gain.connect(ctx.destination);

      noise.start(now);
    } catch {
      // Ignore
    }
  }

  // Roulette fret tick
  public playWheelTick() {
    if (this.isMuted) return;
    this.playSoundFile('tick', 0.5);
    const ctx = this.getContext();
    if (!ctx) return;

    try {
      const now = ctx.currentTime;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'square';
      osc.frequency.setValueAtTime(950 + Math.random() * 100, now);
      osc.frequency.exponentialRampToValueAtTime(300, now + 0.02);

      gain.gain.setValueAtTime(0.12 * this.volume, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.02);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(now);
      osc.stop(now + 0.025);
    } catch {
      // Ignore
    }
  }

  // Slot reel tick
  public playReelTick() {
    if (this.isMuted) return;
    this.playSoundFile('tick', 0.6);
    const ctx = this.getContext();
    if (!ctx) return;

    try {
      const now = ctx.currentTime;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'triangle';
      osc.frequency.setValueAtTime(520, now);
      osc.frequency.exponentialRampToValueAtTime(120, now + 0.035);

      gain.gain.setValueAtTime(0.15 * this.volume, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.035);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(now);
      osc.stop(now + 0.04);
    } catch {
      // Ignore
    }
  }

  // Cash out bell sound
  public playCashOut() {
    if (this.isMuted) return;
    this.playSoundFile('win', 0.7);
    const ctx = this.getContext();
    if (!ctx) return;

    try {
      const notes = [1046.5, 1318.5]; // C6 & E6
      const now = ctx.currentTime;

      notes.forEach((freq, idx) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'sine';
        osc.frequency.value = freq;

        const startTime = now + idx * 0.06;
        gain.gain.setValueAtTime(0.28 * this.volume, startTime);
        gain.gain.exponentialRampToValueAtTime(0.001, startTime + 0.6);

        osc.connect(gain);
        gain.connect(ctx.destination);

        osc.start(startTime);
        osc.stop(startTime + 0.65);
      });
    } catch {
      // Ignore
    }
  }

  // Win Chime (Celebratory Chords)
  public playWinChime() {
    if (this.isMuted) return;
    this.playSoundFile('win', 0.9);
    const ctx = this.getContext();
    if (!ctx) return;

    try {
      const chord = [523.25, 659.25, 783.99, 1046.5]; // C5, E5, G5, C6
      const now = ctx.currentTime;

      chord.forEach((freq, idx) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();

        osc.type = 'triangle';
        osc.frequency.value = freq;

        const startTime = now + idx * 0.08;
        gain.gain.setValueAtTime(0.22 * this.volume, startTime);
        gain.gain.exponentialRampToValueAtTime(0.001, startTime + 0.5);

        osc.connect(gain);
        gain.connect(ctx.destination);

        osc.start(startTime);
        osc.stop(startTime + 0.55);
      });
    } catch {
      // Ignore
    }
  }

  // Crash rocket explosion / bust
  public playCrashSound() {
    if (this.isMuted) return;
    this.playSoundFile('lose', 0.8);
    const ctx = this.getContext();
    if (!ctx) return;

    try {
      const now = ctx.currentTime;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(280, now);
      osc.frequency.exponentialRampToValueAtTime(40, now + 0.4);

      gain.gain.setValueAtTime(0.3 * this.volume, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.45);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(now);
      osc.stop(now + 0.5);
    } catch {
      // Ignore
    }
  }

  // Big Jackpot fanfare
  public playJackpotFanfare() {
    if (this.isMuted) return;
    const ctx = this.getContext();
    if (!ctx) return;

    try {
      const notes = [523.25, 659.25, 783.99, 1046.5, 1318.51, 1567.98];
      const now = ctx.currentTime;

      notes.forEach((freq, i) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();

        osc.type = i % 2 === 0 ? 'triangle' : 'sine';
        osc.frequency.value = freq;

        const start = now + i * 0.09;
        gain.gain.setValueAtTime(0.25 * this.volume, start);
        gain.gain.exponentialRampToValueAtTime(0.001, start + 0.8);

        osc.connect(gain);
        gain.connect(ctx.destination);

        osc.start(start);
        osc.stop(start + 0.85);
      });
    } catch {
      // Ignore
    }
  }
}

export const soundManager = new SoundEngine();
