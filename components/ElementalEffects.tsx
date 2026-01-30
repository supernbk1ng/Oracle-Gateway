import React, { useEffect, useState } from 'react';

type ElementType = 'Metal' | 'Wood' | 'Water' | 'Fire' | 'Earth';

interface Props {
  element?: ElementType;
}

export const ElementalEffects: React.FC<Props> = ({ element }) => {
  const [active, setActive] = useState(false);

  useEffect(() => {
    if (element) {
      // Small delay to allow enter animation
      const timer = setTimeout(() => setActive(true), 500);
      return () => clearTimeout(timer);
    }
  }, [element]);

  if (!element) return null;

  return (
    <div className={`fixed inset-0 pointer-events-none z-0 transition-opacity duration-2000 ${active ? 'opacity-100' : 'opacity-0'}`}>
      {/* Base ambient layer */}
      <div className={`absolute inset-0 transition-colors duration-2000 ${
        element === 'Fire' ? 'bg-red-900/10' :
        element === 'Water' ? 'bg-blue-900/10' :
        element === 'Wood' ? 'bg-emerald-900/10' :
        element === 'Metal' ? 'bg-slate-300/5' :
        'bg-amber-900/10' // Earth
      }`} />

      {/* Fire: Pulsing vignette */}
      {element === 'Fire' && (
        <div className="absolute inset-0 animate-pulse-slow shadow-[inset_0_0_100px_rgba(220,38,38,0.2)] mix-blend-screen" />
      )}

      {/* Water: Flowing wave overlay (simulated with gradient animation) */}
      {element === 'Water' && (
        <div className="absolute inset-0 bg-gradient-to-t from-blue-500/10 to-transparent animate-pulse-slow" 
             style={{ animationDuration: '4s' }} />
      )}

      {/* Wood: Rising particles/growth feeling (simulated with upward gradient) */}
      {element === 'Wood' && (
        <div className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-emerald-500/10 to-transparent opacity-60" />
      )}

      {/* Metal: Sharp sheen */}
      {element === 'Metal' && (
        <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/5 to-transparent opacity-30" />
      )}

      {/* Earth: Grounded heavy bottom */}
      {element === 'Earth' && (
        <div className="absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-amber-900/30 to-transparent" />
      )}
      
      {/* Global CSS Variable Injection and Animations */}
      <style>{`
        :root {
          --element-primary: ${
            element === 'Fire' ? '#ef4444' :
            element === 'Water' ? '#3b82f6' :
            element === 'Wood' ? '#10b981' :
            element === 'Metal' ? '#94a3b8' :
            '#d97706'
          };
        }
        @keyframes pulse-slow {
          0%, 100% { opacity: 0.3; }
          50% { opacity: 0.6; }
        }
        .animate-pulse-slow {
          animation: pulse-slow 4s cubic-bezier(0.4, 0, 0.6, 1) infinite;
        }
      `}</style>
    </div>
  );
};
