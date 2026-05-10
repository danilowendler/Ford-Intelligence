import { useEffect } from 'react';
import { StyleSheet, View, type DimensionValue, type ViewStyle } from 'react-native';
import Animated, {
  Easing,
  cancelAnimation,
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withTiming,
} from 'react-native-reanimated';
import { useTheme } from '@/theme/ThemeProvider';

type SharedProps = {
  style?: ViewStyle;
  shimmer?: boolean;
};

type BlockProps = SharedProps & {
  height?: number;
  width?: DimensionValue;
  radius?: number;
};

function useShimmerOpacity(enabled: boolean) {
  const opacity = useSharedValue(0.55);

  useEffect(() => {
    if (!enabled) return;
    opacity.value = withRepeat(
      withTiming(1, { duration: 900, easing: Easing.inOut(Easing.quad) }),
      -1,
      true,
    );
    return () => {
      cancelAnimation(opacity);
    };
  }, [enabled, opacity]);

  return useAnimatedStyle(() => ({ opacity: opacity.value }));
}

function SkeletonBase({
  style,
  shimmer = true,
  children,
}: SharedProps & { children?: React.ReactNode }) {
  const theme = useTheme();
  const animated = useShimmerOpacity(shimmer);
  return (
    <Animated.View
      accessibilityElementsHidden
      importantForAccessibility="no-hide-descendants"
      style={[
        {
          backgroundColor: theme.colors.bgElevated,
          borderWidth: 1,
          borderColor: theme.colors.border,
        },
        style,
        animated,
      ]}
    >
      {children}
    </Animated.View>
  );
}

function SkeletonBlock({ height = 16, width, radius, style, shimmer }: BlockProps) {
  const theme = useTheme();
  return (
    <SkeletonBase
      shimmer={shimmer}
      style={{
        height,
        width,
        borderRadius: radius ?? theme.radius.sm,
        ...style,
      }}
    />
  );
}

function SkeletonLine({
  width = '100%',
  height = 12,
  style,
  shimmer,
}: SharedProps & { width?: DimensionValue; height?: number }) {
  return <SkeletonBlock width={width} height={height} radius={4} style={style} shimmer={shimmer} />;
}

function SkeletonCircle({
  size = 40,
  style,
  shimmer,
}: SharedProps & { size?: number }) {
  return (
    <SkeletonBlock
      width={size}
      height={size}
      radius={size / 2}
      style={style}
      shimmer={shimmer}
    />
  );
}

function SkeletonGroup({
  children,
  gap = 8,
  style,
}: {
  children: React.ReactNode;
  gap?: number;
  style?: ViewStyle;
}) {
  return <View style={[styles.group, { gap }, style]}>{children}</View>;
}

const styles = StyleSheet.create({
  group: {
    flexDirection: 'column',
  },
});

export const Skeleton = {
  Block: SkeletonBlock,
  Line: SkeletonLine,
  Circle: SkeletonCircle,
  Group: SkeletonGroup,
};
