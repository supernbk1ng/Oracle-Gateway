
import React from 'react';
import { DivinationResult, DivinationPath } from '../types';
import { PieChart, Pie, Cell, ResponsiveContainer } from 'recharts';

interface Props {
  path: DivinationPath;
  question: string;
  result: DivinationResult;
  onReset: () => void;
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

const ProgressCircle = ({ value, color, label }: { value: number, color: string, label: string }) => {
  const safeValue = isNaN(Number(value)) ? 0 : Number(value);
  const data = [{ value: safeValue }, { value: 100 - safeValue }];
  return (
    <div className="flex flex-col items-center gap-2">
      <div className="h-32 w-32 relative">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              innerRadius={35}
              outerRadius={45}
              paddingAngle={0}
              dataKey="value"
              startAngle={90}
              endAngle={450}
              stroke="none"
            >
              <Cell fill={color} />
              <Cell fill="rgba(255,255,255,0.05)" />
            </Pie>
          </PieChart>
        </ResponsiveContainer>
        <div className="absolute inset-0 flex items-center justify-center text-xl font-bold font-mystic" style={{ color }}>
          {value}%
        </div>
      </div>
      <span className="text-[10px] tracking-[0.2em] uppercase text-slate-500 whitespace-nowrap font-mystic">{label}</span>
    </div>
  );
};

const LineLabels = ["初爻", "二爻", "三爻", "四爻", "五爻", "上爻"];
const TarotLabels = ["过去 (Past)", "现在 (Present)", "未来 (Future)"];

export const ResultView: React.FC<Props> = ({ path, question, result, onReset }) => {
  const isTaoist = path === 'TAOIST';
  const mainColor = isTaoist ? '#34d399' : '#fbbf24';

  return (
    <div className="flex flex-col items-center max-w-5xl w-full gap-8 animate-in fade-in duration-1000">
      {/* Background Atmosphere */}
      <ElementalEffects element={result.element} />

      {/* Sticky Back Button Wrapper */}
      <div className="sticky top-0 w-full z-50 flex justify-start pointer-events-none mb-4">
        <button 
          onClick={onReset}
          className="pointer-events-auto flex items-center gap-2 text-slate-500 hover:text-cyan-400 transition-colors bg-[#05070a]/80 backdrop-blur-md px-4 py-2 rounded-full border border-white/5 font-mystic text-sm shadow-lg"
        >
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 15l-3-3m0 0l3-3m-3 3h8M3 12a9 9 0 1118 0 9 9 0 01-18 0z" />
          </svg>
          返回观测门
        </button>
      </div>

      {/* Header */}
      <div className="text-center space-y-6">
        <div className="inline-block bg-slate-900/40 border border-white/5 px-4 py-1 rounded-full text-[10px] tracking-widest text-slate-400">
          源自 2030 年的预言
        </div>
        
        <div className="flex flex-col items-center gap-4">
          {isTaoist && result.hexagramSymbol && (
            <div className="relative group">
              <div className="absolute inset-0 bg-emerald-500/20 blur-3xl rounded-full animate-pulse" />
              <div className="relative w-32 h-32 flex items-center justify-center border-2 border-emerald-500/30 rounded-2xl bg-slate-950/50 backdrop-blur-md shadow-[0_0_50px_rgba(52,211,153,0.1)] overflow-hidden">
                <div className="absolute inset-0 opacity-10 pointer-events-none">
                   <svg width="100%" height="100%" viewBox="0 0 100 100">
                      <circle cx="50" cy="50" r="40" fill="none" stroke="currentColor" strokeWidth="0.5" className="text-emerald-500"/>
                      <path d="M50 10 L50 90 M10 50 L90 50" stroke="currentColor" strokeWidth="0.5" className="text-emerald-500"/>
                   </svg>
                </div>
                <div className="text-7xl text-emerald-400 select-none font-serif transform transition-transform group-hover:scale-110 duration-500">
                  {result.hexagramSymbol}
                </div>
              </div>
            </div>
          )}

          {!isTaoist && result.cards && (
            <div className="flex gap-3 mb-2">
              {result.cards.map((card, idx) => (
                <div key={idx} className="px-3 py-1 bg-yellow-500/10 border border-yellow-500/30 rounded-lg text-yellow-500 text-xs font-mystic">
                  {card}
                </div>
              ))}
            </div>
          )}

          <div className="space-y-1">
            <h2 className="text-4xl md:text-5xl font-mystic tracking-wider" style={{ color: mainColor }}>
              {result.title}
            </h2>
            <p className="text-cyan-500/60 font-light tracking-[0.2em] text-sm uppercase">
              {result.subtitle || (isTaoist ? '上古智慧 · 乾坤易理' : '星轨交汇 · 命运羁绊')}
            </p>
          </div>
        </div>
      </div>

      {/* Main Content Card */}
      <div className="relative w-full max-w-4xl bg-gradient-to-br from-slate-900/80 to-slate-950/40 backdrop-blur-2xl border border-white/10 rounded-[40px] p-8 md:p-12 overflow-hidden shadow-2xl mb-8">
        <div className="absolute -top-24 -left-24 w-80 h-80 blur-[120px] rounded-full opacity-20 animate-glow" style={{ backgroundColor: mainColor }} />
        <div className="absolute -bottom-24 -right-24 w-80 h-80 blur-[120px] rounded-full opacity-10 animate-glow" style={{ backgroundColor: '#0ea5e9' }} />
        
        <div className="relative z-10 space-y-10">
          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <div className="w-1 h-6 rounded-full" style={{ backgroundColor: mainColor }} />
              <h4 className="text-slate-400 text-sm font-mystic tracking-widest uppercase">观测之问</h4>
            </div>
            <p className="text-2xl font-mystic text-cyan-50/90 italic leading-relaxed">
              "{question}"
            </p>
            <div className="w-full h-px bg-gradient-to-r from-transparent via-white/10 to-transparent mt-6" />
          </div>

          <div className="flex flex-col lg:flex-row gap-12 items-start">
            <div className="flex-1 space-y-6">
              <div className="flex items-center gap-3 mb-4">
                <svg className="w-5 h-5 opacity-50" fill="none" viewBox="0 0 24 24" stroke="currentColor" style={{ color: mainColor }}>
                   <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5s3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                </svg>
                <h5 className="text-xs uppercase tracking-[0.3em] text-slate-500 font-mystic">启示解读</h5>
              </div>
              <div className="text-slate-300 leading-relaxed font-mystic text-lg">
                <div className="space-y-6">
                  {result.interpretation.split('\n').filter(p => p.trim()).map((para, i) => (
                    <p key={i} className="first-letter:text-2xl first-letter:font-bold first-letter:mr-1">
                      {para}
                    </p>
                  ))}
                </div>
              </div>

              {/* Taoist Detailed Line Analysis */}
              {isTaoist && result.lineInterpretations && result.lineInterpretations.length > 0 && (
                <div className="mt-12 space-y-8 animate-in slide-in-from-bottom duration-700 delay-300">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-[1px] bg-emerald-500/30" />
                    <h5 className="text-xs uppercase tracking-[0.4em] text-emerald-500/70 font-mystic">六爻象辞解析</h5>
                    <div className="flex-1 h-[1px] bg-emerald-500/30" />
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {result.lineInterpretations.map((line, idx) => (
                      <div key={idx} className="group relative bg-white/5 border border-white/5 rounded-2xl p-6 transition-all hover:bg-emerald-500/5 hover:border-emerald-500/20">
                        <div className="absolute top-4 right-4 text-[10px] text-emerald-500/40 font-mystic tracking-widest opacity-0 group-hover:opacity-100 transition-opacity">
                          {LineLabels[idx]}
                        </div>
                        <div className="flex items-start gap-3">
                          <div className="flex flex-col items-center mt-1">
                             <div className="w-1.5 h-1.5 rounded-full bg-emerald-500/40 mb-1" />
                             <div className="w-[1px] h-8 bg-emerald-500/10" />
                          </div>
                          <div className="space-y-1">
                            <span className="text-[10px] text-emerald-500/60 font-mystic tracking-tighter uppercase">{LineLabels[idx]}</span>
                            <p className="text-sm text-slate-400 leading-relaxed font-mystic italic">
                              {line}
                            </p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Tarot Detailed Card Analysis */}
              {!isTaoist && result.cards && result.cardInterpretations && result.cardInterpretations.length > 0 && (
                <div className="mt-12 space-y-8 animate-in slide-in-from-bottom duration-700 delay-300">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-[1px] bg-yellow-500/30" />
                    <h5 className="text-xs uppercase tracking-[0.4em] text-yellow-500/70 font-mystic">三牌位深层洞察</h5>
                    <div className="flex-1 h-[1px] bg-yellow-500/30" />
                  </div>
                  <div className="grid grid-cols-1 gap-6">
                    {result.cardInterpretations.map((interpretation, idx) => {
                      const cardName = result.cards![idx];
                      const imageUrl = TAROT_IMAGE_MAP[cardName] || "";
                      return (
                        <div key={idx} className="group relative bg-white/5 border border-white/5 rounded-3xl p-6 md:p-8 transition-all hover:bg-yellow-500/5 hover:border-yellow-500/20 flex flex-col md:flex-row gap-6 items-center md:items-start">
                          <div className="relative w-24 h-40 shrink-0 rounded-lg overflow-hidden border border-yellow-500/30 shadow-lg group-hover:scale-105 transition-transform duration-500">
                            {imageUrl ? (
                              <img src={imageUrl} alt={cardName} className="w-full h-full object-cover" />
                            ) : (
                              <div className="w-full h-full bg-slate-900 flex items-center justify-center text-yellow-500/30">🎴</div>
                            )}
                            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                          </div>
                          <div className="flex-1 space-y-3 text-center md:text-left">
                            <div className="flex flex-col md:flex-row md:items-center gap-2 md:gap-4">
                               <span className="text-[10px] text-yellow-500/60 font-mystic tracking-[0.2em] uppercase">{TarotLabels[idx]}</span>
                               <h6 className="text-xl text-yellow-500 font-mystic font-bold">{cardName}</h6>
                            </div>
                            <p className="text-slate-400 leading-relaxed font-mystic italic text-base">
                              {interpretation}
                            </p>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>

            {/* Side Metrics */}
            <div className="w-full lg:w-auto flex flex-col gap-6 lg:sticky lg:top-24">
               <div className="bg-slate-900/40 p-8 rounded-[32px] border border-white/5 backdrop-blur-sm shadow-inner grid grid-cols-2 gap-8 lg:flex lg:flex-col lg:gap-10">
                <ProgressCircle value={result.successRate} color={isTaoist ? '#34d399' : '#fbbf24'} label="成事胜算" />
                <ProgressCircle value={result.energyAlign} color={isTaoist ? '#22d3ee' : '#f59e0b'} label="能量契合" />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Action Section */}
      <div className="flex flex-col items-center gap-4 py-8">
        <button 
          onClick={onReset}
          className="group relative flex items-center gap-4 px-12 py-5 bg-slate-900/80 border border-white/10 rounded-full text-cyan-400 hover:border-cyan-400 hover:text-white transition-all hover:scale-105 active:scale-95 shadow-xl overflow-hidden"
        >
          <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/0 via-cyan-500/10 to-cyan-500/0 opacity-0 group-hover:opacity-100 transition-opacity translate-x-[-100%] group-hover:translate-x-[100%] duration-1000" />
          <svg className="w-6 h-6 transition-transform group-hover:rotate-180 duration-700" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
          </svg>
          <span className="font-mystic tracking-[0.2em] text-lg uppercase">封存命运 · 再次开启</span>
        </button>
        <p className="text-[10px] text-slate-600 tracking-widest font-mystic uppercase opacity-50 mt-4">THE ORACLE GATEWAY — EST. 2030</p>
      </div>
    </div>
  );
};
