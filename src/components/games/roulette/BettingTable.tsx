import React from 'react';
import { RED_NUMBERS } from './StatsRibbon';
import { soundManager } from '../../../lib/audio';

export interface RouletteBet {
  type: string;
  target: string | number;
  amount: number;
}

interface BettingTableProps {
  bets: RouletteBet[];
  onPlaceBet: (bet: { type: string; target: string | number }) => void;
  disabled: boolean;
}

export const BettingTable: React.FC<BettingTableProps> = ({
  bets,
  onPlaceBet,
  disabled,
}) => {
  const getBetAmount = (type: string, target: string | number): number => {
    return bets
      .filter((b) => b.type === type && b.target === target)
      .reduce((sum, b) => sum + b.amount, 0);
  };

  const handleCellClick = (type: string, target: string | number) => {
    if (disabled) return;
    soundManager.playChipSound();
    onPlaceBet({ type, target });
  };

  // Rows for European roulette numbers (1-36)
  // Row 1: 3, 6, 9, 12, 15, 18, 21, 24, 27, 30, 33, 36
  // Row 2: 2, 5, 8, 11, 14, 17, 20, 23, 26, 29, 32, 35
  // Row 3: 1, 4, 7, 10, 13, 16, 19, 22, 25, 28, 31, 34
  const rows = [
    [3, 6, 9, 12, 15, 18, 21, 24, 27, 30, 33, 36],
    [2, 5, 8, 11, 14, 17, 20, 23, 26, 29, 32, 35],
    [1, 4, 7, 10, 13, 16, 19, 22, 25, 28, 31, 34],
  ];

  return (
    <div className="w-full select-none overflow-x-auto pb-2">
      <div className="min-w-[620px] bg-[#0E1522] p-3 rounded-2xl border-2 border-casino-border shadow-xl">
        {/* Main Grid: 0 on left, 3x12 numbers in middle, 2:1 column on right */}
        <div className="flex gap-1 mb-1">
          {/* 0 Pocket */}
          <button
            onClick={() => handleCellClick('straight', 0)}
            disabled={disabled}
            className="w-12 rounded-xl bg-emerald-700 hover:bg-emerald-600 text-white font-mono-numbers font-black text-sm flex flex-col items-center justify-center relative transition-all active:scale-95 disabled:opacity-50"
          >
            <span>0</span>
            {getBetAmount('straight', 0) > 0 && (
              <span className="absolute bottom-1 px-1 rounded-full bg-casino-gold text-black text-[9px] font-black shadow-glow-gold">
                {getBetAmount('straight', 0)}
              </span>
            )}
          </button>

          {/* 3 Rows of 12 columns */}
          <div className="flex-1 flex flex-col gap-1">
            {rows.map((row, rIdx) => (
              <div key={rIdx} className="flex gap-1">
                {row.map((num) => {
                  const isRed = RED_NUMBERS.includes(num);
                  const placed = getBetAmount('straight', num);
                  return (
                    <button
                      key={num}
                      onClick={() => handleCellClick('straight', num)}
                      disabled={disabled}
                      className={`flex-1 h-11 rounded-lg font-mono-numbers font-bold text-xs flex flex-col items-center justify-center relative transition-all active:scale-95 disabled:opacity-50 ${
                        isRed
                          ? 'bg-red-700 hover:bg-red-600 text-white'
                          : 'bg-slate-900 hover:bg-slate-800 text-white border border-slate-700/60'
                      }`}
                    >
                      <span>{num}</span>
                      {placed > 0 && (
                        <span className="absolute -top-1.5 -right-1 px-1 rounded-full bg-casino-gold text-black text-[8px] font-black shadow-glow-gold">
                          {placed}
                        </span>
                      )}
                    </button>
                  );
                })}
              </div>
            ))}
          </div>

          {/* 2:1 Columns */}
          <div className="w-12 flex flex-col gap-1">
            {[1, 2, 3].map((col) => {
              const placed = getBetAmount('column', col);
              return (
                <button
                  key={col}
                  onClick={() => handleCellClick('column', col)}
                  disabled={disabled}
                  className="flex-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-[11px] font-bold flex flex-col items-center justify-center relative transition-all active:scale-95 disabled:opacity-50 border border-slate-700"
                >
                  <span>2:1</span>
                  {placed > 0 && (
                    <span className="absolute -top-1 px-1 rounded-full bg-casino-gold text-black text-[8px] font-black">
                      {placed}
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* Dozens (1st 12, 2nd 12, 3rd 12) */}
        <div className="flex gap-1 ml-13 mb-1">
          {['1st 12', '2nd 12', '3rd 12'].map((dozen, idx) => {
            const placed = getBetAmount('dozen', idx + 1);
            return (
              <button
                key={dozen}
                onClick={() => handleCellClick('dozen', idx + 1)}
                disabled={disabled}
                className="flex-1 py-2 rounded-lg bg-[#151D2C] hover:bg-[#1D273B] text-slate-300 text-xs font-bold uppercase tracking-wider relative transition-all active:scale-95 disabled:opacity-50 border border-slate-700/80"
              >
                <span>{dozen}</span>
                {placed > 0 && (
                  <span className="ml-1.5 px-1.5 py-0.2 rounded-full bg-casino-gold text-black text-[9px] font-black">
                    {placed}
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {/* Outside Bets: 1-18, EVEN, RED, BLACK, ODD, 19-36 */}
        <div className="flex gap-1 ml-13">
          {[
            { label: '1 - 18', type: 'outside', target: 'low' },
            { label: 'EVEN', type: 'outside', target: 'even' },
            { label: 'RED', type: 'outside', target: 'red', color: 'bg-red-700 hover:bg-red-600' },
            { label: 'BLACK', type: 'outside', target: 'black', color: 'bg-black hover:bg-slate-900 border border-slate-700' },
            { label: 'ODD', type: 'outside', target: 'odd' },
            { label: '19 - 36', type: 'outside', target: 'high' },
          ].map((item) => {
            const placed = getBetAmount(item.type, item.target);
            return (
              <button
                key={item.label}
                onClick={() => handleCellClick(item.type, item.target)}
                disabled={disabled}
                className={`flex-1 py-2.5 rounded-lg text-xs font-bold uppercase tracking-wider text-white relative transition-all active:scale-95 disabled:opacity-50 ${
                  item.color || 'bg-[#151D2C] hover:bg-[#1D273B] border border-slate-700/80'
                }`}
              >
                <span>{item.label}</span>
                {placed > 0 && (
                  <span className="ml-1 px-1.5 py-0.2 rounded-full bg-casino-gold text-black text-[8px] font-black">
                    {placed}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};
