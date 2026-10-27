import React, { useState } from 'react';
import { X, CheckCircle, ShieldCheck, ArrowRight, Smartphone, Building2, CreditCard, Bitcoin } from 'lucide-react';
import { useWalletStore } from '../../stores/useWalletStore';
import { useToastStore } from '../../stores/useToastStore';
import { soundManager } from '../../lib/audio';
import { triggerConfetti } from '../../lib/utils';
import { triggerHaptic } from '../../lib/haptics';

interface DepositModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const PRESET_AMOUNTS = [500, 1000, 2500, 5000, 10000];

const PAYMENT_METHODS = [
  { id: 'upi', name: 'Instant UPI / QR', icon: Smartphone, desc: 'Google Pay, PhonePe, Paytm' },
  { id: 'netbanking', name: 'NetBanking', icon: Building2, desc: 'HDFC, ICICI, SBI, Axis' },
  { id: 'card', name: 'Credit / Debit Card', icon: CreditCard, desc: 'Visa, MasterCard, RuPay' },
  { id: 'crypto', name: 'Crypto (Instant)', icon: Bitcoin, desc: 'USDT TRC20, Bitcoin, ETH' },
];

export const DepositModal: React.FC<DepositModalProps> = ({ isOpen, onClose }) => {
  const { deposit, currencyMode } = useWalletStore();
  const { showToast } = useToastStore();
  const [amount, setAmount] = useState<number>(1000);
  const [selectedMethod, setSelectedMethod] = useState<string>('upi');
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [isSuccess, setIsSuccess] = useState<boolean>(false);

  if (!isOpen) return null;

  const handleDeposit = () => {
    if (amount <= 0 || isProcessing) return;
    setIsProcessing(true);
    soundManager.playButtonTap();
    triggerHaptic('medium');

    setTimeout(() => {
      deposit(amount, selectedMethod.toUpperCase());
      setIsProcessing(false);
      setIsSuccess(true);
      soundManager.playCashOut();
      triggerConfetti();
      triggerHaptic('success');
      showToast(`+${currencyMode === 'real' ? '₹' : '🪙 '}${amount.toLocaleString()} Credited Instantly!`, 'success');

      setTimeout(() => {
        setIsSuccess(false);
        onClose();
      }, 1500);
    }, 1200);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/80 backdrop-blur-md animate-fade-in">
      <div className="relative w-full max-w-md p-6 rounded-t-3xl sm:rounded-3xl bg-[#141923] border-t sm:border border-casino-border shadow-2xl overflow-hidden animate-slide-up sm:animate-scale-in max-h-[92vh] overflow-y-auto">
        {/* Mobile Grab Handle */}
        <div className="w-12 h-1.5 rounded-full bg-slate-700/80 mx-auto mb-3 sm:hidden" />

        {/* Close Button */}
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
          <div className="py-12 text-center">
            <div className="w-20 h-20 mx-auto mb-4 flex items-center justify-center rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 animate-bounce-subtle">
              <CheckCircle className="w-10 h-10" />
            </div>
            <h3 className="text-2xl font-bold text-white font-display">Deposit Successful!</h3>
            <p className="text-sm text-slate-400 mt-2">
              {currencyMode === 'real' ? `₹${amount.toLocaleString()}` : `${amount.toLocaleString()} Demo Chips`} credited to your wallet.
            </p>
          </div>
        ) : (
          <>
            <div className="mb-5">
              <span className="text-xs uppercase tracking-wider text-casino-gold font-bold">Secure Checkout</span>
              <h2 className="text-2xl font-black text-white font-display">
                Add Funds {currencyMode === 'demo' && '(Demo)'}
              </h2>
            </div>

            {/* Quick Amounts */}
            <div className="mb-5">
              <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2 block">
                Select Amount
              </label>
              <div className="grid grid-cols-5 gap-2 mb-3">
                {PRESET_AMOUNTS.map((val) => (
                  <button
                    key={val}
                    type="button"
                    onClick={() => {
                      soundManager.playButtonTap();
                      setAmount(val);
                    }}
                    className={`py-2 px-1 text-xs font-mono-numbers font-bold rounded-xl border transition-all ${
                      amount === val
                        ? 'bg-casino-gold/20 text-casino-gold border-casino-gold shadow-glow-gold'
                        : 'bg-slate-900 border-slate-800 text-slate-300 hover:bg-slate-800'
                    }`}
                  >
                    ₹{val >= 1000 ? `${val / 1000}k` : val}
                  </button>
                ))}
              </div>
              <div className="relative">
                <span className="absolute left-3.5 top-1/2 -translate-y-1/2 font-mono-numbers text-slate-400 font-bold">
                  {currencyMode === 'real' ? '₹' : '🪙'}
                </span>
                <input
                  type="number"
                  value={amount}
                  onChange={(e) => setAmount(Number(e.target.value))}
                  className="w-full pl-8 pr-4 py-3 rounded-2xl bg-slate-900 border border-slate-700 text-white font-mono-numbers text-lg font-bold focus:outline-none focus:border-casino-gold"
                  placeholder="Custom amount"
                />
              </div>
            </div>

            {/* Payment Methods */}
            <div className="mb-6">
              <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2 block">
                Payment Gateway
              </label>
              <div className="space-y-2">
                {PAYMENT_METHODS.map((method) => {
                  const Icon = method.icon;
                  const isSelected = selectedMethod === method.id;
                  return (
                    <div
                      key={method.id}
                      onClick={() => {
                        soundManager.playButtonTap();
                        setSelectedMethod(method.id);
                      }}
                      className={`flex items-center justify-between p-3 rounded-2xl border cursor-pointer transition-all ${
                        isSelected
                          ? 'bg-[#1E2536] border-casino-gold/60 shadow-glow-gold'
                          : 'bg-[#0F141F] border-slate-800 hover:border-slate-700'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <div className={`p-2.5 rounded-xl ${isSelected ? 'bg-casino-gold text-black' : 'bg-slate-800 text-slate-300'}`}>
                          <Icon className="w-5 h-5" />
                        </div>
                        <div>
                          <div className="text-sm font-bold text-white">{method.name}</div>
                          <div className="text-[11px] text-slate-400">{method.desc}</div>
                        </div>
                      </div>
                      <div className={`w-4 h-4 rounded-full border flex items-center justify-center ${isSelected ? 'border-casino-gold bg-casino-gold' : 'border-slate-600'}`}>
                        {isSelected && <div className="w-2 h-2 rounded-full bg-black" />}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Deposit Action Button */}
            <button
              onClick={handleDeposit}
              disabled={isProcessing || amount <= 0}
              className="w-full py-4 rounded-2xl bg-emerald-gradient text-white font-bold text-base tracking-wide flex items-center justify-center gap-2 hover:brightness-110 active:scale-95 transition-all shadow-glow-emerald disabled:opacity-50"
            >
              {isProcessing ? (
                <div className="flex items-center gap-2">
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  <span>Processing Payment...</span>
                </div>
              ) : (
                <>
                  <span>Deposit {currencyMode === 'real' ? `₹${amount.toLocaleString()}` : `${amount.toLocaleString()} Chips`}</span>
                  <ArrowRight className="w-5 h-5" />
                </>
              )}
            </button>

            <div className="flex items-center justify-center gap-1.5 mt-4 text-[11px] text-slate-400">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span>256-Bit SSL Encrypted & Mock Instant Settlement</span>
            </div>
          </>
        )}
      </div>
    </div>
  );
};
