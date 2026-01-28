
import React, { useState, useEffect } from 'react';

interface Props {
  onComplete: (cards: string[]) => void;
  onBack: () => void;
}

interface TarotCard {
  name: string;
  image: string;
}

const TAROT_CARDS: TarotCard[] = [
  { name: "愚者", image: "https://upload.wikimedia.org/wikipedia/commons/9/90/RWS_Tarot_00_Fool.jpg" },
  { name: "魔术师", image: "https://upload.wikimedia.org/wikipedia/commons/d/de/RWS_Tarot_01_Magician.jpg" },
  { name: "女祭司", image: "https://upload.wikimedia.org/wikipedia/commons/8/88/RWS_Tarot_02_High_Priestess.jpg" },
  { name: "皇后", image: "https://upload.wikimedia.org/wikipedia/commons/a/af/RWS_Tarot_03_Empress.jpg" },
  { name: "皇帝", image: "https://upload.wikimedia.org/wikipedia/commons/c/c3/RWS_Tarot_04_Emperor.jpg" },
  { name: "教皇", image: "https://upload.wikimedia.org/wikipedia/commons/8/8d/RWS_Tarot_05_Hierophant.jpg" },
  { name: "恋人", image: "https://upload.wikimedia.org/wikipedia/commons/3/3a/RWS_Tarot_06_Lovers.jpg" },
  { name: "战车", image: "https://upload.wikimedia.org/wikipedia/commons/9/9b/RWS_Tarot_07_Chariot.jpg" },
  { name: "力量", image: "https://upload.wikimedia.org/wikipedia/commons/f/f5/RWS_Tarot_08_Strength.jpg" },
  { name: "隐士", image: "https://upload.wikimedia.org/wikipedia/commons/4/4d/RWS_Tarot_09_Hermit.jpg" },
  { name: "命运之轮", image: "https://upload.wikimedia.org/wikipedia/commons/3/3c/RWS_Tarot_10_Wheel_of_Fortune.jpg" },
  { name: "正义", image: "https://upload.wikimedia.org/wikipedia/commons/e/e0/RWS_Tarot_11_Justice.jpg" },
  { name: "倒吊人", image: "https://upload.wikimedia.org/wikipedia/commons/2/2b/RWS_Tarot_12_Hanged_Man.jpg" },
  { name: "死神", image: "https://upload.wikimedia.org/wikipedia/commons/d/d7/RWS_Tarot_13_Death.jpg" },
  { name: "节制", image: "https://upload.wikimedia.org/wikipedia/commons/f/f8/RWS_Tarot_14_Temperance.jpg" },
  { name: "恶魔", image: "https://upload.wikimedia.org/wikipedia/commons/5/55/RWS_Tarot_15_Devil.jpg" },
  { name: "高塔", image: "https://upload.wikimedia.org/wikipedia/commons/5/53/RWS_Tarot_16_Tower.jpg" },
  { name: "星星", image: "https://upload.wikimedia.org/wikipedia/commons/d/db/RWS_Tarot_17_Star.jpg" },
  { name: "月亮", image: "https://upload.wikimedia.org/wikipedia/commons/7/7f/RWS_Tarot_18_Moon.jpg" },
  { name: "太阳", image: "https://upload.wikimedia.org/wikipedia/commons/1/17/RWS_Tarot_19_Sun.jpg" },
  { name: "审判", image: "https://upload.wikimedia.org/wikipedia/commons/d/dd/RWS_Tarot_20_Judgement.jpg" },
  { name: "世界", image: "https://upload.wikimedia.org/wikipedia/commons/f/ff/RWS_Tarot_21_World.jpg" }
];

