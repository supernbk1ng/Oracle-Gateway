import React, { useMemo } from 'react';
import { DivinationResult, DivinationPath } from '../types';

interface Props {
  path: DivinationPath;
  result: DivinationResult;
  tarotImages?: Record<string, string>; // Pass map if needed, or handle inside
}

const TAROT_IMAGE_MAP: Record<string, string> = {
  "愚者": "https://upload.wikimedia.org/wikipedia/commons/9/90/RWS_Tarot_00_Fool.jpg",
  "魔术师": "https://upload.wikimedia.org/wikipedia/commons/d/de/RWS_Tarot_01_Magician.jpg",
  "女祭司": "https://upload.wikimedia.org/wikipedia/commons/8/88/RWS_Tarot_02_High_Priestess.jpg",
  "皇后": "https://upload.wikimedia.org/wikipedia/commons/a/af/RWS_Tarot_03_Empress.jpg",
  "皇帝": "https://upload.wikimedia.org/wikipedia/commons/c/c3/RWS_Tarot_04_Emperor.jpg",
  "教皇": "https://upload.wikimedia.org/wikipedia/commons/8/8d/RWS_Tarot_05_Hierophant.jpg",
  "恋人": "https://upload.wikimedia.org/wikipedia/commons/3/3a/RWS_Tarot_06_Lovers.jpg",
  "战车": "https://upload.wikimedia.org/wikipedia/commons/9/9b/RWS_Tarot_07_Chariot.jpg",
  "力量": "https://upload.wikimedia.org/wikipedia/commons/f/f5/RWS_Tarot_08_Strength.jpg",
  "隐士": "https://upload.wikimedia.org/wikipedia/commons/4/4d/RWS_Tarot_09_Hermit.jpg",
  "命运之轮": "https://upload.wikimedia.org/wikipedia/commons/3/3c/RWS_Tarot_10_Wheel_of_Fortune.jpg",
  "正义": "https://upload.wikimedia.org/wikipedia/commons/e/e0/RWS_Tarot_11_Justice.jpg",
  "倒吊人": "https://upload.wikimedia.org/wikipedia/commons/2/2b/RWS_Tarot_12_Hanged_Man.jpg",
  "死神": "https://upload.wikimedia.org/wikipedia/commons/d/d7/RWS_Tarot_13_Death.jpg",
  "节制": "https://upload.wikimedia.org/wikipedia/commons/f/f8/RWS_Tarot_14_Temperance.jpg",
  "恶魔": "https://upload.wikimedia.org/wikipedia/commons/5/55/RWS_Tarot_15_Devil.jpg",
  "高塔": "https://upload.wikimedia.org/wikipedia/commons/5/53/RWS_Tarot_16_Tower.jpg",
  "星星": "https://upload.wikimedia.org/wikipedia/commons/d/db/RWS_Tarot_17_Star.jpg",
  "月亮": "https://upload.wikimedia.org/wikipedia/commons/7/7f/RWS_Tarot_18_Moon.jpg",
  "太阳": "https://upload.wikimedia.org/wikipedia/commons/1/17/RWS_Tarot_19_Sun.jpg",
  "审判": "https://upload.wikimedia.org/wikipedia/commons/d/dd/RWS_Tarot_20_Judgement.jpg",
  "世界": "https://upload.wikimedia.org/wikipedia/commons/f/ff/RWS_Tarot_21_World.jpg"
};

