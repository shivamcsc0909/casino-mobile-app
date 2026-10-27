import React, { useState, useEffect, useRef } from 'react';
import { Rocket, ShieldCheck, History } from 'lucide-react';
import { useWalletStore } from '../../../stores/useWalletStore';
import { useUserStore } from '../../../stores/useUserStore';
import { soundManager } from '../../../lib/audio';
import { formatCurrency, generateSeed, triggerConfetti } from '../../../lib/utils';
import { AviatorBetsList } from './AviatorBetsList';
import type { PlayerBet } from './AviatorBetsList';
import { BOT_NAMES } from '../../../lib/botSimulator';

type GameState = 'waiting' | 'in_flight' | 'crashed';

export const AviatorGame: React.FC = () => {
  const { currencyMode, placeBet, addWin, getActiveBalance } = useWalletStore();
  const { addVipPoints } = useUserStore();

  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  // Game loop states
  const [gameState, setGameState] = useState<GameState>('waiting');
  const [multiplier, setMultiplier] = useState<number>(1.0);
  const [crashPoint, setCrashPoint] = useState<number>(2.25);
  const [countdown, setCountdown] = useState<number>(4);
  const [history, setHistory] = useState<number[]>([1.35, 2.84, 1.12, 5.40, 1.95, 12.45, 1.05, 3.20]);
  const [seed, setSeed] = useState<string>(generateSeed());

  // Dual Betting Terminal states
  // Terminal 1
  const [bet1Amount, setBet1Amount] = useState<number>(100);
  const [bet1Placed, setBet1Placed] = useState<boolean>(false);
  const [bet1CashedOut, setBet1CashedOut] = useState<boolean>(false);
  const [autoCashout1, setAutoCashout1] = useState<boolean>(false);
  const [autoMult1, setAutoMult1] = useState<number>(2.0);

  // Terminal 2
  const [bet2Amount, setBet2Amount] = useState<number>(200);
  const [bet2Placed, setBet2Placed] = useState<boolean>(false);
  const [bet2CashedOut, setBet2CashedOut] = useState<boolean>(false);
  const [autoCashout2, setAutoCashout2] = useState<boolean>(false);
  const [autoMult2, setAutoMult2] = useState<number>(3.5);

  // Live bot bets
  const [botBets, setBotBets] = useState<PlayerBet[]>([]);

  // Sound ref to avoid multiple triggers per tick
  const stateRef = useRef(gameState);
  stateRef.current = gameState;
  const multRef = useRef(multiplier);
  multRef.current = multiplier;

  // Generate bot bets for the upcoming round
  const generateBotBets = () => {
    const list: PlayerBet[] = [];
    const count = 7 + Math.floor(Math.random() * 5);
    for (let i = 0; i < count; i++) {
      const name = BOT_NAMES[i % BOT_NAMES.length];
      const target = Number((1.2 + Math.random() * 6).toFixed(2));
      list.push({
        id: `bot_${i}_${Date.now()}`,
        name,
        avatar: `https://api.dicebear.com/7.x/bottts/svg?seed=${name}`,
        betAmount: [100, 200, 500, 1000, 2000][Math.floor(Math.random() * 5)],
        cashoutMult: null,
        targetCashout: target,
        isCashedOut: false,
        isBusted: false,
      });
    }
    setBotBets(list);
  };

  // Main Game Loop Controller
  useEffect(() => {
    let timer: ReturnType<typeof setTimeout>;

    if (gameState === 'waiting') {
      generateBotBets();
      setMultiplier(1.0);
      setSeed(generateSeed());

      // Decide next crash point (random weighted)
      const r = Math.random();
      let nextCrash = 1.05 + Math.random() * 3.5;
      if (r < 0.08) nextCrash = 1.01; // Instant bust
      else if (r > 0.85) nextCrash = 5 + Math.random() * 15; // Moon shot!
      setCrashPoint(Number(nextCrash.toFixed(2)));

      setCountdown(4);
      const countdownInterval = setInterval(() => {
        setCountdown((prev) => {
          if (prev <= 1) {
            clearInterval(countdownInterval);
            setGameState('in_flight');
            return 0;
          }
          return prev - 1;
        });
      }, 1000);

      return () => clearInterval(countdownInterval);
    }

    if (gameState === 'in_flight') {
      const startTime = performance.now();
      const targetCrash = crashPoint;

      const flightInterval = setInterval(() => {
        const elapsed = (performance.now() - startTime) / 1000;
        // Exponential multiplier growth: 1.00 * e^(0.09 * t^1.2)
        const currentM = Number((1.0 + Math.pow(elapsed * 0.45, 1.4)).toFixed(2));
        setMultiplier(currentM);

        // Check bot cashouts
        setBotBets((prev) =>
          prev.map((b) => {
            if (!b.isCashedOut && !b.isBusted && currentM >= b.targetCashout && currentM < targetCrash) {
              return { ...b, isCashedOut: true, cashoutMult: b.targetCashout };
            }
            return b;
          })
        );

        // Auto cashout for terminal 1
        if (bet1Placed && !bet1CashedOut && autoCashout1 && currentM >= autoMult1) {
          handleCashout1(currentM);
        }

        // Auto cashout for terminal 2
        if (bet2Placed && !bet2CashedOut && autoCashout2 && currentM >= autoMult2) {
          handleCashout2(currentM);
        }

        // Crash check
        if (currentM >= targetCrash) {
          clearInterval(flightInterval);
          setMultiplier(targetCrash);
          setGameState('crashed');
          soundManager.playCrashSound();

          // Mark remaining bots busted
          setBotBets((prev) =>
            prev.map((b) => (b.isCashedOut ? b : { ...b, isBusted: true }))
          );

          // Update history ribbon
          setHistory((prev) => [targetCrash, ...prev.slice(0, 14)]);

          // Wait 3s then start new round
          timer = setTimeout(() => {
            setBet1Placed(false);
            setBet1CashedOut(false);
            setBet2Placed(false);
            setBet2CashedOut(false);
            setGameState('waiting');
          }, 3500);
        }
      }, 50);

      return () => {
        clearInterval(flightInterval);
        clearTimeout(timer);
      };
    }
  }, [gameState, crashPoint]);

  // Terminal 1 Actions
  const handlePlaceBet1 = () => {
    if (gameState !== 'waiting' || bet1Placed) return;
    const ok = placeBet(bet1Amount, 'Aviator (Terminal 1)');
    if (ok) {
      soundManager.playChipSound();
      setBet1Placed(true);
      setBet1CashedOut(false);
      addVipPoints(Math.floor(bet1Amount / 10));
    }
  };

  const handleCashout1 = (currMult?: number) => {
    if (!bet1Placed || bet1CashedOut || gameState !== 'in_flight') return;
    const winMult = currMult || multiplier;
    const winAmount = Math.floor(bet1Amount * winMult);
    addWin(winAmount, 'Aviator (Terminal 1)');
    setBet1CashedOut(true);
    soundManager.playCashOut();
    triggerConfetti();
  };

  // Terminal 2 Actions
  const handlePlaceBet2 = () => {
    if (gameState !== 'waiting' || bet2Placed) return;
    const ok = placeBet(bet2Amount, 'Aviator (Terminal 2)');
    if (ok) {
      soundManager.playChipSound();
      setBet2Placed(true);
      setBet2CashedOut(false);
      addVipPoints(Math.floor(bet2Amount / 10));
    }
  };

  const handleCashout2 = (currMult?: number) => {
    if (!bet2Placed || bet2CashedOut || gameState !== 'in_flight') return;
    const winMult = currMult || multiplier;
    const winAmount = Math.floor(bet2Amount * winMult);
    addWin(winAmount, 'Aviator (Terminal 2)');
    setBet2CashedOut(true);
    soundManager.playCashOut();
    triggerConfetti();
  };

  // Canvas Drawing for Flight Curve & Rocket
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animId: number;

    const render = () => {
      const width = canvas.width;
      const height = canvas.height;

      ctx.clearRect(0, 0, width, height);

      // Background grid lines
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.05)';
      ctx.lineWidth = 1;
      for (let x = 40; x < width; x += 50) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, height);
        ctx.stroke();
      }
      for (let y = 30; y < height; y += 40) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(width, y);
        ctx.stroke();
      }

      if (stateRef.current === 'in_flight' || stateRef.current === 'crashed') {
        const mult = multRef.current;
        // Progress 0 to 1 based on multiplier
        const progress = Math.min(1, (mult - 1.0) / 4.0);

        const startX = 20;
        const startY = height - 20;
        const currentX = startX + progress * (width - 80);
        const currentY = startY - Math.pow(progress, 1.2) * (height - 60);

        // Multiplier Area Fill
        const gradient = ctx.createLinearGradient(0, height, currentX, currentY);
        gradient.addColorStop(0, 'rgba(239, 68, 68, 0.0)');
        gradient.addColorStop(1, stateRef.current === 'crashed' ? 'rgba(239, 68, 68, 0.25)' : 'rgba(255, 184, 0, 0.25)');

        ctx.beginPath();
        ctx.moveTo(startX, startY);
        ctx.quadraticCurveTo(startX + (currentX - startX) * 0.5, startY, currentX, currentY);
        ctx.lineTo(currentX, startY);
        ctx.closePath();
        ctx.fillStyle = gradient;
        ctx.fill();

        // Curve Line
        ctx.beginPath();
        ctx.moveTo(startX, startY);
        ctx.quadraticCurveTo(startX + (currentX - startX) * 0.5, startY, currentX, currentY);
        ctx.strokeStyle = stateRef.current === 'crashed' ? '#EF4444' : '#FFB800';
        ctx.lineWidth = 4;
        ctx.stroke();

        // Draw Rocket if in flight
        if (stateRef.current === 'in_flight') {
          ctx.save();
          ctx.translate(currentX, currentY);
          // Angle rocket slightly upward
          ctx.rotate(-0.35);

          // Rocket Body
          ctx.fillStyle = '#EF4444';
          ctx.beginPath();
          ctx.ellipse(0, 0, 16, 7, 0, 0, Math.PI * 2);
          ctx.fill();

          // Nose cone
          ctx.fillStyle = '#FFB800';
          ctx.beginPath();
          ctx.moveTo(14, -5);
          ctx.lineTo(24, 0);
          ctx.lineTo(14, 5);
          ctx.closePath();
          ctx.fill();

          // Engine Flame particle
          ctx.fillStyle = Math.random() > 0.5 ? '#FF9500' : '#FFDD00';
          ctx.beginPath();
          ctx.moveTo(-16, -4);
          ctx.lineTo(-24 - Math.random() * 8, 0);
          ctx.lineTo(-16, 4);
          ctx.closePath();
          ctx.fill();

          ctx.restore();
        } else if (stateRef.current === 'crashed') {
          // Explosion burst
          ctx.fillStyle = '#EF4444';
          ctx.font = 'bold 16px Outfit, sans-serif';
          ctx.textAlign = 'center';
          ctx.fillText('💥 FLEW AWAY', currentX, currentY - 15);
        }
      }

      animId = requestAnimationFrame(render);
    };

    render();
    return () => cancelAnimationFrame(animId);
  }, []);

  return (
    <div className="p-3 sm:p-6 max-w-6xl mx-auto space-y-4">
      {/* Provably Fair & History Ribbon */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-3 rounded-2xl bg-casino-card border border-casino-border">
        <div className="flex items-center gap-2 overflow-x-auto no-scrollbar">
          <History className="w-4 h-4 text-slate-400 shrink-0" />
          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider shrink-0">
            Recent:
          </span>
          {history.map((val, idx) => (
            <span
              key={idx}
              className={`px-2 py-0.5 rounded-lg text-xs font-mono-numbers font-bold shrink-0 ${
                val >= 5
                  ? 'bg-purple-500/20 text-purple-300 border border-purple-500/40'
                  : val >= 2
                  ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40'
                  : 'bg-slate-800 text-slate-400 border border-slate-700'
              }`}
            >
              {val.toFixed(2)}x
            </span>
          ))}
        </div>

        <div className="flex items-center gap-1.5 text-[11px] text-slate-400 shrink-0">
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
          <span className="font-mono text-[10px] text-slate-400 truncate max-w-[150px]">Seed: {seed.slice(0, 10)}...</span>
        </div>
      </div>

      {/* Main Game Stage + Live Bets Split */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
        {/* Canvas & Flight Arena */}
        <div className="lg:col-span-3 flex flex-col gap-4">
          <div className="relative w-full h-[260px] sm:h-[340px] rounded-3xl bg-gradient-to-b from-[#0F1420] to-[#080B11] border border-casino-border/80 overflow-hidden flex items-center justify-center shadow-inner">
            <canvas
              ref={canvasRef}
              width={700}
              height={340}
              className="absolute inset-0 w-full h-full pointer-events-none"
            />

            {/* Central Multiplier Display */}
            <div className="relative z-10 text-center select-none pointer-events-none">
              {gameState === 'waiting' ? (
                <div className="animate-pulse">
                  <div className="flex items-center justify-center gap-2 mb-2">
                    <Rocket className="w-6 h-6 text-casino-gold animate-bounce-subtle" />
                    <span className="text-xs uppercase font-extrabold tracking-widest text-casino-gold">
                      NEXT ROUND IN
                    </span>
                  </div>
                  <div className="text-5xl font-black text-white font-mono-numbers">{countdown}s</div>
                  <div className="w-48 h-1.5 bg-slate-800 rounded-full mx-auto mt-3 overflow-hidden">
                    <div
                      className="h-full bg-casino-gold transition-all duration-1000"
                      style={{ width: `${(countdown / 4) * 100}%` }}
                    />
                  </div>
                </div>
              ) : gameState === 'in_flight' ? (
                <div>
                  <div className="text-6xl sm:text-7xl font-black text-white font-mono-numbers drop-shadow-[0_0_35px_rgba(255,184,0,0.5)]">
                    {multiplier.toFixed(2)}x
                  </div>
                  <div className="text-xs uppercase tracking-widest text-casino-gold font-bold mt-2">
                    FLIGHT IN PROGRESS
                  </div>
                </div>
              ) : (
                <div>
                  <div className="text-5xl sm:text-6xl font-black text-red-500 font-mono-numbers drop-shadow-[0_0_30px_rgba(239,68,68,0.6)]">
                    {multiplier.toFixed(2)}x
                  </div>
                  <div className="text-xs uppercase tracking-widest text-red-400 font-extrabold mt-2">
                    CRASHED • FLEW AWAY
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* DUAL BETTING TERMINAL (Bet 1 & Bet 2) */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {/* TERMINAL 1 */}
            <div className="p-4 rounded-2xl bg-[#111622] border border-casino-border">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-bold uppercase text-slate-300">Terminal 1</span>
                <div className="flex items-center gap-2">
                  <label className="text-[10px] text-slate-400 font-semibold">Auto Cashout</label>
                  <input
                    type="checkbox"
                    checked={autoCashout1}
                    onChange={(e) => setAutoCashout1(e.target.checked)}
                    className="accent-casino-gold w-3.5 h-3.5 rounded"
                  />
                  {autoCashout1 && (
                    <input
                      type="number"
                      step="0.1"
                      min="1.1"
                      value={autoMult1}
                      onChange={(e) => setAutoMult1(Number(e.target.value))}
                      className="w-14 px-1.5 py-0.5 rounded bg-slate-900 border border-slate-700 text-xs font-mono-numbers text-center text-white"
                    />
                  )}
                </div>
              </div>

              {/* Amount selector */}
              <div className="flex items-center gap-2 mb-3">
                <div className="flex-1 relative">
                  <input
                    type="number"
                    value={bet1Amount}
                    onChange={(e) => setBet1Amount(Number(e.target.value))}
                    disabled={bet1Placed}
                    className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-white font-mono-numbers text-sm font-bold disabled:opacity-50"
                  />
                </div>
                <div className="flex gap-1">
                  {[100, 200, 500, 1000].map((amt) => (
                    <button
                      key={amt}
                      onClick={() => {
                        soundManager.playButtonTap();
                        setBet1Amount(amt);
                      }}
                      disabled={bet1Placed}
                      className="px-2 py-2 rounded-xl bg-slate-800 text-[10px] font-bold text-slate-300 hover:bg-slate-700 disabled:opacity-40"
                    >
                      +{amt}
                    </button>
                  ))}
                </div>
              </div>

              {/* Big Action Button */}
              {gameState === 'in_flight' && bet1Placed && !bet1CashedOut ? (
                <button
                  onClick={() => handleCashout1()}
                  className="w-full py-3.5 rounded-xl bg-gold-gradient text-black font-extrabold text-base tracking-wide shadow-glow-gold hover:brightness-110 active:scale-95 transition-all"
                >
                  CASH OUT {formatCurrency(Math.floor(bet1Amount * multiplier), currencyMode)}
                </button>
              ) : (
                <button
                  onClick={handlePlaceBet1}
                  disabled={gameState !== 'waiting' || bet1Placed || getActiveBalance() < bet1Amount}
                  className={`w-full py-3.5 rounded-xl font-extrabold text-base tracking-wide transition-all ${
                    bet1Placed
                      ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40'
                      : 'bg-emerald-gradient text-white hover:brightness-110 active:scale-95 shadow-glow-emerald disabled:opacity-40'
                  }`}
                >
                  {bet1Placed ? 'BET PLACED (WAITING)' : `BET ${formatCurrency(bet1Amount, currencyMode)}`}
                </button>
              )}
            </div>

            {/* TERMINAL 2 */}
            <div className="p-4 rounded-2xl bg-[#111622] border border-casino-border">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-bold uppercase text-slate-300">Terminal 2</span>
                <div className="flex items-center gap-2">
                  <label className="text-[10px] text-slate-400 font-semibold">Auto Cashout</label>
                  <input
                    type="checkbox"
                    checked={autoCashout2}
                    onChange={(e) => setAutoCashout2(e.target.checked)}
                    className="accent-casino-gold w-3.5 h-3.5 rounded"
                  />
                  {autoCashout2 && (
                    <input
                      type="number"
                      step="0.1"
                      min="1.1"
                      value={autoMult2}
                      onChange={(e) => setAutoMult2(Number(e.target.value))}
                      className="w-14 px-1.5 py-0.5 rounded bg-slate-900 border border-slate-700 text-xs font-mono-numbers text-center text-white"
                    />
                  )}
                </div>
              </div>

              {/* Amount selector */}
              <div className="flex items-center gap-2 mb-3">
                <div className="flex-1 relative">
                  <input
                    type="number"
                    value={bet2Amount}
                    onChange={(e) => setBet2Amount(Number(e.target.value))}
                    disabled={bet2Placed}
                    className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-white font-mono-numbers text-sm font-bold disabled:opacity-50"
                  />
                </div>
                <div className="flex gap-1">
                  {[200, 500, 1000, 2000].map((amt) => (
                    <button
                      key={amt}
                      onClick={() => {
                        soundManager.playButtonTap();
                        setBet2Amount(amt);
                      }}
                      disabled={bet2Placed}
                      className="px-2 py-2 rounded-xl bg-slate-800 text-[10px] font-bold text-slate-300 hover:bg-slate-700 disabled:opacity-40"
                    >
                      +{amt}
                    </button>
                  ))}
                </div>
              </div>

              {/* Big Action Button */}
              {gameState === 'in_flight' && bet2Placed && !bet2CashedOut ? (
                <button
                  onClick={() => handleCashout2()}
                  className="w-full py-3.5 rounded-xl bg-gold-gradient text-black font-extrabold text-base tracking-wide shadow-glow-gold hover:brightness-110 active:scale-95 transition-all"
                >
                  CASH OUT {formatCurrency(Math.floor(bet2Amount * multiplier), currencyMode)}
                </button>
              ) : (
                <button
                  onClick={handlePlaceBet2}
                  disabled={gameState !== 'waiting' || bet2Placed || getActiveBalance() < bet2Amount}
                  className={`w-full py-3.5 rounded-xl font-extrabold text-base tracking-wide transition-all ${
                    bet2Placed
                      ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40'
                      : 'bg-emerald-gradient text-white hover:brightness-110 active:scale-95 shadow-glow-emerald disabled:opacity-40'
                  }`}
                >
                  {bet2Placed ? 'BET PLACED (WAITING)' : `BET ${formatCurrency(bet2Amount, currencyMode)}`}
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Live Bot Bets Sidebar */}
        <div className="lg:col-span-1">
          <AviatorBetsList bets={botBets} currentMultiplier={multiplier} />
        </div>
      </div>
    </div>
  );
};
