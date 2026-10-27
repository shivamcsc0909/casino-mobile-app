import React from 'react';
import { Plus, Diamond, User } from 'lucide-react';
import { useWalletStore } from '../../stores/useWalletStore';
import { useUserStore } from '../../stores/useUserStore';
import { formatCurrency } from '../../lib/utils';
import { SoundToggle } from '../common/SoundToggle';
import { soundManager } from '../../lib/audio';

interface HeaderProps {
  onOpenDeposit: () => void;
  onOpenProfile: () => void;
  onOpenAuth: () => void;
  onNavigateHome: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  onOpenDeposit,
  onOpenProfile,
  onOpenAuth,
  onNavigateHome,
}) => {
  const { currencyMode, realBalance, demoBalance, setCurrencyMode } = useWalletStore();
  const { isLoggedIn, avatar, vipTier } = useUserStore();

  const activeBalance = currencyMode === 'real' ? realBalance : demoBalance;

  const toggleCurrency = () => {
    soundManager.playChipSound();
    setCurrencyMode(currencyMode === 'real' ? 'demo' : 'real');
  };

  return (
    <header className="sticky top-0 z-40 w-full bg-[#0B0E14]/90 backdrop-blur-md border-b border-casino-border/80 px-3 sm:px-6 py-2.5">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-2">
        {/* Brand / Logo */}
        <div
          onClick={() => {
            soundManager.playButtonTap();
            onNavigateHome();
          }}
          className="flex items-center gap-2 cursor-pointer group shrink-0"
        >
          <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-gradient-to-br from-casino-gold to-amber-600 flex items-center justify-center shadow-glow-gold">
            <Diamond className="w-5 h-5 sm:w-6 sm:h-6 text-black fill-black" />
          </div>
          <div className="flex flex-col">
            <div className="flex items-center gap-1">
              <span className="font-display font-black text-lg sm:text-xl tracking-wider text-white">ROYALE</span>
              <span className="font-display font-black text-lg sm:text-xl text-gold-gradient">777</span>
            </div>
            <span className="text-[9px] uppercase tracking-widest text-slate-400 font-bold -mt-1 hidden sm:block">
              Luxury Gaming
            </span>
          </div>
        </div>

        {/* Central Balance Display & Switcher */}
        <div className="flex items-center gap-1.5 sm:gap-2">
          {/* Quick Dual-Balance Switcher Pill */}
          <div
            onClick={toggleCurrency}
            className="flex items-center gap-2 px-2.5 sm:px-3.5 py-1.5 rounded-2xl bg-[#141923] border border-casino-border cursor-pointer hover:border-slate-600 transition-all select-none"
            title="Click to switch Real Money / Practice Demo"
          >
            <div
              className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold transition-all ${
                currencyMode === 'real'
                  ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 shadow-glow-emerald'
                  : 'bg-amber-500/20 text-amber-300 border border-amber-500/40 shadow-glow-gold'
              }`}
            >
              {currencyMode === 'real' ? '₹' : '🪙'}
            </div>
            <div className="flex flex-col text-left">
              <span className="text-[10px] text-slate-400 leading-none flex items-center gap-1 font-semibold uppercase tracking-wider">
                <span>{currencyMode === 'real' ? 'Real Cash' : 'Demo Chips'}</span>
                <span className="text-[9px] text-casino-gold underline decoration-dotted">⇄</span>
              </span>
              <span className="text-sm sm:text-base font-extrabold font-mono-numbers text-white leading-tight">
                {formatCurrency(activeBalance, currencyMode)}
              </span>
            </div>
          </div>

          {/* Quick Deposit Action */}
          <button
            onClick={() => {
              soundManager.playChipSound();
              onOpenDeposit();
            }}
            className="flex items-center gap-1.5 px-3 sm:px-4 py-2 rounded-2xl bg-emerald-gradient hover:brightness-110 active:scale-95 text-white font-extrabold text-xs sm:text-sm tracking-wide shadow-glow-emerald transition-all shrink-0"
          >
            <Plus className="w-4 h-4 stroke-[3]" />
            <span className="hidden sm:inline">DEPOSIT</span>
            <span className="sm:hidden">+ ₹</span>
          </button>
        </div>

        {/* Right Actions: Sound, Notifications, User Profile */}
        <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
          <SoundToggle />

          {isLoggedIn ? (
            <button
              onClick={() => {
                soundManager.playButtonTap();
                onOpenProfile();
              }}
              className="flex items-center gap-2 p-1 pl-2 rounded-2xl bg-casino-card hover:bg-casino-cardHover border border-casino-border transition-all"
            >
              <div className="hidden md:flex flex-col text-right">
                <span className="text-xs font-bold text-slate-200">My Account</span>
                <span className="text-[10px] text-casino-gold font-semibold uppercase">{vipTier}</span>
              </div>
              <img
                src={avatar}
                alt="Avatar"
                className="w-8 h-8 rounded-xl object-cover border border-casino-gold/60"
              />
            </button>
          ) : (
            <button
              onClick={() => {
                soundManager.playButtonTap();
                onOpenAuth();
              }}
              className="flex items-center gap-1.5 px-3 py-2 rounded-2xl bg-casino-card hover:bg-casino-cardHover border border-casino-gold/40 text-casino-gold font-bold text-xs transition-all shadow-glow-gold"
            >
              <User className="w-4 h-4" />
              <span className="hidden sm:inline">Sign In</span>
            </button>
          )}
        </div>
      </div>
    </header>
  );
};
