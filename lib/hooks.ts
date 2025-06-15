'use client';

import { useCallback } from 'react';

export function useSound(soundUrl: string, volume = 1.0) {
  const playSound = useCallback(() => {
    const audio = new Audio(soundUrl);
    audio.volume = volume;
    audio.play().catch(error => {
      console.error('Failed to play sound:', error);
    });
  }, [soundUrl, volume]);

  return playSound;
}
