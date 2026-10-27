import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface Transaction {
  id: string;
  type: 'deposit' | 'withdrawal' | 'bet' | 'win';
  amount: number;
  currency: 'real' | 'demo';
  game?: string;
  method?: string;
  status: 'completed' | 'pending' | 'failed';
  timestamp: number;
}

interface WalletState {
  realBalance: number;
  demoBalance: number;
  currencyMode: 'real' | 'demo';
  transactions: Transaction[];
  
  // Actions
  setCurrencyMode: (mode: 'real' | 'demo') => void;
  deposit: (amount: number, method: string) => void;
  withdraw: (amount: number, details: string) => { success: boolean; message: string };
  placeBet: (amount: number, game: string) => boolean;
  addWin: (amount: number, game: string) => void;
  resetDemoBalance: () => void;
  getActiveBalance: () => number;
}

export const useWalletStore = create<WalletState>()(
  persist(
    (set, get) => ({
      realBalance: 2500, // Starting simulated real INR balance
      demoBalance: 10000, // 10,000 Demo Virtual Chips
      currencyMode: 'demo', // Default to Practice/Guest mode
      transactions: [
        {
          id: 'tx_init_1',
          type: 'deposit',
          amount: 10000,
          currency: 'demo',
          method: 'Welcome Guest Grant',
          status: 'completed',
          timestamp: Date.now() - 3600000,
        },
        {
          id: 'tx_init_2',
          type: 'deposit',
          amount: 2500,
          currency: 'real',
          method: 'UPI Auto-Deposit',
          status: 'completed',
          timestamp: Date.now() - 1800000,
        }
      ],

      setCurrencyMode: (mode) => set({ currencyMode: mode }),

      getActiveBalance: () => {
        const state = get();
        return state.currencyMode === 'real' ? state.realBalance : state.demoBalance;
      },

      deposit: (amount: number, method: string) => {
        const { currencyMode } = get();
        const tx: Transaction = {
          id: `tx_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
          type: 'deposit',
          amount,
          currency: currencyMode,
          method,
          status: 'completed',
          timestamp: Date.now(),
        };

        set((state) => ({
          realBalance: currencyMode === 'real' ? state.realBalance + amount : state.realBalance,
          demoBalance: currencyMode === 'demo' ? state.demoBalance + amount : state.demoBalance,
          transactions: [tx, ...state.transactions],
        }));
      },

      withdraw: (amount: number, details: string) => {
        const { realBalance, currencyMode } = get();
        if (currencyMode === 'demo') {
          return { success: false, message: 'Practice Demo chips cannot be withdrawn!' };
        }
        if (amount < 500) {
          return { success: false, message: 'Minimum withdrawal amount is ₹500' };
        }
        if (amount > realBalance) {
          return { success: false, message: 'Insufficient real money balance' };
        }

        const tx: Transaction = {
          id: `tx_w_${Date.now()}`,
          type: 'withdrawal',
          amount,
          currency: 'real',
          method: details,
          status: 'pending',
          timestamp: Date.now(),
        };

        set((state) => ({
          realBalance: state.realBalance - amount,
          transactions: [tx, ...state.transactions],
        }));

        return { success: true, message: `Withdrawal request of ₹${amount} submitted!` };
      },

      placeBet: (amount: number, game: string) => {
        const { currencyMode, realBalance, demoBalance } = get();
        const currentBalance = currencyMode === 'real' ? realBalance : demoBalance;

        if (amount <= 0 || currentBalance < amount) {
          return false;
        }

        const tx: Transaction = {
          id: `tx_bet_${Date.now()}_${Math.random().toString(36).substring(2, 5)}`,
          type: 'bet',
          amount,
          currency: currencyMode,
          game,
          status: 'completed',
          timestamp: Date.now(),
        };

        set((state) => ({
          realBalance: currencyMode === 'real' ? state.realBalance - amount : state.realBalance,
          demoBalance: currencyMode === 'demo' ? state.demoBalance - amount : state.demoBalance,
          transactions: [tx, ...state.transactions.slice(0, 49)],
        }));

        return true;
      },

      addWin: (amount: number, game: string) => {
        if (amount <= 0) return;
        const { currencyMode } = get();
        const tx: Transaction = {
          id: `tx_win_${Date.now()}_${Math.random().toString(36).substring(2, 5)}`,
          type: 'win',
          amount,
          currency: currencyMode,
          game,
          status: 'completed',
          timestamp: Date.now(),
        };

        set((state) => ({
          realBalance: currencyMode === 'real' ? state.realBalance + amount : state.realBalance,
          demoBalance: currencyMode === 'demo' ? state.demoBalance + amount : state.demoBalance,
          transactions: [tx, ...state.transactions.slice(0, 49)],
        }));
      },

      resetDemoBalance: () => {
        set({ demoBalance: 10000 });
      },
    }),
    {
      name: 'casino_wallet_store',
    }
  )
);
