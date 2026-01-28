
import React, { useState } from 'react';
import { DivinationPath } from '../types';

interface Props {
  onSelect: (question: string, path: DivinationPath) => void;
}

export const OracleGateway: React.FC<Props> = ({ onSelect }) => {
  const [question, setQuestion] = useState('');

  return (
    <div className="flex flex-col items-center max-w-4xl w-full gap-8">
      <div className="text-center space-y-2">
        <h1 className="text-4xl md:text-5xl font-mystic text-green-300 tracking-wider">
          万象观测门
        </h1>
        <p className="text-cyan-500/60 tracking-[0.3em] font-light text-sm uppercase">
          The Oracle Gateway
        </p>
      </div>

      {/* Question Input */}
      <div className="w-full max-w-2xl relative">
        <div className="absolute -inset-1 bg-gradient-to-r from-cyan-400 via-yellow-400 to-cyan-400 rounded-xl opacity-75 blur-[2px]" />
        <input 
          type="text"
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
          placeholder="输入你的问题..."
          className="relative w-full bg-[#05070a] border-none rounded-xl px-6 py-5 text-xl text-cyan-100 placeholder:text-slate-700 focus:outline-none focus:ring-0"
        />
      </div>

      {/* Path Options */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 w-full max-w-3xl mt-4">
        {/* Taoist Path */}
        <button 
          onClick={() => question.trim() && onSelect(question, 'TAOIST')}
          className="group relative h-64 rounded-3xl overflow-hidden transition-all hover:scale-105 active:scale-95"
        >
          <div className="absolute inset-0 bg-slate-900/40 group-hover:bg-cyan-900/20 transition-colors border border-white/5 group-hover:border-cyan-500/40" />
          <div className="relative h-full flex flex-col items-center justify-center gap-4">
            <div className="w-24 h-24 rounded-full border-2 border-cyan-500/30 flex items-center justify-center p-4">
              <svg className="w-full h-full text-cyan-400" viewBox="0 0 100 100">
                <circle cx="50" cy="50" r="45" fill="none" stroke="currentColor" strokeWidth="1" strokeDasharray="10 5" />
                <circle cx="50" cy="50" r="15" fill="currentColor" opacity="0.8" />
                <circle cx="50" cy="50" r="30" fill="none" stroke="currentColor" strokeWidth="2" />
                {Array.from({length: 8}).map((_, i) => (
                  <line key={i} x1="50" y1="5" x2="50" y2="20" stroke="currentColor" strokeWidth="4" transform={`rotate(${i * 45} 50 50)`} />
                ))}
              </svg>
            </div>
            <div className="text-center">
              <h3 className="text-cyan-300 text-xl font-mystic">道家周易</h3>
              <p className="text-cyan-500/50 text-xs tracking-widest uppercase">Taoist Path</p>
            </div>
          </div>
        </button>

        {/* Tarot Path */}
        <button 
          onClick={() => question.trim() && onSelect(question, 'TAROT')}
          className="group relative h-64 rounded-3xl overflow-hidden transition-all hover:scale-105 active:scale-95"
        >
          <div className="absolute inset-0 bg-slate-900/40 group-hover:bg-yellow-900/20 transition-colors border border-white/5 group-hover:border-yellow-500/40" />
          <div className="relative h-full flex flex-col items-center justify-center gap-4">
            <div className="w-24 h-24 rounded-full border-2 border-yellow-500/30 flex items-center justify-center p-4">
              <svg className="w-full h-full text-yellow-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                <circle cx="12" cy="12" r="3" />
              </svg>
            </div>
            <div className="text-center">
              <h3 className="text-yellow-500 text-xl font-mystic">西方塔罗</h3>
              <p className="text-yellow-600/50 text-xs tracking-widest uppercase">Tarot Path</p>
            </div>
          </div>
        </button>
      </div>

      <p className="text-slate-600 font-mystic animate-pulse mt-8">
        {question ? '点击选择你的命运指引' : '请先输入问题'}
      </p>
    </div>
  );
};
