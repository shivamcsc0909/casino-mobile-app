import React, { useState, useEffect } from 'react';
import { Rocket, Disc, Layers, Sparkles, Trophy, Users, ShieldAlert, ChevronRight, Search } from 'lucide-react';
import type { TabType } from './MobileBottomNav';
import { soundManager } from '../../lib/audio';
import { triggerHaptic } from '../../lib/haptics';
import { useWalletStore } from '../../stores/useWalletStore';

interface CasinoLobbyProps {
  onSelectGame: (tab: TabType) => void;
  onOpenDeposit: () => void;
  onOpenResponsible: () => void;
}

export const CasinoLobby: React.FC<CasinoLobbyProps> = ({
  onSelectGame,
  onOpenDeposit,
  onOpenResponsible,
}) => {
  const { currencyMode } = useWalletStore();
  const [searchQuery, setSearchQuery] = useState('');

  // Progressive Jackpot live climbing counter
  const [jackpot, setJackpot] = useState<number>(14892450);

  useEffect(() => {
    const interval = setInterval(() => {
      setJackpot((prev) => prev + Math.floor(Math.random() * 25) + 3);
    }, 1800);
    return () => clearInterval(interval);
  }, []);

  const [activeCategory, setActiveCategory] = useState<'all' | 'crash' | 'table' | 'cards' | 'slots'>('all');

  const games = [
    {
      id: 'aviator' as TabType,
      title: 'Aviator Crash',
      category: 'crash',
      tag: '🔥 HOTTEST',
      players: '2,841 Playing',
      desc: 'Cash out before the rocket explodes! Dual bet console with up to 100x multiplier.',
      badgeColor: 'bg-red-500/20 text-red-400 border-red-500/40',
      gradient: 'from-red-950/80 via-slate-900 to-black',
      icon: Rocket,
      borderGlow: 'hover:border-red-500/60',
    },
    {
      id: 'roulette' as TabType,
      title: 'European Roulette 3D',
      category: 'table',
      tag: '⚡ 35:1 PAYOUT',
      players: '1,420 Playing',
      desc: 'Single zero European wheel with real physics, inside/outside grid, and hot numbers.',
      badgeColor: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/40',
      gradient: 'from-emerald-950/80 via-slate-900 to-black',
      icon: Disc,
      borderGlow: 'hover:border-emerald-500/60',
    },
    {
      id: 'teenpatti' as TabType,
      title: 'Teen Patti Live',
      category: 'cards',
      tag: '♠ INDIAN POKER',
      players: '3,105 Playing',
      desc: '3-Card showdown against smart bots. Seen/Blind, Chaal, Pack, and authentic Trail ranking.',
      badgeColor: 'bg-amber-500/20 text-amber-300 border-amber-500/40',
      gradient: 'from-amber-950/80 via-slate-900 to-black',
      icon: Layers,
      borderGlow: 'hover:border-amber-500/60',
    },
    {
      id: 'slots' as TabType,
      title: 'Neon Slots 777',
      category: 'slots',
      tag: '🎰 JACKPOT',
      players: '1,890 Playing',
      desc: 'Classic 3-reel slots with 5 paylines, wild diamonds, turbo mode, and confetti celebrations.',
      badgeColor: 'bg-purple-500/20 text-purple-300 border-purple-500/40',
      gradient: 'from-purple-950/80 via-slate-900 to-black',
      icon: Sparkles,
      borderGlow: 'hover:border-purple-500/60',
    },
  ];

  const filteredGames = games.filter((g) => {
    const matchesCat = activeCategory === 'all' || g.category === activeCategory;
    const matchesSearch =
      searchQuery.trim() === '' ||
      g.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      g.desc.toLowerCase().includes(searchQuery.toLowerCase()) ||
      g.tag.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCat && matchesSearch;
  });

  return (
    <div className="p-3 sm:p-6 max-w-6xl mx-auto space-y-5 animate-fade-in">
      {/* Hero Progressive Jackpot Banner */}
      <div className="relative p-6 sm:p-8 rounded-3xl bg-gradient-to-r from-[#1B1705] via-[#2A210A] to-[#121622] border-2 border-casino-gold/50 shadow-glow-gold overflow-hidden">
        {/* Shimmer background decoration */}
        <div className="absolute -right-10 -bottom-10 w-64 h-64 bg-casino-gold/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="text-center md:text-left">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-casino-gold/20 border border-casino-gold/40 text-casino-gold text-xs font-black uppercase tracking-wider mb-2">
              <Trophy className="w-3.5 h-3.5" />
              <span>LIVE MEGA PROGRESSIVE JACKPOT</span>
            </div>
            <div className="text-3xl sm:text-5xl font-black text-gold-gradient font-mono-numbers tracking-tight my-1 drop-shadow-md">
              ₹{jackpot.toLocaleString('en-IN')}.00
            </div>
            <p className="text-xs sm:text-sm text-slate-300 mt-1 max-w-md">
              Jackpot drops randomly on any real or practice spin across all 4 signature games!
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-center gap-3 shrink-0 w-full md:w-auto">
            <button
              onClick={() => {
                soundManager.playChipSound();
                triggerHaptic('medium');
                onOpenDeposit();
              }}
              className="w-full sm:w-auto px-6 py-3.5 rounded-2xl bg-emerald-gradient text-white font-black text-sm tracking-wider shadow-glow-emerald hover:brightness-110 active:scale-95 transition-all"
            >
              + QUICK DEPOSIT
            </button>
            <button
              onClick={() => {
                soundManager.playButtonTap();
                triggerHaptic('light');
                onSelectGame('aviator');
              }}
              className="w-full sm:w-auto px-6 py-3.5 rounded-2xl bg-casino-card hover:bg-casino-cardHover border border-casino-gold/60 text-casino-gold font-black text-sm tracking-wider transition-all"
            >
              PLAY AVIATOR
            </button>
          </div>
        </div>
      </div>

      {/* Search Bar & Categories */}
      <div className="flex flex-col sm:flex-row items-center gap-3">
        {/* Search Input */}
        <div className="relative w-full sm:w-72">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search games..."
            className="w-full pl-9 pr-4 py-2.5 rounded-2xl bg-casino-card border border-casino-border text-xs text-white placeholder-slate-500 focus:outline-none focus:border-casino-gold transition-colors"
          />
        </div>

        {/* Category Pills */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 no-scrollbar w-full">
          {[
            { id: 'all', label: 'All Games (4)' },
            { id: 'crash', label: '🚀 Crash' },
            { id: 'table', label: '🎯 Roulette' },
            { id: 'cards', label: '♠ Teen Patti' },
            { id: 'slots', label: '🎰 777 Slots' },
          ].map((cat) => (
            <button
              key={cat.id}
              onClick={() => {
                soundManager.playButtonTap();
                triggerHaptic('light');
                setActiveCategory(cat.id as typeof activeCategory);
              }}
              className={`px-3.5 py-2 rounded-2xl text-xs font-bold uppercase tracking-wider whitespace-nowrap transition-all ${
                activeCategory === cat.id
                  ? 'bg-casino-gold text-black shadow-glow-gold'
                  : 'bg-casino-card text-slate-400 hover:text-white border border-casino-border'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>
      </div>

      {/* Game Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredGames.map((game) => {
          const Icon = game.icon;
          return (
            <div
              key={game.id}
              onClick={() => {
                soundManager.playButtonTap();
                triggerHaptic('medium');
                onSelectGame(game.id);
              }}
              className={`group relative p-5 rounded-3xl bg-gradient-to-br ${game.gradient} border border-casino-border ${game.borderGlow} cursor-pointer transition-all duration-300 hover:scale-[1.01] hover:shadow-2xl overflow-hidden flex flex-col justify-between min-h-[200px] active:scale-98`}
            >
              <div>
                <div className="flex items-center justify-between mb-3">
                  <span className={`text-[10px] uppercase font-black px-2.5 py-1 rounded-full border ${game.badgeColor}`}>
                    {game.tag}
                  </span>
                  <div className="flex items-center gap-1.5 text-[11px] text-slate-400 font-medium">
                    <Users className="w-3.5 h-3.5 text-emerald-400" />
                    <span>{game.players}</span>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="p-3.5 rounded-2xl bg-black/40 border border-slate-700/60 text-white group-hover:scale-110 transition-transform">
                    <Icon className="w-8 h-8 text-casino-gold" />
                  </div>
                  <div>
                    <h3 className="text-xl font-black text-white font-display group-hover:text-casino-gold transition-colors">
                      {game.title}
                    </h3>
                    <p className="text-xs text-slate-400 mt-1 line-clamp-2">
                      {game.desc}
                    </p>
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-between mt-4 pt-3 border-t border-slate-800/80">
                <span className="text-[11px] font-bold text-slate-300">
                  {currencyMode === 'real' ? 'Real Cash Enabled' : '10,000 Demo Chips'}
                </span>
                <div className="flex items-center gap-1 text-xs font-black text-casino-gold group-hover:translate-x-1 transition-transform">
                  <span>PLAY NOW</span>
                  <ChevronRight className="w-4 h-4" />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Responsible Gaming Bar */}
      <div className="p-4 rounded-2xl bg-[#090C12] border border-casino-border flex flex-col sm:flex-row items-center justify-between gap-3 text-center sm:text-left">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-xl bg-amber-500/10 text-amber-400 border border-amber-500/30 shrink-0">
            <ShieldAlert className="w-5 h-5" />
          </div>
          <div>
            <div className="text-xs font-bold text-white flex items-center justify-center sm:justify-start gap-1.5">
              <span>Play Responsibly</span>
              <span className="text-[10px] px-1.5 py-0.2 rounded bg-red-500/20 text-red-400 font-black border border-red-500/30">
                18+ ONLY
              </span>
            </div>
            <p className="text-[11px] text-slate-400 mt-0.5">
              Set personal daily limits, view reality check timers, or take self-exclusion breaks anytime.
            </p>
          </div>
        </div>

        <button
          onClick={() => {
            soundManager.playButtonTap();
            onOpenResponsible();
          }}
          className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold transition-all border border-slate-700 shrink-0"
        >
          Manage Limits
        </button>
      </div>
    </div>
  );
};
