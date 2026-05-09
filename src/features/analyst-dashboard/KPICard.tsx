import { View } from 'react-native';
import { Icon, Text, type IconName } from '@/components';
import { useTheme } from '@/theme/ThemeProvider';

interface KPICardProps {
  label: string;
  value: string;
  icon: IconName;
  delta?: string;
  deltaPositive?: boolean;
}

export function KPICard({ label, value, icon, delta, deltaPositive }: KPICardProps) {
  const theme = useTheme();

  return (
    <View
      style={{
        flex: 1,
        backgroundColor: theme.colors.bgElevated,
        borderRadius: theme.radius.lg,
        borderWidth: 1,
        borderColor: theme.colors.border,
        padding: theme.spacing.md,
        gap: theme.spacing.xs,
        shadowColor: '#000',
        shadowOpacity: 0.3,
        shadowRadius: 12,
        shadowOffset: { width: 0, height: 6 },
        elevation: 6,
      }}
    >
      <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
        <View
          style={{
            width: 32,
            height: 32,
            borderRadius: theme.radius.md,
            backgroundColor: 'rgba(31,111,235,0.14)',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <Icon name={icon} size={16} color="accent" />
        </View>
        {delta ? (
          <Text
            variant="caption"
            style={{
              color: deltaPositive ? theme.colors.success : theme.colors.alertCritical,
              fontWeight: '600',
            }}
          >
            {delta}
          </Text>
        ) : null}
      </View>

      <Text
        variant="h1"
        style={{ color: theme.colors.textPrimary, lineHeight: 36 }}
      >
        {value}
      </Text>

      <Text
        variant="caption"
        color="muted"
        style={{ textTransform: 'uppercase', letterSpacing: 0.6 }}
      >
        {label}
      </Text>
    </View>
  );
}
