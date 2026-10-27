import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { soundManager } from '../lib/audio';

interface AudioState {
  muted: boolean;
  volume: number;
  toggleMute: () => void;
  setVolume: (v: number) => void;
}

export const useAudioStore = create<AudioState>()(
  persist(
    (set, get) => ({
      muted: false,
      volume: 0.6,
      toggleMute: () => {
        const next = !get().muted;
        soundManager.setMuted(next);
        set({ muted: next });
      },
      setVolume: (v: number) => {
        soundManager.setVolume(v);
        set({ volume: v });
      },
    }),
    {
      name: 'casino_audio_store',
      onRehydrateStorage: () => (state) => {
        if (state) {
          soundManager.setMuted(state.muted);
          soundManager.setVolume(state.volume);
        }
      }
    }
  )
);
