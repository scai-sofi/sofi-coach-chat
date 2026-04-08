import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';
import { usePrototype, SharedScreen } from '../../prototype/PrototypeContext';

export type Phase2Screen = 'home' | 'chat' | 'my-accounts' | 'goals-profile' | 'about-me' | 'coach-memory' | 'preferences' | 'ai-usage';

const PROFILE_SCREENS: Phase2Screen[] = ['my-accounts', 'goals-profile', 'about-me', 'coach-memory', 'preferences'];

const SHARED_SCREEN_MAP: Record<SharedScreen, Phase2Screen> = {
  'home': 'home',
  'chat': 'chat',
};

function toSharedScreen(s: Phase2Screen): SharedScreen {
  if (s === 'chat') return 'chat';
  return 'home';
}

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
  const { sharedScreen, setSharedScreen } = usePrototype();
  const [screen, setScreen] = useState<Phase2Screen>(SHARED_SCREEN_MAP[sharedScreen] || 'home');
  const [shouldOpenDrawer, setShouldOpenDrawer] = useState(false);

  const navigate = useCallback((s: Phase2Screen) => {
    setShouldOpenDrawer(false);
    setScreen(s);
    setSharedScreen(toSharedScreen(s));
  }, [setSharedScreen]);

  const goBack = useCallback(() => {
    setScreen(prev => {
      if (prev === 'ai-usage') return 'preferences';
      if (PROFILE_SCREENS.includes(prev)) {
        setShouldOpenDrawer(true);
      }
      return 'home';
    });
    setSharedScreen('home');
  }, [setSharedScreen]);

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
