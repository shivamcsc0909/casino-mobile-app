import React, { useState, useEffect } from 'react';
import { Eye, RefreshCw, Trophy } from 'lucide-react';
import { useWalletStore } from '../../../stores/useWalletStore';
import { useUserStore } from '../../../stores/useUserStore';
import { soundManager } from '../../../lib/audio';
import { formatCurrency, triggerConfetti } from '../../../lib/utils';
import { createDeck, evaluateHand } from './HandEvaluator';
import type { Card, EvaluatedHand } from './HandEvaluator';

interface TablePlayer {
  id: string;
  name: string;
  avatar: string;
  chips: number;
  cards: Card[];
  isFolded: boolean;
  isSeen: boolean;
  currentBet: number;
  evaluated: EvaluatedHand | null;
  message?: string;
}

export const TeenPattiGame: React.FC = () => {
  const { currencyMode, placeBet, addWin, getActiveBalance } = useWalletStore();
  const { username, avatar, addVipPoints } = useUserStore();

  const [bootAmount] = useState<number>(50);
  const [currentChaal, setCurrentChaal] = useState<number>(50);
  const [pot, setPot] = useState<number>(0);
  const [turnIndex, setTurnIndex] = useState<number>(0); // 0 = Player, 1 = Kabir, 2 = Priya, 3 = Rahul
  const [gameStage, setGameStage] = useState<'idle' | 'betting' | 'showdown'>('idle');
  const [winner, setWinner] = useState<TablePlayer | null>(null);

  // 4 Table Players
  const [players, setPlayers] = useState<TablePlayer[]>([
    {
      id: 'p_user',
      name: username || 'You',
      avatar: avatar,
      chips: 5000,
      cards: [],
      isFolded: false,
      isSeen: false,
      currentBet: 0,
      evaluated: null,
    },
    {
      id: 'p_kabir',
      name: 'Kabir_Ace',
      avatar: 'https://api.dicebear.com/7.x/bottts/svg?seed=Kabir_Ace',
      chips: 4800,
      cards: [],
      isFolded: false,
      isSeen: false,
      currentBet: 0,
      evaluated: null,
      message: 'Ready to play! 🃏',
    },
    {
      id: 'p_priya',
      name: 'Priya_Queen',
      avatar: 'https://api.dicebear.com/7.x/bottts/svg?seed=Priya_Queen',
      chips: 6200,
      cards: [],
      isFolded: false,
      isSeen: false,
      currentBet: 0,
      evaluated: null,
    },
    {
      id: 'p_rahul',
      name: 'Rahul_Pro',
      avatar: 'https://api.dicebear.com/7.x/bottts/svg?seed=Rahul_Pro',
      chips: 3500,
      cards: [],
      isFolded: false,
      isSeen: false,
      currentBet: 0,
      evaluated: null,
    },
  ]);

  // Start new round
  const startNewRound = () => {
    const currentBalance = getActiveBalance();
    if (currentBalance < bootAmount) return;

    const ok = placeBet(bootAmount, 'Teen Patti (Boot)');
    if (!ok) return;

    soundManager.playCardFlip();
    addVipPoints(5);

    const deck = createDeck();
    const pCards: Card[][] = [[], [], [], []];

    // Deal 3 cards to each of the 4 players
    for (let c = 0; c < 3; c++) {
      for (let p = 0; p < 4; p++) {
        pCards[p].push(deck.pop()!);
      }
    }

    const updated: TablePlayer[] = players.map((pl, idx) => ({
      ...pl,
      cards: pCards[idx],
      isFolded: false,
      isSeen: false,
      currentBet: bootAmount,
      evaluated: evaluateHand(pCards[idx]),
      message: undefined,
    }));

    setPlayers(updated);
    setPot(bootAmount * 4);
    setCurrentChaal(bootAmount);
    setTurnIndex(0); // Player starts first
    setGameStage('betting');
    setWinner(null);
  };

  // See cards (flip)
  const handleSeeCards = () => {
    soundManager.playCardFlip();
    setPlayers((prev) =>
      prev.map((pl, idx) => (idx === 0 ? { ...pl, isSeen: true } : pl))
    );
  };

  // Player actions
  const handlePlayerPack = () => {
    soundManager.playButtonTap();
    setPlayers((prev) =>
      prev.map((pl, idx) => (idx === 0 ? { ...pl, isFolded: true } : pl))
    );
    advanceTurn();
  };

  const handlePlayerChaal = (multiplier = 1) => {
    const isPlayerSeen = players[0].isSeen;
    const betCost = (isPlayerSeen ? currentChaal * 2 : currentChaal) * multiplier;

    const currentBalance = getActiveBalance();
    if (currentBalance < betCost) return;

    const ok = placeBet(betCost, 'Teen Patti (Chaal)');
    if (!ok) return;

    soundManager.playChipSound();
    addVipPoints(Math.floor(betCost / 10));

    setPot((prev) => prev + betCost);
    setPlayers((prev) =>
      prev.map((pl, idx) =>
        idx === 0 ? { ...pl, currentBet: pl.currentBet + betCost } : pl
      )
    );
    advanceTurn();
  };

  const handlePlayerShow = () => {
    soundManager.playCashOut();
    performShowdown();
  };

  // Advance to next active player
  const advanceTurn = () => {
    setTurnIndex((prev) => (prev + 1) % 4);
  };

  // AI Bot Turns
  useEffect(() => {
    if (gameStage !== 'betting') return;

    // Check if only 1 player remains (everyone else folded)
    const activePlayers = players.filter((p) => !p.isFolded);
    if (activePlayers.length <= 1) {
      declareWinner(activePlayers[0]);
      return;
    }

    // If it's a bot's turn (index 1, 2, 3)
    if (turnIndex !== 0) {
      const currentBot = players[turnIndex];
      if (currentBot.isFolded) {
        advanceTurn();
        return;
      }

      // Simulate 1.2s thinking time for realistic play
      const timer = setTimeout(() => {
        soundManager.playCardFlip();

        // Bot decision logic based on hand score
        const hand = currentBot.evaluated!;
        const isGoodHand = hand.score >= 20000; // Pair or better

        // Random chance bot sees cards
        if (!currentBot.isSeen && Math.random() > 0.4) {
          setPlayers((prev) =>
            prev.map((p, i) => (i === turnIndex ? { ...p, isSeen: true } : p))
          );
        }

        // Active players count
        if (activePlayers.length === 2 && Math.random() > 0.6) {
          // Trigger show!
          setPlayers((prev) =>
            prev.map((p, i) =>
              i === turnIndex ? { ...p, message: 'I call SHOW! 🃏' } : p
            )
          );
          setTimeout(() => performShowdown(), 800);
          return;
        }

        if (!isGoodHand && Math.random() < 0.25) {
          // Bot packs
          setPlayers((prev) =>
            prev.map((p, i) =>
              i === turnIndex ? { ...p, isFolded: true, message: 'I pack 🏳️' } : p
            )
          );
        } else {
          // Bot chaals
          const betAmount = currentChaal;
          soundManager.playChipSound();
          setPot((prev) => prev + betAmount);
          setPlayers((prev) =>
            prev.map((p, i) =>
              i === turnIndex
                ? {
                    ...p,
                    currentBet: p.currentBet + betAmount,
                    message: Math.random() > 0.5 ? 'Chaal! 💰' : 'In! 🔥',
                  }
                : p
            )
          );
        }

        advanceTurn();
      }, 1300);

      return () => clearTimeout(timer);
    }
  }, [turnIndex, gameStage, players]);

  // Showdown resolution
  const performShowdown = () => {
    setGameStage('showdown');
    // Reveal all cards
    setPlayers((prev) => prev.map((p) => ({ ...p, isSeen: true })));

    const activePlayers = players.filter((p) => !p.isFolded);
    let bestPlayer = activePlayers[0];

    activePlayers.forEach((p) => {
      if (p.evaluated!.score > bestPlayer.evaluated!.score) {
        bestPlayer = p;
      }
    });

    declareWinner(bestPlayer);
  };

  const declareWinner = (winPlayer: TablePlayer) => {
    setWinner(winPlayer);
    setGameStage('showdown');

    if (winPlayer.id === 'p_user') {
      addWin(pot, 'Teen Patti (Pot Win)');
      soundManager.playWinChime();
      triggerConfetti();
    } else {
      soundManager.playCrashSound();
    }
  };

  const renderCard = (card: Card, isRevealed: boolean) => {
    const isRed = card.suit === '♥' || card.suit === '♦';

    if (!isRevealed) {
      return (
        <div className="w-10 h-14 sm:w-12 sm:h-16 rounded-lg bg-gradient-to-br from-red-900 to-red-950 border border-red-700/80 shadow-md flex items-center justify-center select-none">
          <div className="w-6 h-10 border border-dashed border-red-400/40 rounded flex items-center justify-center">
            <span className="text-[10px] text-red-300 font-bold">777</span>
          </div>
        </div>
      );
    }

    return (
      <div className="w-10 h-14 sm:w-12 sm:h-16 rounded-lg bg-white border border-slate-300 shadow-md flex flex-col justify-between p-1 select-none animate-flip">
        <div className={`text-[10px] font-bold leading-none ${isRed ? 'text-red-600' : 'text-black'}`}>
          {card.rank}
        </div>
        <div className={`text-base font-bold text-center leading-none ${isRed ? 'text-red-600' : 'text-black'}`}>
          {card.suit}
        </div>
        <div className={`text-[10px] font-bold self-end leading-none ${isRed ? 'text-red-600' : 'text-black'}`}>
          {card.rank}
        </div>
      </div>
    );
  };

  const userPlayer = players[0];
  const activeCount = players.filter((p) => !p.isFolded).length;

  return (
    <div className="p-2 sm:p-4 max-w-5xl mx-auto space-y-3 pb-12">
      {/* Top Table Felt Arena */}
      <div className="relative w-full min-h-[250px] sm:min-h-[320px] rounded-3xl bg-gradient-to-b from-[#0B3D2E] via-[#0E4937] to-[#08291F] border-4 border-[#C89B3C] shadow-[0_0_50px_rgba(0,0,0,0.8)_inset] overflow-hidden p-2 sm:p-4 flex flex-col justify-between">
        
        {/* Table Felt Decorative Oval */}
        <div className="absolute inset-4 sm:inset-8 border border-emerald-400/20 rounded-[80px] pointer-events-none" />

        {/* Seat 3: Top Player (Priya_Queen) */}
        <div className="flex flex-col items-center relative z-10">
          <div className={`flex flex-col items-center p-2 rounded-2xl transition-all ${
            turnIndex === 2 && gameStage === 'betting' ? 'ring-2 ring-casino-gold bg-black/40 scale-105' : 'bg-black/20'
          }`}>
            <div className="relative">
              <img
                src={players[2].avatar}
                alt={players[2].name}
                className="w-10 h-10 rounded-full border border-casino-gold/60"
              />
              {players[2].isFolded && (
                <span className="absolute inset-0 bg-black/70 rounded-full flex items-center justify-center text-[9px] font-bold text-red-400">
                  FOLD
                </span>
              )}
            </div>
            <span className="text-[11px] font-bold text-slate-200 mt-1">{players[2].name}</span>
            {players[2].message && (
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-slate-900/90 text-casino-gold font-bold shadow animate-bounce">
                {players[2].message}
              </span>
            )}
            {/* Cards */}
            <div className="flex gap-1 mt-1.5">
              {players[2].cards.map((c, i) => (
                <React.Fragment key={i}>
                  {renderCard(c, gameStage === 'showdown')}
                </React.Fragment>
              ))}
            </div>
          </div>
        </div>

        {/* Middle Row: Kabir (Left) - POT (Center) - Rahul (Right) */}
        <div className="flex items-center justify-between relative z-10 my-2 px-2 sm:px-8">
          {/* Seat 2: Left Player (Kabir_Ace) */}
          <div className={`flex flex-col items-center p-2 rounded-2xl transition-all ${
            turnIndex === 1 && gameStage === 'betting' ? 'ring-2 ring-casino-gold bg-black/40 scale-105' : 'bg-black/20'
          }`}>
            <div className="relative">
              <img
                src={players[1].avatar}
                alt={players[1].name}
                className="w-10 h-10 rounded-full border border-casino-gold/60"
              />
              {players[1].isFolded && (
                <span className="absolute inset-0 bg-black/70 rounded-full flex items-center justify-center text-[9px] font-bold text-red-400">
                  FOLD
                </span>
              )}
            </div>
            <span className="text-[11px] font-bold text-slate-200 mt-1">{players[1].name}</span>
            {players[1].message && (
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-slate-900/90 text-casino-gold font-bold shadow animate-bounce">
                {players[1].message}
              </span>
            )}
            <div className="flex gap-1 mt-1.5">
              {players[1].cards.map((c, i) => (
                <React.Fragment key={i}>
                  {renderCard(c, gameStage === 'showdown')}
                </React.Fragment>
              ))}
            </div>
          </div>

          {/* Central POT Display */}
          <div className="flex flex-col items-center justify-center p-4 rounded-3xl bg-black/60 border border-casino-gold/50 shadow-glow-gold backdrop-blur-md">
            <span className="text-[10px] uppercase font-bold text-casino-gold tracking-widest flex items-center gap-1">
              <Trophy className="w-3.5 h-3.5" />
              TABLE POT
            </span>
            <div className="text-2xl sm:text-3xl font-black text-gold-gradient font-mono-numbers my-1">
              {formatCurrency(pot, currencyMode)}
            </div>
            <span className="text-[10px] text-slate-300 font-semibold">
              Boot: {bootAmount} | Current Chaal: {currentChaal}
            </span>

            {/* Winner Toast */}
            {winner && (
              <div className="mt-2 px-3 py-1 rounded-full bg-emerald-500 text-black font-extrabold text-xs shadow-glow-emerald animate-bounce">
                🎉 {winner.name} WINS! ({winner.evaluated?.rankType})
              </div>
            )}
          </div>

          {/* Seat 4: Right Player (Rahul_Pro) */}
          <div className={`flex flex-col items-center p-2 rounded-2xl transition-all ${
            turnIndex === 3 && gameStage === 'betting' ? 'ring-2 ring-casino-gold bg-black/40 scale-105' : 'bg-black/20'
          }`}>
            <div className="relative">
              <img
                src={players[3].avatar}
                alt={players[3].name}
                className="w-10 h-10 rounded-full border border-casino-gold/60"
              />
              {players[3].isFolded && (
                <span className="absolute inset-0 bg-black/70 rounded-full flex items-center justify-center text-[9px] font-bold text-red-400">
                  FOLD
                </span>
              )}
            </div>
            <span className="text-[11px] font-bold text-slate-200 mt-1">{players[3].name}</span>
            {players[3].message && (
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-slate-900/90 text-casino-gold font-bold shadow animate-bounce">
                {players[3].message}
              </span>
            )}
            <div className="flex gap-1 mt-1.5">
              {players[3].cards.map((c, i) => (
                <React.Fragment key={i}>
                  {renderCard(c, gameStage === 'showdown')}
                </React.Fragment>
              ))}
            </div>
          </div>
        </div>

        {/* Seat 1: Bottom Player (YOU) */}
        <div className="flex flex-col items-center relative z-10">
          <div className={`flex flex-col items-center p-3 rounded-3xl transition-all ${
            turnIndex === 0 && gameStage === 'betting' ? 'ring-2 ring-casino-gold bg-black/60 shadow-glow-gold' : 'bg-black/30'
          }`}>
            <div className="flex items-center gap-3">
              <img
                src={userPlayer.avatar}
                alt="You"
                className="w-10 h-10 rounded-2xl object-cover border-2 border-casino-gold"
              />
              <div className="text-left">
                <div className="text-xs font-bold text-white flex items-center gap-1.5">
                  <span>{userPlayer.name} (You)</span>
                  <span className={`text-[10px] px-1.5 py-0.2 rounded font-bold uppercase ${
                    userPlayer.isSeen ? 'bg-blue-500/20 text-blue-400' : 'bg-amber-500/20 text-amber-300'
                  }`}>
                    {userPlayer.isSeen ? 'Seen' : 'Blind'}
                  </span>
                </div>
                {userPlayer.isSeen && userPlayer.evaluated && (
                  <span className="text-[11px] font-extrabold text-casino-gold">
                    {userPlayer.evaluated.rankType} ({userPlayer.evaluated.description})
                  </span>
                )}
              </div>
            </div>

            {/* User Cards */}
            <div className="flex gap-2 mt-2">
              {userPlayer.cards.map((c, i) => (
                <React.Fragment key={i}>
                  {renderCard(c, userPlayer.isSeen || gameStage === 'showdown')}
                </React.Fragment>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Control Console */}
      <div className="p-4 rounded-3xl bg-casino-card border border-casino-border">
        {gameStage === 'idle' || gameStage === 'showdown' ? (
          <button
            onClick={startNewRound}
            disabled={getActiveBalance() < bootAmount}
            className="w-full py-4 rounded-2xl bg-gold-gradient text-black font-black text-base tracking-wider flex items-center justify-center gap-2 shadow-glow-gold hover:brightness-110 active:scale-95 transition-all disabled:opacity-40"
          >
            <RefreshCw className="w-5 h-5" />
            <span>DEAL NEW HAND (Boot: {formatCurrency(bootAmount, currencyMode)})</span>
          </button>
        ) : (
          <div className="flex flex-col sm:flex-row items-center gap-3">
            {/* See cards button if blind */}
            {!userPlayer.isSeen && (
              <button
                onClick={handleSeeCards}
                className="w-full sm:w-auto px-5 py-3 rounded-2xl bg-slate-800 hover:bg-slate-700 text-casino-gold font-bold text-xs flex items-center justify-center gap-2 border border-casino-gold/30"
              >
                <Eye className="w-4 h-4" />
                <span>SEE CARDS</span>
              </button>
            )}

            {/* Pack (Fold) */}
            <button
              onClick={handlePlayerPack}
              disabled={turnIndex !== 0}
              className="flex-1 py-3 px-4 rounded-2xl bg-red-500/15 hover:bg-red-500/25 border border-red-500/30 text-red-400 font-bold text-xs flex items-center justify-center gap-2 disabled:opacity-30"
            >
              <span>PACK (FOLD)</span>
            </button>

            {/* Chaal (Match) */}
            <button
              onClick={() => handlePlayerChaal(1)}
              disabled={turnIndex !== 0}
              className="flex-1 py-3 px-4 rounded-2xl bg-emerald-gradient text-white font-black text-sm tracking-wide shadow-glow-emerald hover:brightness-110 active:scale-95 transition-all disabled:opacity-30"
            >
              <span>CHAAL ({formatCurrency(userPlayer.isSeen ? currentChaal * 2 : currentChaal, currencyMode)})</span>
            </button>

            {/* Showdown (Show) if 2 players remain */}
            {activeCount === 2 && (
              <button
                onClick={handlePlayerShow}
                disabled={turnIndex !== 0}
                className="flex-1 py-3 px-4 rounded-2xl bg-gold-gradient text-black font-black text-sm tracking-wide shadow-glow-gold hover:brightness-110 active:scale-95 transition-all disabled:opacity-30"
              >
                <span>SHOWDOWN 🃏</span>
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
