export interface GameTutorial {
  gameId: string;
  title: string;
  subtitle: string;
  badge: string;
  pictogram: string;
  steps: {
    number: number;
    title: string;
    description: string;
    icon: string;
  }[];
  payouts: {
    event: string;
    multiplier: string;
  }[];
  proTip: string;
}

export const GAME_TUTORIALS: Record<string, GameTutorial> = {
  aviator: {
    gameId: 'aviator',
    title: 'Aviator / Crash',
    subtitle: 'High-speed multiplier flight simulator',
    badge: '100x Potential',
    pictogram: '🚀',
    steps: [
      { number: 1, title: 'Place Your Bet', description: 'Enter bet amount on Terminal 1 or Terminal 2 before countdown ends.', icon: '💰' },
      { number: 2, title: 'Watch Multiplier Climb', description: 'The rocket flies upward, exponentially increasing the payout multiplier from 1.00x.', icon: '📈' },
      { number: 3, title: 'Cash Out Before Crash', description: 'Hit "Cash Out" before the rocket flies away to secure your profit!', icon: '🔔' },
    ],
    payouts: [
      { event: 'Cashout at 1.50x', multiplier: '1.50x Bet' },
      { event: 'Cashout at 5.00x', multiplier: '5.00x Bet' },
      { event: 'Cashout at 20.0x', multiplier: '20.0x Bet' },
      { event: 'Crash before cashout', multiplier: '0x (Loss)' },
    ],
    proTip: 'Use Terminal 1 for a safe 1.40x auto-cashout, and let Terminal 2 ride for big multiplier moonshots!',
  },
  mines: {
    gameId: 'mines',
    title: 'Mines Diamond Hunt',
    subtitle: 'Strategic grid minefield cashout',
    badge: 'Pick Your Risk',
    pictogram: '💣',
    steps: [
      { number: 1, title: 'Choose Bet & Mines Count', description: 'Select 1 to 24 hidden mines in the 5x5 grid (default: 3 mines).', icon: '⚙️' },
      { number: 2, title: 'Uncover Safe Tiles', description: 'Every diamond you reveal increases your cashout multiplier.', icon: '💎' },
      { number: 3, title: 'Cash Out Anytime', description: 'Click Cash Out to bank your winnings, or keep picking diamonds for higher multipliers.', icon: '💵' },
    ],
    payouts: [
      { event: '1st Diamond', multiplier: '1.15x Bet' },
      { event: '3rd Diamond', multiplier: '1.80x Bet' },
      { event: '6th Diamond', multiplier: '4.20x Bet' },
      { event: 'Hit a Mine', multiplier: 'Bust' },
    ],
    proTip: 'Uncovering just 3 to 4 diamonds consistently yields near 2x returns with minimal risk.',
  },
  roulette: {
    gameId: 'roulette',
    title: 'European Roulette 3D',
    subtitle: 'Single Zero European Casino Wheel',
    badge: '35:1 Straight Payout',
    pictogram: '🎡',
    steps: [
      { number: 1, title: 'Place Your Chips', description: 'Bet on single numbers (0-36), Red/Black, Even/Odd, Dozens, or Columns.', icon: '🪙' },
      { number: 2, title: 'Spin the Wheel', description: 'The wheel turns clockwise while the ivory ball spins counter-clockwise.', icon: '🔄' },
      { number: 3, title: 'Collect Winning Pockets', description: 'Prizes are paid according to the sector where the ball settles.', icon: '🏆' },
    ],
    payouts: [
      { event: 'Straight Up (Single Number)', multiplier: '35:1' },
      { event: 'Column / Dozen', multiplier: '2:1' },
      { event: 'Red / Black / Even / Odd', multiplier: '1:1' },
    ],
    proTip: 'Outside bets (Red/Black) have a 48.6% probability—ideal for steady bankroll growth.',
  },
  teenpatti: {
    gameId: 'teenpatti',
    title: 'Teen Patti Live',
    subtitle: 'Traditional Indian 3-Card Poker',
    badge: 'Trail is King',
    pictogram: '🎴',
    steps: [
      { number: 1, title: 'Boot & Deal', description: 'Every player contributes the boot amount and receives 3 face-down cards.', icon: '🃏' },
      { number: 2, title: 'Blind vs Seen', description: 'Play Blind for half price, or "See Cards" and bet full Chaal.', icon: '👁️' },
      { number: 3, title: 'Showdown', description: 'Best hand wins the pot: Trail > Pure Sequence > Sequence > Color > Pair > High Card.', icon: '👑' },
    ],
    payouts: [
      { event: 'Trail (AAA, KKK...)', multiplier: 'Highest Rank' },
      { event: 'Pure Sequence (AKQ suited)', multiplier: '2nd Highest' },
      { event: 'Color / Flush', multiplier: 'Mid Rank' },
    ],
    proTip: 'If your cards are weak, pack early to save your chips for stronger hands.',
  },
  blackjack: {
    gameId: 'blackjack',
    title: 'Blackjack 21 VIP',
    subtitle: 'Classic Player vs Dealer Card Duel',
    badge: '3:2 Blackjack',
    pictogram: '🃏',
    steps: [
      { number: 1, title: 'Deal Initial Cards', description: 'You and Dealer each get 2 cards (Dealer hides 1 card).', icon: '🂠' },
      { number: 2, title: 'Hit or Stand', description: 'Ask for another card (Hit) or hold (Stand) to get as close to 21 without busting.', icon: '✋' },
      { number: 3, title: 'Dealer Turn', description: 'Dealer must draw until 17 or higher. Beat the dealer score to win!', icon: '🏆' },
    ],
    payouts: [
      { event: 'Natural Blackjack (A + 10/J/Q/K)', multiplier: '3:2 (2.5x)' },
      { event: 'Standard Win', multiplier: '1:1 (2.0x)' },
      { event: 'Push (Tie)', multiplier: 'Bet Refunded' },
    ],
    proTip: 'Always stand on hard 17 or higher, and double down when you hold 11 against dealer 6.',
  },
  andarbahar: {
    gameId: 'andarbahar',
    title: 'Andar Bahar Royale',
    subtitle: 'Fast-Paced Indian Card Match',
    badge: 'Pure Desi Action',
    pictogram: '🂠',
    steps: [
      { number: 1, title: 'Joker Card Drawn', description: 'The dealer reveals a central opening card (e.g., 8 of Spades).', icon: '🃏' },
      { number: 2, title: 'Bet on Andar or Bahar', description: 'Guess which side will receive a card of the identical rank first.', icon: '↔️' },
      { number: 3, title: 'Deal to Match', description: 'Cards are dealt alternately. The matching card wins the round!', icon: '🎯' },
    ],
    payouts: [
      { event: 'Andar Match', multiplier: '1.90x' },
      { event: 'Bahar Match', multiplier: '2.00x' },
    ],
    proTip: 'Since Andar receives the first card, it statistically hits slightly more often.',
  },
  dragontiger: {
    gameId: 'dragontiger',
    title: 'Dragon Tiger Duel',
    subtitle: 'Fastest 2-Card Casino Game',
    badge: 'Instant Result',
    pictogram: '🐉',
    steps: [
      { number: 1, title: 'Place Your Bet', description: 'Bet on Dragon, Tiger, or a Tie.', icon: '🪙' },
      { number: 2, title: 'Two Cards Dealt', description: '1 card to Dragon, 1 card to Tiger (King is high, Ace is low).', icon: '🎴' },
      { number: 3, title: 'High Card Wins', description: 'The side with the higher card score wins immediately.', icon: '⚡' },
    ],
    payouts: [
      { event: 'Dragon Win', multiplier: '2.0x' },
      { event: 'Tiger Win', multiplier: '2.0x' },
      { event: 'Tie Match', multiplier: '9.0x (8:1)' },
    ],
    proTip: 'Avoid betting on Tie frequently; stick to Dragon or Tiger for a lower house edge.',
  },
  baccarat: {
    gameId: 'baccarat',
    title: 'Baccarat Royale',
    subtitle: 'Classic Punto Banco',
    badge: 'Low House Edge',
    pictogram: '👑',
    steps: [
      { number: 1, title: 'Choose Your Side', description: 'Bet on Player, Banker, or Tie.', icon: '🪙' },
      { number: 2, title: 'Sum Closest to 9', description: '10s and face cards count as 0. 9 is the highest possible hand.', icon: '🎲' },
      { number: 3, title: 'Natural & Third Card', description: 'Hands with 8 or 9 natural win without extra draws.', icon: '🏆' },
    ],
    payouts: [
      { event: 'Player Win', multiplier: '2.0x' },
      { event: 'Banker Win', multiplier: '1.95x' },
      { event: 'Tie', multiplier: '9.0x' },
    ],
    proTip: 'Banker bet has the lowest casino edge in the entire casino (1.06%).',
  },
  slots: {
    gameId: 'slots',
    title: 'Neon Slots 777',
    subtitle: '3-Reel Classic Neon Slot Machine',
    badge: '50x Diamond Wild',
    pictogram: '🎰',
    steps: [
      { number: 1, title: 'Set Line Bet', description: 'Choose your bet per line across 5 fixed paylines.', icon: '🪙' },
      { number: 2, title: 'Spin the Reels', description: 'Click Spin, or activate Turbo Mode and Auto-Spin for rapid play.', icon: '⚡' },
      { number: 3, title: 'Hit 3-of-a-Kind', description: 'Match symbols across horizontal or diagonal lines to win!', icon: '✨' },
    ],
    payouts: [
      { event: '3x Wild Diamonds', multiplier: '50x Line Bet' },
      { event: '3x Lucky 777s', multiplier: '25x Line Bet' },
      { event: '3x Gold Bars', multiplier: '10x Line Bet' },
    ],
    proTip: 'Wild Diamonds substitute for any fruit or bell to complete winning paylines.',
  },
  plinko: {
    gameId: 'plinko',
    title: 'Plinko Fortune',
    subtitle: 'Gravity Peg Drop Simulation',
    badge: '1000x Edge Bins',
    pictogram: '🎱',
    steps: [
      { number: 1, title: 'Select Chip & Risk', description: 'Choose your bet amount and drop quantity.', icon: '🪙' },
      { number: 2, title: 'Ball Bounces Down', description: 'Ball navigates pins with true physical collisions.', icon: '📐' },
      { number: 3, title: 'Outer Bins Pay Big', description: 'Center bins pay 0.2x–1x, outer edge bins pay up to 1000x!', icon: '💥' },
    ],
    payouts: [
      { event: 'Far Outer Bins', multiplier: '29x to 1000x' },
      { event: 'Mid Bins', multiplier: '2x to 5x' },
      { event: 'Center Bins', multiplier: '0.2x to 0.5x' },
    ],
    proTip: 'Drop multiple balls in rapid succession to create multiple multiplier payouts!',
  },
  limbo: {
    gameId: 'limbo',
    title: 'Limbo Rocket',
    subtitle: 'Instant Target Multiplier Burst',
    badge: 'Set Your Multiplier',
    pictogram: '⚡',
    steps: [
      { number: 1, title: 'Set Target Multiplier', description: 'Enter any target from 1.1x up to 10,000x.', icon: '🎯' },
      { number: 2, title: 'Click Bet', description: 'The random multiplier generates instantly.', icon: '🚀' },
      { number: 3, title: 'Beat The Target', description: 'If the rolled multiplier is >= target, you win target x bet!', icon: '💰' },
    ],
    payouts: [
      { event: 'Target Met', multiplier: 'Target x Bet' },
      { event: 'Under Target', multiplier: '0x' },
    ],
    proTip: 'Targeting 2.0x gives you a 49.5% win probability—great for Martingale strategies.',
  },
  coinflip: {
    gameId: 'coinflip',
    title: 'Coin Flip Deluxe',
    subtitle: 'Heads or Tails Streak Guesser',
    badge: '1.96x Double',
    pictogram: '🪙',
    steps: [
      { number: 1, title: 'Choose Heads or Tails', description: 'Pick your lucky side before each flip.', icon: '🪙' },
      { number: 2, title: '3D Gold Coin Flips', description: 'Watch the coin spin in 3D and land.', icon: '🔄' },
      { number: 3, title: 'Build Win Streak', description: 'Cash out anytime or let it ride to double each consecutive win.', icon: '📈' },
    ],
    payouts: [
      { event: '1 Correct Flip', multiplier: '1.96x' },
      { event: '2 Correct Flips', multiplier: '3.84x' },
      { event: '3 Correct Flips', multiplier: '7.52x' },
    ],
    proTip: 'Cashing out after 2 consecutive wins locks in nearly 4x profit with high frequency.',
  },
  dice: {
    gameId: 'dice',
    title: 'Dice Over/Under',
    subtitle: '100-Sided Roll Predictor',
    badge: 'Custom Win Chance',
    pictogram: '🎲',
    steps: [
      { number: 1, title: 'Adjust Target Slider', description: 'Drag the slider to pick Roll Over or Roll Under.', icon: '🎚️' },
      { number: 2, title: 'View Multiplier', description: 'Higher difficulty yields higher multipliers (up to 99x).', icon: '📊' },
      { number: 3, title: 'Roll Dice', description: 'If roll falls in the green zone, you win immediately.', icon: '🎲' },
    ],
    payouts: [
      { event: '50% Win Chance', multiplier: '1.98x' },
      { event: '25% Win Chance', multiplier: '3.96x' },
      { event: '10% Win Chance', multiplier: '9.90x' },
    ],
    proTip: 'Use a 65% win chance for steady, lower-volatility accumulation.',
  },
  hilo: {
    gameId: 'hilo',
    title: 'Hi-Lo Card Duel',
    subtitle: 'Higher or Lower Card Chain',
    badge: 'Continuous Multiplier',
    pictogram: '📊',
    steps: [
      { number: 1, title: 'Current Card Shown', description: 'Look at the active face-up card.', icon: '🂠' },
      { number: 2, title: 'Guess Higher or Lower', description: 'Predict if next card will be Higher or Lower.', icon: '📈' },
      { number: 3, title: 'Cash Out or Continue', description: 'Every correct guess multiplies your pot.', icon: '💵' },
    ],
    payouts: [
      { event: 'Correct Guess', multiplier: '1.2x to 5.0x' },
      { event: 'Incorrect Guess', multiplier: 'Bust' },
    ],
    proTip: 'When you get an Ace (low) or King (high), the odds of a correct guess exceed 90%!',
  },
};

export function getTutorialForGame(gameId: string): GameTutorial {
  return (
    GAME_TUTORIALS[gameId] || {
      gameId,
      title: 'Casino Game Briefing',
      subtitle: 'Standard rules & mechanics',
      badge: 'Fair Play',
      pictogram: '🎲',
      steps: [
        { number: 1, title: 'Place Your Chips', description: 'Select your bet size from available chip denominations.', icon: '🪙' },
        { number: 2, title: 'Start Round', description: 'Initiate the game round and observe the animation.', icon: '▶️' },
        { number: 3, title: 'Win Payout', description: 'Winnings are automatically credited to your wallet.', icon: '🏆' },
      ],
      payouts: [
        { event: 'Standard Win', multiplier: '2.0x' },
        { event: 'Special Feature', multiplier: '10x to 50x' },
      ],
      proTip: 'Start in Demo Practice Mode to test strategies before switching to Real Money.',
    }
  );
}
