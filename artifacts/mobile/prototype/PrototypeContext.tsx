import React, { createContext, useContext, useState, useCallback } from 'react';

export type ProtoPhase = 'phase1' | 'phase2';
export type SharedScreen = 'home' | 'chat';

interface PrototypeContextType {
  protoPhase: ProtoPhase;
  setProtoPhase: (phase: ProtoPhase) => void;
  togglePhase: () => void;
  sharedPersonaId: string | null;
  setSharedPersonaId: (id: string | null) => void;
  sharedScreen: SharedScreen;
  setSharedScreen: (screen: SharedScreen) => void;
}

const PrototypeContext = createContext<PrototypeContextType>({
  protoPhase: 'phase1',
  setProtoPhase: () => {},
  togglePhase: () => {},
  sharedPersonaId: null,
  setSharedPersonaId: () => {},
  sharedScreen: 'home',
  setSharedScreen: () => {},
});

export function PrototypeProvider({ children }: { children: React.ReactNode }) {
  const [protoPhase, setProtoPhase] = useState<ProtoPhase>('phase1');
  const [sharedPersonaId, setSharedPersonaId] = useState<string | null>(null);
  const [sharedScreen, setSharedScreen] = useState<SharedScreen>('home');

  const togglePhase = useCallback(() => {
    setProtoPhase(prev => prev === 'phase1' ? 'phase2' : 'phase1');
  }, []);

  return (
    <PrototypeContext.Provider value={{
      protoPhase, setProtoPhase, togglePhase,
      sharedPersonaId, setSharedPersonaId,
      sharedScreen, setSharedScreen,
    }}>
      {children}
    </PrototypeContext.Provider>
  );
}

export function usePrototype(): PrototypeContextType {
  return useContext(PrototypeContext);
}
