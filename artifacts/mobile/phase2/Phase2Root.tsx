import React from 'react';
import { ThemeProvider } from './context/ThemeContext';
import { CoachProvider } from './context/CoachContext';
import { ToastProvider } from './components/Toast';
import { Phase2NavProvider, usePhase2Nav } from './context/Phase2NavContext';
import HomeScreen from './screens/HomeScreen';
import ChatScreen from './screens/ChatScreen';
import AboutMeScreen from './screens/AboutMeScreen';
import MyAccountsScreen from './screens/MyFinancesScreen';
import CoachMemoryScreen from './screens/CoachMemoryScreen';
import GoalsProfileScreen from './screens/GoalsProfileScreen';
import PreferencesScreen from './screens/PreferencesScreen';
import AiUsageScreen from './screens/AiUsageScreen';

function Phase2Navigator() {
  const { screen } = usePhase2Nav();

  switch (screen) {
    case 'chat':
      return <ChatScreen />;
    case 'about-me':
      return <AboutMeScreen />;
    case 'my-accounts':
      return <MyAccountsScreen />;
    case 'coach-memory':
      return <CoachMemoryScreen />;
    case 'goals-profile':
      return <GoalsProfileScreen />;
    case 'preferences':
      return <PreferencesScreen />;
    case 'ai-usage':
      return <AiUsageScreen />;
    default:
      return <HomeScreen />;
  }
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
