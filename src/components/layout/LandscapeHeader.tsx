import React from 'react';
import { ArrowLeft, Plus, Diamond } from 'lucide-react';
import { useWalletStore } from '../../stores/useWalletStore';
import { useUserStore } from '../../stores/useUserStore';
import { soundManager } from '../../lib/audio';
import { triggerHaptic } from '../../lib/haptics';
import { formatCurrency } from '../../lib/utils';
import { SoundToggle } from '../common/SoundToggle';

interface LandscapeHeaderProps {
  activeGameTitle?: string;
  onBackToFloor: () => void;
  onOpenDeposit: () => void;
  onOpenProfile: () => void;
}

export const LandscapeHeader: React.FC<LandscapeHeaderProps> = ({
  activeGameTitle,
  onBackToFloor,
  onOpenDeposit,
  onOpenProfile,
}) => {
  const { currencyMode, realBalance, demoBalance, setCurrencyMode } = useWalletStore();
  const { avatar, vipTier } = useUserStore();

  const activeBalance = currencyMode === 'real' ? realBalance : demoBalance;

  const toggleCurrency = () => {
    soundManager.playChipSound();
    triggerHaptic('light');
    setCurrencyMode(currencyMode === 'real' ? 'demo' : 'real');
  };

  return (
    <header className="sticky top-0 z-40 w-full bg-[#0A0D14]/90 backdrop-blur-md border-b border-casino-border px-3 sm:px-6 py-2">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-3">
        {/* Left: Brand or Back Button */}
        <div className="flex items-center gap-2">
          {activeGameTitle ? (
            <button
              onClick={() => {
                soundManager.playButtonTap();
                triggerHaptic('light');
                onBackToFloor();
              }}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-casino-card hover:bg-casino-cardHover border border-casino-border text-xs font-bold text-slate-300 hover:text-white transition-all active:scale-95"
            >
              <ArrowLeft className="w-4 h-4 text-casino-gold" />
              <span>Floor</span>
            </button>
          ) : (
            <div className="flex items-center gap-2 select-none">
              <div className="w-8 h-8 rounded-xl bg-gold-gradient flex items-center justify-center shadow-glow-gold">
                <Diamond className="w-4 h-4 text-black fill-black" />
              </div>
              <span className="font-display font-black text-base text-white tracking-wider">
                ROYALE <span className="text-gold-gradient">777</span>
              </span>
            </div>
          )}

          {activeGameTitle && (
            <span className="text-xs font-black text-white uppercase tracking-wider hidden sm:inline pl-1 border-l border-slate-700">
              {activeGameTitle}
            </span>
          )}
        </div>

        {/* Center: Dual-Balance Switcher */}
        <div className="flex items-center gap-2">
          <div
            onClick={toggleCurrency}
            className="flex items-center gap-2 px-3 py-1 rounded-2xl bg-[#121622] border border-casino-border cursor-pointer hover:border-slate-600 transition-all select-none"
            title="Click to toggle Real Money / Demo Chips"
          >
            <span
              className={`w-5 h-5 rounded-full flex items-center justify-center text-[11px] font-bold ${
                currencyMode === 'real'
                  ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 shadow-glow-emerald'
                  : 'bg-amber-500/20 text-amber-300 border border-amber-500/40 shadow-glow-gold'
              }`}
            >
              {currencyMode === 'real' ? '₹' : '🪙'}
            </span>
            <div className="flex flex-col text-left">
              <span className="text-[9px] text-slate-400 font-bold uppercase tracking-wider leading-none">
                {currencyMode === 'real' ? 'Real Cash' : 'Demo Chips'} ⇄
              </span>
              <span className="text-xs sm:text-sm font-black font-mono-numbers text-white leading-tight">
                {formatCurrency(activeBalance, currencyMode)}
              </span>
            </div>
          </div>

          {/* Quick Deposit */}
          <button
            onClick={() => {
              soundManager.playChipSound();
              triggerHaptic('medium');
              onOpenDeposit();
            }}
            className="flex items-center gap-1 px-3 py-1.5 rounded-xl bg-emerald-gradient text-white font-black text-xs shadow-glow-emerald hover:brightness-110 active:scale-95 transition-all"
          >
            <Plus className="w-3.5 h-3.5 stroke-[3]" />
            <span className="hidden sm:inline">DEPOSIT</span>
          </button>
        </div>

        {/* Right: Sound & Profile */}
        <div className="flex items-center gap-2">
          <SoundToggle />

          <button
            onClick={() => {
              soundManager.playButtonTap();
              triggerHaptic('light');
              onOpenProfile();
            }}
            className="flex items-center gap-1.5 p-1 pl-2 rounded-xl bg-casino-card hover:bg-casino-cardHover border border-casino-border"
          >
            <span className="text-[10px] font-black text-casino-gold uppercase hidden md:inline">
              {vipTier}
            </span>
            <img
              src={avatar}
              alt="Avatar"
              className="w-7 h-7 rounded-lg object-cover border border-casino-gold/50"
            />
          </button>
        </div>
      </div>
    </header>
  );
};
