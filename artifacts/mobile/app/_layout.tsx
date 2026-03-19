import { useFonts } from "expo-font";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Stack } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import React, { useEffect, useState } from "react";
import { Platform, ActivityIndicator, View } from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { KeyboardProvider } from "react-native-keyboard-controller";
import { SafeAreaProvider } from "react-native-safe-area-context";

import { ErrorBoundary } from "@/components/ErrorBoundary";
import { CoachProvider } from "@/context/CoachContext";

if (Platform.OS !== 'web') {
  SplashScreen.preventAutoHideAsync().catch(() => {});
}

const queryClient = new QueryClient();

function RootLayoutNav() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="index" />
    </Stack>
  );
}

export default function RootLayout() {
  const [timedOut, setTimedOut] = useState(false);
  const [fontsLoaded, fontError] = useFonts({
    'TTNorms-Regular': require('../assets/fonts/TTNorms-Regular.otf'),
    'TTNorms-Medium': require('../assets/fonts/TTNorms-Medium.otf'),
    'TTNorms-Bold': require('../assets/fonts/TTNorms-Bold.otf'),
    'TTNorms-Italic': require('../assets/fonts/TTNorms-Italic.otf'),
    'TTNorms-BoldItalic': require('../assets/fonts/TTNorms-BoldItalic.otf'),
  });

  useEffect(() => {
    const timer = setTimeout(() => setTimedOut(true), 5000);
    return () => clearTimeout(timer);
  }, []);

  const ready = fontsLoaded || fontError || timedOut;

  useEffect(() => {
    if (ready && Platform.OS !== 'web') {
      SplashScreen.hideAsync().catch(() => {});
    }
  }, [ready]);

  if (!ready) {
    if (Platform.OS === 'web') {
      return (
        <View style={{ flex: 1, backgroundColor: '#faf8f5', alignItems: 'center', justifyContent: 'center' }}>
          <ActivityIndicator size="large" color="#1a1919" />
        </View>
      );
    }
    return null;
  }

  return (
    <SafeAreaProvider>
      <ErrorBoundary>
        <QueryClientProvider client={queryClient}>
          <GestureHandlerRootView style={{ flex: 1 }}>
            <KeyboardProvider>
              <CoachProvider>
                <RootLayoutNav />
              </CoachProvider>
            </KeyboardProvider>
          </GestureHandlerRootView>
        </QueryClientProvider>
      </ErrorBoundary>
    </SafeAreaProvider>
  );
}
