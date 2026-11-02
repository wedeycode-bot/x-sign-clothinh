'use client';

import React, { createContext, useContext } from 'react';

interface SoundContextType {
  isPlaying: boolean;
  toggleAudio: () => void;
  playClick: () => void;
  playSwoosh: () => void;
  playSuccess: () => void;
}

const noop = () => {};

const defaultContext: SoundContextType = {
  isPlaying: false,
  toggleAudio: noop,
  playClick: noop,
  playSwoosh: noop,
  playSuccess: noop,
};

const SoundContext = createContext<SoundContextType>(defaultContext);

export const SoundProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <SoundContext.Provider value={defaultContext}>
      {children}
    </SoundContext.Provider>
  );
};

export const useSound = () => {
  return useContext(SoundContext);
};
