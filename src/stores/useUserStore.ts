import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export type VIPTier = 'Bronze' | 'Silver' | 'Gold' | 'VIP Diamond';
export type KYCStatus = 'unverified' | 'pending' | 'verified';

export interface UserProfile {
  username: string;
  phone: string;
  avatar: string;
  isLoggedIn: boolean;
  isGuest: boolean;
  vipTier: VIPTier;
  vipPoints: number;
  kycStatus: KYCStatus;
  dailyBetLimit: number;
  selfExclusionActive: boolean;
}

interface UserState extends UserProfile {
  loginWithPhone: (phone: string) => void;
  loginWithSocial: (provider: string) => void;
  loginAsGuest: () => void;
  logout: () => void;
  setAvatar: (avatar: string) => void;
  submitKYC: () => void;
  setDailyLimit: (limit: number) => void;
  setSelfExclusion: (active: boolean) => void;
  addVipPoints: (pts: number) => void;
}

export const AVATARS = [
  'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=150&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=150&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?w=150&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80',
];

export const useUserStore = create<UserState>()(
  persist(
    (set, get) => ({
      username: 'Guest_7749',
      phone: '',
      avatar: AVATARS[0],
      isLoggedIn: false,
      isGuest: true,
      vipTier: 'Bronze',
      vipPoints: 120,
      kycStatus: 'unverified',
      dailyBetLimit: 50000,
      selfExclusionActive: false,

      loginWithPhone: (phone: string) => {
        set({
          isLoggedIn: true,
          isGuest: false,
          phone,
          username: `Player_${phone.slice(-4)}`,
          vipTier: 'Silver',
          kycStatus: 'pending',
        });
      },

      loginWithSocial: (provider: string) => {
        set({
          isLoggedIn: true,
          isGuest: false,
          phone: '+91 98980 12345',
          username: provider === 'Google' ? 'Alex Rivera' : 'Royale VIP',
          vipTier: 'Gold',
          kycStatus: 'verified',
        });
      },

      loginAsGuest: () => {
        set({
          isLoggedIn: false,
          isGuest: true,
          username: `Guest_${Math.floor(1000 + Math.random() * 9000)}`,
          kycStatus: 'unverified',
        });
      },

      logout: () => {
        set({
          isLoggedIn: false,
          isGuest: true,
          username: `Guest_${Math.floor(1000 + Math.random() * 9000)}`,
          phone: '',
          kycStatus: 'unverified',
          vipTier: 'Bronze',
        });
      },

      setAvatar: (avatar: string) => set({ avatar }),

      submitKYC: () => set({ kycStatus: 'verified' }),

      setDailyLimit: (limit: number) => set({ dailyBetLimit: limit }),

      setSelfExclusion: (active: boolean) => set({ selfExclusionActive: active }),

      addVipPoints: (pts: number) => {
        const nextPts = get().vipPoints + pts;
        let tier: VIPTier = 'Bronze';
        if (nextPts >= 10000) tier = 'VIP Diamond';
        else if (nextPts >= 3000) tier = 'Gold';
        else if (nextPts >= 800) tier = 'Silver';

        set({ vipPoints: nextPts, vipTier: tier });
      },
    }),
    {
      name: 'casino_user_store',
    }
  )
);
