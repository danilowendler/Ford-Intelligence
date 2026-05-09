import { View } from 'react-native';
import { useTheme } from '@/theme/ThemeProvider';

export function SkeletonBlock({ height = 16, width }: { height?: number; width?: number | string }) {
  const theme = useTheme();
  return (
    <View
      style={{
        height,
        width: width as number | undefined,
        backgroundColor: theme.colors.bgElevated,
        borderRadius: theme.radius.sm,
        borderWidth: 1,
        borderColor: theme.colors.border,
      }}
    />
  );
}
