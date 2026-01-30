
import React, { useState } from 'react';
import { playWoodSound } from '../utils/sound';

interface Props {
  onComplete: (hexagram: string) => void;
  onBack: () => void;
}

export const TaoistCasting: React.FC<Props> = ({ onComplete, onBack }) => {
  const [lines, setLines] = useState<number[]>([]); // 0 for Yin (broken), 1 for Yang (solid)
  const [isCasting, setIsCasting] = useState(false);
  const [meritPopups, setMeritPopups] = useState<{id: number, x: number, y: number}[]>([]);

  const castLine = () => {
    if (lines.length >= 6 || isCasting) return;
    setIsCasting(true);
    playWoodSound();
    
    // Initial haptic feedback for button press
    if (navigator.vibrate) navigator.vibrate(20);
    
    // Simulate coin spinning
    setTimeout(() => {
      const newLine = Math.random() > 0.5 ? 1 : 0;
      setLines([newLine, ...lines]); // I-Ching is built from bottom to top
      setIsCasting(false);

      // Haptic Feedback based on result (Tactile Password)
      if (navigator.vibrate) {
        if (newLine === 1) {
          // Yang (Solid): Long vibration
          navigator.vibrate(200);
        } else {
          // Yin (Broken): Two short vibrations
          navigator.vibrate([50, 50, 50]);
        }
      }
    }, 600);
  };

  const finalize = () => {
    onComplete(`已成卦: ${lines.map(l => l === 1 ? '阳' : '阴').join('')}`);
  };

  return (
    <div className="flex flex-col items-center gap-12 w-full max-w-4xl animate-in fade-in duration-700">
      <button 
        onClick={onBack}
        className="absolute top-0 left-0 flex items-center gap-2 text-slate-500 hover:text-emerald-400 transition-colors font-mystic text-sm px-4 py-2"
      >
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
        </svg>
        返回修改问题
      </button>

      <div className="text-center space-y-2">
        <h2 className="text-3xl font-mystic text-emerald-400">虔心起卦</h2>
        <p className="text-emerald-600/60 tracking-widest text-sm uppercase">敲击木鱼，积攒功德，连续起卦六次</p>
      </div>

      <div className="flex flex-col md:flex-row items-center gap-16 relative">
        {/* Merit Popups */}
        {meritPopups.map(popup => (
          <div 
            key={popup.id}
            className="fixed pointer-events-none text-emerald-400 font-bold text-xl animate-float-up z-50"
            style={{ left: popup.x, top: popup.y }}
          >
            功德 +1
          </div>
        ))}

        {/* The Wooden Fish */}
        <div className="relative">
          <button 
            onClick={castLine}
            disabled={lines.length >= 6 || isCasting}
            className={`w-64 h-64 flex items-center justify-center transition-all group relative
              ${lines.length < 6 && !isCasting ? 'cursor-pointer hover:scale-105' : 'cursor-default opacity-80'}
            `}
          >
            {/* Wooden Fish SVG */}
            <svg 
              viewBox="0 0 200 200" 
              className={`w-full h-full drop-shadow-[0_10px_20px_rgba(0,0,0,0.5)] transition-transform duration-100 ${isCasting ? 'scale-95' : ''}`}
            >
              <g transform="translate(100, 100)">
                 {/* Body */}
                 <path 
                   d="M-70,20 C-80,60 -20,80 20,80 C70,80 90,40 85,0 C80,-50 40,-70 -10,-70 C-50,-70 -70,-30 -70,20 Z" 
                   fill="#8B4513" 
                   stroke="#5D2906" 
                   strokeWidth="3"
                 />
                 {/* Highlight/Texture */}
                 <path 
                   d="M-50,-40 C-20,-60 40,-50 60,-10" 
                   fill="none" 
                   stroke="#A0522D" 
                   strokeWidth="2" 
                   opacity="0.5"
                 />
                 {/* Opening/Mouth (The slit) */}
                 <path 
                   d="M-60,30 Q-20,40 40,30 Q60,30 70,20" 
                   fill="none" 
                   stroke="#3E1C05" 
                   strokeWidth="6" 
                   strokeLinecap="round"
                 />
                 <path 
                   d="M-60,30 Q-20,40 40,30 Q60,30 70,20" 
                   fill="none" 
                   stroke="#1a0b02" 
                   strokeWidth="2" 
                   strokeLinecap="round"
                 />
                 {/* Stick (Hammer) - Only visible when casting/hitting - Simplified as animation or static icon */}
              </g>
              {/* Stick hitting animation hint */}
              <g className={`transition-opacity duration-100 ${isCasting ? 'opacity-100' : 'opacity-0'}`}>
                 <circle cx="120" cy="50" r="15" fill="#D2691E" />
                 <path d="M120,50 L180,-20" stroke="#8B4513" strokeWidth="8" strokeLinecap="round" />
              </g>
            </svg>
            
            {/* Glow effect */}
            <div className={`absolute inset-0 bg-emerald-500/20 blur-3xl rounded-full transition-opacity duration-300 -z-10 ${isCasting ? 'opacity-60' : 'opacity-0'}`} />
          </button>
        </div>

        {/* The Hexagram Display */}
        <div className="flex flex-col gap-3 items-center min-w-[200px]">
          <div className="space-y-3 bg-white/5 p-8 rounded-3xl border border-white/5 backdrop-blur-sm min-h-[300px] flex flex-col justify-end">
            {Array.from({ length: 6 }).map((_, i) => {
              const lineIndex = 5 - i;
              const lineValue = lines[lineIndex];
              return (
                <div key={i} className="h-4 w-48 flex justify-between items-center transition-all duration-500">
                  {lineValue === undefined ? (
                    <div className="w-full h-[2px] bg-white/5" />
                  ) : lineValue === 1 ? (
                    <div className="w-full h-4 bg-emerald-400 rounded-sm shadow-[0_0_10px_rgba(52,211,153,0.5)]" />
                  ) : (
                    <>
                      <div className="w-[45%] h-4 bg-emerald-400/80 rounded-sm" />
                      <div className="w-[45%] h-4 bg-emerald-400/80 rounded-sm" />
                    </>
                  )}
                </div>
              );
            })}
          </div>
          <span className="text-xs text-emerald-600 font-mystic tracking-widest uppercase mt-2">
            进展: {lines.length}/6
          </span>
        </div>
      </div>

      {lines.length === 6 && (
        <button 
          onClick={finalize}
          className="px-12 py-4 bg-emerald-500 text-slate-950 font-mystic rounded-full font-bold text-lg hover:bg-emerald-400 shadow-[0_0_30px_rgba(52,211,153,0.4)] transition-all animate-bounce"
        >
          推演玄机
        </button>
      )}
    </div>
  );
};
