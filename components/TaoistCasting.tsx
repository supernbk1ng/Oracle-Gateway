
import React, { useState } from 'react';

interface Props {
  onComplete: (hexagram: string) => void;
  onBack: () => void;
}

export const TaoistCasting: React.FC<Props> = ({ onComplete, onBack }) => {
  const [lines, setLines] = useState<number[]>([]); // 0 for Yin (broken), 1 for Yang (solid)
  const [isCasting, setIsCasting] = useState(false);

  const castLine = () => {
    if (lines.length >= 6 || isCasting) return;
    setIsCasting(true);
    
    // Simulate coin spinning
    setTimeout(() => {
      const newLine = Math.random() > 0.5 ? 1 : 0;
      setLines([newLine, ...lines]); // I-Ching is built from bottom to top
      setIsCasting(false);
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
        <p className="text-emerald-600/60 tracking-widest text-sm uppercase">点击铜钱，连续起卦六次</p>
      </div>

      <div className="flex flex-col md:flex-row items-center gap-16">
        {/* The Coins */}
        <div className="relative">
          <button 
            onClick={castLine}
            disabled={lines.length >= 6 || isCasting}
            className={`w-48 h-48 rounded-full border-4 border-emerald-500/30 flex items-center justify-center transition-all bg-emerald-950/20 group
              ${lines.length < 6 && !isCasting ? 'hover:border-emerald-400 hover:shadow-[0_0_40px_rgba(52,211,153,0.3)] cursor-pointer' : 'cursor-default'}
            `}
          >
            <div className={`text-6xl text-emerald-400 transition-transform duration-500 ${isCasting ? 'animate-spin' : 'group-hover:scale-110'}`}>
              🪙
            </div>
          </button>
          {isCasting && (
            <div className="absolute inset-0 border-4 border-emerald-400 rounded-full animate-ping opacity-20" />
          )}
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
