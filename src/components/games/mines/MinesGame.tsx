import React, { useState } from 'react';
import { Play } from 'lucide-react';
import { useWalletStore } from '../../../stores/useWalletStore';
import { useUserStore } from '../../../stores/useUserStore';
import { soundManager } from '../../../lib/audio';
import { triggerHaptic } from '../../../lib/haptics';
import { formatCurrency, triggerConfetti } from '../../../lib/utils';

export const MinesGame: React.FC = () => {
  const { currencyMode, placeBet, addWin, getActiveBalance } = useWalletStore();
  const { addVipPoints } = useUserStore();

  const [betAmount, setBetAmount] = useState<number>(100);
  const [mineCount, setMineCount] = useState<number>(3);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [grid, setGrid] = useState<{ isMine: boolean; revealed: boolean }[]>(
    Array(25).fill({ isMine: false, revealed: false })
  );
  const [gemsFound, setGemsFound] = useState<number>(0);
  const [isGameOver, setIsGameOver] = useState<boolean>(false);
  const [lastWin, setLastWin] = useState<number | null>(null);

  // Multiplier formula based on mines and gems found
  const getMultiplier = (gems: number) => {
    if (gems === 0) return 1.0;
    let mult = 1.0;
    for (let i = 0; i < gems; i++) {
      mult *= (25 - i) / (25 - mineCount - i);
    }
    return Number((mult * 0.98).toFixed(2)); // 2% house edge
  };

  const handleStartGame = () => {
    const balance = getActiveBalance();
    if (balance < betAmount) return;

    const ok = placeBet(betAmount, 'Mines');
    if (!ok) return;

    soundManager.playChipSound();
    triggerHaptic('medium');
    addVipPoints(Math.floor(betAmount / 10));

    // Place mines randomly
    const newGrid = Array(25).fill(null).map(() => ({ isMine: false, revealed: false }));
    let placed = 0;
    while (placed < mineCount) {
      const idx = Math.floor(Math.random() * 25);
      if (!newGrid[idx].isMine) {
        newGrid[idx].isMine = true;
        placed++;
      }
    }

    setGrid(newGrid);
    setIsPlaying(true);
    setIsGameOver(false);
    setGemsFound(0);
    setLastWin(null);
  };

  const handleTileClick = (index: number) => {
    if (!isPlaying || grid[index].revealed || isGameOver) return;

    const tile = grid[index];

    if (tile.isMine) {
      // Hit a mine!
      soundManager.playCrashSound();
      triggerHaptic('warning');
      // Reveal all tiles
      setGrid((prev) => prev.map((t) => ({ ...t, revealed: true })));
      setIsGameOver(true);
      setIsPlaying(false);
    } else {
      // Uncovered a diamond!
      soundManager.playChipSound();
      triggerHaptic('light');

      const nextGems = gemsFound + 1;
      setGemsFound(nextGems);

      setGrid((prev) =>
        prev.map((t, i) => (i === index ? { ...t, revealed: true } : t))
      );

      // Check if all safe tiles cleared
      if (nextGems === 25 - mineCount) {
        handleCashOut(nextGems);
      }
    }
  };

  const handleCashOut = (gems = gemsFound) => {
    if (!isPlaying || gems === 0) return;

    const mult = getMultiplier(gems);
    const winAmt = Math.floor(betAmount * mult);

    addWin(winAmt, 'Mines (Cash Out)');
    setLastWin(winAmt);
    setIsPlaying(false);
    setIsGameOver(true);

    soundManager.playCashOut();
    triggerConfetti();
    triggerHaptic('success');

    // Reveal rest of grid
    setGrid((prev) => prev.map((t) => ({ ...t, revealed: true })));
  };

  const currentMultiplier = getMultiplier(gemsFound);

  return (
    <div className="p-2 sm:p-4 max-w-4xl mx-auto space-y-3 select-none animate-fade-in pb-12">
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 items-center">
        {/* Controls Sidebar */}
        <div className="p-3 sm:p-5 rounded-3xl bg-casino-card border border-casino-border space-y-3">
          <div>
            <span className="text-[10px] uppercase font-bold text-casino-gold tracking-widest block">
              DIAMOND GRID
            </span>
            <h2 className="text-xl sm:text-2xl font-black text-white font-display">Mines 5x5</h2>
          </div>

          {/* Bet Amount */}
          <div>
            <label className="text-xs font-bold text-slate-400 uppercase tracking-wider block mb-1">
              Bet Amount
            </label>
            <div className="grid grid-cols-4 gap-1 mb-1.5">
              {[50, 100, 200, 500].map((amt) => (
                <button
                  key={amt}
                  onClick={() => {
                    soundManager.playChipSound();
                    setBetAmount(amt);
                  }}
                  disabled={isPlaying}
                  className={`py-1 rounded-xl font-mono-numbers font-bold text-xs border ${
                    betAmount === amt
                      ? 'bg-casino-gold text-black border-casino-gold'
                      : 'bg-slate-900 border-slate-800 text-slate-400'
                  }`}
                >
                  {amt}
                </button>
              ))}
            </div>

            {/* Quick Multipliers: 1/2, 2X, MAX (inspired by web3 casino) */}
            <div className="flex gap-1 mb-2">
              <button
                type="button"
                onClick={() => {
                  soundManager.playChipSound();
                  setBetAmount((b) => Math.max(20, Math.floor(b / 2)));
                }}
                disabled={isPlaying}
                className="flex-1 py-1 rounded-lg bg-slate-900 hover:bg-slate-800 border border-slate-800 text-[10px] font-bold text-slate-300"
              >
                1/2
              </button>
              <button
                type="button"
                onClick={() => {
                  soundManager.playChipSound();
                  setBetAmount((b) => Math.min(getActiveBalance(), b * 2));
                }}
                disabled={isPlaying}
                className="flex-1 py-1 rounded-lg bg-slate-900 hover:bg-slate-800 border border-slate-800 text-[10px] font-bold text-slate-300"
              >
                2X
              </button>
              <button
                type="button"
                onClick={() => {
                  soundManager.playChipSound();
                  setBetAmount(Math.min(5000, getActiveBalance()));
                }}
                disabled={isPlaying}
                className="flex-1 py-1 rounded-lg bg-casino-gold/15 hover:bg-casino-gold/25 border border-casino-gold/30 text-[10px] font-black text-casino-gold"
              >
                MAX
              </button>
            </div>
          </div>

          {/* Mines Count Selector */}
          <div>
            <label className="text-xs font-bold text-slate-400 uppercase tracking-wider block mb-1">
              Mines Count: <span className="text-red-400 font-mono-numbers">{mineCount}</span>
            </label>
            <div className="flex gap-1">
              {[1, 3, 5, 10].map((cnt) => (
                <button
                  key={cnt}
                  onClick={() => {
                    soundManager.playButtonTap();
                    setMineCount(cnt);
                  }}
                  disabled={isPlaying}
                  className={`flex-1 py-1 rounded-xl text-xs font-bold border ${
                    mineCount === cnt
                      ? 'bg-red-500/20 text-red-300 border-red-500/50'
                      : 'bg-slate-900 border-slate-800 text-slate-400'
                  }`}
                >
                  {cnt} 💣
                </button>
              ))}
            </div>
          </div>

          {/* Action Button */}
          {isPlaying ? (
            <button
              onClick={() => handleCashOut()}
              disabled={gemsFound === 0}
              className="w-full py-3 rounded-2xl bg-gold-gradient text-black font-black text-sm tracking-wider flex items-center justify-center gap-2 shadow-glow-gold hover:brightness-110 active:scale-95 transition-all disabled:opacity-40"
            >
              <span>CASH OUT ({currentMultiplier}x)</span>
            </button>
          ) : (
            <button
              onClick={handleStartGame}
              disabled={getActiveBalance() < betAmount}
              className="w-full py-3 rounded-2xl bg-emerald-gradient text-white font-black text-sm tracking-wider flex items-center justify-center gap-2 shadow-glow-emerald hover:brightness-110 active:scale-95 transition-all disabled:opacity-40"
            >
              <Play className="w-4 h-4 fill-white" />
              <span>START GAME</span>
            </button>
          )}

          {/* Win toast */}
          {lastWin !== null && (
            <div className="p-2.5 rounded-2xl bg-emerald-500/20 border border-emerald-500/40 text-emerald-400 font-mono-numbers font-extrabold text-center text-xs">
              +{formatCurrency(lastWin, currencyMode)} WON!
            </div>
          )}
        </div>

        {/* 5x5 Minefield Grid */}
        <div className="sm:col-span-2 p-3 sm:p-5 rounded-3xl bg-[#0B0E14] border-2 border-casino-border flex items-center justify-center shadow-inner">
          <div className="grid grid-cols-5 gap-1.5 sm:gap-2.5 w-full max-w-[320px] sm:max-w-[380px]">
            {grid.map((tile, i) => (
              <button
                key={i}
                onClick={() => handleTileClick(i)}
                disabled={!isPlaying || tile.revealed}
                className={`h-11 sm:h-13 rounded-2xl font-bold flex items-center justify-center text-xl sm:text-2xl transition-all duration-200 active:scale-90 ${
                  tile.revealed
                    ? tile.isMine
                      ? 'bg-red-950 border border-red-500 shadow-glow-danger'
                      : 'bg-emerald-950 border border-emerald-500 shadow-glow-emerald'
                    : 'bg-[#151C2C] hover:bg-[#1E273D] border border-slate-700/60 shadow-md'
                }`}
              >
                {tile.revealed ? (
                  tile.isMine ? (
                    <span className="animate-bounce-subtle text-red-400 drop-shadow-[0_0_12px_rgba(239,68,68,0.9)]">💣</span>
                  ) : (
                    <span className="animate-scale-in text-emerald-300 drop-shadow-[0_0_15px_rgba(16,185,129,0.9)] scale-110">💎</span>
                  )
                ) : (
                  <span className="w-2 h-2 rounded-full bg-slate-700/50" />
                )}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
