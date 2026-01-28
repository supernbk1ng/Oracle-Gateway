
import React from 'react';

export const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <div className="relative min-h-screen w-full bg-[#05070a] text-slate-200">
      {/* Fixed Background Elements */}
      <div className="fixed inset-0 stars-bg opacity-30 pointer-events-none" />
      
      {/* Fixed Corner UI Elements */}
      <div className="fixed top-4 left-4 w-12 h-12 border-t-2 border-l-2 border-cyan-500/30 rounded-tl-lg pointer-events-none z-50" />
      <div className="fixed top-4 right-4 w-12 h-12 border-t-2 border-r-2 border-cyan-500/30 rounded-tr-lg pointer-events-none z-50" />
      <div className="fixed bottom-4 left-4 w-12 h-12 border-b-2 border-l-2 border-cyan-500/30 rounded-bl-lg pointer-events-none z-50" />
      <div className="fixed bottom-4 right-4 w-12 h-12 border-b-2 border-r-2 border-cyan-500/30 rounded-br-lg pointer-events-none z-50" />
      
      {/* Content Container - Allow natural scroll with min-h-screen */}
      <main className="relative z-10 w-full min-h-screen flex flex-col items-center p-6 md:p-12">
        <div className="w-full flex flex-col items-center justify-center py-12">
          {children}
        </div>
      </main>

      {/* Info Icon - Fixed to viewport */}
      <div className="fixed bottom-6 right-6 z-50">
        <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center text-slate-900 font-bold shadow-lg cursor-pointer hover:bg-slate-200 transition-colors">
          ?
        </div>
      </div>
    </div>
  );
};