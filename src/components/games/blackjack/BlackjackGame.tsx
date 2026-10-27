import React, { useState } from 'react';
import { Play, Trophy } from 'lucide-react';
import { useWalletStore } from '../../../stores/useWalletStore';
import { useUserStore } from '../../../stores/useUserStore';
import { soundManager } from '../../../lib/audio';
import { triggerHaptic } from '../../../lib/haptics';
import { formatCurrency, triggerConfetti } from '../../../lib/utils';
import { createDeck } from '../teenpatti/HandEvaluator';
import type { Card } from '../teenpatti/HandEvaluator';

export const BlackjackGame: React.FC = () => {
  const { currencyMode, placeBet, addWin, getActiveBalance } = useWalletStore();
  const { addVipPoints } = useUserStore();

  const [betAmount, setBetAmount] = useState<number>(100);
  const [deck, setDeck] = useState<Card[]>([]);
  const [playerHand, setPlayerHand] = useState<Card[]>([]);
  const [dealerHand, setDealerHand] = useState<Card[]>([]);
  const [gameState, setGameState] = useState<'betting' | 'playing' | 'dealer_turn' | 'game_over'>('betting');
  const [statusMessage, setStatusMessage] = useState<string>('Place your bet to start');
  const [isWin, setIsWin] = useState<boolean | null>(null);

  const calculateHandScore = (hand: Card[]): number => {
    let score = 0;
    let aces = 0;

    for (const card of hand) {
      if (card.rank === 'A') {
        aces += 1;
        score += 11;
      } else if (['K', 'Q', 'J', '10'].includes(card.rank)) {
        score += 10;
      } else {
        score += Number(card.rank);
      }
    }

    while (score > 21 && aces > 0) {
      score -= 10;
      aces -= 1;
    }

    return score;
  };

  const handleDeal = () => {
    const balance = getActiveBalance();
    if (balance < betAmount) return;

    const ok = placeBet(betAmount, 'Blackjack 21');
    if (!ok) return;

    soundManager.playCardFlip();
    triggerHaptic('medium');
    addVipPoints(Math.floor(betAmount / 10));

    const newDeck = createDeck();
    const p1 = newDeck.pop()!;
    const d1 = newDeck.pop()!;
    const p2 = newDeck.pop()!;
    const d2 = newDeck.pop()!;

    const pHand = [p1, p2];
    const dHand = [d1, d2];

    setDeck(newDeck);
    setPlayerHand(pHand);
    setDealerHand(dHand);
    setIsWin(null);

    const pScore = calculateHandScore(pHand);
    if (pScore === 21) {
      // Natural Blackjack!
      setGameState('game_over');
      const winAmt = Math.floor(betAmount * 2.5);
      addWin(winAmt, 'Blackjack (Natural 21)');
      setStatusMessage('BLACKJACK 21! Payout 3:2');
      setIsWin(true);
      soundManager.playWinChime();
      triggerConfetti();
      triggerHaptic('success');
    } else {
      setGameState('playing');
      setStatusMessage('Hit or Stand?');
    }
  };

  const handleHit = () => {
    if (gameState !== 'playing') return;
    soundManager.playCardFlip();
    triggerHaptic('light');

    const newDeck = [...deck];
    const newCard = newDeck.pop()!;
    const newHand = [...playerHand, newCard];

    setDeck(newDeck);
    setPlayerHand(newHand);

    const score = calculateHandScore(newHand);
    if (score > 21) {
      // Bust
      setGameState('game_over');
      setStatusMessage('BUST! Hand exceeded 21');
      setIsWin(false);
      soundManager.playCrashSound();
      triggerHaptic('warning');
    } else if (score === 21) {
      handleStand(newHand);
    }
  };

  const handleStand = (currentPHand?: Card[]) => {
    if (gameState !== 'playing' && !currentPHand) return;
    soundManager.playButtonTap();
    triggerHaptic('light');
    setGameState('dealer_turn');

    const activePHand = currentPHand || playerHand;
    const pScore = calculateHandScore(activePHand);

    let currentDHand = [...dealerHand];
    let currentDeck = [...deck];
    let dScore = calculateHandScore(currentDHand);

    // Dealer draws on 16 or lower, stands on 17
    while (dScore < 17 && currentDeck.length > 0) {
      const card = currentDeck.pop()!;
      currentDHand.push(card);
      dScore = calculateHandScore(currentDHand);
    }

    setDealerHand(currentDHand);
    setDeck(currentDeck);
    setGameState('game_over');

    if (dScore > 21) {
      // Dealer busts
      const win = betAmount * 2;
      addWin(win, 'Blackjack (Dealer Bust)');
      setStatusMessage('DEALER BUSTS! You Win!');
      setIsWin(true);
      soundManager.playWinChime();
      triggerConfetti();
      triggerHaptic('success');
    } else if (pScore > dScore) {
      const win = betAmount * 2;
      addWin(win, 'Blackjack (Higher Hand)');
      setStatusMessage(`YOU WIN! (${pScore} vs ${dScore})`);
      setIsWin(true);
      soundManager.playWinChime();
      triggerConfetti();
      triggerHaptic('success');
    } else if (pScore === dScore) {
      // Push
      addWin(betAmount, 'Blackjack (Push)');
      setStatusMessage(`PUSH! Tie at ${pScore}`);
      setIsWin(null);
    } else {
      setStatusMessage(`DEALER WINS (${dScore} vs ${pScore})`);
      setIsWin(false);
      soundManager.playCrashSound();
      triggerHaptic('warning');
    }
  };

  const renderCard = (card: Card, hide = false) => {
    if (hide) {
      return (
        <div className="w-12 h-16 sm:w-14 sm:h-20 rounded-xl bg-gradient-to-br from-blue-900 to-indigo-950 border-2 border-indigo-400/50 shadow-md flex items-center justify-center select-none">
          <div className="w-7 h-10 border border-dashed border-indigo-300/40 rounded flex items-center justify-center">
            <span className="text-[10px] text-indigo-300 font-bold">21</span>
          </div>
        </div>
      );
    }

    const isRed = card.suit === '♥' || card.suit === '♦';
    return (
      <div className="w-12 h-16 sm:w-14 sm:h-20 rounded-xl bg-white border border-slate-300 shadow-md flex flex-col justify-between p-1 select-none animate-scale-in">
        <div className={`text-xs font-bold leading-none ${isRed ? 'text-red-600' : 'text-black'}`}>
          {card.rank}
        </div>
        <div className={`text-xl font-black text-center leading-none ${isRed ? 'text-red-600' : 'text-black'}`}>
          {card.suit}
        </div>
        <div className={`text-xs font-bold self-end leading-none ${isRed ? 'text-red-600' : 'text-black'}`}>
          {card.rank}
        </div>
      </div>
    );
  };

  const pScore = calculateHandScore(playerHand);
  const dScore = gameState === 'playing' ? calculateHandScore([dealerHand[0]]) : calculateHandScore(dealerHand);

  return (
    <div className="p-2 sm:p-4 max-w-5xl mx-auto space-y-3 select-none animate-fade-in pb-12">
      {/* Landscape Casino Table Felt */}
      <div className="relative w-full min-h-[220px] sm:min-h-[280px] rounded-3xl bg-gradient-to-b from-[#092B20] via-[#0E3B2C] to-[#061F17] border-4 border-[#C89B3C] shadow-[0_0_50px_rgba(0,0,0,0.8)_inset] p-3 sm:p-5 flex flex-col justify-between">
        
        {/* Table Felt Logo Watermark */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-15">
          <span className="font-display font-black text-6xl sm:text-8xl tracking-widest text-emerald-200">
            BLACKJACK 21
          </span>
        </div>

        {/* Dealer Zone (Top) */}
        <div className="flex flex-col items-center relative z-10">
          <div className="flex items-center gap-2 mb-2">
            <span className="text-xs uppercase font-extrabold tracking-widest text-emerald-300">
              DEALER HAND
            </span>
            {dealerHand.length > 0 && (
              <span className="px-2 py-0.5 rounded-full bg-black/60 text-casino-gold font-mono-numbers text-xs font-bold border border-casino-gold/30">
                {dScore}
              </span>
            )}
          </div>
          <div className="flex gap-2">
            {dealerHand.map((c, idx) => (
              <React.Fragment key={idx}>
                {renderCard(c, idx === 1 && gameState === 'playing')}
              </React.Fragment>
            ))}
          </div>
        </div>

        {/* Center Status Banner */}
        <div className="text-center relative z-10 my-2">
          <div className={`inline-flex items-center gap-2 px-5 py-2 rounded-full font-black text-sm uppercase tracking-wider shadow-lg ${
            isWin === true
              ? 'bg-emerald-500 text-black shadow-glow-emerald animate-bounce-subtle'
              : isWin === false
              ? 'bg-red-500 text-white shadow-glow-danger'
              : 'bg-black/60 text-casino-gold border border-casino-gold/40'
          }`}>
            {isWin === true && <Trophy className="w-4 h-4 fill-black" />}
            <span>{statusMessage}</span>
          </div>
        </div>

        {/* Player Zone (Bottom) */}
        <div className="flex flex-col items-center relative z-10">
          <div className="flex gap-2 mb-2">
            {playerHand.map((c, idx) => (
              <React.Fragment key={idx}>
                {renderCard(c, false)}
              </React.Fragment>
            ))}
          </div>
          <div className="flex items-center gap-2">
            <span className="text-xs uppercase font-extrabold tracking-widest text-emerald-300">
              YOUR HAND
            </span>
            {playerHand.length > 0 && (
              <span className="px-2 py-0.5 rounded-full bg-black/60 text-casino-gold font-mono-numbers text-xs font-bold border border-casino-gold/30">
                {pScore}
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Control Console */}
      <div className="p-4 rounded-3xl bg-casino-card border border-casino-border flex flex-col sm:flex-row items-center justify-between gap-3">
        {/* Bet Selector */}
        <div className="flex items-center gap-2 w-full sm:w-auto">
          <span className="text-xs font-bold text-slate-400 uppercase">Bet:</span>
          {[50, 100, 250, 500, 1000].map((val) => (
            <button
              key={val}
              onClick={() => {
                soundManager.playChipSound();
                setBetAmount(val);
              }}
              disabled={gameState === 'playing'}
              className={`px-3 py-1.5 rounded-xl font-mono-numbers font-bold text-xs border transition-all ${
                betAmount === val
                  ? 'bg-casino-gold text-black border-casino-gold shadow-glow-gold'
                  : 'bg-slate-900 border-slate-800 text-slate-300 hover:bg-slate-800 disabled:opacity-40'
              }`}
            >
              {val}
            </button>
          ))}
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
          {gameState === 'playing' ? (
            <>
              <button
                onClick={handleHit}
                className="flex-1 sm:flex-none px-6 py-3 rounded-2xl bg-emerald-gradient text-white font-black text-sm tracking-wider shadow-glow-emerald hover:brightness-110 active:scale-95 transition-all"
              >
                HIT (+1)
              </button>
              <button
                onClick={() => handleStand()}
                className="flex-1 sm:flex-none px-6 py-3 rounded-2xl bg-red-600 hover:bg-red-500 text-white font-black text-sm tracking-wider shadow-glow-danger active:scale-95 transition-all"
              >
                STAND
              </button>
            </>
          ) : (
            <button
              onClick={handleDeal}
              disabled={getActiveBalance() < betAmount}
              className="w-full sm:w-auto px-8 py-3.5 rounded-2xl bg-gold-gradient text-black font-black text-sm tracking-wider flex items-center justify-center gap-2 shadow-glow-gold hover:brightness-110 active:scale-95 transition-all disabled:opacity-40"
            >
              <Play className="w-4 h-4 fill-black" />
              <span>DEAL ({formatCurrency(betAmount, currencyMode)})</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
