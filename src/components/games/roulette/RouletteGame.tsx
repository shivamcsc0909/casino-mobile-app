import React, { useState, useRef, useEffect } from 'react';
import { Play, RotateCcw, Copy } from 'lucide-react';
import { useWalletStore } from '../../../stores/useWalletStore';
import { useUserStore } from '../../../stores/useUserStore';
import { soundManager } from '../../../lib/audio';
import { formatCurrency, triggerConfetti } from '../../../lib/utils';
import { BettingTable } from './BettingTable';
import type { RouletteBet } from './BettingTable';
import { StatsRibbon, RED_NUMBERS } from './StatsRibbon';

// Official European Roulette wheel order
const WHEEL_NUMBERS = [
  0, 32, 15, 19, 4, 21, 2, 25, 17, 34, 6, 27, 13, 36, 11, 30, 8, 23, 10, 5, 24, 16, 33, 1, 20, 14, 31, 9, 22, 18, 29, 7, 28, 12, 35, 3, 26
];

const CHIP_VALUES = [10, 50, 100, 500, 1000];

export const RouletteGame: React.FC = () => {
  const { currencyMode, placeBet, addWin, getActiveBalance } = useWalletStore();
  const { addVipPoints } = useUserStore();

  const [bets, setBets] = useState<RouletteBet[]>([]);
  const [selectedChip, setSelectedChip] = useState<number>(50);
  const [isSpinning, setIsSpinning] = useState<boolean>(false);
  const [winningNumber, setWinningNumber] = useState<number | null>(null);
  const [recentNumbers, setRecentNumbers] = useState<number[]>([14, 7, 32, 0, 19, 25, 3, 36, 11]);
  const [roundWin, setRoundWin] = useState<number | null>(null);

  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const wheelAngleRef = useRef<number>(0);
  const ballAngleRef = useRef<number>(0);

  const totalBet = bets.reduce((sum, b) => sum + b.amount, 0);

  // Draw the realistic roulette wheel on canvas
  const drawWheel = (wheelAngle: number, ballAngle: number, ballRadius: number) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const size = canvas.width;
    const center = size / 2;
    const radius = center - 8;
    const sectorAngle = (2 * Math.PI) / WHEEL_NUMBERS.length;

    ctx.clearRect(0, 0, size, size);

    // Outer rim metallic gold ring
    ctx.save();
    ctx.beginPath();
    ctx.arc(center, center, radius, 0, Math.PI * 2);
    ctx.fillStyle = '#1B2130';
    ctx.fill();
    ctx.lineWidth = 6;
    ctx.strokeStyle = '#FFB800';
    ctx.stroke();

    // Rotate context for wheel
    ctx.translate(center, center);
    ctx.rotate(wheelAngle);

    // Draw sectors
    WHEEL_NUMBERS.forEach((num, i) => {
      const angle = i * sectorAngle;
      ctx.beginPath();
      ctx.moveTo(0, 0);
      ctx.arc(0, 0, radius - 10, angle, angle + sectorAngle);
      ctx.closePath();

      if (num === 0) {
        ctx.fillStyle = '#059669'; // Green 0
      } else if (RED_NUMBERS.includes(num)) {
        ctx.fillStyle = '#DC2626'; // Red
      } else {
        ctx.fillStyle = '#111827'; // Black
      }
      ctx.fill();

      ctx.lineWidth = 1;
      ctx.strokeStyle = '#FFB800';
      ctx.stroke();

      // Sector Numbers
      ctx.save();
      ctx.rotate(angle + sectorAngle / 2);
      ctx.fillStyle = '#FFFFFF';
      ctx.font = 'bold 9px JetBrains Mono, sans-serif';
      ctx.textAlign = 'right';
      ctx.fillText(num.toString(), radius - 16, 3);
      ctx.restore();
    });

    // Central brass hub
    ctx.beginPath();
    ctx.arc(0, 0, 32, 0, Math.PI * 2);
    const hubGrad = ctx.createRadialGradient(0, 0, 5, 0, 0, 32);
    hubGrad.addColorStop(0, '#FFE873');
    hubGrad.addColorStop(1, '#B45309');
    ctx.fillStyle = hubGrad;
    ctx.fill();
    ctx.lineWidth = 2;
    ctx.strokeStyle = '#FFB800';
    ctx.stroke();

    ctx.restore();

    // Draw Roulette Ball
    const bx = center + Math.cos(ballAngle) * ballRadius;
    const by = center + Math.sin(ballAngle) * ballRadius;

    ctx.save();
    ctx.beginPath();
    ctx.arc(bx, by, 5, 0, Math.PI * 2);
    const ballGrad = ctx.createRadialGradient(bx - 2, by - 2, 1, bx, by, 5);
    ballGrad.addColorStop(0, '#FFFFFF');
    ballGrad.addColorStop(1, '#94A3B8');
    ctx.fillStyle = ballGrad;
    ctx.shadowColor = '#FFFFFF';
    ctx.shadowBlur = 8;
    ctx.fill();
    ctx.restore();
  };

  useEffect(() => {
    drawWheel(wheelAngleRef.current, ballAngleRef.current, 100);
  }, []);

  const handlePlaceBet = (betOption: { type: string; target: string | number }) => {
    if (isSpinning) return;
    const currentBalance = getActiveBalance();
    if (currentBalance < totalBet + selectedChip) return;

    setBets((prev) => {
      const existing = prev.find(
        (b) => b.type === betOption.type && b.target === betOption.target
      );
      if (existing) {
        return prev.map((b) =>
          b === existing ? { ...b, amount: b.amount + selectedChip } : b
        );
      }
      return [...prev, { ...betOption, amount: selectedChip }];
    });
  };

  const handleClearBets = () => {
    if (isSpinning) return;
    soundManager.playButtonTap();
    setBets([]);
  };

  const handleDoubleBets = () => {
    if (isSpinning || bets.length === 0) return;
    const currentBalance = getActiveBalance();
    if (currentBalance < totalBet * 2) return;
    soundManager.playChipSound();
    setBets((prev) => prev.map((b) => ({ ...b, amount: b.amount * 2 })));
  };

  const handleSpin = () => {
    if (isSpinning || bets.length === 0) return;

    // Deduct total bet
    const ok = placeBet(totalBet, 'European Roulette');
    if (!ok) return;

    addVipPoints(Math.floor(totalBet / 10));
    setIsSpinning(true);
    setWinningNumber(null);
    setRoundWin(null);

    // Pick random winning number
    const winner = WHEEL_NUMBERS[Math.floor(Math.random() * WHEEL_NUMBERS.length)];
    const winIndex = WHEEL_NUMBERS.indexOf(winner);

    const targetWheelAngle = Math.PI * 8; // Multiple spins
    const sectorAngle = (2 * Math.PI) / WHEEL_NUMBERS.length;
    // Align ball with winning sector
    const targetBallAngle = -Math.PI * 12 + (winIndex * sectorAngle);

    let startTime = performance.now();
    const duration = 4000; // 4s spin
    let lastTick = 0;

    const animateSpin = (now: number) => {
      const elapsed = now - startTime;
      const progress = Math.min(1, elapsed / duration);
      // Ease out cubic
      const ease = 1 - Math.pow(1 - progress, 3);

      const currentWheelAngle = ease * targetWheelAngle;
      const currentBallAngle = ease * targetBallAngle;
      // Ball drops toward inner track as it slows
      const ballRadius = 120 - ease * 35;

      wheelAngleRef.current = currentWheelAngle;
      ballAngleRef.current = currentBallAngle;

      drawWheel(currentWheelAngle, currentBallAngle, ballRadius);

      // Play tick sound periodically
      if (now - lastTick > (100 + ease * 250)) {
        soundManager.playWheelTick();
        lastTick = now;
      }

      if (progress < 1) {
        requestAnimationFrame(animateSpin);
      } else {
        // Spin finished!
        setIsSpinning(false);
        setWinningNumber(winner);
        setRecentNumbers((prev) => [winner, ...prev.slice(0, 19)]);

        // Calculate Payouts
        let totalWin = 0;
        bets.forEach((b) => {
          if (b.type === 'straight' && b.target === winner) {
            totalWin += b.amount * 36; // 35:1 payout + original bet
          } else if (b.type === 'column') {
            const col = Number(b.target);
            if (winner > 0 && (winner - col) % 3 === 0) {
              totalWin += b.amount * 3; // 2:1 payout
            }
          } else if (b.type === 'dozen') {
            const doz = Number(b.target);
            if (
              (doz === 1 && winner >= 1 && winner <= 12) ||
              (doz === 2 && winner >= 13 && winner <= 24) ||
              (doz === 3 && winner >= 25 && winner <= 36)
            ) {
              totalWin += b.amount * 3;
            }
          } else if (b.type === 'outside') {
            if (winner !== 0) {
              if (b.target === 'red' && RED_NUMBERS.includes(winner)) totalWin += b.amount * 2;
              if (b.target === 'black' && !RED_NUMBERS.includes(winner)) totalWin += b.amount * 2;
              if (b.target === 'even' && winner % 2 === 0) totalWin += b.amount * 2;
              if (b.target === 'odd' && winner % 2 !== 0) totalWin += b.amount * 2;
              if (b.target === 'low' && winner >= 1 && winner <= 18) totalWin += b.amount * 2;
              if (b.target === 'high' && winner >= 19 && winner <= 36) totalWin += b.amount * 2;
            }
          }
        });

        if (totalWin > 0) {
          addWin(totalWin, 'European Roulette');
          setRoundWin(totalWin);
          soundManager.playWinChime();
          triggerConfetti();
        }
      }
    };

    requestAnimationFrame(animateSpin);
  };

  return (
    <div className="p-3 sm:p-6 max-w-6xl mx-auto space-y-4">
      {/* Hot / Cold & History Ribbon */}
      <StatsRibbon recentNumbers={recentNumbers} />

      {/* Main Wheel & Result Banner */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 items-center">
        {/* Animated 3D/Canvas Roulette Wheel */}
        <div className="lg:col-span-1 flex flex-col items-center justify-center p-4 rounded-3xl bg-[#0E131E] border border-casino-border relative">
          <canvas
            ref={canvasRef}
            width={280}
            height={280}
            className="w-[240px] h-[240px] sm:w-[280px] sm:h-[280px] drop-shadow-[0_0_20px_rgba(255,184,0,0.25)]"
          />

          {winningNumber !== null && (
            <div className="mt-3 px-4 py-1.5 rounded-full bg-casino-card border border-casino-gold/50 flex items-center gap-2 shadow-glow-gold">
              <span className="text-xs uppercase text-slate-400 font-bold">Landed On:</span>
              <span
                className={`w-6 h-6 rounded-full flex items-center justify-center font-mono-numbers text-xs font-black ${
                  winningNumber === 0
                    ? 'bg-emerald-600 text-white'
                    : RED_NUMBERS.includes(winningNumber)
                    ? 'bg-red-600 text-white'
                    : 'bg-black text-white border border-slate-700'
                }`}
              >
                {winningNumber}
              </span>
            </div>
          )}
        </div>

        {/* Status / Controls Info */}
        <div className="lg:col-span-2 flex flex-col justify-between gap-4 p-4 rounded-3xl bg-casino-card border border-casino-border">
          <div className="flex items-center justify-between">
            <div>
              <span className="text-[10px] uppercase font-bold text-casino-gold tracking-widest">
                Single Zero European Style
              </span>
              <h2 className="text-2xl font-black text-white font-display">European Roulette</h2>
            </div>
            {roundWin !== null && (
              <div className="text-right">
                <span className="text-[10px] uppercase font-bold text-emerald-400">Round Payout</span>
                <div className="text-xl font-black text-emerald-400 font-mono-numbers">
                  +{formatCurrency(roundWin, currencyMode)}
                </div>
              </div>
            )}
          </div>

          {/* Chip Selector */}
          <div>
            <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider block mb-2">
              Select Chip Value
            </label>
            <div className="flex gap-2">
              {CHIP_VALUES.map((val) => (
                <button
                  key={val}
                  onClick={() => {
                    soundManager.playChipSound();
                    setSelectedChip(val);
                  }}
                  disabled={isSpinning}
                  className={`flex-1 py-2 rounded-xl font-mono-numbers font-extrabold text-xs border transition-all ${
                    selectedChip === val
                      ? 'bg-gold-gradient text-black border-casino-gold shadow-glow-gold scale-105'
                      : 'bg-slate-900 border-slate-800 text-slate-300 hover:bg-slate-800'
                  }`}
                >
                  {val >= 1000 ? `${val / 1000}k` : val}
                </button>
              ))}
            </div>
          </div>

          {/* Action Buttons: Clear, Double, Spin */}
          <div className="flex gap-2">
            <button
              onClick={handleClearBets}
              disabled={isSpinning || bets.length === 0}
              className="px-3 py-3 rounded-2xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold text-xs flex items-center justify-center gap-1.5 transition-all disabled:opacity-40"
            >
              <RotateCcw className="w-4 h-4" />
              <span>Clear</span>
            </button>

            <button
              onClick={handleDoubleBets}
              disabled={isSpinning || bets.length === 0}
              className="px-3 py-3 rounded-2xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold text-xs flex items-center justify-center gap-1.5 transition-all disabled:opacity-40"
            >
              <Copy className="w-4 h-4" />
              <span>2X Bet</span>
            </button>

            <button
              onClick={handleSpin}
              disabled={isSpinning || bets.length === 0}
              className="flex-1 py-3.5 rounded-2xl bg-gold-gradient text-black font-black text-sm tracking-wider flex items-center justify-center gap-2 shadow-glow-gold hover:brightness-110 active:scale-95 transition-all disabled:opacity-40"
            >
              <Play className="w-4 h-4 fill-black" />
              <span>{isSpinning ? 'SPINNING...' : `SPIN (${formatCurrency(totalBet, currencyMode)})`}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Interactive Betting Table */}
      <BettingTable
        bets={bets}
        onPlaceBet={handlePlaceBet}
        disabled={isSpinning}
      />
    </div>
  );
};
