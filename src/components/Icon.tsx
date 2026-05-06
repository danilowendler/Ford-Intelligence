import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '@/theme/ThemeProvider';
import type { ComponentProps } from 'react';

export type IconName = ComponentProps<typeof Ionicons>['name'];

export type IconColor =
  | 'primary'
  | 'muted'
  | 'accent'
  | 'warn'
  | 'critical'
  | 'success'
  | 'inverse';

export type IconProps = {
  name: IconName;
  size?: number;
  color?: IconColor;
};

export function Icon({ name, size = 20, color = 'primary' }: IconProps) {
  const theme = useTheme();
  const map: Record<IconColor, string> = {
    primary: theme.colors.textPrimary,
    muted: theme.colors.textMuted,
    accent: theme.plan.accent,
    warn: theme.colors.alertWarn,
    critical: theme.colors.alertCritical,
    success: theme.colors.success,
    inverse: theme.plan.accentContrast,
  };
  return <Ionicons name={name} size={size} color={map[color]} />;
}
