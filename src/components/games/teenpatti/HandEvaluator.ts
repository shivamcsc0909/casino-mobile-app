export interface Card {
  suit: '♠' | '♥' | '♦' | '♣';
  rank: string; // '2'..'10', 'J', 'Q', 'K', 'A'
  value: number; // 2..14
}

export type HandRankType =
  | 'Trail (Trio)'
  | 'Pure Sequence'
  | 'Sequence'
  | 'Color (Flush)'
  | 'Pair'
  | 'High Card';

export interface EvaluatedHand {
  rankType: HandRankType;
  score: number; // For comparative evaluation
  description: string;
}

export const SUITS: Card['suit'][] = ['♠', '♥', '♦', '♣'];
export const RANKS = ['2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K', 'A'];

export function createDeck(): Card[] {
  const deck: Card[] = [];
  for (const suit of SUITS) {
    for (let i = 0; i < RANKS.length; i++) {
      deck.push({
        suit,
        rank: RANKS[i],
        value: i + 2, // 2 to 14 (Ace = 14)
      });
    }
  }
  // Shuffle Fisher-Yates
  for (let i = deck.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [deck[i], deck[j]] = [deck[j], deck[i]];
  }
  return deck;
}

export function evaluateHand(cards: Card[]): EvaluatedHand {
  if (cards.length !== 3) {
    return { rankType: 'High Card', score: 0, description: 'Incomplete' };
  }

  // Sort descending by value
  const sorted = [...cards].sort((a, b) => b.value - a.value);
  const v1 = sorted[0].value;
  const v2 = sorted[1].value;
  const v3 = sorted[2].value;

  const isFlush = sorted[0].suit === sorted[1].suit && sorted[1].suit === sorted[2].suit;

  // Check Sequence / Straight (including A-2-3 wrap)
  let isStraight = false;
  let straightHigh = v1;

  if (v1 - v2 === 1 && v2 - v3 === 1) {
    isStraight = true;
    straightHigh = v1;
  } else if (v1 === 14 && v2 === 3 && v3 === 2) {
    // A-2-3 (Special Teen Patti rule: A-2-3 is second highest sequence, or handled as 3-high straight)
    isStraight = true;
    straightHigh = 14;
  }

  // 1. Trail / Trio (Three of a Kind)
  if (v1 === v2 && v2 === v3) {
    return {
      rankType: 'Trail (Trio)',
      score: 60000 + v1,
      description: `Trail of ${sorted[0].rank}s`,
    };
  }

  // 2. Pure Sequence (Straight Flush)
  if (isStraight && isFlush) {
    return {
      rankType: 'Pure Sequence',
      score: 50000 + straightHigh,
      description: `Pure Sequence ${sorted[0].rank}-${sorted[1].rank}-${sorted[2].rank}`,
    };
  }

  // 3. Sequence (Straight)
  if (isStraight) {
    return {
      rankType: 'Sequence',
      score: 40000 + straightHigh,
      description: `Sequence ${sorted[0].rank}-${sorted[1].rank}-${sorted[2].rank}`,
    };
  }

  // 4. Color (Flush)
  if (isFlush) {
    return {
      rankType: 'Color (Flush)',
      score: 30000 + v1 * 100 + v2 * 10 + v3,
      description: `Color in ${sorted[0].suit}`,
    };
  }

  // 5. Pair
  if (v1 === v2) {
    return {
      rankType: 'Pair',
      score: 20000 + v1 * 100 + v3,
      description: `Pair of ${sorted[0].rank}s`,
    };
  } else if (v2 === v3) {
    return {
      rankType: 'Pair',
      score: 20000 + v2 * 100 + v1,
      description: `Pair of ${sorted[1].rank}s`,
    };
  } else if (v1 === v3) {
    return {
      rankType: 'Pair',
      score: 20000 + v1 * 100 + v2,
      description: `Pair of ${sorted[0].rank}s`,
    };
  }

  // 6. High Card
  return {
    rankType: 'High Card',
    score: 10000 + v1 * 100 + v2 * 10 + v3,
    description: `High Card ${sorted[0].rank}`,
  };
}
