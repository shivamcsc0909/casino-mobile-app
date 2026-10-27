import React from 'react';
import { Home, Rocket, Disc, Layers, Sparkles, Wallet } from 'lucide-react';
import { soundManager } from '../../lib/audio';

export type TabType = 'lobby' | 'aviator' | 'roulette' | 'teenpatti' | 'slots' | 'wallet';

interface MobileBottomNavProps {
  activeTab: TabType;
  onSelectTab: (tab: TabType) => void;
}

export const MobileBottomNav: React.FC<MobileBottomNavProps> = ({ activeTab, onSelectTab }) => {
  const tabs = [
    { id: 'lobby', label: 'Lobby', icon: Home },
    { id: 'aviator', label: 'Crash', icon: Rocket },
    { id: 'roulette', label: 'Roulette', icon: Disc },
    { id: 'teenpatti', label: 'Teen Patti', icon: Layers },
    { id: 'slots', label: 'Slots', icon: Sparkles },
    { id: 'wallet', label: 'Wallet', icon: Wallet },
  ] as const;

  const handleClick = (id: TabType) => {
    soundManager.playButtonTap();
    onSelectTab(id);
  };

  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-[#0B0E14]/95 backdrop-blur-xl border-t border-casino-border px-2 py-1.5 safe-area-pb">
      <div className="flex items-center justify-around">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => handleClick(tab.id)}
              className={`flex flex-col items-center justify-center py-1 px-2 rounded-xl transition-all relative ${
                isActive ? 'text-casino-gold' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <div
                className={`p-1.5 rounded-xl transition-all ${
                  isActive ? 'bg-casino-gold/15 shadow-glow-gold scale-110' : ''
                }`}
              >
                <Icon className="w-5 h-5" />
              </div>
              <span className={`text-[10px] mt-0.5 font-bold tracking-tight ${isActive ? 'text-casino-gold' : ''}`}>
                {tab.label}
              </span>
              {isActive && (
                <div className="w-1.5 h-1.5 rounded-full bg-casino-gold absolute -top-0.5" />
              )}
            </button>
          );
        })}
      </div>
    </nav>
  );
};
