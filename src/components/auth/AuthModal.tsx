import React, { useState } from 'react';
import { X, Sparkles, User, ArrowRight, Shield } from 'lucide-react';
import { useUserStore } from '../../stores/useUserStore';
import { soundManager } from '../../lib/audio';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({ isOpen, onClose }) => {
  const { loginWithPhone, loginWithSocial, loginAsGuest } = useUserStore();
  const [step, setStep] = useState<'phone' | 'otp'>('phone');
  const [phone, setPhone] = useState('9876543210');
  const [otp, setOtp] = useState('1234');

  if (!isOpen) return null;

  const handleSendOTP = (e: React.FormEvent) => {
    e.preventDefault();
    soundManager.playButtonTap();
    if (phone.length >= 10) {
      setStep('otp');
    }
  };

  const handleVerifyOTP = (e: React.FormEvent) => {
    e.preventDefault();
    soundManager.playCashOut();
    loginWithPhone(phone);
    onClose();
  };

  const handleGoogleLogin = () => {
    soundManager.playCashOut();
    loginWithSocial('Google');
    onClose();
  };

  const handleGuestLogin = () => {
    soundManager.playButtonTap();
    loginAsGuest();
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/80 backdrop-blur-md animate-fade-in">
      <div className="relative w-full max-w-md p-6 rounded-t-3xl sm:rounded-3xl bg-[#141923] border-t sm:border border-casino-border shadow-2xl animate-slide-up sm:animate-scale-in max-h-[92vh] overflow-y-auto">
        {/* Mobile Grab Handle */}
        <div className="w-12 h-1.5 rounded-full bg-slate-700/80 mx-auto mb-3 sm:hidden" />
        <button
          onClick={() => {
            soundManager.playButtonTap();
            onClose();
          }}
          className="absolute top-4 right-4 p-2 text-slate-400 hover:text-white rounded-full bg-slate-800/60 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="text-center mb-6">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-casino-gold/15 border border-casino-gold/30 text-casino-gold text-xs font-bold uppercase tracking-wider mb-2">
            <Sparkles className="w-3.5 h-3.5" />
            <span>VIP Access</span>
          </div>
          <h2 className="text-2xl font-black text-white font-display">Sign In to Royale 777</h2>
          <p className="text-xs text-slate-400 mt-1">Unlock real-money rewards, withdrawals, and VIP tiers</p>
        </div>

        {step === 'phone' ? (
          <form onSubmit={handleSendOTP} className="space-y-4">
            <div>
              <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider block mb-1.5">
                Mobile Number
              </label>
              <div className="flex rounded-2xl bg-slate-900 border border-slate-700 overflow-hidden focus-within:border-casino-gold">
                <span className="px-3.5 py-3 bg-slate-800/80 text-slate-300 text-sm font-bold border-r border-slate-700 flex items-center">
                  +91
                </span>
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  maxLength={10}
                  required
                  placeholder="Enter 10-digit number"
                  className="w-full px-4 py-3 bg-transparent text-white font-mono-numbers text-base font-semibold focus:outline-none"
                />
              </div>
            </div>

            <button
              type="submit"
              className="w-full py-3.5 rounded-2xl bg-gold-gradient text-black font-extrabold text-sm tracking-wide flex items-center justify-center gap-2 hover:brightness-110 active:scale-95 transition-all shadow-glow-gold"
            >
              <span>Get Verification Code</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>
        ) : (
          <form onSubmit={handleVerifyOTP} className="space-y-4">
            <div>
              <div className="flex justify-between items-center mb-1.5">
                <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                  Enter 4-Digit OTP
                </label>
                <span className="text-[11px] text-casino-gold font-mono-numbers">Auto-filled: 1234</span>
              </div>
              <input
                type="text"
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                maxLength={4}
                required
                className="w-full text-center tracking-[1em] py-3 rounded-2xl bg-slate-900 border border-slate-700 text-white font-mono-numbers text-2xl font-bold focus:outline-none focus:border-casino-gold"
              />
            </div>

            <button
              type="submit"
              className="w-full py-3.5 rounded-2xl bg-emerald-gradient text-white font-bold text-sm tracking-wide hover:brightness-110 active:scale-95 transition-all shadow-glow-emerald"
            >
              Verify & Enter
            </button>

            <button
              type="button"
              onClick={() => setStep('phone')}
              className="w-full text-xs text-slate-400 hover:text-slate-200"
            >
              Change Phone Number
            </button>
          </form>
        )}

        <div className="relative my-6 text-center">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-slate-800" />
          </div>
          <span className="relative px-3 text-[11px] uppercase tracking-wider text-slate-500 bg-[#141923]">
            Or Continue With
          </span>
        </div>

        {/* 1-Click Social Login */}
        <div className="space-y-2">
          <button
            type="button"
            onClick={handleGoogleLogin}
            className="w-full py-3 px-4 rounded-2xl bg-[#0B0E14] border border-slate-700 hover:border-slate-600 text-slate-200 font-bold text-xs flex items-center justify-center gap-2.5 transition-all"
          >
            <svg className="w-4 h-4" viewBox="0 0 24 24">
              <path
                fill="#4285F4"
                d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.8-2.4 3.66v3.05h3.88c2.27-2.09 3.66-5.17 3.66-9.15z"
              />
              <path
                fill="#34A853"
                d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.1-6.72-4.93H1.26v3.15C3.25 21.36 7.33 24 12 24z"
              />
              <path
                fill="#FBBC05"
                d="M5.28 14.27c-.25-.72-.38-1.49-.38-2.27s.13-1.55.38-2.27V6.58H1.26C.46 8.16 0 9.98 0 12s.46 3.84 1.26 5.42l4.02-3.15z"
              />
              <path
                fill="#EA4335"
                d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.33 0 3.25 2.64 1.26 6.58l4.02 3.15c.95-2.83 3.6-4.98 6.72-4.98z"
              />
            </svg>
            <span>Continue with Google</span>
          </button>

          {/* Instant Guest Access */}
          <button
            type="button"
            onClick={handleGuestLogin}
            className="w-full py-3 px-4 rounded-2xl bg-slate-800/40 hover:bg-slate-800 border border-slate-700/60 text-slate-300 font-bold text-xs flex items-center justify-center gap-2 transition-all"
          >
            <User className="w-4 h-4 text-casino-gold" />
            <span>Play as Guest (10,000 Demo Chips)</span>
          </button>
        </div>

        <div className="flex items-center justify-center gap-1 mt-5 text-[10px] text-slate-500 text-center">
          <Shield className="w-3 h-3 text-slate-500" />
          <span>By continuing, you agree to 18+ Responsible Gaming Terms</span>
        </div>
      </div>
    </div>
  );
};
