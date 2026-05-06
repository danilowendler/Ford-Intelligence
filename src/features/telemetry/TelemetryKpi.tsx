import { useEffect } from 'react';
import { View } from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSequence,
  withTiming,
} from 'react-native-reanimated';
import { GlassPanel, Icon, Text, type IconName } from '@/components';
import { useTheme } from '@/theme/ThemeProvider';

export type TelemetryKpiTone = 'neutral' | 'warn' | 'critical' | 'success';

export type TelemetryKpiProps = {
  icon: IconName;
  label: string;
  value: string;
  unit?: string;
  hint?: string;
  tone?: TelemetryKpiTone;
};

export function TelemetryKpi({
  icon,
  label,
  value,
  unit,
  hint,
  tone = 'neutral',
}: TelemetryKpiProps) {
  const theme = useTheme();
  const pulse = useSharedValue(1);

  useEffect(() => {
    pulse.value = withSequence(
      withTiming(1.04, { duration: 180 }),
      withTiming(1, { duration: 220 }),
    );
  }, [value, pulse]);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: pulse.value }],
  }));

  const accentMap: Record<TelemetryKpiTone, string> = {
    neutral: theme.plan.accent,
    warn: theme.colors.alertWarn,
    critical: theme.colors.alertCritical,
    success: theme.colors.success,
  };

  const iconColor =
    tone === 'warn'
      ? 'warn'
      : tone === 'critical'
        ? 'critical'
        : tone === 'success'
          ? 'success'
          : 'accent';

  return (
    <Animated.View style={[{ width: 156 }, animatedStyle]}>
      <GlassPanel padding="md" style={{ gap: theme.spacing.sm, minHeight: 124 }}>
        <View
          style={{
            width: 36,
            height: 36,
            borderRadius: theme.radius.md,
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: `${accentMap[tone]}26`,
          }}
        >
          <Icon name={icon} size={20} color={iconColor} />
        </View>
        <Text variant="caption" color="muted">
          {label}
        </Text>
        <View style={{ flexDirection: 'row', alignItems: 'baseline', gap: 4 }}>
          <Text variant="h3">{value}</Text>
          {unit ? (
            <Text variant="caption" color="muted">
              {unit}
            </Text>
          ) : null}
        </View>
        {hint ? (
          <Text variant="caption" color="muted" numberOfLines={1}>
            {hint}
          </Text>
        ) : null}
      </GlassPanel>
    </Animated.View>
  );
}
