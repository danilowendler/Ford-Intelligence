import type { ReactNode } from 'react';
import {
  ActivityIndicator,
  Pressable,
  StyleSheet,
  View,
  type PressableProps,
} from 'react-native';
import { useTheme } from '@/theme/ThemeProvider';
import { Text } from './Text';

export type ButtonVariant = 'primary' | 'secondary' | 'ghost';

export type ButtonProps = Omit<PressableProps, 'children' | 'style'> & {
  label: string;
  variant?: ButtonVariant;
  loading?: boolean;
  disabled?: boolean;
  iconLeft?: ReactNode;
  iconRight?: ReactNode;
  fullWidth?: boolean;
};

export function Button({
  label,
  variant = 'primary',
  loading = false,
  disabled = false,
  iconLeft,
  iconRight,
  fullWidth = false,
  ...rest
}: ButtonProps) {
  const theme = useTheme();
  const isDisabled = disabled || loading;

  const surface = (() => {
    switch (variant) {
      case 'primary':
        return {
          bg: theme.plan.accent,
          fg: theme.plan.accentContrast,
          border: 'transparent',
        };
      case 'secondary':
        return {
          bg: theme.colors.bgElevated,
          fg: theme.colors.textPrimary,
          border: theme.colors.borderStrong,
        };
      case 'ghost':
        return {
          bg: 'transparent',
          fg: theme.colors.textPrimary,
          border: 'transparent',
        };
    }
  })();

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityState={{ disabled: isDisabled, busy: loading }}
      disabled={isDisabled}
      hitSlop={4}
      style={({ pressed }) => [
        styles.base,
        {
          backgroundColor: surface.bg,
          borderColor: surface.border,
          borderRadius: theme.radius.md,
          paddingHorizontal: theme.spacing.lg,
          minHeight: theme.touchTarget.comfortable,
          width: fullWidth ? '100%' : undefined,
          opacity: isDisabled ? 0.5 : pressed ? 0.85 : 1,
        },
      ]}
      {...rest}
    >
      {loading ? (
        <ActivityIndicator color={surface.fg} />
      ) : (
        <View style={styles.content}>
          {iconLeft ? <View style={{ marginRight: theme.spacing.sm }}>{iconLeft}</View> : null}
          <Text variant="bodyStrong" style={{ color: surface.fg }}>
            {label}
          </Text>
          {iconRight ? <View style={{ marginLeft: theme.spacing.sm }}>{iconRight}</View> : null}
        </View>
      )}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  base: {
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
  },
});
