import React from 'react';
import { X, Play, FastForward, Lightbulb, ShieldCheck } from 'lucide-react';
import { getTutorialForGame } from '../../data/tutorialsData';
import { soundManager } from '../../lib/audio';
import { triggerHaptic } from '../../lib/haptics';

interface GameTutorialModalProps {
  gameId: string | null;
  isOpen: boolean;
  onClose: () => void;
  onPlay: () => void;
}

export const GameTutorialModal: React.FC<GameTutorialModalProps> = ({
  gameId,
  isOpen,
  onClose,
  onPlay,
}) => {
  if (!isOpen || !gameId) return null;

  const tut = getTutorialForGame(gameId);

  const handleStartPlay = () => {
    soundManager.playChipSound();
    triggerHaptic('medium');
    onPlay();
  };

  const handleSkip = () => {
    soundManager.playButtonTap();
    triggerHaptic('light');
    onPlay();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-start sm:items-center justify-center p-2 sm:p-4 bg-black/85 backdrop-blur-md overflow-y-auto overflow-x-hidden animate-fade-in">
      <div className="relative w-full max-w-xl md:max-w-3xl my-auto p-4 sm:p-6 rounded-3xl bg-gradient-to-b from-[#171D2A] to-[#0E121B] border-2 border-casino-gold/50 shadow-[0_0_50px_rgba(255,184,0,0.25)] max-h-[92vh] overflow-y-auto animate-scale-in">
        {/* Close Button */}
        <button
          onClick={() => {
            soundManager.playButtonTap();
            onClose();
          }}
          className="absolute top-3 right-3 p-2 text-slate-400 hover:text-white rounded-full bg-slate-800/80 transition-colors z-20"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6 items-start">
          {/* Left Column: Title & 3-Step Briefing */}
          <div>
            {/* Header Briefing */}
            <div className="flex items-center gap-3 mb-3 pr-8">
              <div className="w-12 h-12 rounded-2xl bg-casino-gold/15 border border-casino-gold/40 flex items-center justify-center text-2xl shadow-glow-gold shrink-0">
                {tut.pictogram}
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h2 className="text-lg sm:text-xl font-black text-white font-display">
                    {tut.title}
                  </h2>
                  <span className="text-[9px] uppercase font-black px-2 py-0.5 rounded-full bg-casino-gold/20 text-casino-gold border border-casino-gold/40">
                    {tut.badge}
                  </span>
                </div>
                <p className="text-[11px] text-slate-400 mt-0.5">{tut.subtitle}</p>
              </div>
            </div>

            {/* 3 Step Visual Guide */}
            <div className="space-y-2">
              <span className="text-[9px] uppercase font-extrabold tracking-widest text-casino-gold block">
                HOW TO PLAY • 3 STEP BRIEFING
              </span>
              {tut.steps.map((st) => (
                <div
                  key={st.number}
                  className="flex items-start gap-2.5 p-2.5 rounded-2xl bg-[#090C12] border border-casino-border/70"
                >
                  <div className="w-7 h-7 rounded-xl bg-slate-800 flex items-center justify-center text-xs font-black text-casino-gold shrink-0 border border-slate-700">
                    {st.icon}
                  </div>
                  <div>
                    <div className="text-xs font-bold text-slate-200">
                      Step {st.number}: {st.title}
                    </div>
                    <div className="text-[10px] text-slate-400 mt-0.5 leading-snug">
                      {st.description}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Right Column: Payouts, VIP Tip & Play Buttons */}
          <div className="flex flex-col justify-between h-full space-y-3">
            {/* Payout Rates Table */}
            <div className="p-2.5 rounded-2xl bg-[#090C12] border border-casino-border/70">
              <span className="text-[9px] uppercase font-extrabold tracking-widest text-slate-400 block mb-1.5">
                STANDARD PAYOUT RATES
              </span>
              <div className="grid grid-cols-2 gap-1.5">
                {tut.payouts.map((po, idx) => (
                  <div
                    key={idx}
                    className="flex items-center justify-between p-1.5 rounded-xl bg-slate-900/80 border border-slate-800 text-xs"
                  >
                    <span className="text-slate-300 text-[10px] font-medium truncate mr-1">
                      {po.event}
                    </span>
                    <span className="font-mono-numbers font-black text-emerald-400 text-[10px] shrink-0">
                      {po.multiplier}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Pro-Tip Box */}
            <div className="flex items-start gap-2 p-2.5 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-amber-200 text-xs">
              <Lightbulb className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
              <div className="text-[10px] leading-relaxed">
                <strong className="text-amber-300">VIP Pro Tip: </strong>
                {tut.proTip}
              </div>
            </div>

            {/* Dual Actions: Skip vs Start */}
            <div className="space-y-2 pt-1">
              <div className="flex items-center gap-2">
                <button
                  onClick={handleSkip}
                  className="flex-1 py-3 px-3 rounded-2xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold text-xs flex items-center justify-center gap-1.5 border border-slate-700 transition-all active:scale-95"
                >
                  <FastForward className="w-3.5 h-3.5 text-slate-400" />
                  <span>SKIP</span>
                </button>

                <button
                  onClick={handleStartPlay}
                  className="flex-1 py-3 px-4 rounded-2xl bg-gold-gradient text-black font-black text-xs sm:text-sm tracking-wider flex items-center justify-center gap-1.5 shadow-glow-gold hover:brightness-110 transition-all active:scale-95"
                >
                  <Play className="w-3.5 h-3.5 fill-black" />
                  <span>PLAY NOW</span>
                </button>
              </div>

              <div className="flex items-center justify-center gap-1 text-[9px] text-slate-500">
                <ShieldCheck className="w-3 h-3 text-emerald-400" />
                <span>Provably Fair RNG Certified • 18+ Play Responsibly</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
