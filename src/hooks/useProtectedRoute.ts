import { useEffect } from 'react';
import { useRouter, useSegments } from 'expo-router';
import { useAuthStore } from '@/stores/useAuthStore';
import { useUserStore } from '@/stores/useUserStore';

export function useProtectedRoute() {
  const status = useAuthStore((s) => s.status);
  const userHydrated = useUserStore((s) => s.hydrated);
  const onboardingComplete = useUserStore((s) => s.onboardingComplete);
  const segments = useSegments();
  const router = useRouter();

  useEffect(() => {
    if (status !== 'authenticated' && status !== 'unauthenticated') return;
    if (!userHydrated) return;

    const isAuthenticated = status === 'authenticated';
    const inAuthGroup = segments[0] === '(auth)';
    const inOnboarding = inAuthGroup && segments[1] === 'onboarding';

    if (!isAuthenticated) {
      if (!inAuthGroup || inOnboarding) {
        router.replace('/(auth)/login');
      }
      return;
    }

    if (!onboardingComplete) {
      if (!inOnboarding) {
        router.replace('/(auth)/onboarding/step-1');
      }
      return;
    }

    if (inAuthGroup) {
      router.replace('/(tabs)');
    }
  }, [status, userHydrated, onboardingComplete, segments, router]);
}
