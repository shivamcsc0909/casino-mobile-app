export interface LiveWinner {
  id: string;
  user: string;
  game: string;
  amount: number;
  multiplier?: string;
  avatar: string;
  time: string;
}

export const BOT_NAMES = [
  'Rahul_Pro', 'Kabir_Ace', 'Priya_Queen', 'Arjun_Vegas',
  'Vikram_R', 'Ananya_S', 'Rohan_Bull', 'Neha_Royale',
  'Lucky_Slick', 'Dev_Highroller', 'Karan_Spin', 'Zara_Win'
];

export const BOT_MESSAGES = [
  '🚀 Let it fly past 5x!!',
  '🔥 Easy money!',
  'GG everyone 😎',
  'Cashing out early today',
  'One more round, feeling lucky!',
  'Nice hit!! 💰',
  'Watch this show down 👀',
  'Pure sequence coming up 🃏'
];

export function generateInitialWinners(): LiveWinner[] {
  const games = ['Aviator', 'European Roulette', 'Teen Patti', 'Neon Slots'];
  const results: LiveWinner[] = [];

  for (let i = 0; i < 8; i++) {
    const name = BOT_NAMES[Math.floor(Math.random() * BOT_NAMES.length)];
    const game = games[Math.floor(Math.random() * games.length)];
    const amount = Math.floor(Math.random() * 45000) + 1200;
    const mult = (1.5 + Math.random() * 12).toFixed(2);
    results.push({
      id: `win_${i}_${Date.now()}`,
      user: name,
      game,
      amount,
      multiplier: `${mult}x`,
      avatar: `https://api.dicebear.com/7.x/bottts/svg?seed=${name}`,
      time: `${Math.floor(Math.random() * 5) + 1}m ago`
    });
  }
  return results;
}
