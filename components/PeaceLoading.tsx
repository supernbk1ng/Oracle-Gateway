
import React, { useState } from 'react';

interface Props {
  onComplete: () => void;
}

interface Ripple {
  id: number;
}

export const PeaceLoading: React.FC<Props> = ({ onComplete }) => {
  const [tapCount, setTapCount] = useState(0);
  const [ripples, setRipples] = useState<Ripple[]>([]);
  const [isAnimate, setIsAnimate] = useState(false);
  const targetTaps = 6;
  const progress = Math.round((tapCount / targetTaps) * 100);

  const handleTap = () => {
    if (tapCount >= targetTaps) return;

    setIsAnimate(true);
    setTimeout(() => setIsAnimate(false), 100);

    // Create floating text effect
    const id = Date.now();
    setRipples(prev => [...prev, { id }]);
    setTimeout(() => {
      setRipples(prev => prev.filter(r => r.id !== id));
    }, 1000);

    setTapCount(prev => prev + 1);

    // Subtle vibration
    if ('vibrate' in navigator) {
      navigator.vibrate(50);
    }
  };

  return (
    <div className="flex flex-col items-center gap-12 select-none w-full">
      {/* Top Badge */}
      <div className="bg-cyan-900/20 border border-cyan-500/30 px-6 py-2 rounded-full backdrop-blur-sm transition-all duration-500 shadow-[0_0_20px_rgba(34,211,238,0.1)]">
        <div className="flex items-center gap-2 text-cyan-400 text-sm tracking-widest font-mystic">
          <span className="text-lg">✨</span>
          宁静指数: {progress}%
        </div>
      </div>

      {/* Central Interactive Muyu Area */}
      <div className="relative flex items-center justify-center w-[320px] h-[320px]">
        {/* Glow background */}
        <div className={`absolute inset-0 bg-cyan-500/5 blur-[80px] rounded-full transition-all duration-1000 ${tapCount > 0 ? 'opacity-40 scale-110' : 'opacity-10 scale-90'}`} />
        
        {/* Floating feedback texts */}
        {ripples.map(ripple => (
          <div 
            key={ripple.id}
            className="absolute left-1/2 -top-10 -translate-x-1/2 text-cyan-400 font-mystic text-2xl font-bold pointer-events-none animate-bounce z-30"
            style={{ animationDuration: '0.8s' }}
          >
            功德 +1
          </div>
        ))}

        {/* Progress ring SVG - Explicitly sized and viewBoxed for perfect alignment */}
        <svg 
          viewBox="0 0 320 320" 
          className="absolute inset-0 w-full h-full -rotate-90 pointer-events-none z-10"
        >
          {/* Track */}
          <circle
            cx="160"
            cy="160"
            r="150"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            className="text-white/5"
          />
          {/* Progress */}
          <circle
            cx="160"
            cy="160"
            r="150"
            fill="none"
            stroke="currentColor"
            strokeWidth="6"
            strokeDasharray={150 * 2 * Math.PI}
            strokeDashoffset={150 * 2 * Math.PI * (1 - tapCount / targetTaps)}
            className="text-cyan-500/50 transition-all duration-500 ease-out"
            strokeLinecap="round"
          />
        </svg>

        {/* The Muyu (Wood Fish) Button */}
        <button 
          onClick={handleTap}
          className={`relative w-64 h-64 rounded-[60px] border flex items-center justify-center bg-cyan-950/20 backdrop-blur-md transition-all duration-75 z-20 shadow-[0_20px_50px_rgba(0,0,0,0.5)] 
            ${isAnimate ? 'scale-90 brightness-125' : 'scale-100'} 
            ${tapCount < targetTaps ? 'cursor-pointer hover:border-cyan-400/40 border-cyan-500/30' : 'cursor-default border-emerald-500/40 bg-emerald-950/10'}`}
        >
          {/* Inner Shape Decor */}
          <div className={`absolute inset-6 rounded-[45px] border transition-colors duration-1000 ${tapCount >= targetTaps ? 'border-emerald-400/10' : 'border-cyan-400/5'}`} />
          
          <div className="relative flex items-center justify-center">
            {/* Iconic Wood Fish (Muyu) SVG */}
            <svg 
              className={`w-36 h-36 transition-all duration-500 ${tapCount >= targetTaps ? 'text-emerald-400 drop-shadow-[0_0_20px_rgba(52,211,153,0.4)]' : 'text-cyan-400 drop-shadow-[0_0_20px_rgba(34,211,238,0.3)]'}`} 
              viewBox="0 0 24 24" 
              fill="currentColor"
            >
              {/* Outer Shell */}
              <path d="M12,2A10,10 0 0,0 2,12A10,10 0 0,0 12,22A10,10 0 0,0 22,12A10,10 0 0,0 12,2M12,4A8,8 0 0,1 20,12A8,8 0 0,1 12,20A8,8 0 0,1 4,12A8,8 0 0,1 12,4Z" opacity="0.1" />
              
              {/* Traditional Muyu Block Shape */}
              <path d="M12,3C7.03,3 3,7.03 3,12C3,16.97 7.03,21 12,21C16.97,21 21,16.97 21,12C21,7.03 16.97,3 12,3M12,19C8.13,19 5,15.87 5,12C5,8.13 8.13,5 12,5C15.87,5 19,8.13 19,12C19,15.87 15.87,19 12,19Z" />
              
              {/* The "Eye" of the Wood Fish */}
              <circle cx="17" cy="12" r="1.5" />
              
              {/* The Resonating Slit */}
              <path d="M7,12C7,12 8,15 12,15C16,15 17,12 17,12" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
              
              {/* Center Focus */}
              <circle cx="12" cy="12" r="3" fill="currentColor" className={tapCount < targetTaps ? "animate-pulse" : ""} />

              {/* Success Checkmark */}
              {tapCount >= targetTaps && (
                <path 
                  className="animate-in fade-in zoom-in duration-500 text-emerald-300" 
                  d="M9,12 L11,14 L15,10" 
                  fill="none" 
                  stroke="currentColor" 
                  strokeWidth="2" 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                />
              )}
            </svg>
          </div>
        </button>
      </div>

      <div className="text-center space-y-4">
        <h2 className={`font-mystic tracking-[0.2em] text-lg uppercase transition-all duration-700 min-h-[1.75rem] ${tapCount >= targetTaps ? 'text-emerald-400/90' : 'text-cyan-200/80'}`}>
          {tapCount === 0 ? '心诚则灵，敲击木鱼' : tapCount < targetTaps ? `涤荡心灵，还剩 ${targetTaps - tapCount} 次` : '灵台清明，万缘放下'}
        </h2>
        
        <div className="h-24 flex items-center justify-center">
          <button 
            onClick={onComplete}
            disabled={tapCount < targetTaps}
            className={`px-14 py-4 rounded-full border-2 font-mystic transition-all duration-700 ${
              tapCount >= targetTaps 
                ? 'bg-emerald-500/10 border-emerald-400/50 text-emerald-400 hover:bg-emerald-500/20 cursor-pointer shadow-[0_0_40px_rgba(52,211,153,0.3)] scale-100 opacity-100' 
                : 'bg-transparent border-white/5 text-white/5 cursor-not-allowed scale-90 opacity-0'
            }`}
          >
            进入观测之门
          </button>
        </div>
      </div>

      {/* Footer Branding */}
      <div className="text-[10px] text-slate-700 font-mystic uppercase tracking-[0.4em] opacity-40 mt-4">
        ZEN ELECTRONIC · PROTOCOL 2.0
      </div>
    </div>
  );
};
