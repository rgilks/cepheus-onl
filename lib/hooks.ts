'use client';

import { useCallback } from 'react';

export function useSound(soundUrl: string) {
  const playSound = useCallback(() => {
    const audio = new Audio(soundUrl);
    audio.play().catch(error => {
      console.error('Failed to play sound:', error);
    });
  }, [soundUrl]);

  return playSound;
}