export const FateCard: React.FC<Props> = ({ path, result }) => {
  // Generate a unique serial number based on timestamp and random seed
  const serialNumber = useMemo(() => {
    const timestamp = Date.now().toString(36).toUpperCase();
    const random = Math.random().toString(36).substr(2, 4).toUpperCase();
    return `OG-${timestamp}-${random}`;
  }, []); // Stable across re-renders unless component unmounts

  return (
    <div 
      id="fate-card-container"
      className="relative w-[375px] h-[667px] bg-slate-950 flex flex-col items-center justify-between p-8 overflow-hidden"
      style={{
        backgroundImage: 'radial-gradient(circle at center, #1e293b 0%, #020617 100%)',
      }}
    >
      {/* Decorative Border */}
      <div className="absolute inset-4 border border-emerald-500/30 rounded-lg pointer-events-none z-10" />
      <div className="absolute inset-5 border border-emerald-500/10 rounded-lg pointer-events-none z-10" />

      {/* Header */}
      <div className="z-20 text-center space-y-2 mt-4">
        <div className="text-emerald-400/80 text-xs tracking-[0.3em] font-mystic uppercase">Oracle Gateway</div>
        <h2 className="text-3xl font-bold text-white font-mystic">{result.title}</h2>
        {result.subtitle && <p className="text-emerald-500/60 text-sm font-mystic">{result.subtitle}</p>}
      </div>

      {/* Visual Centerpiece */}
      <div className="z-20 flex-1 flex flex-col items-center justify-center w-full my-4">
        {path === 'TAOIST' ? (
          <div className="relative flex flex-col items-center">
            {/* Hexagram Symbol */}
            <div className="text-9xl text-emerald-400 mb-4 drop-shadow-[0_0_15px_rgba(52,211,153,0.5)]">
              {result.hexagramSymbol || '䷀'}
            </div>
            {/* Element Effect Placeholder or similar */}
            <div className="text-emerald-600/50 font-mystic tracking-widest text-sm">
              {result.element ? `[ ${result.element} ]` : ''}
            </div>
          </div>
        ) : (
          <div className="flex justify-center items-center gap-2 w-full px-2">
            {/* Show up to 3 cards, slightly overlapped or grid */}
            {result.cards && result.cards.map((card, idx) => {
              const imgUrl = TAROT_IMAGE_MAP[card] || "https://upload.wikimedia.org/wikipedia/commons/9/90/RWS_Tarot_00_Fool.jpg";
              return (
                <div key={idx} className="relative w-24 h-40 rounded shadow-2xl border border-white/10 overflow-hidden transform hover:scale-105 transition-transform" 
                     style={{ transform: `rotate(${(idx - 1) * 5}deg) translateY(${Math.abs(idx - 1) * 10}px)` }}>
                  <img src={imgUrl} alt={card} className="w-full h-full object-cover" crossOrigin="anonymous" />
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Quote Section */}
      <div className="z-20 w-full text-center space-y-4 mb-8">
        <div className="h-px w-16 bg-emerald-500/30 mx-auto" />
        <p className="text-lg text-emerald-100 font-mystic italic leading-relaxed px-4">
          “{result.fateQuote || result.interpretation.substring(0, 50) + '...'}”
        </p>
        <div className="h-px w-16 bg-emerald-500/30 mx-auto" />
      </div>

      {/* Footer / Serial */}
      <div className="z-20 w-full flex flex-col items-center gap-1 mb-2">
        <div className="text-[10px] text-slate-500 tracking-widest font-mono">
          NO. {serialNumber}
        </div>
        <div className="flex items-center gap-2 text-[10px] text-slate-600">
          <span>THE ORACLE GATEWAY</span>
          <span>•</span>
          <span>{new Date().toLocaleDateString()}</span>
        </div>
        {/* QR Code Placeholder (Optional) */}
        <div className="w-8 h-8 border border-white/10 mt-2 bg-white/5" />
      </div>
      
      {/* Background Noise/Texture Overlay */}
      <div className="absolute inset-0 opacity-20 pointer-events-none mix-blend-overlay"
           style={{ backgroundImage: 'url("data:image/svg+xml,%3Csvg viewBox=\'0 0 200 200\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cfilter id=\'noiseFilter\'%3E%3CfeTurbulence type=\'fractalNoise\' baseFrequency=\'0.65\' numOctaves=\'3\' stitchTiles=\'stitch\'/%3E%3C/filter%3E%3Crect width=\'100%25\' height=\'100%25\' filter=\'url(%23noiseFilter)\'/%3E%3C/svg%3E")' }} 
      />
    </div>
  );
};
