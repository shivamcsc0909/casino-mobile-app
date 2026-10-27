import React, { useState } from 'react';
import { Play } from 'lucide-react';
import { useWalletStore } from '../../../stores/useWalletStore';
import { useUserStore } from '../../../stores/useUserStore';
import { soundManager } from '../../../lib/audio';
import { triggerHaptic } from '../../../lib/haptics';
import { formatCurrency, triggerConfetti } from '../../../lib/utils';
import { createDeck } from '../teenpatti/HandEvaluator';
import type { Card } from '../teenpatti/HandEvaluator';

export const AndarBaharGame: React.FC = () => {
  const { currencyMode, placeBet, addWin, getActiveBalance } = useWalletStore();
  const { addVipPoints } = useUserStore();

  const [betSide, setBetSide] = useState<'andar' | 'bahar'>('andar');
  const [betAmount, setBetAmount] = useState<number>(100);
  const [jokerCard, setJokerCard] = useState<Card | null>(null);
  const [andarCards, setAndarCards] = useState<Card[]>([]);
  const [baharCards, setBaharCards] = useState<Card[]>([]);
  const [isDealing, setIsDealing] = useState<boolean>(false);
  const [winnerSide, setWinnerSide] = useState<'andar' | 'bahar' | null>(null);

  const handleStartRound = () => {
    const balance = getActiveBalance();
    if (balance < betAmount) return;

    const ok = placeBet(betAmount, `Andar Bahar (${betSide.toUpperCase()})`);
    if (!ok) return;

    soundManager.playCardFlip();
    triggerHaptic('medium');
    addVipPoints(Math.floor(betAmount / 10));

    setIsDealing(true);
    setWinnerSide(null);
    setAndarCards([]);
    setBaharCards([]);

    const deck = createDeck();
    const joker = deck.pop()!;
    setJokerCard(joker);

    // Deal cards alternately
    const tempAndar: Card[] = [];
    const tempBahar: Card[] = [];

    let currentTurn: 'andar' | 'bahar' = 'andar';
    let step = 0;

    const dealInterval = setInterval(() => {
      if (deck.length === 0) {
        clearInterval(dealInterval);
        setIsDealing(false);
        return;
      }

      const nextCard = deck.pop()!;
      soundManager.playCardFlip();
      triggerHaptic('light');

      if (currentTurn === 'andar') {
        tempAndar.push(nextCard);
        setAndarCards([...tempAndar]);
      } else {
        tempBahar.push(nextCard);
        setBaharCards([...tempBahar]);
      }

      // Check if match
      if (nextCard.rank === joker.rank) {
        clearInterval(dealInterval);
        setIsDealing(false);
        setWinnerSide(currentTurn);

        if (currentTurn === betSide) {
          const mult = currentTurn === 'andar' ? 1.9 : 2.0;
          const win = Math.floor(betAmount * mult);
          addWin(win, `Andar Bahar (${currentTurn.toUpperCase()} Win)`);
          soundManager.playWinChime();
          triggerConfetti();
          triggerHaptic('success');
        } else {
          soundManager.playCrashSound();
          triggerHaptic('warning');
        }
        return;
      }

      currentTurn = currentTurn === 'andar' ? 'bahar' : 'andar';
      step++;
      if (step > 40) {
        clearInterval(dealInterval);
        setIsDealing(false);
      }
    }, 450);
  };

  const renderCard = (card: Card) => {
    const isRed = card.suit === '♥' || card.suit === '♦';
    return (
      <div className="w-10 h-14 sm:w-12 sm:h-16 rounded-xl bg-white border border-slate-300 shadow flex flex-col justify-between p-1 select-none animate-scale-in shrink-0">
        <div className={`text-[10px] font-bold leading-none ${isRed ? 'text-red-600' : 'text-black'}`}>
          {card.rank}
        </div>
        <div className={`text-base font-black text-center leading-none ${isRed ? 'text-red-600' : 'text-black'}`}>
          {card.suit}
        </div>
        <div className={`text-[10px] font-bold self-end leading-none ${isRed ? 'text-red-600' : 'text-black'}`}>
          {card.rank}
        </div>
      </div>
    );
  };

  return (
    <div className="p-3 sm:p-6 max-w-5xl mx-auto space-y-4 select-none animate-fade-in">
      {/* Table Arena */}
      <div className="p-5 rounded-3xl bg-gradient-to-b from-[#1E170A] via-[#121622] to-[#0A0D14] border-2 border-casino-gold/50 shadow-glow-gold flex flex-col items-center">
        {/* Central Opening Joker Card */}
        <div className="text-center mb-5">
          <span className="text-[10px] uppercase font-black text-casino-gold tracking-widest block mb-2">
            OPENING JOKER CARD
          </span>
          <div className="w-16 h-22 sm:w-20 sm:h-28 rounded-2xl bg-white border-2 border-casino-gold p-2 shadow-glow-gold mx-auto flex flex-col justify-between">
            {jokerCard ? (
              <>
                <span className={`text-xs font-bold ${jokerCard.suit === '♥' || jokerCard.suit === '♦' ? 'text-red-600' : 'text-black'}`}>
                  {jokerCard.rank}
                </span>
                <span className={`text-2xl font-black text-center ${jokerCard.suit === '♥' || jokerCard.suit === '♦' ? 'text-red-600' : 'text-black'}`}>
                  {jokerCard.suit}
                </span>
                <span className={`text-xs font-bold self-end ${jokerCard.suit === '♥' || jokerCard.suit === '♦' ? 'text-red-600' : 'text-black'}`}>
                  {jokerCard.rank}
                </span>
              </>
            ) : (
              <div className="h-full flex items-center justify-center text-slate-400 font-bold text-xs">
                ?
              </div>
            )}
          </div>
        </div>

        {/* Andar vs Bahar Dual Trays */}
        <div className="grid grid-cols-2 gap-3 w-full max-w-3xl">
          {/* ANDAR TRAY */}
          <div className={`p-4 rounded-2xl border transition-all ${
            winnerSide === 'andar'
              ? 'bg-emerald-500/20 border-emerald-400 shadow-glow-emerald'
              : 'bg-[#090D15] border-slate-800'
          }`}>
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-black uppercase text-amber-400">ANDAR (1.9x)</span>
              <span className="text-[10px] text-slate-400">{andarCards.length} Cards</span>
            </div>
            <div className="flex gap-1.5 overflow-x-auto min-h-[70px] p-1 bg-black/40 rounded-xl items-center">
              {andarCards.map((c, i) => (
                <React.Fragment key={i}>{renderCard(c)}</React.Fragment>
              ))}
            </div>
          </div>

          {/* BAHAR TRAY */}
          <div className={`p-4 rounded-2xl border transition-all ${
            winnerSide === 'bahar'
              ? 'bg-emerald-500/20 border-emerald-400 shadow-glow-emerald'
              : 'bg-[#090D15] border-slate-800'
          }`}>
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-black uppercase text-blue-400">BAHAR (2.0x)</span>
              <span className="text-[10px] text-slate-400">{baharCards.length} Cards</span>
            </div>
            <div className="flex gap-1.5 overflow-x-auto min-h-[70px] p-1 bg-black/40 rounded-xl items-center">
              {baharCards.map((c, i) => (
                <React.Fragment key={i}>{renderCard(c)}</React.Fragment>
              ))}
            </div>
          </div>
        </div>

        {/* Winner Announcement */}
        {winnerSide && (
          <div className="mt-4 px-6 py-2 rounded-full bg-emerald-500 text-black font-black text-sm uppercase shadow-glow-emerald animate-bounce">
            🎉 {winnerSide.toUpperCase()} WINS!
          </div>
        )}
      </div>

      {/* Control Console */}
      <div className="p-4 rounded-3xl bg-casino-card border border-casino-border flex flex-col sm:flex-row items-center justify-between gap-3">
        {/* Side Selector */}
        <div className="flex flex-wrap items-center gap-2 w-full sm:w-auto">
          <div className="flex gap-1">
            <button
              onClick={() => setBetSide('andar')}
              disabled={isDealing}
              className={`px-4 py-2 rounded-xl font-bold text-xs border ${
                betSide === 'andar'
                  ? 'bg-amber-500/20 text-amber-300 border-amber-500 shadow-glow-gold'
                  : 'bg-slate-900 border-slate-800 text-slate-400'
              }`}
            >
              ANDAR (1.9x)
            </button>
            <button
              onClick={() => setBetSide('bahar')}
              disabled={isDealing}
              className={`px-4 py-2 rounded-xl font-bold text-xs border ${
                betSide === 'bahar'
                  ? 'bg-blue-500/20 text-blue-300 border-blue-500 shadow-glow-gold'
                  : 'bg-slate-900 border-slate-800 text-slate-400'
              }`}
            >
              BAHAR (2.0x)
            </button>
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

        {/* Bet Amount & Deal Action */}
        <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
          <button
            onClick={handleStartRound}
            disabled={isDealing || getActiveBalance() < betAmount}
            className="w-full sm:w-auto px-8 py-3.5 rounded-2xl bg-gold-gradient text-black font-black text-sm tracking-wider flex items-center justify-center gap-2 shadow-glow-gold hover:brightness-110 active:scale-95 transition-all disabled:opacity-40"
          >
            <Play className="w-4 h-4 fill-black" />
            <span>{isDealing ? 'DEALING...' : `DEAL (${formatCurrency(betAmount, currencyMode)})`}</span>
          </button>
        </div>
      </div>
    </div>
  );
};
