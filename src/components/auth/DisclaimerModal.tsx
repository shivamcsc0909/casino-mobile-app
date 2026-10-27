import React, { useState } from 'react';
import { ShieldCheck, Check, AlertTriangle, ArrowRight } from 'lucide-react';
import { soundManager } from '../../lib/audio';
import { triggerHaptic } from '../../lib/haptics';

interface DisclaimerModalProps {
  isOpen: boolean;
  onAgreeAndProceed: () => void;
}

export const DisclaimerModal: React.FC<DisclaimerModalProps> = ({
  isOpen,
  onAgreeAndProceed,
}) => {
  const [agreed, setAgreed] = useState(false);

  if (!isOpen) return null;

  const handleConfirm = () => {
    if (!agreed) return;
    soundManager.playCashOut();
    triggerHaptic('success');
    onAgreeAndProceed();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-start sm:items-center justify-center p-2 sm:p-4 bg-black/90 backdrop-blur-xl overflow-y-auto overflow-x-hidden animate-fade-in">
      <div className="relative w-full max-w-xl md:max-w-2xl my-auto p-4 sm:p-6 rounded-3xl bg-gradient-to-b from-[#181F2D] to-[#0D1119] border-2 border-casino-gold/50 shadow-[0_0_60px_rgba(255,184,0,0.3)] max-h-[92vh] overflow-y-auto animate-scale-in">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6 items-center">
          
          {/* Left Column: Heading & Guidelines */}
          <div>
            <div className="flex items-center gap-3 mb-3">
              <div className="w-11 h-11 rounded-2xl bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-400 shadow-glow-gold shrink-0">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <div>
                <div className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-red-500/20 text-red-400 text-[9px] font-black uppercase tracking-wider border border-red-500/30">
                  <span>MANDATORY 18+ VERIFICATION</span>
                </div>
                <h2 className="text-xl font-black text-white font-display">Terms & Disclaimer</h2>
              </div>
            </div>

            {/* Disclaimer Bullet Points */}
            <div className="space-y-2 text-xs text-slate-300">
              <div className="flex items-start gap-2 p-2.5 rounded-2xl bg-[#090C12] border border-casino-border/70">
                <span className="text-sm">🔞</span>
                <div className="text-[10px] leading-relaxed">
                  <strong className="text-white">Strictly 18+:</strong> You certify that you are at least 18 years of age or legal age in your jurisdiction.
                </div>
              </div>

              <div className="flex items-start gap-2 p-2.5 rounded-2xl bg-[#090C12] border border-casino-border/70">
                <span className="text-sm">🪙</span>
                <div className="text-[10px] leading-relaxed">
                  <strong className="text-white">Simulation:</strong> Practice mode credits 10,000 virtual demo chips with zero cash value.
                </div>
              </div>

              <div className="flex items-start gap-2 p-2.5 rounded-2xl bg-[#090C12] border border-casino-border/70">
                <AlertTriangle className="w-3.5 h-3.5 text-amber-400 shrink-0 mt-0.5" />
                <div className="text-[10px] leading-relaxed">
                  <strong className="text-white">Responsible:</strong> Set personal limits, take breaks, and game within your budget.
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Checkbox Agreement & Enter Button */}
          <div className="flex flex-col justify-between h-full space-y-3">
            <div className="p-3 rounded-2xl bg-[#090C12] border border-slate-800 text-[11px] text-slate-400 leading-relaxed">
              By entering <span className="text-casino-gold font-bold">Royale 777</span>, you acknowledge that this is a simulated luxury gaming platform engineered for entertainment and practice.
            </div>

            {/* Agreement Checkbox */}
            <div
              onClick={() => {
                soundManager.playButtonTap();
                triggerHaptic('light');
                setAgreed(!agreed);
              }}
              className={`flex items-center gap-3 p-3 rounded-2xl border cursor-pointer transition-all ${
                agreed
                  ? 'bg-casino-gold/15 border-casino-gold text-white shadow-glow-gold'
                  : 'bg-[#090C12] border-slate-700 text-slate-400 hover:border-slate-600'
              }`}
            >
              <div
                className={`w-5 h-5 rounded-lg border flex items-center justify-center transition-all shrink-0 ${
                  agreed
                    ? 'bg-casino-gold border-casino-gold text-black'
                    : 'border-slate-600 bg-slate-900'
                }`}
              >
                {agreed && <Check className="w-3.5 h-3.5 stroke-[3]" />}
              </div>
              <span className="text-xs font-bold select-none leading-snug">
                I confirm I am 18+ and accept all Terms & Responsible Gaming Guidelines.
              </span>
            </div>

            {/* Enter Casino Action */}
            <button
              onClick={handleConfirm}
              disabled={!agreed}
              className="w-full py-3.5 rounded-2xl bg-gold-gradient text-black font-black text-xs tracking-wider uppercase flex items-center justify-center gap-2 shadow-glow-gold hover:brightness-110 active:scale-95 transition-all disabled:opacity-30 disabled:cursor-not-allowed"
            >
              <span>ENTER CASINO FLOOR</span>
              <ArrowRight className="w-4 h-4 stroke-[3]" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
