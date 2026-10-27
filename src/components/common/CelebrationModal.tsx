import React from 'react';
import { Trophy, Sparkles, X } from 'lucide-react';
import { formatCurrency } from '../../lib/utils';
import { soundManager } from '../../lib/audio';

interface CelebrationModalProps {
  isOpen: boolean;
  amount: number;
  currencyMode: 'real' | 'demo';
  title?: string;
  subtitle?: string;
  onClose: () => void;
}

export const CelebrationModal: React.FC<CelebrationModalProps> = ({
  isOpen,
  amount,
  currencyMode,
  title = 'MEGA WIN!',
  subtitle = 'Incredible round! Your chips have been credited.',
  onClose
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fade-in">
      <div className="relative w-full max-w-sm p-6 text-center rounded-3xl bg-gradient-to-b from-[#1E2538] to-[#0E121B] border-2 border-casino-gold/60 shadow-[0_0_50px_rgba(255,184,0,0.35)]">
        <button
          onClick={() => {
            soundManager.playButtonTap();
            onClose();
          }}
          className="absolute top-4 right-4 p-2 text-slate-400 hover:text-white rounded-full bg-slate-800/60"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="w-20 h-20 mx-auto mb-4 flex items-center justify-center rounded-full bg-casino-gold/20 border-2 border-casino-gold shadow-glow-gold animate-bounce-subtle">
          <Trophy className="w-10 h-10 text-casino-gold" />
        </div>

        <div className="flex items-center justify-center gap-1.5 mb-1 text-sm font-semibold tracking-wider text-casino-gold uppercase">
          <Sparkles className="w-4 h-4" />
          <span>{title}</span>
          <Sparkles className="w-4 h-4" />
        </div>

        <div className="text-3xl sm:text-4xl font-extrabold text-gold-gradient font-mono-numbers my-3">
          {formatCurrency(amount, currencyMode)}
        </div>

        <p className="text-xs text-slate-400 mb-6 px-4">
          {subtitle}
        </p>

        <button
          onClick={() => {
            soundManager.playChipSound();
            onClose();
          }}
          className="w-full py-3.5 px-6 rounded-2xl bg-gold-gradient text-black font-extrabold text-base tracking-wide hover:brightness-110 active:scale-95 transition-all shadow-glow-gold"
        >
          COLLECT REWARD
        </button>
      </div>
    </div>
  );
};
