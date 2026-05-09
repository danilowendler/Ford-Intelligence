import { useEffect, useState } from 'react';
import { Keyboard, Modal, Pressable, StyleSheet, View } from 'react-native';
import Animated, {
  Easing,
  cancelAnimation,
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withTiming,
  FadeIn,
  FadeOut,
} from 'react-native-reanimated';
import { useBottomTabBarHeight } from '@react-navigation/bottom-tabs';
import * as Haptics from 'expo-haptics';
import { GlassPanel, Icon, Text, Button } from '@/components';
import { useTheme } from '@/theme/ThemeProvider';

export function VoiceCommandFab() {
  const theme = useTheme();
  const tabBarHeight = useBottomTabBarHeight();
  const [open, setOpen] = useState(false);
  const [keyboardOpen, setKeyboardOpen] = useState(false);
  const pulse = useSharedValue(1);

  useEffect(() => {
    const showSub = Keyboard.addListener('keyboardDidShow', () => setKeyboardOpen(true));
    const hideSub = Keyboard.addListener('keyboardDidHide', () => setKeyboardOpen(false));
    return () => {
      showSub.remove();
      hideSub.remove();
    };
  }, []);

  useEffect(() => {
    if (open) {
      pulse.value = withRepeat(
        withTiming(1.25, { duration: 700, easing: Easing.inOut(Easing.quad) }),
        -1,
        true,
      );
    } else {
      cancelAnimation(pulse);
      pulse.value = 1;
    }
    return () => cancelAnimation(pulse);
  }, [open, pulse]);

  const waveformStyle = useAnimatedStyle(() => ({
    transform: [{ scale: pulse.value }],
  }));

  if (keyboardOpen) return null;

  const handlePress = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium).catch(() => {});
    setOpen(true);
  };

  const bottom = tabBarHeight + theme.spacing.lg;

  return (
    <>
      <View
        pointerEvents="box-none"
        style={[StyleSheet.absoluteFill, styles.layer]}
      >
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Comando de voz Premium"
          onPress={handlePress}
          style={({ pressed }) => [
            styles.fab,
            {
              right: theme.spacing.lg,
              bottom,
              backgroundColor: theme.plan.accent,
              shadowColor: theme.plan.accent,
              opacity: pressed ? 0.85 : 1,
            },
          ]}
        >
          <Icon name="mic" size={24} color="inverse" />
        </Pressable>
      </View>

      <Modal
        visible={open}
        transparent
        animationType="none"
        onRequestClose={() => setOpen(false)}
      >
        <Animated.View
          entering={FadeIn.duration(180)}
          exiting={FadeOut.duration(160)}
          style={[styles.backdrop, { backgroundColor: theme.colors.overlay }]}
        >
          <Pressable style={StyleSheet.absoluteFill} onPress={() => setOpen(false)} />
          <View style={styles.sheetWrap}>
            <GlassPanel padding="lg" style={{ gap: theme.spacing.lg, alignItems: 'center' }}>
              <Animated.View
                style={[
                  styles.waveform,
                  waveformStyle,
                  { backgroundColor: theme.plan.accentSoft, borderColor: theme.plan.accent },
                ]}
              >
                <Icon name="mic" size={42} color="accent" />
              </Animated.View>
              <View style={{ gap: theme.spacing.xs, alignItems: 'center' }}>
                <Text variant="h2">Estou ouvindo…</Text>
                <Text variant="body" color="muted" style={{ textAlign: 'center' }}>
                  Diga &quot;agendar revisão&quot; ou &quot;como está minha bateria?&quot;.
                </Text>
              </View>
              <Button label="Encerrar" variant="secondary" onPress={() => setOpen(false)} fullWidth />
            </GlassPanel>
          </View>
        </Animated.View>
      </Modal>
    </>
  );
}

const styles = StyleSheet.create({
  layer: {
    overflow: 'visible',
  },
  fab: {
    position: 'absolute',
    width: 56,
    height: 56,
    borderRadius: 28,
    alignItems: 'center',
    justifyContent: 'center',
    shadowOpacity: 0.45,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 6 },
    elevation: 8,
  },
  backdrop: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  sheetWrap: {
    padding: 16,
  },
  waveform: {
    width: 96,
    height: 96,
    borderRadius: 48,
    borderWidth: 2,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
