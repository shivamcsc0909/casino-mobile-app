import React, { useState } from 'react';
import { ALL_GAMES, CASINO_ZONES } from '../../data/gamesCatalogue';
import { Sparkles, HelpCircle } from 'lucide-react';
import { soundManager } from '../../lib/audio';
import { triggerHaptic } from '../../lib/haptics';

interface CasinoFloorProps {
  onSelectGameWithTutorial: (gameId: string) => void;
  onOpenWallet: () => void;
}

export const CasinoFloor: React.FC<CasinoFloorProps> = ({
  onSelectGameWithTutorial,
  onOpenWallet,
}) => {
  const [selectedZone, setSelectedZone] = useState<string>('all');

  const filteredGames = ALL_GAMES.filter((g) => {
    if (selectedZone === 'all') return true;
    return g.category === selectedZone;
  });

  return (
    <div className="p-3 sm:p-6 max-w-7xl mx-auto space-y-5 select-none animate-fade-in">
      {/* Storyline VIP Penthouse Welcome Header */}
      <div className="relative p-5 sm:p-6 rounded-3xl bg-gradient-to-r from-[#171306] via-[#221B0A] to-[#0E121B] border-2 border-casino-gold/40 shadow-glow-gold overflow-hidden">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4 relative z-10">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-casino-gold/15 border border-casino-gold/30 text-casino-gold text-[10px] font-black uppercase tracking-widest mb-1.5">
              <Sparkles className="w-3 h-3" />
              <span>THE HIGH-ROLLER ODYSSEY • CHAPTER 1</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-black text-white font-display">
              The Penthouse Vault
            </h2>
            <p className="text-xs text-slate-300 mt-0.5 max-w-xl">
              18 elite casino tables and machines await. Select any game to view its rules and master the floor.
            </p>
          </div>

          <button
            onClick={() => {
              soundManager.playButtonTap();
              triggerHaptic('light');
              onOpenWallet();
            }}
            className="px-4 py-2.5 rounded-2xl bg-casino-card hover:bg-casino-cardHover border border-casino-gold/50 text-casino-gold font-black text-xs uppercase tracking-wider shrink-0 transition-all active:scale-95"
          >
            Passbook & History →
          </button>
        </div>
      </div>

      {/* Zone Category Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 no-scrollbar">
        {CASINO_ZONES.map((zone) => (
          <button
            key={zone.id}
            onClick={() => {
              soundManager.playButtonTap();
              triggerHaptic('light');
              setSelectedZone(zone.id);
            }}
            className={`px-3.5 py-2 rounded-2xl text-xs font-bold whitespace-nowrap transition-all flex items-center gap-1.5 ${
              selectedZone === zone.id
                ? 'bg-casino-gold text-black shadow-glow-gold'
                : 'bg-casino-card hover:bg-casino-cardHover text-slate-400 hover:text-white border border-casino-border'
            }`}
          >
            <span>{zone.icon}</span>
            <span>{zone.name}</span>
          </button>
        ))}
      </div>

      {/* Clean 18-Game Card Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4">
        {filteredGames.map((game) => (
          <div
            key={game.id}
            onClick={() => {
              soundManager.playChipSound();
              triggerHaptic('medium');
              onSelectGameWithTutorial(game.id);
            }}
            className="group relative p-4 rounded-3xl bg-gradient-to-b from-[#141A28] to-[#0D1018] border border-casino-border/80 hover:border-casino-gold/60 cursor-pointer transition-all duration-200 hover:scale-[1.02] hover:shadow-2xl flex flex-col justify-between min-h-[170px] active:scale-95"
          >
            {/* Top Tag & Players */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className={`text-[9px] uppercase font-black px-2 py-0.5 rounded-full border ${game.tagColor}`}>
                  {game.tag}
                </span>
                <span className="text-[10px] text-slate-500 font-mono-numbers">
                  {game.players}
                </span>
              </div>

              {/* Large Visual Pictogram & Title */}
              <div className="flex items-center gap-3 my-2">
                <div className="w-12 h-12 rounded-2xl bg-black/40 border border-slate-700/60 flex items-center justify-center text-2xl group-hover:scale-110 transition-transform shrink-0 shadow-inner">
                  {game.pictogram}
                </div>
                <div className="min-w-0">
                  <h3 className="text-sm font-black text-white font-display truncate group-hover:text-casino-gold transition-colors">
                    {game.title}
                  </h3>
                  <span className="text-[10px] text-slate-400 block truncate">
                    {game.zone}
                  </span>
                </div>
              </div>
            </div>

            {/* Bottom: Multiplier & How To Play button */}
            <div className="flex items-center justify-between mt-3 pt-2.5 border-t border-slate-800/80">
              <span className="font-mono-numbers font-black text-emerald-400 text-xs">
                {game.maxMultiplier}
              </span>
              <div className="flex items-center gap-1 text-[11px] font-bold text-casino-gold">
                <HelpCircle className="w-3.5 h-3.5" />
                <span>Rules / Play</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
