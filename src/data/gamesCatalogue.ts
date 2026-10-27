export interface CasinoGameInfo {
  id: string;
  title: string;
  category: 'crash' | 'table' | 'cards' | 'slots';
  zone: string;
  tag: string;
  tagColor: string;
  iconName: string;
  pictogram: string; // Emoji / visual graphic symbol
  players: string;
  minBet: number;
  maxMultiplier: string;
  description: string;
}

export const CASINO_ZONES = [
  { id: 'all', name: 'All Games', icon: '✨' },
  { id: 'crash', name: 'Neon Boulevard (Crash & Arcade)', icon: '🚀' },
  { id: 'table', name: 'The Royale Salon (Wheels)', icon: '🎯' },
  { id: 'cards', name: 'The High-Stakes Lounge (Cards)', icon: '♠' },
  { id: 'slots', name: 'The VIP Vault (Slots & Jackpots)', icon: '🎰' },
];

export const ALL_GAMES: CasinoGameInfo[] = [
  // 1. Aviator Crash
  {
    id: 'aviator',
    title: 'Aviator Crash',
    category: 'crash',
    zone: 'Neon Boulevard',
    tag: '🔥 HOTTEST',
    tagColor: 'bg-red-500/20 text-red-400 border-red-500/40',
    iconName: 'Rocket',
    pictogram: '🚀',
    players: '3,420 Active',
    minBet: 100,
    maxMultiplier: '100x+',
    description: 'Fly high with the multiplier rocket. Cash out before it explodes!',
  },
  // 2. Mines
  {
    id: 'mines',
    title: 'Mines Diamond Hunt',
    category: 'crash',
    zone: 'Neon Boulevard',
    tag: '💎 TOP CASHOUT',
    tagColor: 'bg-cyan-500/20 text-cyan-300 border-cyan-500/40',
    iconName: 'Bomb',
    pictogram: '💣',
    players: '2,190 Active',
    minBet: 50,
    maxMultiplier: '500x',
    description: 'Uncover hidden diamonds in a 5x5 grid without hitting the mines.',
  },
  // 3. Plinko
  {
    id: 'plinko',
    title: 'Plinko Fortune',
    category: 'crash',
    zone: 'Neon Boulevard',
    tag: '⚡ 1000x MAX',
    tagColor: 'bg-pink-500/20 text-pink-300 border-pink-500/40',
    iconName: 'CircleDot',
    pictogram: '🎱',
    players: '1,840 Active',
    minBet: 50,
    maxMultiplier: '1000x',
    description: 'Drop the ball through the pin pyramid into high-paying multiplier bins.',
  },
  // 4. Limbo
  {
    id: 'limbo',
    title: 'Limbo Rocket',
    category: 'crash',
    zone: 'Neon Boulevard',
    tag: '🎯 HIGH ROLLER',
    tagColor: 'bg-amber-500/20 text-amber-300 border-amber-500/40',
    iconName: 'Gauge',
    pictogram: '⚡',
    players: '1,210 Active',
    minBet: 50,
    maxMultiplier: '10000x',
    description: 'Set your target multiplier and launch. Win instantly if target is exceeded.',
  },
  // 5. Coin Flip
  {
    id: 'coinflip',
    title: 'Coin Flip Deluxe',
    category: 'crash',
    zone: 'Neon Boulevard',
    tag: '🪙 INSTANT',
    tagColor: 'bg-yellow-500/20 text-yellow-300 border-yellow-500/40',
    iconName: 'Coins',
    pictogram: '🪙',
    players: '980 Active',
    minBet: 20,
    maxMultiplier: '32x Streak',
    description: 'Guess Heads or Tails. Double your streak on every correct flip.',
  },
  // 6. Dice
  {
    id: 'dice',
    title: 'Dice Over/Under',
    category: 'crash',
    zone: 'Neon Boulevard',
    tag: '🎲 98% RTP',
    tagColor: 'bg-indigo-500/20 text-indigo-300 border-indigo-500/40',
    iconName: 'Dices',
    pictogram: '🎲',
    players: '1,450 Active',
    minBet: 20,
    maxMultiplier: '99x',
    description: 'Roll the 100-sided die. Adjust your win chance slider for custom payouts.',
  },

  // 7. European Roulette
  {
    id: 'roulette',
    title: 'European Roulette 3D',
    category: 'table',
    zone: 'The Royale Salon',
    tag: '👑 35:1 CLASSIC',
    tagColor: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/40',
    iconName: 'Disc',
    pictogram: '🎡',
    players: '2,900 Active',
    minBet: 50,
    maxMultiplier: '36x',
    description: 'Single zero European wheel with real physics, inside/outside grid, and hot numbers.',
  },
  // 8. Mega Wheel
  {
    id: 'megawheel',
    title: 'Mega Wheel 40x',
    category: 'table',
    zone: 'The Royale Salon',
    tag: '🎡 MULTIPLIER',
    tagColor: 'bg-purple-500/20 text-purple-300 border-purple-500/40',
    iconName: 'PieChart',
    pictogram: '🎡',
    players: '1,620 Active',
    minBet: 50,
    maxMultiplier: '40x',
    description: 'Spin the giant prize wheel. Bet on 1, 2, 5, 10, 20, or the rare 40x slice.',
  },

  // 9. Teen Patti Live
  {
    id: 'teenpatti',
    title: 'Teen Patti Live',
    category: 'cards',
    zone: 'The High-Stakes Lounge',
    tag: '♠ INDIAN POKER',
    tagColor: 'bg-amber-500/20 text-amber-300 border-amber-500/40',
    iconName: 'Layers',
    pictogram: '🎴',
    players: '4,100 Active',
    minBet: 50,
    maxMultiplier: 'Pot Win',
    description: '3-Card showdown against smart bots. Seen/Blind, Chaal, Pack, and authentic Trail ranking.',
  },
  // 10. Blackjack 21
  {
    id: 'blackjack',
    title: 'Blackjack 21 VIP',
    category: 'cards',
    zone: 'The High-Stakes Lounge',
    tag: '🃏 3:2 BLACKJACK',
    tagColor: 'bg-blue-500/20 text-blue-300 border-blue-500/40',
    iconName: 'Shield',
    pictogram: '🃏',
    players: '3,250 Active',
    minBet: 100,
    maxMultiplier: '2.5x',
    description: 'Beat the dealer by getting closer to 21 without busting. Hit, Stand, or Double down.',
  },
  // 11. Andar Bahar
  {
    id: 'andarbahar',
    title: 'Andar Bahar Royale',
    category: 'cards',
    zone: 'The High-Stakes Lounge',
    tag: '🇮🇳 DESI CLASSIC',
    tagColor: 'bg-orange-500/20 text-orange-300 border-orange-500/40',
    iconName: 'Split',
    pictogram: '🂠',
    players: '3,800 Active',
    minBet: 50,
    maxMultiplier: '2x',
    description: 'A Joker card is drawn. Bet whether the matching rank card lands on Andar or Bahar.',
  },
  // 12. Dragon Tiger
  {
    id: 'dragontiger',
    title: 'Dragon Tiger Duel',
    category: 'cards',
    zone: 'The High-Stakes Lounge',
    tag: '🐉 2-CARD DUEL',
    tagColor: 'bg-red-500/20 text-red-300 border-red-500/40',
    iconName: 'Swords',
    pictogram: '🐉',
    players: '2,600 Active',
    minBet: 50,
    maxMultiplier: '8:1 Tie',
    description: 'Fastest casino card duel: Dragon vs Tiger. The higher card wins instantly.',
  },
  // 13. Baccarat Royale
  {
    id: 'baccarat',
    title: 'Baccarat Royale',
    category: 'cards',
    zone: 'The High-Stakes Lounge',
    tag: '💎 VIP PUNTO BANCO',
    tagColor: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40',
    iconName: 'Crown',
    pictogram: '👑',
    players: '1,950 Active',
    minBet: 100,
    maxMultiplier: '8:1 Tie',
    description: 'Bet on Player, Banker, or Tie. Hand closest to 9 points takes the round.',
  },
  // 14. Hi-Lo Duel
  {
    id: 'hilo',
    title: 'Hi-Lo Card Duel',
    category: 'cards',
    zone: 'The High-Stakes Lounge',
    tag: '📈 STREAK WIN',
    tagColor: 'bg-teal-500/20 text-teal-300 border-teal-500/40',
    iconName: 'TrendingUp',
    pictogram: '📊',
    players: '1,150 Active',
    minBet: 20,
    maxMultiplier: '100x Streak',
    description: 'Will the next dealt card be Higher or Lower? Cash out anytime with accumulated multiplier.',
  },

  // 15. Neon Slots 777
  {
    id: 'slots',
    title: 'Neon Slots 777',
    category: 'slots',
    zone: 'The VIP Vault',
    tag: '🎰 50x WILD',
    tagColor: 'bg-purple-500/20 text-purple-300 border-purple-500/40',
    iconName: 'Sparkles',
    pictogram: '🎰',
    players: '3,100 Active',
    minBet: 100,
    maxMultiplier: '500x',
    description: '3-reel 5-payline classic neon machine with wild diamonds, turbo spins & mega jackpot.',
  },
  // 16. Dragon Fortune Slots
  {
    id: 'dragonslots',
    title: 'Dragon Fortune 888',
    category: 'slots',
    zone: 'The VIP Vault',
    tag: '🐲 888x JACKPOT',
    tagColor: 'bg-red-500/20 text-red-300 border-red-500/40',
    iconName: 'Flame',
    pictogram: '🧧',
    players: '2,400 Active',
    minBet: 100,
    maxMultiplier: '888x',
    description: 'Imperial golden dragons and lucky coins trigger mystical cascading multipliers.',
  },
  // 17. Royal Gems
  {
    id: 'royalgems',
    title: 'Royal Gems Megaways',
    category: 'slots',
    zone: 'The VIP Vault',
    tag: '💎 MEGAWAYS',
    tagColor: 'bg-blue-500/20 text-blue-300 border-blue-500/40',
    iconName: 'Diamond',
    pictogram: '💎',
    players: '1,780 Active',
    minBet: 100,
    maxMultiplier: '1000x',
    description: 'Sapphires, emeralds, and rubies line up for multi-line jewel cascades.',
  },
  // 18. Video Poker
  {
    id: 'videopoker',
    title: 'Jacks or Better Poker',
    category: 'cards',
    zone: 'The High-Stakes Lounge',
    tag: '🃏 800:1 ROYAL FLUSH',
    tagColor: 'bg-yellow-500/20 text-yellow-300 border-yellow-500/40',
    iconName: 'Award',
    pictogram: '♠',
    players: '1,320 Active',
    minBet: 50,
    maxMultiplier: '800x',
    description: '5-Card draw video poker. Hold your winning pairs and draw for the Royal Flush.',
  },
];
