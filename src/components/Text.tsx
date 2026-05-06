import type { ReactNode } from 'react';
import { Text as RNText, type TextProps as RNTextProps } from 'react-native';
import { useTheme } from '@/theme/ThemeProvider';
import type { TypographyVariant } from '@/theme/typography';

export type TextColor =
  | 'primary'
  | 'muted'
  | 'accent'
  | 'warn'
  | 'critical'
  | 'success'
  | 'inverse';

export type TextProps = Omit<RNTextProps, 'children'> & {
  variant?: TypographyVariant;
  color?: TextColor;
  children: ReactNode;
};

export function Text({
  variant = 'body',
  color = 'primary',
  style,
  children,
  ...rest
}: TextProps) {
  const theme = useTheme();
  const colorMap: Record<TextColor, string> = {
    primary: theme.colors.textPrimary,
    muted: theme.colors.textMuted,
    accent: theme.plan.accent,
    warn: theme.colors.alertWarn,
    critical: theme.colors.alertCritical,
    success: theme.colors.success,
    inverse: theme.plan.accentContrast,
  };
  return (
    <RNText style={[theme.typography[variant], { color: colorMap[color] }, style]} {...rest}>
      {children}
    </RNText>
  );
}
