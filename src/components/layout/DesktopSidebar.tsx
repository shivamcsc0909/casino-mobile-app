import React from 'react';
import { Home, Rocket, Disc, Layers, Sparkles, Wallet, ShieldAlert, Award } from 'lucide-react';
import type { TabType } from './MobileBottomNav';
import { soundManager } from '../../lib/audio';
import { useUserStore } from '../../stores/useUserStore';

interface DesktopSidebarProps {
  activeTab: TabType;
  onSelectTab: (tab: TabType) => void;
  onOpenResponsible: () => void;
  onOpenProfile: () => void;
}

export const DesktopSidebar: React.FC<DesktopSidebarProps> = ({
  activeTab,
  onSelectTab,
  onOpenResponsible,
  onOpenProfile,
}) => {
  const { vipTier, vipPoints } = useUserStore();

  const navItems = [
    { id: 'lobby', label: 'Casino Lobby', icon: Home, badge: null },
    { id: 'aviator', label: 'Aviator Crash', icon: Rocket, badge: 'HOT' },
    { id: 'roulette', label: 'Roulette 3D', icon: Disc, badge: 'LIVE' },
    { id: 'teenpatti', label: 'Teen Patti Live', icon: Layers, badge: 'NEW' },
    { id: 'slots', label: 'Neon Slots 777', icon: Sparkles, badge: 'JACKPOT' },
    { id: 'wallet', label: 'Wallet & Logs', icon: Wallet, badge: null },
  ] as const;

  const handleClick = (id: TabType) => {
    soundManager.playButtonTap();
    onSelectTab(id);
  };

  return (
    <aside className="hidden md:flex flex-col w-64 bg-[#0D111A] border-r border-casino-border/80 min-h-[calc(100vh-61px)] p-4 shrink-0 justify-between">
      <div className="space-y-6">
        {/* Navigation Section */}
        <div>
          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-widest px-3 mb-2 block">
            Gaming Floor
          </span>
          <div className="space-y-1.5">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => handleClick(item.id)}
                  className={`w-full flex items-center justify-between px-3.5 py-3 rounded-2xl text-sm font-bold transition-all ${
                    isActive
                      ? 'bg-casino-gold text-black shadow-glow-gold'
                      : 'text-slate-300 hover:text-white hover:bg-casino-card'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <Icon className="w-5 h-5" />
                    <span>{item.label}</span>
                  </div>
                  {item.badge && (
                    <span
                      className={`text-[9px] font-extrabold px-1.5 py-0.5 rounded-full ${
                        isActive
                          ? 'bg-black text-casino-gold'
                          : item.badge === 'HOT'
                          ? 'bg-red-500/20 text-red-400 border border-red-500/30'
                          : item.badge === 'JACKPOT'
                          ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                          : 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                      }`}
                    >
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* VIP Loyalty Card */}
        <div
          onClick={() => {
            soundManager.playButtonTap();
            onOpenProfile();
          }}
          className="p-4 rounded-2xl bg-gradient-to-br from-[#1E2538] to-[#121622] border border-casino-gold/30 cursor-pointer hover:border-casino-gold transition-all shadow-glow-gold/40"
        >
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <Award className="w-5 h-5 text-casino-gold" />
              <span className="text-xs font-bold text-white uppercase tracking-wider">{vipTier} Club</span>
            </div>
            <span className="text-[10px] text-casino-gold font-mono-numbers font-bold">
              {vipPoints} XP
            </span>
          </div>
          <p className="text-[11px] text-slate-400 mb-2 leading-relaxed">
            Level up for 5% weekly cashback & instant VIP priority withdrawals.
          </p>
          <div className="w-full h-1.5 rounded-full bg-slate-800 overflow-hidden">
            <div
              className="h-full bg-gold-gradient rounded-full"
              style={{ width: `${Math.min(100, (vipPoints / 3000) * 100)}%` }}
            />
          </div>
        </div>
      </div>

      {/* Footer Utility Links */}
      <div className="space-y-2 pt-4 border-t border-casino-border">
        <button
          onClick={() => {
            soundManager.playButtonTap();
            onOpenResponsible();
          }}
          className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-semibold text-slate-400 hover:text-white hover:bg-casino-card transition-all"
        >
          <ShieldAlert className="w-4 h-4 text-amber-400" />
          <span>Responsible Gaming (18+)</span>
        </button>

        <div className="px-3 py-2 rounded-xl bg-[#090C12] border border-slate-800 text-[10px] text-slate-400 flex items-center justify-between">
          <div className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span>Fair Gaming Certified</span>
          </div>
          <span className="font-mono text-[9px] text-slate-500">RNG v2.4</span>
        </div>
      </div>
    </aside>
  );
};
