import { useEffect } from 'react';
import { useRouter, useSegments } from 'expo-router';
import { useAuthStore } from '@/stores/useAuthStore';
import { useUserStore } from '@/stores/useUserStore';

export function useProtectedRoute() {
  const status = useAuthStore((s) => s.status);
  const user = useAuthStore((s) => s.user);
  const userHydrated = useUserStore((s) => s.hydrated);
  const onboardingComplete = useUserStore((s) => s.onboardingComplete);
  const segments = useSegments();
  const router = useRouter();

  useEffect(() => {
    if (status !== 'authenticated' && status !== 'unauthenticated') return;
    if (!userHydrated) return;

    const isAuthenticated = status === 'authenticated';
    const inAuthGroup    = segments[0] === '(auth)';
    const inOnboarding   = inAuthGroup && segments[1] === 'onboarding';
    const inAnalystGroup = (segments[0] as string) === '(analyst)';
    const inTabsGroup    = (segments[0] as string) === '(tabs)';

    if (!isAuthenticated) {
      // Cover the neutral index screen and any leaked analyst/tabs route
      if (!inAuthGroup || inOnboarding) {
        router.replace('/(auth)/login');
      }
      return;
    }

    // Analyst role — skip onboarding, route directly to analyst area
    if (user?.role === 'analyst') {
      if (!inAnalystGroup) {
        router.replace('/(analyst)/dashboard' as never);
      }
      return;
    }

    // Client role — onboarding gate
    if (!onboardingComplete) {
      if (!inOnboarding) {
        router.replace('/(auth)/onboarding/step-1');
      }
      return;
    }

    // Authenticated client not yet in the tabs group (covers index, auth, analyst routes)
    if (!inTabsGroup) {
      router.replace('/(tabs)');
    }
  }, [status, user, userHydrated, onboardingComplete, segments, router]);
}
