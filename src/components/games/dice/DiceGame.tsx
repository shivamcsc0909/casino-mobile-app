import React, { useState } from 'react';
import { Play, Dices } from 'lucide-react';
import { useWalletStore } from '../../../stores/useWalletStore';
import { useUserStore } from '../../../stores/useUserStore';
import { soundManager } from '../../../lib/audio';
import { triggerHaptic } from '../../../lib/haptics';
import { formatCurrency, triggerConfetti } from '../../../lib/utils';

export const DiceGame: React.FC = () => {
  const { currencyMode, placeBet, addWin, getActiveBalance } = useWalletStore();
  const { addVipPoints } = useUserStore();

  const [betAmount, setBetAmount] = useState<number>(50);
  const [winChance, setWinChance] = useState<number>(50);
  const [isRolling, setIsRolling] = useState<boolean>(false);
  const [rollResult, setRollResult] = useState<number | null>(null);
  const [isWin, setIsWin] = useState<boolean | null>(null);

  // Multiplier formula: 98 / winChance
  const multiplier = Number((98 / winChance).toFixed(2));

  const handleRoll = () => {
    const balance = getActiveBalance();
    if (balance < betAmount) return;

    const ok = placeBet(betAmount, 'Dice Over/Under');
    if (!ok) return;

    soundManager.playWheelTick();
    triggerHaptic('medium');
    addVipPoints(Math.floor(betAmount / 10));

    setIsRolling(true);
    setRollResult(null);
    setIsWin(null);

    // Suspense tick loop
    let tickCount = 0;
    const interval = setInterval(() => {
      soundManager.playWheelTick();
      tickCount++;
      if (tickCount >= 5) {
        clearInterval(interval);
        const result = Number((Math.random() * 99.99).toFixed(2));
        setRollResult(result);
        setIsRolling(false);

        const win = result < winChance;
        setIsWin(win);

        if (win) {
          const payout = Math.floor(betAmount * multiplier);
          addWin(payout, 'Dice Win');
          soundManager.playWinChime();
          triggerConfetti();
          triggerHaptic('success');
        } else {
          soundManager.playCrashSound();
          triggerHaptic('warning');
        }
      }
    }, 100);
  };

  return (
    <div className="p-3 sm:p-6 max-w-4xl mx-auto space-y-4 select-none animate-fade-in">
      <div className="p-8 rounded-3xl bg-gradient-to-b from-[#141224] via-[#101524] to-[#0A0D14] border-2 border-casino-gold/50 shadow-glow-gold flex flex-col items-center">
        <div className="flex items-center gap-2 mb-6">
          <Dices className="w-5 h-5 text-indigo-400" />
          <h2 className="text-xl font-black text-white font-display uppercase tracking-widest">
            DICE OVER / UNDER
          </h2>
        </div>

        {/* Big Roll Number Display */}
        <div className="my-4 text-center">
          <div className="text-6xl sm:text-7xl font-black font-mono-numbers text-white drop-shadow-[0_0_30px_rgba(255,255,255,0.2)]">
            {isRolling ? '...' : rollResult !== null ? rollResult.toFixed(2) : '50.00'}
          </div>
          {isWin !== null && (
            <div className={`mt-2 font-black text-sm uppercase ${isWin ? 'text-emerald-400' : 'text-red-400'}`}>
              {isWin ? `🎉 WIN! Under ${winChance}%` : `BUST! Over ${winChance}%`}
            </div>
          )}
        </div>

        {/* Win Chance Slider */}
        <div className="w-full max-w-md my-4 space-y-2">
          <div className="flex justify-between text-xs font-bold text-slate-300">
            <span>Win Zone: 0 - {winChance}%</span>
            <span className="text-emerald-400 font-mono-numbers">Multiplier: {multiplier}x</span>
          </div>
          <input
            type="range"
            min={5}
            max={95}
            value={winChance}
            onChange={(e) => setWinChance(Number(e.target.value))}
            disabled={isRolling}
            className="w-full accent-casino-gold h-2 rounded-lg bg-slate-800 cursor-pointer"
          />
        </div>
      </div>

      {/* Control Console */}
      <div className="p-4 rounded-3xl bg-casino-card border border-casino-border flex flex-col sm:flex-row items-center justify-between gap-3">
        {/* Bet Chips */}
        <div className="flex items-center gap-2 w-full sm:w-auto">
          {[20, 50, 100, 250, 500].map((amt) => (
            <button
              key={amt}
              onClick={() => {
                soundManager.playChipSound();
                setBetAmount(amt);
              }}
              disabled={isRolling}
              className={`px-3 py-1.5 rounded-xl font-mono-numbers font-bold text-xs border ${
                betAmount === amt
                  ? 'bg-casino-gold text-black border-casino-gold shadow-glow-gold'
                  : 'bg-slate-900 border-slate-800 text-slate-400'
              }`}
            >
              {amt}
            </button>
          ))}
        </div>

        {/* Roll Action */}
        <button
          onClick={handleRoll}
          disabled={isRolling || getActiveBalance() < betAmount}
          className="w-full sm:w-auto px-8 py-3.5 rounded-2xl bg-gold-gradient text-black font-black text-sm tracking-wider flex items-center justify-center gap-2 shadow-glow-gold hover:brightness-110 active:scale-95 transition-all disabled:opacity-40"
        >
          <Play className="w-4 h-4 fill-black" />
          <span>{isRolling ? 'ROLLING...' : `ROLL DICE (${formatCurrency(betAmount, currencyMode)})`}</span>
        </button>
      </div>
    </div>
  );
};
