import React, { useState } from 'react';
import { Play, Trophy, Sparkles } from 'lucide-react';
import { useWalletStore } from '../../../stores/useWalletStore';
import { useUserStore } from '../../../stores/useUserStore';
import { soundManager } from '../../../lib/audio';
import { triggerHaptic } from '../../../lib/haptics';
import { formatCurrency, triggerConfetti } from '../../../lib/utils';

export const CoinFlipGame: React.FC = () => {
  const { currencyMode, placeBet, addWin, getActiveBalance } = useWalletStore();
  const { addVipPoints } = useUserStore();

  const [betSide, setBetSide] = useState<'heads' | 'tails'>('heads');
  const [betAmount, setBetAmount] = useState<number>(50);
  const [isFlipping, setIsFlipping] = useState<boolean>(false);
  const [streak, setStreak] = useState<number>(0);
  const [coinResult, setCoinResult] = useState<'heads' | 'tails' | null>(null);
  const [lastWin, setLastWin] = useState<number | null>(null);

  const currentMultiplier = Number((Math.pow(1.96, streak)).toFixed(2));

  const handleFlip = () => {
    if (isFlipping) return;

    if (streak === 0) {
      const balance = getActiveBalance();
      if (balance < betAmount) return;

      const ok = placeBet(betAmount, 'Coin Flip');
      if (!ok) return;
      addVipPoints(Math.floor(betAmount / 10));
    }

    soundManager.playWheelTick();
    triggerHaptic('medium');
    setIsFlipping(true);
    setCoinResult(null);

    setTimeout(() => {
      const outcome: 'heads' | 'tails' = Math.random() > 0.5 ? 'heads' : 'tails';
      setCoinResult(outcome);
      setIsFlipping(false);

      if (outcome === betSide) {
        // Correct flip!
        const nextStreak = streak + 1;
        setStreak(nextStreak);
        soundManager.playCashOut();
        triggerHaptic('success');
      } else {
        // Lost streak
        setStreak(0);
        soundManager.playCrashSound();
        triggerHaptic('warning');
      }
    }, 900);
  };

  const handleCashOut = () => {
    if (streak === 0) return;
    const winAmt = Math.floor(betAmount * currentMultiplier);
    addWin(winAmt, `Coin Flip (${streak} Streak)`);
    setLastWin(winAmt);
    setStreak(0);
    soundManager.playWinChime();
    triggerConfetti();
    triggerHaptic('success');
  };

  return (
    <div className="p-3 sm:p-6 max-w-4xl mx-auto space-y-4 select-none animate-fade-in">
      <div className="p-8 rounded-3xl bg-gradient-to-b from-[#1E190A] via-[#141824] to-[#0A0D14] border-2 border-casino-gold/50 shadow-glow-gold flex flex-col items-center">
        <div className="flex items-center gap-2 mb-6">
          <Sparkles className="w-5 h-5 text-casino-gold" />
          <h2 className="text-xl font-black text-white font-display uppercase tracking-widest">
            COIN FLIP DELUXE
          </h2>
        </div>

        {/* 3D Gold Coin Animation */}
        <div className="my-4">
          <div
            className={`w-32 h-32 rounded-full bg-gradient-to-br from-[#FFE873] via-[#FFB800] to-[#B45309] border-4 border-amber-300 shadow-glow-gold flex items-center justify-center text-4xl select-none transition-transform duration-700 ${
              isFlipping ? 'animate-spin' : ''
            }`}
          >
            {isFlipping ? '🪙' : coinResult === 'heads' ? '👑' : coinResult === 'tails' ? '🦅' : '🪙'}
          </div>
          <div className="text-center mt-3 font-bold text-xs uppercase text-slate-300">
            {isFlipping ? 'Flipping...' : coinResult ? coinResult.toUpperCase() : 'Choose Side & Flip'}
          </div>
        </div>

        {/* Streak Counter & Multiplier */}
        {streak > 0 && (
          <div className="mt-2 flex items-center gap-2 px-4 py-1.5 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 text-xs font-black font-mono-numbers animate-bounce-subtle">
            <Trophy className="w-4 h-4 text-casino-gold" />
            <span>Streak: {streak} | Multiplier: {currentMultiplier}x</span>
          </div>
        )}

        {/* Win announcement */}
        {lastWin !== null && (
          <div className="mt-3 px-6 py-1.5 rounded-full bg-emerald-500 text-black font-black text-xs uppercase shadow-glow-emerald">
            +{formatCurrency(lastWin, currencyMode)} WON!
          </div>
        )}
      </div>

      {/* Control Console */}
      <div className="p-4 rounded-3xl bg-casino-card border border-casino-border flex flex-col sm:flex-row items-center justify-between gap-3">
        {/* Heads / Tails Selector & Chips */}
        <div className="flex flex-wrap items-center gap-2 w-full sm:w-auto">
          <div className="grid grid-cols-2 gap-1.5">
            <button
              onClick={() => setBetSide('heads')}
              disabled={isFlipping}
              className={`px-4 py-2 rounded-xl font-bold text-xs border ${
                betSide === 'heads'
                  ? 'bg-casino-gold text-black border-casino-gold shadow-glow-gold'
                  : 'bg-slate-900 border-slate-800 text-slate-400'
              }`}
            >
              👑 HEADS (1.96x)
            </button>
            <button
              onClick={() => setBetSide('tails')}
              disabled={isFlipping}
              className={`px-4 py-2 rounded-xl font-bold text-xs border ${
                betSide === 'tails'
                  ? 'bg-casino-gold text-black border-casino-gold shadow-glow-gold'
                  : 'bg-slate-900 border-slate-800 text-slate-400'
              }`}
            >
              🦅 TAILS (1.96x)
            </button>
          </div>

          <div className="flex gap-1">
            {[20, 50, 100, 250].map((amt) => (
              <button
                key={amt}
                onClick={() => {
                  soundManager.playChipSound();
                  setBetAmount(amt);
                }}
                disabled={isFlipping || streak > 0}
                className={`px-2.5 py-2 rounded-xl font-mono-numbers font-bold text-xs border ${
                  betAmount === amt
                    ? 'bg-casino-gold text-black border-casino-gold'
                    : 'bg-slate-900 border-slate-800 text-slate-400'
                }`}
              >
                {amt}
              </button>
            ))}
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
          {streak > 0 && (
            <button
              onClick={handleCashOut}
              className="px-6 py-3.5 rounded-2xl bg-gold-gradient text-black font-black text-sm tracking-wider shadow-glow-gold hover:brightness-110 active:scale-95 transition-all"
            >
              CASH OUT ({formatCurrency(Math.floor(betAmount * currentMultiplier), currencyMode)})
            </button>
          )}

          <button
            onClick={handleFlip}
            disabled={isFlipping || (streak === 0 && getActiveBalance() < betAmount)}
            className="flex-1 sm:flex-none px-8 py-3.5 rounded-2xl bg-emerald-gradient text-white font-black text-sm tracking-wider flex items-center justify-center gap-2 shadow-glow-emerald hover:brightness-110 active:scale-95 transition-all disabled:opacity-40"
          >
            <Play className="w-4 h-4 fill-white" />
            <span>{isFlipping ? 'FLIPPING...' : streak > 0 ? 'FLIP AGAIN (2x)' : `FLIP (${formatCurrency(betAmount, currencyMode)})`}</span>
          </button>
        </div>
      </div>
    </div>
  );
};
