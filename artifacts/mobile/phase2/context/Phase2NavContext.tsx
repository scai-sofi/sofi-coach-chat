import React, { createContext, useContext, useState, useCallback } from 'react';

export type Phase2Screen = 'home' | 'chat' | 'about-me' | 'my-finances' | 'goals-profile' | 'preferences';

interface Phase2NavContextType {
  screen: Phase2Screen;
  navigate: (screen: Phase2Screen) => void;
  goBack: () => void;
}

const Phase2NavContext = createContext<Phase2NavContextType>({
  screen: 'home',
  navigate: () => {},
  goBack: () => {},
});

export function Phase2NavProvider({ children }: { children: React.ReactNode }) {
  const [screen, setScreen] = useState<Phase2Screen>('home');

  const navigate = useCallback((s: Phase2Screen) => setScreen(s), []);
  const goBack = useCallback(() => setScreen('home'), []);

  return (
    <Phase2NavContext.Provider value={{ screen, navigate, goBack }}>
      {children}
    </Phase2NavContext.Provider>
  );
}

export function usePhase2Nav() {
  return useContext(Phase2NavContext);
}
