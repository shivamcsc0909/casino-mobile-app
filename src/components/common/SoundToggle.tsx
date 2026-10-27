import React from 'react';
import { Volume2, VolumeX } from 'lucide-react';
import { useAudioStore } from '../../stores/useAudioStore';
import { soundManager } from '../../lib/audio';

export const SoundToggle: React.FC<{ className?: string }> = ({ className = '' }) => {
  const { muted, toggleMute } = useAudioStore();

  const handleToggle = () => {
    soundManager.playButtonTap();
    toggleMute();
  };

  return (
    <button
      onClick={handleToggle}
      className={`p-2 rounded-xl bg-casino-card hover:bg-casino-cardHover border border-casino-border text-slate-300 hover:text-casino-gold transition-colors ${className}`}
      title={muted ? 'Unmute Audio' : 'Mute Audio'}
    >
      {muted ? <VolumeX className="w-5 h-5 text-red-400" /> : <Volume2 className="w-5 h-5 text-casino-gold" />}
    </button>
  );
};
