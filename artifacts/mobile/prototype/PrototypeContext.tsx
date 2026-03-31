import React, { createContext, useContext, useState, useCallback } from 'react';

export type ProtoPhase = 'phase1' | 'phase2';

interface PrototypeContextType {
  protoPhase: ProtoPhase;
  setProtoPhase: (phase: ProtoPhase) => void;
  togglePhase: () => void;
}

const PrototypeContext = createContext<PrototypeContextType>({
  protoPhase: 'phase1',
  setProtoPhase: () => {},
  togglePhase: () => {},
});

export function PrototypeProvider({ children }: { children: React.ReactNode }) {
  const [protoPhase, setProtoPhase] = useState<ProtoPhase>('phase1');

  const togglePhase = useCallback(() => {
    setProtoPhase(prev => prev === 'phase1' ? 'phase2' : 'phase1');
  }, []);

  return (
    <PrototypeContext.Provider value={{ protoPhase, setProtoPhase, togglePhase }}>
      {children}
    </PrototypeContext.Provider>
  );
}

export function usePrototype(): PrototypeContextType {
  return useContext(PrototypeContext);
}
