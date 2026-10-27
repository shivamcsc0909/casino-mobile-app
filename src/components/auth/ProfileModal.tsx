import React, { useState } from 'react';
import { X, ShieldCheck, Crown, LogOut, AlertCircle } from 'lucide-react';
import { useUserStore, AVATARS } from '../../stores/useUserStore';
import { soundManager } from '../../lib/audio';

interface ProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  onOpenResponsible: () => void;
}

export const ProfileModal: React.FC<ProfileModalProps> = ({ isOpen, onClose, onOpenResponsible }) => {
  const {
    username,
    phone,
    avatar,
    vipTier,
    vipPoints,
    kycStatus,
    setAvatar,
    submitKYC,
    logout,
    isGuest
  } = useUserStore();

  const [kycSuccess, setKycSuccess] = useState(false);

  if (!isOpen) return null;

  const handleKyc = () => {
    soundManager.playCashOut();
    submitKYC();
    setKycSuccess(true);
    setTimeout(() => setKycSuccess(false), 2500);
  };

  const getTierColor = (tier: string) => {
    switch (tier) {
      case 'VIP Diamond':
        return 'text-cyan-400 border-cyan-500/40 bg-cyan-500/10';
      case 'Gold':
        return 'text-casino-gold border-casino-gold/40 bg-casino-gold/10';
      case 'Silver':
        return 'text-slate-300 border-slate-400/40 bg-slate-400/10';
      default:
        return 'text-amber-600 border-amber-600/40 bg-amber-600/10';
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/80 backdrop-blur-md animate-fade-in">
      <div className="relative w-full max-w-md p-6 rounded-t-3xl sm:rounded-3xl bg-[#141923] border-t sm:border border-casino-border shadow-2xl max-h-[92vh] overflow-y-auto animate-slide-up sm:animate-scale-in">
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

        {/* User Header */}
        <div className="flex items-center gap-4 mb-6">
          <div className="relative">
            <img
              src={avatar}
              alt="Avatar"
              className="w-16 h-16 rounded-2xl object-cover border-2 border-casino-gold shadow-glow-gold"
            />
            <div className="absolute -bottom-1 -right-1 p-1 rounded-full bg-casino-gold text-black">
              <Crown className="w-3.5 h-3.5" />
            </div>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-xl font-bold text-white font-display">{username}</h2>
              <span className={`text-[10px] uppercase font-extrabold px-2 py-0.5 rounded-full border ${getTierColor(vipTier)}`}>
                {vipTier}
              </span>
            </div>
            <p className="text-xs text-slate-400 font-mono-numbers mt-0.5">
              {phone ? phone : isGuest ? 'Guest Access Mode' : 'VIP Member'}
            </p>
          </div>
        </div>

        {/* VIP Level Progress */}
        <div className="p-4 rounded-2xl bg-[#0B0E14] border border-casino-border mb-5">
          <div className="flex justify-between items-center text-xs mb-2">
            <span className="text-slate-400">VIP Loyalty Progress</span>
            <span className="text-casino-gold font-bold font-mono-numbers">{vipPoints} / 3000 XP</span>
          </div>
          <div className="w-full h-2 rounded-full bg-slate-800 overflow-hidden mb-2">
            <div
              className="h-full bg-gold-gradient rounded-full transition-all duration-500"
              style={{ width: `${Math.min(100, (vipPoints / 3000) * 100)}%` }}
            />
          </div>
          <div className="flex justify-between text-[10px] text-slate-500">
            <span>Bronze (0 XP)</span>
            <span>Silver (800)</span>
            <span>Gold (3K)</span>
            <span>VIP Diamond (10K)</span>
          </div>
        </div>

        {/* KYC Verification Status */}
        <div className="p-4 rounded-2xl bg-[#0B0E14] border border-casino-border mb-5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <ShieldCheck className={`w-5 h-5 ${kycStatus === 'verified' ? 'text-emerald-400' : 'text-amber-400'}`} />
              <div>
                <div className="text-xs font-bold text-white">KYC Verification Status</div>
                <div className="text-[11px] text-slate-400">
                  {kycStatus === 'verified'
                    ? 'Identity verified for instant withdrawals'
                    : 'Verification needed for unlimited withdrawals'}
                </div>
              </div>
            </div>
            <span
              className={`text-[10px] uppercase font-bold px-2 py-1 rounded-full border ${
                kycStatus === 'verified'
                  ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30'
                  : 'bg-amber-500/10 text-amber-400 border-amber-500/30'
              }`}
            >
              {kycStatus}
            </span>
          </div>

          {kycStatus !== 'verified' && (
            <button
              onClick={handleKyc}
              className="w-full mt-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-casino-gold text-xs font-bold transition-all border border-casino-gold/30"
            >
              {kycSuccess ? 'Verification Simulated ✓' : 'Instant 1-Click KYC Verification'}
            </button>
          )}
        </div>

        {/* Avatar Picker */}
        <div className="mb-5">
          <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider block mb-2">
            Select Avatar
          </label>
          <div className="grid grid-cols-6 gap-2">
            {AVATARS.map((avUrl, idx) => (
              <img
                key={idx}
                src={avUrl}
                alt={`Avatar ${idx}`}
                onClick={() => {
                  soundManager.playButtonTap();
                  setAvatar(avUrl);
                }}
                className={`w-12 h-12 rounded-xl object-cover cursor-pointer border-2 transition-all ${
                  avatar === avUrl ? 'border-casino-gold scale-105 shadow-glow-gold' : 'border-transparent opacity-60 hover:opacity-100'
                }`}
              />
            ))}
          </div>
        </div>

        {/* Responsible Gaming & Logout */}
        <div className="space-y-2 pt-2 border-t border-slate-800">
          <button
            onClick={() => {
              onClose();
              onOpenResponsible();
            }}
            className="w-full py-2.5 px-4 rounded-xl bg-slate-800/60 hover:bg-slate-800 text-slate-300 text-xs font-bold flex items-center justify-between"
          >
            <span>Responsible Gaming Limits</span>
            <AlertCircle className="w-4 h-4 text-amber-400" />
          </button>

          <button
            onClick={() => {
              soundManager.playButtonTap();
              logout();
              onClose();
            }}
            className="w-full py-2.5 px-4 rounded-xl bg-red-500/10 hover:bg-red-500/20 text-red-400 text-xs font-bold flex items-center justify-center gap-2 border border-red-500/20 transition-all"
          >
            <LogOut className="w-4 h-4" />
            <span>Sign Out / Switch to Guest</span>
          </button>
        </div>
      </div>
    </div>
  );
};
