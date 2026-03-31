import React from 'react';
import { ThemeProvider } from './context/ThemeContext';
import { CoachProvider } from './context/CoachContext';
import { ToastProvider } from './components/Toast';
import { Phase2NavProvider, usePhase2Nav } from './context/Phase2NavContext';
import HomeScreen from './screens/HomeScreen';
import ChatScreen from './screens/ChatScreen';

function Phase2Navigator() {
  const { screen } = usePhase2Nav();

  if (screen === 'chat') {
    return <ChatScreen />;
  }
  return <HomeScreen />;
}

export function Phase2Root() {
  return (
    <ThemeProvider>
      <CoachProvider>
        <ToastProvider>
          <Phase2NavProvider>
            <Phase2Navigator />
          </Phase2NavProvider>
        </ToastProvider>
      </CoachProvider>
    </ThemeProvider>
  );
}
