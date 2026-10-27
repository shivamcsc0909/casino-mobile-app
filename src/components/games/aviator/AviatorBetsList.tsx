import React from 'react';
import { Users } from 'lucide-react';
import { formatCurrency } from '../../../lib/utils';

export interface PlayerBet {
  id: string;
  name: string;
  avatar: string;
  betAmount: number;
  cashoutMult: number | null; // null if still in flight or busted
  targetCashout: number;
  isCashedOut: boolean;
  isBusted: boolean;
}

interface AviatorBetsListProps {
  bets: PlayerBet[];
  currentMultiplier: number;
}

export const AviatorBetsList: React.FC<AviatorBetsListProps> = ({ bets }) => {
  return (
    <div className="flex flex-col h-full bg-[#111622] rounded-2xl border border-casino-border overflow-hidden">
      <div className="flex items-center justify-between px-3 py-2.5 bg-[#0B0E14] border-b border-casino-border text-xs font-bold text-slate-300">
        <div className="flex items-center gap-1.5">
          <Users className="w-4 h-4 text-casino-gold" />
          <span>All Bets ({bets.length})</span>
        </div>
        <span className="text-[10px] text-slate-400">Total: {formatCurrency(bets.reduce((acc, b) => acc + b.betAmount, 0), 'demo')}</span>
      </div>

      <div className="divide-y divide-slate-800/60 overflow-y-auto max-h-[380px] p-1">
        {bets.map((b) => (
          <div
            key={b.id}
            className={`flex items-center justify-between px-2.5 py-1.5 rounded-lg text-xs transition-colors ${
              b.isCashedOut
                ? 'bg-emerald-500/10 text-emerald-300'
                : b.isBusted
                ? 'opacity-40 text-slate-500'
                : 'text-slate-300'
            }`}
          >
            <div className="flex items-center gap-2">
              <img src={b.avatar} alt={b.name} className="w-5 h-5 rounded-full bg-slate-800" />
              <span className="font-semibold text-[11px] truncate max-w-[90px]">{b.name}</span>
            </div>

            <div className="flex items-center gap-3">
              <span className="font-mono-numbers text-[11px] text-slate-400">
                {b.betAmount}
              </span>

              {b.isCashedOut ? (
                <span className="px-1.5 py-0.5 rounded bg-emerald-500/20 text-emerald-400 font-mono-numbers font-bold text-[10px]">
                  {b.cashoutMult?.toFixed(2)}x
                </span>
              ) : b.isBusted ? (
                <span className="text-[10px] text-red-400 uppercase font-mono">Bust</span>
              ) : (
                <span className="w-2 h-2 rounded-full bg-amber-400 animate-ping" />
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
