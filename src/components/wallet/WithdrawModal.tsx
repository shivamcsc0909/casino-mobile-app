import React, { useState } from 'react';
import { X, CheckCircle, AlertCircle, ArrowUpRight } from 'lucide-react';
import { useWalletStore } from '../../stores/useWalletStore';
import { useToastStore } from '../../stores/useToastStore';
import { soundManager } from '../../lib/audio';
import { triggerHaptic } from '../../lib/haptics';

interface WithdrawModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const WithdrawModal: React.FC<WithdrawModalProps> = ({ isOpen, onClose }) => {
  const { realBalance, currencyMode, withdraw, setCurrencyMode } = useWalletStore();
  const { showToast } = useToastStore();
  const [amount, setAmount] = useState<number>(500);
  const [upiId, setUpiId] = useState<string>('user@okaxis');
  const [accountNumber, setAccountNumber] = useState<string>('918237465012');
  const [ifsc, setIfsc] = useState<string>('HDFC0001234');
  const [withdrawType, setWithdrawType] = useState<'upi' | 'bank'>('upi');
  const [errorMsg, setErrorMsg] = useState<string>('');
  const [isSuccess, setIsSuccess] = useState<boolean>(false);

  if (!isOpen) return null;

  const handleWithdraw = (e: React.FormEvent) => {
    e.preventDefault();
    soundManager.playButtonTap();
    triggerHaptic('light');
    setErrorMsg('');

    if (currencyMode === 'demo') {
      setErrorMsg('You are in Practice Mode. Please switch to Real Money to withdraw.');
      triggerHaptic('warning');
      return;
    }

    const details = withdrawType === 'upi' ? `UPI: ${upiId}` : `Bank: ${accountNumber} (${ifsc})`;
    const res = withdraw(amount, details);

    if (!res.success) {
      setErrorMsg(res.message);
      triggerHaptic('warning');
      showToast(res.message, 'warning');
      return;
    }

    soundManager.playCashOut();
    triggerHaptic('success');
    showToast(`Withdrawal of ₹${amount} Queued!`, 'success');
    setIsSuccess(true);
    setTimeout(() => {
      setIsSuccess(false);
      onClose();
    }, 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/80 backdrop-blur-md animate-fade-in">
      <div className="relative w-full max-w-md p-6 rounded-t-3xl sm:rounded-3xl bg-[#141923] border-t sm:border border-casino-border shadow-2xl overflow-hidden animate-slide-up sm:animate-scale-in max-h-[92vh] overflow-y-auto">
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

        {isSuccess ? (
          <div className="py-10 text-center">
            <div className="w-16 h-16 mx-auto mb-3 flex items-center justify-center rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 animate-bounce-subtle">
              <CheckCircle className="w-8 h-8" />
            </div>
            <h3 className="text-xl font-bold text-white font-display">Withdrawal Queued!</h3>
            <p className="text-xs text-slate-400 mt-2">
              ₹{amount.toLocaleString()} is being processed to your {withdrawType.toUpperCase()}. Estimated time: 5-15 mins.
            </p>
          </div>
        ) : (
          <>
            <div className="mb-4">
              <span className="text-xs uppercase tracking-wider text-casino-gold font-bold">Fast Payouts</span>
              <h2 className="text-2xl font-black text-white font-display">Withdraw Winnings</h2>
            </div>

            {currencyMode === 'demo' ? (
              <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/30 mb-4 text-center">
                <AlertCircle className="w-8 h-8 text-amber-400 mx-auto mb-2" />
                <p className="text-sm font-bold text-amber-300">Practice Mode Active</p>
                <p className="text-xs text-slate-300 mt-1 mb-3">
                  Demo chips are virtual and cannot be withdrawn. Switch to Real Cash to play & withdraw real payouts!
                </p>
                <button
                  type="button"
                  onClick={() => setCurrencyMode('real')}
                  className="px-4 py-2 rounded-xl bg-casino-gold text-black text-xs font-bold shadow-glow-gold"
                >
                  Switch to Real Cash
                </button>
              </div>
            ) : (
              <div className="p-3.5 rounded-2xl bg-[#0B0E14] border border-casino-border mb-4 flex justify-between items-center">
                <span className="text-xs text-slate-400">Available Real Balance</span>
                <span className="text-lg font-bold font-mono-numbers text-emerald-400">
                  ₹{realBalance.toLocaleString()}
                </span>
              </div>
            )}

            {/* Type selector */}
            <div className="grid grid-cols-2 gap-2 mb-4">
              <button
                type="button"
                onClick={() => setWithdrawType('upi')}
                className={`py-2 rounded-xl text-xs font-bold border transition-all ${
                  withdrawType === 'upi'
                    ? 'bg-casino-gold/20 text-casino-gold border-casino-gold'
                    : 'bg-slate-900 border-slate-800 text-slate-400'
                }`}
              >
                Instant UPI
              </button>
              <button
                type="button"
                onClick={() => setWithdrawType('bank')}
                className={`py-2 rounded-xl text-xs font-bold border transition-all ${
                  withdrawType === 'bank'
                    ? 'bg-casino-gold/20 text-casino-gold border-casino-gold'
                    : 'bg-slate-900 border-slate-800 text-slate-400'
                }`}
              >
                Bank Transfer
              </button>
            </div>

            <form onSubmit={handleWithdraw} className="space-y-4">
              {withdrawType === 'upi' ? (
                <div>
                  <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider block mb-1.5">
                    UPI ID (VPA)
                  </label>
                  <input
                    type="text"
                    value={upiId}
                    onChange={(e) => setUpiId(e.target.value)}
                    required
                    className="w-full px-4 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white text-sm focus:outline-none focus:border-casino-gold"
                    placeholder="e.g. mobile@upi"
                  />
                </div>
              ) : (
                <div className="space-y-3">
                  <div>
                    <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider block mb-1.5">
                      Account Number
                    </label>
                    <input
                      type="text"
                      value={accountNumber}
                      onChange={(e) => setAccountNumber(e.target.value)}
                      required
                      className="w-full px-4 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white text-sm focus:outline-none focus:border-casino-gold"
                      placeholder="e.g. 501000293847"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider block mb-1.5">
                      IFSC Code
                    </label>
                    <input
                      type="text"
                      value={ifsc}
                      onChange={(e) => setIfsc(e.target.value)}
                      required
                      className="w-full px-4 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white text-sm uppercase focus:outline-none focus:border-casino-gold"
                      placeholder="e.g. HDFC0001234"
                    />
                  </div>
                </div>
              )}

              <div>
                <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider block mb-1.5">
                  Withdrawal Amount (Min ₹500)
                </label>
                <div className="relative">
                  <span className="absolute left-3.5 top-1/2 -translate-y-1/2 font-mono-numbers text-slate-400 font-bold">₹</span>
                  <input
                    type="number"
                    value={amount}
                    min={500}
                    onChange={(e) => setAmount(Number(e.target.value))}
                    className="w-full pl-8 pr-4 py-3 rounded-2xl bg-slate-900 border border-slate-700 text-white font-mono-numbers text-lg font-bold focus:outline-none focus:border-casino-gold"
                  />
                </div>
              </div>

              {errorMsg && (
                <div className="p-3 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400 text-xs">
                  {errorMsg}
                </div>
              )}

              <button
                type="submit"
                className="w-full py-3.5 rounded-2xl bg-gold-gradient text-black font-extrabold text-sm tracking-wide flex items-center justify-center gap-2 hover:brightness-110 active:scale-95 transition-all shadow-glow-gold"
              >
                <span>Request Payout</span>
                <ArrowUpRight className="w-4 h-4" />
              </button>
            </form>
          </>
        )}
      </div>
    </div>
  );
};