export const TarotDraw: React.FC<Props> = ({ onComplete, onBack }) => {
  const [shuffledIndices, setShuffledIndices] = useState<number[]>([]);
  const [selectedIndices, setSelectedIndices] = useState<number[]>([]);
  const labels = ["过去", "现在", "未来"];

  useEffect(() => {
    // 1. Preload all Tarot card images as soon as the component mounts
    TAROT_CARDS.forEach((card) => {
      const img = new Image();
      img.src = card.image;
    });

    // 2. Shuffle the indices on mount
    const indices = Array.from({ length: TAROT_CARDS.length }, (_, i) => i);
    for (let i = indices.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [indices[i], indices[j]] = [indices[j], indices[i]];
    }
    setShuffledIndices(indices);
  }, []);

  const handleCardClick = (poolIndex: number) => {
    if (selectedIndices.includes(poolIndex)) return;
    if (selectedIndices.length < 3) {
      setSelectedIndices([...selectedIndices, poolIndex]);
    }
  };

  const finalize = () => {
    const cards = selectedIndices.map(poolIndex => {
      const actualCardIndex = shuffledIndices[poolIndex];
      return TAROT_CARDS[actualCardIndex].name;
    });
    onComplete(cards);
  };

  return (
    <div className="flex flex-col items-center gap-10 w-full max-w-5xl animate-in fade-in zoom-in duration-700">
      <button 
        onClick={onBack}
        className="absolute top-0 left-0 flex items-center gap-2 text-slate-500 hover:text-yellow-500 transition-colors font-mystic text-sm px-4 py-2 z-50"
      >
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
        </svg>
        返回修改问题
      </button>

      <div className="text-center space-y-2">
        <h2 className="text-3xl font-mystic text-yellow-500">挑选三张塔罗牌</h2>
        <p className="text-yellow-600/60 tracking-widest text-sm uppercase">选取你的过去、现在与未来</p>
      </div>

      {/* Selected Slots */}
      <div className="flex gap-4 md:gap-8 items-start mb-8 min-h-[320px]">
        {[0, 1, 2].map(i => {
          const poolIndex = selectedIndices[i];
          const actualCard = poolIndex !== undefined ? TAROT_CARDS[shuffledIndices[poolIndex]] : null;
          
          return (
            <div key={i} className="flex flex-col items-center gap-4">
              <div className={`relative w-32 h-52 md:w-40 md:h-64 rounded-xl border-2 transition-all duration-700 overflow-hidden group shadow-2xl ${actualCard ? 'border-yellow-500 bg-black' : 'border-white/10 bg-white/5 border-dashed'}`}>
                {actualCard ? (
                  <div className="absolute inset-0 animate-in fade-in zoom-in duration-500">
                    <img 
                      src={actualCard.image} 
                      alt={actualCard.name}
                      loading="eager" // Load immediately as we want it shown instantly
                      className="w-full h-full object-cover opacity-90 group-hover:opacity-100 transition-opacity"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
                    <div className="absolute bottom-3 left-0 right-0 text-center">
                       <p className="text-yellow-500 font-mystic text-sm md:text-base font-bold drop-shadow-lg uppercase tracking-widest px-2">
                         {actualCard.name}
                       </p>
                    </div>
                  </div>
                ) : (
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-6 h-6 rounded-full border-2 border-white/10 animate-pulse" />
                  </div>
                )}
              </div>
              <span className="text-xs tracking-[0.3em] text-slate-500 font-mystic uppercase">{labels[i]}</span>
            </div>
          );
        })}
      </div>

      {/* Card Pool */}
      <div className="relative w-full overflow-hidden p-8 bg-slate-900/40 rounded-[40px] border border-white/5 backdrop-blur-xl shadow-2xl">
        <div className="grid grid-cols-6 sm:grid-cols-11 gap-3">
          {shuffledIndices.map((_, i) => (
            <button
              key={i}
              disabled={selectedIndices.length >= 3 || selectedIndices.includes(i)}
              onClick={() => handleCardClick(i)}
              className={`relative aspect-[2/3] w-full rounded-lg transition-all transform duration-500
                ${selectedIndices.includes(i) 
                  ? 'opacity-0 scale-0 -translate-y-24 rotate-12 pointer-events-none' 
                  : 'hover:-translate-y-3 hover:shadow-[0_20px_40px_rgba(251,191,36,0.2)] active:scale-95'
                }
              `}
            >
              <div className="absolute inset-0 rounded-lg overflow-hidden border border-white/10 shadow-lg bg-[#0a0c10]">
                {/* Mystical Pattern Fallback */}
                <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-slate-900 to-indigo-950">
                   <div className="opacity-20 transform rotate-45 scale-150">
                      <svg width="100%" height="100%" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M20 0L24.4903 15.5097L40 20L24.4903 24.4903L20 40L15.5097 24.4903L0 20L15.5097 15.5097L20 0Z" fill="#fbbf24"/>
                      </svg>
                   </div>
                </div>
                
                {/* Decoration */}
                <div className="absolute inset-0 p-[2px]">
                   <div className="w-full h-full rounded-[6px] border border-yellow-500/20 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-30 pointer-events-none" />
                </div>
                
                <div className="absolute inset-0 flex items-center justify-center">
                   <div className="w-8 h-8 md:w-10 md:h-10 text-yellow-500/40 border border-yellow-500/20 rounded-full flex items-center justify-center p-2 backdrop-blur-sm">
                      <svg viewBox="0 0 24 24" fill="currentColor">
                        <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z" />
                      </svg>
                   </div>
                </div>
                
                <div className="absolute inset-0 bg-yellow-900/10 group-hover:bg-transparent transition-colors" />
              </div>
            </button>
          ))}
        </div>
      </div>

      <div className="min-h-[80px] flex items-center justify-center">
        {selectedIndices.length === 3 ? (
          <button 
            onClick={finalize}
            className="px-16 py-5 bg-gradient-to-r from-yellow-600 to-yellow-400 text-slate-950 font-mystic rounded-full font-bold text-xl hover:from-yellow-500 hover:to-yellow-300 shadow-[0_0_50px_rgba(251,191,36,0.3)] transition-all animate-in slide-in-from-bottom duration-500"
          >
            揭示星轨真理
          </button>
        ) : (
          <p className="text-slate-500 font-mystic tracking-widest uppercase animate-pulse">
            选择剩下 {3 - selectedIndices.length} 张牌以洞悉天机
          </p>
        )}
      </div>
    </div>
  );
};
