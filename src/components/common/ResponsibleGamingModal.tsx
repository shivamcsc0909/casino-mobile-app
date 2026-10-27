import React, { useState } from 'react';
import { ShieldAlert, X, AlertTriangle, Clock, Lock } from 'lucide-react';
import { useUserStore } from '../../stores/useUserStore';
import { soundManager } from '../../lib/audio';

interface ResponsibleGamingModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ResponsibleGamingModal: React.FC<ResponsibleGamingModalProps> = ({ isOpen, onClose }) => {
  const { dailyBetLimit, setDailyLimit, selfExclusionActive, setSelfExclusion } = useUserStore();
  const [limitInput, setLimitInput] = useState(dailyBetLimit.toString());
  const [savedSuccess, setSavedSuccess] = useState(false);

  if (!isOpen) return null;

  const handleSaveLimit = (e: React.FormEvent) => {
    e.preventDefault();
    soundManager.playButtonTap();
    const val = Number(limitInput);
    if (!isNaN(val) && val > 0) {
      setDailyLimit(val);
      setSavedSuccess(true);
      setTimeout(() => setSavedSuccess(false), 2000);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/80 backdrop-blur-md animate-fade-in">
      <div className="relative w-full max-w-md p-6 rounded-t-3xl sm:rounded-3xl bg-[#141923] border-t sm:border border-casino-border shadow-2xl overflow-y-auto max-h-[92vh] animate-slide-up sm:animate-scale-in">
        {/* Mobile Grab Handle */}
        <div className="w-12 h-1.5 rounded-full bg-slate-700/80 mx-auto mb-3 sm:hidden" />
        <button
          onClick={() => {
            soundManager.playButtonTap();
            onClose();
          }}
          className="absolute top-4 right-4 p-2 text-slate-400 hover:text-white rounded-full bg-slate-800/60"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-3 mb-4">
          <div className="p-3 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-amber-400">
            <ShieldAlert className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-white font-display">Responsible Gaming</h2>
            <span className="text-xs px-2 py-0.5 rounded-full bg-red-500/20 text-red-400 font-bold border border-red-500/30">
              18+ ONLY
            </span>
          </div>
        </div>

        <p className="text-xs text-slate-400 mb-6 leading-relaxed">
          Gaming should be entertaining and fun. Never chase losses, bet only what you can afford, and take regular breaks.
        </p>

        {/* Daily Betting Limit Form */}
        <div className="p-4 rounded-2xl bg-[#0B0E14] border border-casino-border mb-4">
          <div className="flex items-center gap-2 mb-2 text-sm font-semibold text-slate-200">
            <Clock className="w-4 h-4 text-casino-gold" />
            <span>Daily Betting Limit</span>
          </div>
          <form onSubmit={handleSaveLimit} className="space-y-3">
            <div className="relative">
              <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 font-mono-numbers">₹</span>
              <input
                type="number"
                value={limitInput}
                onChange={(e) => setLimitInput(e.target.value)}
                className="w-full pl-8 pr-4 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white font-mono-numbers text-sm focus:outline-none focus:border-casino-gold"
                placeholder="Set max daily bet limit"
              />
            </div>
            <div className="flex gap-2">
              {[1000, 5000, 20000, 50000].map((preset) => (
                <button
                  type="button"
                  key={preset}
                  onClick={() => {
                    soundManager.playButtonTap();
                    setLimitInput(preset.toString());
                  }}
                  className="flex-1 py-1.5 text-xs rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors"
                >
                  ₹{(preset / 1000).toFixed(0)}k
                </button>
              ))}
            </div>
            <button
              type="submit"
              className="w-full py-2.5 rounded-xl bg-casino-gold hover:bg-casino-goldHover text-black font-bold text-xs uppercase tracking-wide transition-all"
            >
              {savedSuccess ? 'Limit Updated ✓' : 'Update Daily Limit'}
            </button>
          </form>
        </div>

        {/* Self-Exclusion Tool */}
        <div className="p-4 rounded-2xl bg-[#0B0E14] border border-casino-border mb-4">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2 text-sm font-semibold text-slate-200">
              <Lock className="w-4 h-4 text-red-400" />
              <span>Self-Exclusion Break</span>
            </div>
            {selfExclusionActive && (
              <span className="text-[10px] uppercase font-bold text-red-400 px-2 py-0.5 rounded bg-red-500/10 border border-red-500/20">
                Active
              </span>
            )}
          </div>
          <p className="text-xs text-slate-400 mb-3">
            Temporarily pause your account to prevent placing any new bets.
          </p>
          <button
            onClick={() => {
              soundManager.playButtonTap();
              setSelfExclusion(!selfExclusionActive);
            }}
            className={`w-full py-2.5 rounded-xl text-xs font-bold transition-all border ${
              selfExclusionActive
                ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30 hover:bg-emerald-500/20'
                : 'bg-red-500/10 text-red-400 border-red-500/30 hover:bg-red-500/20'
            }`}
          >
            {selfExclusionActive ? 'Disable Self-Exclusion' : 'Activate 24-Hour Self-Exclusion'}
          </button>
        </div>

        {/* Help & Support note */}
        <div className="p-3 rounded-xl bg-slate-900/60 border border-slate-800 flex items-start gap-2 text-[11px] text-slate-400">
          <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
          <span>If gambling is affecting your life, free & confidential support is available 24/7 at National Helpline: 1800-419-0123.</span>
        </div>
      </div>
    </div>
  );
};
