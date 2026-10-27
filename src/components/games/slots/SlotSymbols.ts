export interface SlotSymbol {
  id: string;
  name: string;
  icon: string;
  multiplier: number; // 3-of-a-kind multiplier
  isWild?: boolean;
}

export const SYMBOLS: SlotSymbol[] = [
  { id: 'diamond', name: 'Diamond Wild', icon: '💎', multiplier: 50, isWild: true },
  { id: 'seven', name: 'Lucky 777', icon: '7️⃣', multiplier: 25 },
  { id: 'star', name: 'Golden Star', icon: '⭐', multiplier: 15 },
  { id: 'bar', name: 'Gold Bar', icon: '🪙', multiplier: 10 },
  { id: 'bell', name: 'Casino Bell', icon: '🔔', multiplier: 8 },
  { id: 'melon', name: 'Watermelon', icon: '🍉', multiplier: 5 },
  { id: 'cherry', name: 'Cherry', icon: '🍒', multiplier: 3 },
];

// 5 Paylines defined by row indices [col0, col1, col2]
export const PAYLINES = [
  { id: 1, name: 'Top Horizontal', indices: [0, 0, 0] },
  { id: 2, name: 'Middle Horizontal', indices: [1, 1, 1] },
  { id: 3, name: 'Bottom Horizontal', indices: [2, 2, 2] },
  { id: 4, name: 'Diagonal Top-Left to Bottom-Right', indices: [0, 1, 2] },
  { id: 5, name: 'Diagonal Bottom-Left to Top-Right', indices: [2, 1, 0] },
];

export function getRandomSymbol(): SlotSymbol {
  // Weighted probability
  const weights = [3, 8, 14, 18, 22, 25, 30]; // Diamond is rarest (3%), cherry most common
  const totalWeight = weights.reduce((a, b) => a + b, 0);
  let random = Math.floor(Math.random() * totalWeight);

  for (let i = 0; i < weights.length; i++) {
    if (random < weights[i]) {
      return SYMBOLS[i];
    }
    random -= weights[i];
  }
  return SYMBOLS[SYMBOLS.length - 1];
}
