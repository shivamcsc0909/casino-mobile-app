import confetti from 'canvas-confetti';

export function formatCurrency(amount: number, mode: 'real' | 'demo' = 'real'): string {
  const prefix = mode === 'real' ? '₹' : '🪙 ';
  return `${prefix}${amount.toLocaleString('en-IN', {
    maximumFractionDigits: 2,
    minimumFractionDigits: amount % 1 === 0 ? 0 : 2
  })}`;
}

export function triggerConfetti() {
  try {
    confetti({
      particleCount: 80,
      spread: 70,
      origin: { y: 0.6 },
      colors: ['#FFB800', '#10B981', '#3B82F6', '#EC4899', '#F59E0B']
    });
  } catch {
    // Confetti fallback
  }
}

export function triggerBigWinConfetti() {
  try {
    const end = Date.now() + 2.5 * 1000;
    const colors = ['#FFB800', '#F59E0B', '#10B981', '#ffffff'];

    (function frame() {
      confetti({
        particleCount: 4,
        angle: 60,
        spread: 55,
        origin: { x: 0 },
        colors: colors
      });
      confetti({
        particleCount: 4,
        angle: 120,
        spread: 55,
        origin: { x: 1 },
        colors: colors
      });

      if (Date.now() < end) {
        requestAnimationFrame(frame);
      }
    })();
  } catch {
    // Fallback
  }
}

// Provably Fair SHA-256 Mock / Seed Generator
export function generateSeed(): string {
  const chars = '0123456789abcdef';
  let result = '0x';
  for (let i = 0; i < 32; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
}
