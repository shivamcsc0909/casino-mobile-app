import React from 'react';
import { useWalletStore } from '../../stores/useWalletStore';
import { soundManager } from '../../lib/audio';

export const BalanceSwitcher: React.FC<{ className?: string }> = ({ className = '' }) => {
  const { currencyMode, setCurrencyMode } = useWalletStore();

  const handleSelect = (mode: 'real' | 'demo') => {
    if (currencyMode !== mode) {
      soundManager.playChipSound();
      setCurrencyMode(mode);
    }
  };

  return (
    <div className={`flex items-center p-1 rounded-2xl bg-[#0F141F] border border-casino-border ${className}`}>
      <button
        onClick={() => handleSelect('demo')}
        className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
          currencyMode === 'demo'
            ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40 shadow-glow-gold'
            : 'text-slate-400 hover:text-slate-200'
        }`}
      >
        <span>🪙</span>
        <span>Practice</span>
      </button>
      <button
        onClick={() => handleSelect('real')}
        className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
          currencyMode === 'real'
            ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 shadow-glow-emerald'
            : 'text-slate-400 hover:text-slate-200'
        }`}
      >
        <span className="font-mono-numbers">₹</span>
        <span>Real Cash</span>
      </button>
    </div>
  );
};
