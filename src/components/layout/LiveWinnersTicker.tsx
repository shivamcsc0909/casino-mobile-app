import React, { useState, useEffect } from 'react';
import { Flame } from 'lucide-react';
import { generateInitialWinners, BOT_NAMES } from '../../lib/botSimulator';
import type { LiveWinner } from '../../lib/botSimulator';
import { formatCurrency } from '../../lib/utils';

export const LiveWinnersTicker: React.FC = () => {
  const [winners, setWinners] = useState<LiveWinner[]>(generateInitialWinners);

  useEffect(() => {
    const games = ['Aviator', 'European Roulette', 'Teen Patti', 'Neon Slots'];
    const interval = setInterval(() => {
      const name = BOT_NAMES[Math.floor(Math.random() * BOT_NAMES.length)];
      const game = games[Math.floor(Math.random() * games.length)];
      const amount = Math.floor(Math.random() * 25000) + 800;
      const mult = (1.4 + Math.random() * 15).toFixed(2);

      const newWinner: LiveWinner = {
        id: `win_dyn_${Date.now()}`,
        user: name,
        game,
        amount,
        multiplier: `${mult}x`,
        avatar: `https://api.dicebear.com/7.x/bottts/svg?seed=${name}`,
        time: 'Just now'
      };

      setWinners((prev) => [newWinner, ...prev.slice(0, 11)]);
    }, 4500);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="w-full bg-[#080A0F] border-b border-casino-border/50 py-1.5 px-3 overflow-hidden">
      <div className="max-w-7xl mx-auto flex items-center gap-3">
        <div className="flex items-center gap-1 text-[11px] font-black uppercase text-casino-gold shrink-0 pl-1">
          <Flame className="w-3.5 h-3.5 text-amber-500 fill-amber-500 animate-pulse" />
          <span className="hidden sm:inline">LIVE CASINO</span> WINS:
        </div>

        {/* Horizontal Marquee / Scroll */}
        <div className="flex items-center gap-3 overflow-x-auto no-scrollbar scroll-smooth whitespace-nowrap">
          {winners.map((w) => (
            <div
              key={w.id}
              className="inline-flex items-center gap-2 px-2.5 py-1 rounded-xl bg-casino-card/90 border border-casino-border text-xs shrink-0"
            >
              <img src={w.avatar} alt={w.user} className="w-4 h-4 rounded-full bg-slate-800" />
              <span className="font-semibold text-slate-300 text-[11px]">{w.user}</span>
              <span className="text-[10px] text-slate-400 font-medium">on {w.game}</span>
              <span className="font-bold font-mono-numbers text-emerald-400 text-[11px]">
                {formatCurrency(w.amount, 'real')}
              </span>
              <span className="text-[10px] font-bold px-1.5 py-0.2 rounded bg-casino-gold/15 text-casino-gold font-mono-numbers">
                {w.multiplier}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
