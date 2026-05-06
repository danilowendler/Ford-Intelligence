import { useEffect, useRef, useState } from 'react';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import * as SplashScreen from 'expo-splash-screen';
import {
  useFonts,
  Inter_400Regular,
  Inter_500Medium,
  Inter_600SemiBold,
  Inter_700Bold,
} from '@expo-google-fonts/inter';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { ThemeProvider } from '@/theme/ThemeProvider';
import { useAuthStore } from '@/stores/useAuthStore';
import { useProtectedRoute } from '@/hooks/useProtectedRoute';
import 'react-native-reanimated';

SplashScreen.preventAutoHideAsync().catch(() => {
  // hideAsync may already be running on some platforms; ignore.
});

function RootNavigator() {
  useProtectedRoute();
  return (
    <Stack screenOptions={{ headerShown: false, animation: 'fade' }}>
      <Stack.Screen name="(auth)" />
      <Stack.Screen name="(tabs)" />
      <Stack.Screen
        name="_dev/design-system"
        options={{
          headerShown: true,
          title: 'Design System',
          headerStyle: { backgroundColor: '#0A0E14' },
          headerTintColor: '#F5F7FA',
        }}
      />
      <Stack.Screen name="+not-found" />
    </Stack>
  );
}

export default function RootLayout() {
  const [fontsLoaded, fontError] = useFonts({
    Inter_400Regular,
    Inter_500Medium,
    Inter_600SemiBold,
    Inter_700Bold,
  });

  const status = useAuthStore((s) => s.status);
  const hydrate = useAuthStore((s) => s.hydrate);
  const [hydrated, setHydrated] = useState(false);
  const hydrateOnce = useRef(false);

  useEffect(() => {
    if (!hydrateOnce.current && status === 'idle') {
      hydrateOnce.current = true;
      hydrate();
    }
  }, [status, hydrate]);

  useEffect(() => {
    if (!hydrated && (status === 'authenticated' || status === 'unauthenticated')) {
      setHydrated(true);
    }
  }, [status, hydrated]);

  const ready = (fontsLoaded || fontError) && hydrated;

  useEffect(() => {
    if (ready) {
      SplashScreen.hideAsync();
    }
  }, [ready]);

  if (!ready) {
    return null;
  }

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaProvider>
        <ThemeProvider>
          <RootNavigator />
          <StatusBar style="light" />
        </ThemeProvider>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}
