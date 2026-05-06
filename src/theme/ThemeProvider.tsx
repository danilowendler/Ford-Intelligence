import { createContext, useContext, useMemo, type PropsWithChildren } from 'react';
import { usePlanStore } from '@/stores/usePlanStore';
import { colors, spacing, radius, blur, shadow, touchTarget } from './tokens';
import { typography, fontFamily } from './typography';
import { planAccents, type PlanAccent, type PlanId } from './plans';

export type Theme = {
  colors: typeof colors;
  spacing: typeof spacing;
  radius: typeof radius;
  blur: typeof blur;
  shadow: typeof shadow;
  touchTarget: typeof touchTarget;
  typography: typeof typography;
  fontFamily: typeof fontFamily;
  plan: { id: PlanId } & PlanAccent;
};

const ThemeContext = createContext<Theme | null>(null);

export function ThemeProvider({ children }: PropsWithChildren) {
  const planId = usePlanStore((s) => s.plan);
  const theme = useMemo<Theme>(
    () => ({
      colors,
      spacing,
      radius,
      blur,
      shadow,
      touchTarget,
      typography,
      fontFamily,
      plan: { id: planId, ...planAccents[planId] },
    }),
    [planId],
  );
  return <ThemeContext.Provider value={theme}>{children}</ThemeContext.Provider>;
}

export function useTheme(): Theme {
  const ctx = useContext(ThemeContext);
  if (!ctx) {
    throw new Error('useTheme must be used inside <ThemeProvider>');
  }
  return ctx;
}
