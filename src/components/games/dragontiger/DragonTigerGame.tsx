import React, { useState } from 'react';
import { Play, Swords } from 'lucide-react';
import { useWalletStore } from '../../../stores/useWalletStore';
import { useUserStore } from '../../../stores/useUserStore';
import { soundManager } from '../../../lib/audio';
import { triggerHaptic } from '../../../lib/haptics';
import { formatCurrency, triggerConfetti } from '../../../lib/utils';
import { createDeck } from '../teenpatti/HandEvaluator';
import type { Card } from '../teenpatti/HandEvaluator';

export const DragonTigerGame: React.FC = () => {
  const { currencyMode, placeBet, addWin, getActiveBalance } = useWalletStore();
  const { addVipPoints } = useUserStore();

  const [betSide, setBetSide] = useState<'dragon' | 'tiger' | 'tie'>('dragon');
  const [betAmount, setBetAmount] = useState<number>(100);
  const [dragonCard, setDragonCard] = useState<Card | null>(null);
  const [tigerCard, setTigerCard] = useState<Card | null>(null);
  const [isDealing, setIsDealing] = useState<boolean>(false);
  const [winner, setWinner] = useState<'dragon' | 'tiger' | 'tie' | null>(null);

  const handlePlay = () => {
    const balance = getActiveBalance();
    if (balance < betAmount) return;

    const ok = placeBet(betAmount, `Dragon Tiger (${betSide.toUpperCase()})`);
    if (!ok) return;

    soundManager.playCardFlip();
    triggerHaptic('medium');
    addVipPoints(Math.floor(betAmount / 10));

    setIsDealing(true);
    setWinner(null);
    setDragonCard(null);
    setTigerCard(null);

    const deck = createDeck();
    const dCard = deck.pop()!;
    const tCard = deck.pop()!;

    setTimeout(() => {
      setDragonCard(dCard);
      soundManager.playCardFlip();
      triggerHaptic('light');

      setTimeout(() => {
        setTigerCard(tCard);
        soundManager.playCardFlip();
        setIsDealing(false);

        let roundWin: 'dragon' | 'tiger' | 'tie' = 'tie';
        if (dCard.value > tCard.value) roundWin = 'dragon';
        else if (tCard.value > dCard.value) roundWin = 'tiger';

        setWinner(roundWin);

        if (roundWin === betSide) {
          const mult = roundWin === 'tie' ? 9.0 : 2.0;
          const payout = Math.floor(betAmount * mult);
          addWin(payout, `Dragon Tiger (${roundWin.toUpperCase()} Win)`);
          soundManager.playWinChime();
          triggerConfetti();
          triggerHaptic('success');
        } else {
          soundManager.playCrashSound();
          triggerHaptic('warning');
        }
      }, 700);
    }, 600);
  };

  const renderCard = (card: Card | null) => {
    if (!card) {
      return (
        <div className="w-20 h-28 sm:w-24 sm:h-36 rounded-2xl bg-[#090D15] border-2 border-dashed border-slate-700 flex items-center justify-center text-slate-500 font-bold">
          ?
        </div>
      );
    }

    const isRed = card.suit === '♥' || card.suit === '♦';
    return (
      <div className="w-20 h-28 sm:w-24 sm:h-36 rounded-2xl bg-white border-2 border-casino-gold p-2 flex flex-col justify-between shadow-glow-gold animate-scale-in select-none">
        <span className={`text-sm font-bold ${isRed ? 'text-red-600' : 'text-black'}`}>
          {card.rank}
        </span>
        <span className={`text-4xl font-black text-center ${isRed ? 'text-red-600' : 'text-black'}`}>
          {card.suit}
        </span>
        <span className={`text-sm font-bold self-end ${isRed ? 'text-red-600' : 'text-black'}`}>
          {card.rank}
        </span>
      </div>
    );
  };

  return (
    <div className="p-3 sm:p-6 max-w-4xl mx-auto space-y-4 select-none animate-fade-in">
      <div className="p-6 rounded-3xl bg-gradient-to-b from-[#1C0E14] via-[#141824] to-[#0A0D14] border-2 border-casino-gold/50 shadow-glow-gold flex flex-col items-center">
        <div className="flex items-center gap-2 mb-6">
          <Swords className="w-5 h-5 text-red-400" />
          <h2 className="text-xl font-black text-white font-display uppercase tracking-widest">
            DRAGON TIGER DUEL
          </h2>
        </div>

        {/* 2-Card Duel Stage */}
        <div className="grid grid-cols-2 gap-6 sm:gap-12 w-full max-w-lg mb-6">
          {/* DRAGON */}
          <div className="flex flex-col items-center">
            <span className="text-sm font-black uppercase text-red-400 tracking-wider mb-2">
              DRAGON 🐉
            </span>
            {renderCard(dragonCard)}
            {dragonCard && (
              <span className="mt-2 text-xs font-bold text-slate-300 font-mono-numbers">
                Value: {dragonCard.value}
              </span>
            )}
          </div>

          {/* TIGER */}
          <div className="flex flex-col items-center">
            <span className="text-sm font-black uppercase text-amber-400 tracking-wider mb-2">
              TIGER 🐅
            </span>
            {renderCard(tigerCard)}
            {tigerCard && (
              <span className="mt-2 text-xs font-bold text-slate-300 font-mono-numbers">
                Value: {tigerCard.value}
              </span>
            )}
          </div>
        </div>

        {/* Winner Banner */}
        {winner && (
          <div className="px-6 py-2 rounded-full bg-emerald-500 text-black font-black text-sm uppercase shadow-glow-emerald animate-bounce">
            🎉 {winner.toUpperCase()} WINS!
          </div>
        )}
      </div>

      {/* Control Console */}
      <div className="p-4 rounded-3xl bg-casino-card border border-casino-border flex flex-col sm:flex-row items-center justify-between gap-3">
        {/* Bet Side Selection & Chips */}
        <div className="flex flex-wrap items-center gap-2 w-full sm:w-auto">
          <div className="grid grid-cols-3 gap-1.5">
            {[
              { id: 'dragon', label: 'DRAGON (2x)', color: 'text-red-400' },
              { id: 'tie', label: 'TIE (9x)', color: 'text-emerald-400' },
              { id: 'tiger', label: 'TIGER (2x)', color: 'text-amber-400' },
            ].map((item) => (
              <button
                key={item.id}
                onClick={() => setBetSide(item.id as typeof betSide)}
                disabled={isDealing}
                className={`px-3 py-2 rounded-xl font-bold text-xs border ${
                  betSide === item.id
                    ? 'bg-casino-gold/20 text-casino-gold border-casino-gold shadow-glow-gold'
                    : 'bg-slate-900 border-slate-800 text-slate-400'
                }`}
              >
                <span className={item.color}>{item.label}</span>
              </button>
            ))}
          </div>

          <div className="flex gap-1">
            {[50, 100, 250, 500].map((amt) => (
              <button
                key={amt}
                onClick={() => {
                  soundManager.playChipSound();
                  setBetAmount(amt);
                }}
                disabled={isDealing}
                className={`px-2.5 py-2 rounded-xl font-mono-numbers font-bold text-xs border ${
                  betAmount === amt
                    ? 'bg-casino-gold text-black border-casino-gold'
                    : 'bg-slate-900 border-slate-800 text-slate-400'
                }`}
              >
                {amt}
              </button>
            ))}
          </div>
        </div>

        {/* Deal Action */}
        <button
          onClick={handlePlay}
          disabled={isDealing || getActiveBalance() < betAmount}
          className="w-full sm:w-auto px-8 py-3.5 rounded-2xl bg-gold-gradient text-black font-black text-sm tracking-wider flex items-center justify-center gap-2 shadow-glow-gold hover:brightness-110 active:scale-95 transition-all disabled:opacity-40"
        >
          <Play className="w-4 h-4 fill-black" />
          <span>{isDealing ? 'DUELING...' : `DEAL (${formatCurrency(betAmount, currencyMode)})`}</span>
        </button>
      </div>
    </div>
  );
};
