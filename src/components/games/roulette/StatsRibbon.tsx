import React from 'react';
import { Flame, Snowflake } from 'lucide-react';

interface StatsRibbonProps {
  recentNumbers: number[];
}

export const RED_NUMBERS = [1, 3, 5, 7, 9, 12, 14, 16, 18, 19, 21, 23, 25, 27, 30, 32, 34, 36];

export const StatsRibbon: React.FC<StatsRibbonProps> = ({ recentNumbers }) => {
  const getNumberColor = (num: number) => {
    if (num === 0) return 'bg-emerald-600 text-white';
    if (RED_NUMBERS.includes(num)) return 'bg-red-600 text-white';
    return 'bg-slate-900 text-white border border-slate-700';
  };

  const hotNumbers = [7, 17, 24, 32];
  const coldNumbers = [0, 4, 15, 28];

  return (
    <div className="flex flex-col sm:flex-row items-center justify-between gap-3 p-3 rounded-2xl bg-casino-card border border-casino-border">
      {/* Recent Winning Numbers Ribbon */}
      <div className="flex items-center gap-2 overflow-x-auto w-full sm:w-auto pb-1 sm:pb-0">
        <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider shrink-0">
          Last Spins:
        </span>
        {recentNumbers.slice(0, 10).map((num, i) => (
          <div
            key={i}
            className={`w-7 h-7 rounded-full flex items-center justify-center font-mono-numbers text-xs font-bold shrink-0 shadow-sm ${getNumberColor(
              num
            )}`}
          >
            {num}
          </div>
        ))}
      </div>

      {/* Hot & Cold stats */}
      <div className="flex items-center gap-4 text-xs font-bold">
        <div className="flex items-center gap-1.5 text-amber-400">
          <Flame className="w-4 h-4 fill-amber-400" />
          <span className="text-[10px] text-slate-400 uppercase">Hot:</span>
          {hotNumbers.map((n) => (
            <span key={n} className="font-mono-numbers">{n}</span>
          ))}
        </div>
        <div className="flex items-center gap-1.5 text-cyan-400">
          <Snowflake className="w-4 h-4" />
          <span className="text-[10px] text-slate-400 uppercase">Cold:</span>
          {coldNumbers.map((n) => (
            <span key={n} className="font-mono-numbers">{n}</span>
          ))}
        </div>
      </div>
    </div>
  );
};
