export const playWoodSound = () => {
  try {
    const AudioContext = window.AudioContext || (window as any).webkitAudioContext;
    if (!AudioContext) return;
    const ctx = new AudioContext();
    const t = ctx.currentTime;

    // Main resonance
    const osc1 = ctx.createOscillator();
    const gain1 = ctx.createGain();
    
    osc1.frequency.setValueAtTime(580, t);
    osc1.frequency.exponentialRampToValueAtTime(500, t + 0.1);
    
    gain1.gain.setValueAtTime(0.8, t);
    gain1.gain.exponentialRampToValueAtTime(0.01, t + 0.3);
    
    osc1.connect(gain1);
    gain1.connect(ctx.destination);

    // Harmonic
    const osc2 = ctx.createOscillator();
    const gain2 = ctx.createGain();
    
    osc2.frequency.setValueAtTime(850, t);
    
    gain2.gain.setValueAtTime(0.3, t);
    gain2.gain.exponentialRampToValueAtTime(0.01, t + 0.2);
    
    osc2.connect(gain2);
    gain2.connect(ctx.destination);

    // Impact click
    const osc3 = ctx.createOscillator();
    const gain3 = ctx.createGain();
    
    osc3.type = 'square';
    osc3.frequency.setValueAtTime(200, t);
    osc3.frequency.linearRampToValueAtTime(100, t + 0.02);
    
    gain3.gain.setValueAtTime(0.3, t);
    gain3.gain.exponentialRampToValueAtTime(0.01, t + 0.02);
    
    osc3.connect(gain3);
    gain3.connect(ctx.destination);

    osc1.start(t);
    osc1.stop(t + 0.3);
    osc2.start(t);
    osc2.stop(t + 0.3);
    osc3.start(t);
    osc3.stop(t + 0.3);

  } catch (e) {
    console.error("Audio playback failed", e);
  }
};
