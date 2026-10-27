import React, { useState } from 'react';
import { Diamond, Phone, ArrowRight, User, Shield, Sparkles } from 'lucide-react';
import { useUserStore } from '../../stores/useUserStore';
import { soundManager } from '../../lib/audio';
import { triggerHaptic } from '../../lib/haptics';

interface LoginScreenProps {
  onInitiateLogin: () => void;
}

export const LoginScreen: React.FC<LoginScreenProps> = ({ onInitiateLogin }) => {
  const { loginWithPhone, loginWithSocial, loginAsGuest } = useUserStore();
  const [phone, setPhone] = useState('9876543210');
  const [showOtpInput, setShowOtpInput] = useState(false);
  const [otp, setOtp] = useState('1234');

  const handleSendOtp = (e: React.FormEvent) => {
    e.preventDefault();
    if (phone.length >= 10) {
      soundManager.playButtonTap();
      triggerHaptic('light');
      setShowOtpInput(true);
    }
  };

  const handleVerifyOtp = (e: React.FormEvent) => {
    e.preventDefault();
    soundManager.playCashOut();
    triggerHaptic('medium');
    loginWithPhone(phone);
    onInitiateLogin();
  };

  const handleGoogle = () => {
    soundManager.playCashOut();
    triggerHaptic('medium');
    loginWithSocial('Google');
    onInitiateLogin();
  };

  const handleGuest = () => {
    soundManager.playButtonTap();
    triggerHaptic('light');
    loginAsGuest();
    onInitiateLogin();
  };

  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-[#06080C] via-[#0E131E] to-[#080B12] text-white flex flex-col justify-start sm:justify-center items-center p-3 sm:p-6 py-6 overflow-y-auto overflow-x-hidden relative select-none pb-20">
      {/* Background ambient lighting */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-casino-gold/10 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute -bottom-20 -right-20 w-80 h-80 bg-purple-600/10 rounded-full blur-[100px] pointer-events-none" />

      {/* Main Luxury Glass Panel - Responsive 2-column on landscape/desktop */}
      <div className="relative z-10 w-full max-w-xl md:max-w-3xl my-auto p-5 sm:p-7 rounded-3xl bg-[#111624]/90 border border-casino-gold/40 shadow-[0_0_80px_rgba(0,0,0,0.8)] backdrop-blur-2xl animate-scale-in">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 md:gap-8 items-center">
          
          {/* Brand Column (Left) */}
          <div className="text-center md:text-left flex flex-col items-center md:items-start">
            <div className="w-14 h-14 sm:w-16 sm:h-16 mb-3 rounded-2xl bg-gradient-to-br from-[#FFE873] via-[#FFB800] to-[#B45309] p-0.5 shadow-glow-gold animate-bounce-subtle">
              <div className="w-full h-full rounded-[18px] bg-[#0E131E] flex items-center justify-center">
                <Diamond className="w-8 h-8 sm:w-9 sm:h-9 text-casino-gold fill-casino-gold" />
              </div>
            </div>

            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-casino-gold/15 border border-casino-gold/30 text-casino-gold text-[10px] font-black uppercase tracking-widest mb-1.5">
              <Sparkles className="w-3 h-3" />
              <span>THE GRAND VAULT</span>
            </div>

            <h1 className="text-2xl sm:text-3xl font-black text-white font-display tracking-tight">
              ROYALE <span className="text-gold-gradient">777</span>
            </h1>
            <p className="text-xs text-slate-400 mt-1 mb-3 max-w-xs">
              Welcome to the high-roller lounge. Enter your credentials to unlock the gaming floor.
            </p>

            <div className="hidden md:flex flex-col gap-2 p-3 rounded-2xl bg-[#090C12]/80 border border-slate-800 text-[11px] text-slate-300 w-full">
              <div className="flex items-center gap-2">
                <span className="text-emerald-400">✓</span>
                <span>Instant 10,000 Free Practice Chips</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-casino-gold">✓</span>
                <span>18+ Provably Fair Casino Games</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-blue-400">✓</span>
                <span>Fast Mock UPI / Crypto Transactions</span>
              </div>
            </div>

            <div className="flex items-center gap-1.5 mt-3 text-[10px] text-slate-500">
              <Shield className="w-3.5 h-3.5 text-slate-500 shrink-0" />
              <span>18+ Fair Gaming & Virtual Simulation</span>
            </div>
          </div>

          {/* Form & Access Column (Right) */}
          <div className="w-full">
            {/* Phone Login Form */}
            {!showOtpInput ? (
              <form onSubmit={handleSendOtp} className="space-y-3 mb-3">
                <div className="flex rounded-2xl bg-[#090C12] border border-slate-700/80 overflow-hidden focus-within:border-casino-gold transition-colors">
                  <span className="px-3 py-2.5 bg-slate-800/60 text-slate-300 text-xs font-black border-r border-slate-700 flex items-center">
                    +91
                  </span>
                  <input
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    maxLength={10}
                    placeholder="Enter Mobile Number"
                    className="w-full px-3 py-2.5 bg-transparent text-white font-mono-numbers text-sm font-bold focus:outline-none placeholder-slate-500"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full py-3 rounded-2xl bg-gold-gradient text-black font-black text-xs tracking-wider uppercase flex items-center justify-center gap-2 shadow-glow-gold hover:brightness-110 active:scale-95 transition-all"
                >
                  <Phone className="w-4 h-4 fill-black" />
                  <span>Continue with Mobile</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </form>
            ) : (
              <form onSubmit={handleVerifyOtp} className="space-y-3 mb-3 animate-fade-in">
                <div className="text-left flex justify-between text-xs text-slate-400 mb-0.5">
                  <span>Enter 4-Digit OTP</span>
                  <span className="text-casino-gold font-mono-numbers">Demo Code: 1234</span>
                </div>
                <input
                  type="text"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value)}
                  maxLength={4}
                  required
                  className="w-full text-center tracking-[0.8em] py-2.5 rounded-2xl bg-[#090C12] border border-casino-gold/60 text-white font-mono-numbers text-xl font-black focus:outline-none shadow-glow-gold"
                />
                <button
                  type="submit"
                  className="w-full py-3 rounded-2xl bg-emerald-gradient text-white font-black text-xs tracking-wider uppercase shadow-glow-emerald hover:brightness-110 active:scale-95 transition-all"
                >
                  Verify OTP & Proceed
                </button>
                <div className="text-center">
                  <button
                    type="button"
                    onClick={() => setShowOtpInput(false)}
                    className="text-[11px] text-slate-400 hover:text-white"
                  >
                    Change Phone Number
                  </button>
                </div>
              </form>
            )}

            {/* Divider */}
            <div className="relative my-3 text-center">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-slate-800" />
              </div>
              <span className="relative px-2.5 text-[9px] uppercase font-bold tracking-widest text-slate-500 bg-[#111624]">
                OR SELECT ACCESS
              </span>
            </div>

            {/* 1-Click Google OAuth */}
            <div className="space-y-2">
              <button
                type="button"
                onClick={handleGoogle}
                className="w-full py-2.5 px-3 rounded-2xl bg-[#090C12] border border-slate-700/80 hover:border-slate-600 text-slate-200 font-bold text-xs flex items-center justify-center gap-2 transition-all active:scale-95"
              >
                <svg className="w-3.5 h-3.5" viewBox="0 0 24 24">
                  <path fill="#4285F4" d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.8-2.4 3.66v3.05h3.88c2.27-2.09 3.66-5.17 3.66-9.15z" />
                  <path fill="#34A853" d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.1-6.72-4.93H1.26v3.15C3.25 21.36 7.33 24 12 24z" />
                  <path fill="#FBBC05" d="M5.28 14.27c-.25-.72-.38-1.49-.38-2.27s.13-1.55.38-2.27V6.58H1.26C.46 8.16 0 9.98 0 12s.46 3.84 1.26 5.42l4.02-3.15z" />
                  <path fill="#EA4335" d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.33 0 3.25 2.64 1.26 6.58l4.02 3.15c.95-2.83 3.6-4.98 6.72-4.98z" />
                </svg>
                <span>Continue with Google</span>
              </button>

              {/* Instant Guest Entry */}
              <button
                type="button"
                onClick={handleGuest}
                className="w-full py-2.5 px-3 rounded-2xl bg-amber-500/10 hover:bg-amber-500/20 border border-amber-500/30 text-amber-300 font-bold text-xs flex items-center justify-center gap-2 transition-all active:scale-95"
              >
                <User className="w-3.5 h-3.5 text-casino-gold" />
                <span>Play as Guest (10,000 Demo Chips)</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
