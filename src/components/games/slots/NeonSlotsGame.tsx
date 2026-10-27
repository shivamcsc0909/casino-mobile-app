import React, { useState, useEffect, useRef } from 'react';
import { Sparkles, Zap, RotateCcw, HelpCircle, Trophy, Play } from 'lucide-react';
import { useWalletStore } from '../../../stores/useWalletStore';
import { useUserStore } from '../../../stores/useUserStore';
import { soundManager } from '../../../lib/audio';
import { formatCurrency, triggerBigWinConfetti, triggerConfetti } from '../../../lib/utils';
import { SYMBOLS, PAYLINES, getRandomSymbol } from './SlotSymbols';
import type { SlotSymbol } from './SlotSymbols';
import { CelebrationModal } from '../../common/CelebrationModal';

export const NeonSlotsGame: React.FC = () => {
  const { currencyMode, placeBet, addWin, getActiveBalance } = useWalletStore();
  const { addVipPoints } = useUserStore();

  const [betPerLine, setBetPerLine] = useState<number>(20);
  const totalBet = betPerLine * 5; // 5 lines fixed

  // 3x3 Grid: grid[col][row]
  const [grid, setGrid] = useState<SlotSymbol[][]>([
    [SYMBOLS[0], SYMBOLS[1], SYMBOLS[2]],
    [SYMBOLS[3], SYMBOLS[0], SYMBOLS[4]],
    [SYMBOLS[5], SYMBOLS[6], SYMBOLS[1]],
  ]);

  const [isSpinning, setIsSpinning] = useState<boolean>(false);
  const [turboMode, setTurboMode] = useState<boolean>(false);
  const [autoSpinCount, setAutoSpinCount] = useState<number>(0);
  const [winningLineIds, setWinningLineIds] = useState<number[]>([]);
  const [lastWin, setLastWin] = useState<number | null>(null);
  const [showCelebration, setShowCelebration] = useState<boolean>(false);
  const [celebrationAmount, setCelebrationAmount] = useState<number>(0);
  const [showPaytable, setShowPaytable] = useState<boolean>(false);

  const autoSpinRef = useRef(autoSpinCount);
  autoSpinRef.current = autoSpinCount;

  // Spin Reels function
  const handleSpin = () => {
    if (isSpinning) return;
    const currentBalance = getActiveBalance();
    if (currentBalance < totalBet) {
      setAutoSpinCount(0);
      return;
    }

    const ok = placeBet(totalBet, 'Neon Slots 777');
    if (!ok) {
      setAutoSpinCount(0);
      return;
    }

    addVipPoints(Math.floor(totalBet / 5));
    setIsSpinning(true);
    setWinningLineIds([]);
    setLastWin(null);

    soundManager.playReelTick();

    const duration = turboMode ? 400 : 1300;

    // Simulate reel rotation ticks
    const tickInterval = setInterval(() => {
      soundManager.playReelTick();
    }, turboMode ? 80 : 140);

    setTimeout(() => {
      clearInterval(tickInterval);

      // Generate random final grid: 3 columns of 3 symbols
      const newGrid: SlotSymbol[][] = [
        [getRandomSymbol(), getRandomSymbol(), getRandomSymbol()],
        [getRandomSymbol(), getRandomSymbol(), getRandomSymbol()],
        [getRandomSymbol(), getRandomSymbol(), getRandomSymbol()],
      ];

      setGrid(newGrid);
      setIsSpinning(false);

      // Evaluate 5 paylines
      let totalPayout = 0;
      const hitLines: number[] = [];

      PAYLINES.forEach((line) => {
        const s1 = newGrid[0][line.indices[0]];
        const s2 = newGrid[1][line.indices[1]];
        const s3 = newGrid[2][line.indices[2]];

        // Match 3 or with Wilds
        const isMatch =
          (s1.id === s2.id || s1.isWild || s2.isWild) &&
          (s2.id === s3.id || s2.isWild || s3.isWild) &&
          (s1.id === s3.id || s1.isWild || s3.isWild);

        if (isMatch) {
          // Determine winning symbol
          const mainSymbol = !s1.isWild ? s1 : !s2.isWild ? s2 : s3;
          const payout = betPerLine * mainSymbol.multiplier;
          totalPayout += payout;
          hitLines.push(line.id);
        }
      });

      setWinningLineIds(hitLines);

      if (totalPayout > 0) {
        addWin(totalPayout, 'Neon Slots 777');
        setLastWin(totalPayout);

        // Check if Mega Win (20x or higher)
        if (totalPayout >= totalBet * 15) {
          setCelebrationAmount(totalPayout);
          setShowCelebration(true);
          soundManager.playJackpotFanfare();
          triggerBigWinConfetti();
        } else {
          soundManager.playWinChime();
          triggerConfetti();
        }
      }

      // Check auto-spin continuation
      if (autoSpinRef.current > 0) {
        setAutoSpinCount((prev) => prev - 1);
      }
    }, duration);
  };

  // Auto spin trigger
  useEffect(() => {
    if (autoSpinCount > 0 && !isSpinning) {
      const timer = setTimeout(() => {
        handleSpin();
      }, turboMode ? 350 : 800);
      return () => clearTimeout(timer);
    }
  }, [autoSpinCount, isSpinning]);

  const toggleAutoSpin = (spins: number) => {
    soundManager.playButtonTap();
    if (autoSpinCount > 0) {
      setAutoSpinCount(0);
    } else {
      setAutoSpinCount(spins);
    }
  };

  return (
    <div className="p-3 sm:p-6 max-w-4xl mx-auto space-y-4">
      {/* Top Banner & Paytable Button */}
      <div className="flex items-center justify-between p-3.5 rounded-2xl bg-casino-card border border-casino-border">
        <div className="flex items-center gap-2">
          <div className="p-2 rounded-xl bg-purple-500/20 text-purple-400 border border-purple-500/30">
            <Sparkles className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-xl font-black text-white font-display">Neon Slots 777</h2>
            <span className="text-[10px] text-casino-gold font-bold uppercase tracking-widest">
              5 Fixed Paylines • 50x Wild Multiplier
            </span>
          </div>
        </div>

        <button
          onClick={() => {
            soundManager.playButtonTap();
            setShowPaytable(!showPaytable);
          }}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-bold transition-all border border-slate-700"
        >
          <HelpCircle className="w-4 h-4 text-casino-gold" />
          <span>Paytable</span>
        </button>
      </div>

      {/* Paytable Drawer if toggled */}
      {showPaytable && (
        <div className="p-4 rounded-2xl bg-[#0F1420] border border-casino-gold/40 shadow-glow-gold animate-fade-in">
          <div className="text-xs uppercase font-extrabold text-casino-gold tracking-widest mb-2">
            Symbol Payout Multipliers (3 of a kind)
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
            {SYMBOLS.map((s) => (
              <div
                key={s.id}
                className="flex items-center gap-2 p-2 rounded-xl bg-slate-900 border border-slate-800"
              >
                <span className="text-2xl">{s.icon}</span>
                <div>
                  <div className="text-xs font-bold text-white">{s.name}</div>
                  <div className="text-[11px] font-extrabold text-emerald-400 font-mono-numbers">
                    {s.multiplier}x Bet
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 3x3 Neon Reels Machine */}
      <div className="relative p-6 sm:p-8 rounded-3xl bg-gradient-to-b from-[#141A29] via-[#0E121C] to-[#0A0D14] border-2 border-purple-500/40 shadow-[0_0_40px_rgba(139,92,246,0.25)] flex flex-col items-center">
        {/* Neon Glow Header */}
        <div className="flex items-center gap-2 mb-4 px-4 py-1 rounded-full bg-purple-500/10 border border-purple-500/30">
          <span className="w-2 h-2 rounded-full bg-purple-400 animate-ping" />
          <span className="text-xs font-black uppercase tracking-widest text-purple-300">
            JACKPOT 777 DELUXE
          </span>
        </div>

        {/* 3 Columns of Reels */}
        <div className="grid grid-cols-3 gap-2 sm:gap-4 w-full max-w-md bg-[#080B10] p-4 rounded-2xl border border-slate-800 shadow-inner">
          {[0, 1, 2].map((colIdx) => (
            <div
              key={colIdx}
              className={`flex flex-col gap-2 rounded-xl bg-slate-900/80 p-2 border border-slate-800 transition-all ${
                isSpinning ? 'blur-[1px] opacity-80' : ''
              }`}
            >
              {[0, 1, 2].map((rowIdx) => {
                const symbol = grid[colIdx][rowIdx];
                const isHit = winningLineIds.length > 0;
                return (
                  <div
                    key={rowIdx}
                    className={`h-20 sm:h-24 rounded-xl flex flex-col items-center justify-center transition-all ${
                      isHit
                        ? 'bg-gradient-to-b from-casino-gold/20 to-purple-500/20 border border-casino-gold shadow-glow-gold'
                        : 'bg-[#121622] border border-slate-800/80'
                    }`}
                  >
                    <span className="text-3xl sm:text-4xl drop-shadow-md select-none transform transition-transform duration-200 hover:scale-110">
                      {symbol.icon}
                    </span>
                  </div>
                );
              })}
            </div>
          ))}
        </div>

        {/* Win Notification Banner */}
        {lastWin !== null && (
          <div className="mt-4 px-6 py-2 rounded-full bg-emerald-500/20 border border-emerald-500/50 text-emerald-400 font-extrabold font-mono-numbers text-base sm:text-lg flex items-center gap-2 shadow-glow-emerald animate-bounce-subtle">
            <Trophy className="w-5 h-5 text-casino-gold" />
            <span>WIN: +{formatCurrency(lastWin, currencyMode)}</span>
          </div>
        )}
      </div>

      {/* Control Console */}
      <div className="p-4 rounded-3xl bg-casino-card border border-casino-border space-y-4">
        {/* Bet per line selector */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="w-full sm:w-auto">
            <label className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
              Line Bet (5 Fixed Lines)
            </label>
            <div className="flex items-center gap-1.5">
              {[10, 20, 50, 100, 200].map((amt) => (
                <button
                  key={amt}
                  onClick={() => {
                    soundManager.playChipSound();
                    setBetPerLine(amt);
                  }}
                  disabled={isSpinning}
                  className={`px-3 py-1.5 rounded-xl font-mono-numbers font-bold text-xs border transition-all ${
                    betPerLine === amt
                      ? 'bg-casino-gold text-black border-casino-gold shadow-glow-gold'
                      : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-white'
                  }`}
                >
                  {amt}
                </button>
              ))}
            </div>
          </div>

          {/* Turbo & Auto-spin Toggles */}
          <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
            <button
              onClick={() => {
                soundManager.playButtonTap();
                setTurboMode(!turboMode);
              }}
              className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold border transition-all ${
                turboMode
                  ? 'bg-amber-500/20 text-amber-300 border-amber-500/40 shadow-glow-gold'
                  : 'bg-slate-900 border-slate-800 text-slate-400'
              }`}
            >
              <Zap className="w-3.5 h-3.5" />
              <span>Turbo</span>
            </button>

            <button
              onClick={() => toggleAutoSpin(25)}
              className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold border transition-all ${
                autoSpinCount > 0
                  ? 'bg-purple-500/20 text-purple-300 border-purple-500/40 shadow-glow-purple'
                  : 'bg-slate-900 border-slate-800 text-slate-400'
              }`}
            >
              <RotateCcw className={`w-3.5 h-3.5 ${autoSpinCount > 0 ? 'animate-spin' : ''}`} />
              <span>Auto ({autoSpinCount > 0 ? autoSpinCount : '25'})</span>
            </button>
          </div>
        </div>

        {/* Big SPIN Action Button */}
        <button
          onClick={handleSpin}
          disabled={isSpinning || getActiveBalance() < totalBet}
          className="w-full py-4 rounded-2xl bg-gold-gradient text-black font-black text-base sm:text-lg tracking-wider flex items-center justify-center gap-2 shadow-glow-gold hover:brightness-110 active:scale-95 transition-all disabled:opacity-40"
        >
          <Play className="w-5 h-5 fill-black" />
          <span>
            {isSpinning
              ? 'SPINNING...'
              : `SPIN REELS (${formatCurrency(totalBet, currencyMode)})`}
          </span>
        </button>
      </div>

      {/* Mega Win Celebration Modal */}
      <CelebrationModal
        isOpen={showCelebration}
        amount={celebrationAmount}
        currencyMode={currencyMode}
        title="JACKPOT BIG WIN!"
        subtitle="Unbelievable match! Your winnings have been credited."
        onClose={() => setShowCelebration(false)}
      />
    </div>
  );
};
