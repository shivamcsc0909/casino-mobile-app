import React, { useState } from 'react';
import { ArrowDownLeft, ArrowUpRight, Trophy, Flame, Clock } from 'lucide-react';
import { useWalletStore } from '../../stores/useWalletStore';
import type { Transaction } from '../../stores/useWalletStore';
import { formatCurrency } from '../../lib/utils';
import { soundManager } from '../../lib/audio';

export const PassbookView: React.FC = () => {
  const { transactions } = useWalletStore();
  const [filter, setFilter] = useState<'all' | 'deposit' | 'withdrawal' | 'bet' | 'win'>('all');

  const filtered = transactions.filter((t) => {
    if (filter === 'all') return true;
    return t.type === filter;
  });

  const getIcon = (type: Transaction['type']) => {
    switch (type) {
      case 'deposit':
        return <ArrowDownLeft className="w-4 h-4 text-emerald-400" />;
      case 'withdrawal':
        return <ArrowUpRight className="w-4 h-4 text-blue-400" />;
      case 'win':
        return <Trophy className="w-4 h-4 text-casino-gold" />;
      case 'bet':
        return <Flame className="w-4 h-4 text-slate-400" />;
    }
  };

  return (
    <div className="p-4 sm:p-6 max-w-4xl mx-auto">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h2 className="text-2xl font-black text-white font-display">Wallet Passbook</h2>
          <p className="text-xs text-slate-400">Complete transaction and gaming log</p>
        </div>

        {/* Filter Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1">
          {(['all', 'deposit', 'withdrawal', 'bet', 'win'] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => {
                soundManager.playButtonTap();
                setFilter(tab);
              }}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold uppercase tracking-wider capitalize whitespace-nowrap transition-all ${
                filter === tab
                  ? 'bg-casino-gold text-black shadow-glow-gold'
                  : 'bg-casino-card text-slate-400 hover:text-white border border-casino-border'
              }`}
            >
              {tab === 'all' ? 'All Logs' : tab + 's'}
            </button>
          ))}
        </div>
      </div>

      {filtered.length === 0 ? (
        <div className="py-16 text-center rounded-3xl bg-casino-card border border-casino-border">
          <Clock className="w-10 h-10 text-slate-600 mx-auto mb-2" />
          <p className="text-slate-400 text-sm">No transactions found under this category.</p>
        </div>
      ) : (
        <div className="space-y-2">
          {filtered.map((t) => (
            <div
              key={t.id}
              className="flex items-center justify-between p-3.5 rounded-2xl bg-casino-card border border-casino-border/70 hover:border-casino-border transition-all"
            >
              <div className="flex items-center gap-3">
                <div className="p-2.5 rounded-xl bg-[#0B0E14] border border-casino-border">
                  {getIcon(t.type)}
                </div>
                <div>
                  <div className="text-sm font-bold text-white capitalize">
                    {t.type === 'bet' || t.type === 'win' ? `${t.game || 'Casino'} ${t.type}` : t.method || t.type}
                  </div>
                  <div className="text-[11px] text-slate-400">
                    {new Date(t.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} •{' '}
                    {new Date(t.timestamp).toLocaleDateString([], { month: 'short', day: 'numeric' })}
                  </div>
                </div>
              </div>

              <div className="text-right">
                <div
                  className={`text-sm font-bold font-mono-numbers ${
                    t.type === 'win' || t.type === 'deposit' ? 'text-emerald-400' : 'text-slate-200'
                  }`}
                >
                  {t.type === 'win' || t.type === 'deposit' ? '+' : '-'}
                  {formatCurrency(t.amount, t.currency)}
                </div>
                <div className="flex items-center justify-end gap-1 mt-0.5">
                  <span
                    className={`text-[9px] font-bold px-1.5 py-0.5 rounded uppercase ${
                      t.status === 'completed'
                        ? 'bg-emerald-500/10 text-emerald-400'
                        : t.status === 'pending'
                        ? 'bg-amber-500/10 text-amber-400'
                        : 'bg-red-500/10 text-red-400'
                    }`}
                  >
                    {t.status}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
