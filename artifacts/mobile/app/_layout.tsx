import { useFonts } from "expo-font";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Stack } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import React, { useEffect } from "react";
import { Platform, View } from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { KeyboardProvider } from "react-native-keyboard-controller";
import { SafeAreaProvider } from "react-native-safe-area-context";

import { ErrorBoundary } from "@/components/ErrorBoundary";
import { CoachProvider } from "@/context/CoachContext";
import { ThemeProvider } from "@/context/ThemeContext";
import { ToastProvider } from "@/components/Toast";
import { PrototypeProvider, usePrototype } from "@/prototype/PrototypeContext";
import { PhaseSwitcherFab } from "@/prototype/PhaseSwitcherFab";
import { Phase2Root } from "@/phase2/Phase2Root";

if (Platform.OS !== 'web') {
  SplashScreen.preventAutoHideAsync().catch(() => {});
}

const queryClient = new QueryClient();

function Phase1Nav() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="index" />
      <Stack.Screen
        name="chat"
        options={{
          animation: 'slide_from_bottom',
          gestureEnabled: true,
          gestureDirection: 'vertical',
        }}
      />
    </Stack>
  );
}

function PhaseRouter() {
  const { protoPhase } = usePrototype();

  if (protoPhase === 'phase2') {
    return <Phase2Root />;
  }

  return (
    <CoachProvider>
      <ToastProvider>
        <Phase1Nav />
      </ToastProvider>
    </CoachProvider>
  );
}

export default function RootLayout() {
  const [fontsLoaded, fontError] = useFonts({
    'TTNorms-Regular': require('../assets/fonts/TTNorms-Regular.otf'),
    'TTNorms-Medium': require('../assets/fonts/TTNorms-Medium.otf'),
    'TTNorms-Bold': require('../assets/fonts/TTNorms-Bold.otf'),
    'TTNorms-Italic': require('../assets/fonts/TTNorms-Italic.otf'),
    'TTNorms-BoldItalic': require('../assets/fonts/TTNorms-BoldItalic.otf'),
  });

  useEffect(() => {
    if ((fontsLoaded || fontError) && Platform.OS !== 'web') {
      SplashScreen.hideAsync().catch(() => {});
    }
  }, [fontsLoaded, fontError]);

  if (!fontsLoaded && !fontError && Platform.OS !== 'web') return null;

  return (
    <SafeAreaProvider>
      <ErrorBoundary>
        <ThemeProvider>
          <QueryClientProvider client={queryClient}>
            <GestureHandlerRootView style={{ flex: 1 }}>
              <KeyboardProvider>
                <PrototypeProvider>
                  <View style={{ flex: 1 }}>
                    <PhaseRouter />
                    <PhaseSwitcherFab />
                  </View>
                </PrototypeProvider>
              </KeyboardProvider>
            </GestureHandlerRootView>
          </QueryClientProvider>
        </ThemeProvider>
      </ErrorBoundary>
    </SafeAreaProvider>
  );
}
