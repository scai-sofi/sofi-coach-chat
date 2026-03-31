import React, { createContext, useContext, useState, useCallback } from 'react';

export type Phase2Screen = 'home' | 'chat' | 'about-me' | 'my-finances' | 'goals-profile' | 'preferences' | 'ai-usage';

const PROFILE_SCREENS: Phase2Screen[] = ['about-me', 'my-finances', 'goals-profile', 'preferences'];

interface Phase2NavContextType {
  screen: Phase2Screen;
  navigate: (screen: Phase2Screen) => void;
  goBack: () => void;
  shouldOpenDrawer: boolean;
  consumeDrawerFlag: () => void;
}

const Phase2NavContext = createContext<Phase2NavContextType>({
  screen: 'home',
  navigate: () => {},
  goBack: () => {},
  shouldOpenDrawer: false,
  consumeDrawerFlag: () => {},
});

export function Phase2NavProvider({ children }: { children: React.ReactNode }) {
  const [screen, setScreen] = useState<Phase2Screen>('home');
  const [shouldOpenDrawer, setShouldOpenDrawer] = useState(false);

  const navigate = useCallback((s: Phase2Screen) => {
    setShouldOpenDrawer(false);
    setScreen(s);
  }, []);

  const goBack = useCallback(() => {
    setScreen(prev => {
      if (prev === 'ai-usage') return 'preferences';
      if (PROFILE_SCREENS.includes(prev)) {
        setShouldOpenDrawer(true);
      }
      return 'home';
    });
  }, []);

  const consumeDrawerFlag = useCallback(() => {
    setShouldOpenDrawer(false);
  }, []);

  return (
    <Phase2NavContext.Provider value={{ screen, navigate, goBack, shouldOpenDrawer, consumeDrawerFlag }}>
      {children}
    </Phase2NavContext.Provider>
  );
}

export function usePhase2Nav() {
  return useContext(Phase2NavContext);
}
