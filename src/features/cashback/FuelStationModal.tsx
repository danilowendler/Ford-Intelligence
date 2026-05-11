import { useEffect, useState } from 'react';
import { Modal, Pressable, ScrollView, StyleSheet, useWindowDimensions, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Animated, { FadeIn, FadeOut, SlideInDown, SlideOutDown } from 'react-native-reanimated';
import { Button, GlassPanel, Icon, Text } from '@/components';
import { useTheme } from '@/theme/ThemeProvider';
import { useWalletStore } from '@/stores/useWalletStore';
import { fetchFuelStations } from '@/services/mocks/walletApi';
import type { FuelStation } from './types';
import { haptic } from '@/utils/haptics';

const EXIT_DURATION_MS = 280;

export type FuelStationModalProps = {
  couponId: string | null;
  onClose: () => void;
  onRedeemed: () => void;
};

export function FuelStationModal({ couponId, onClose, onRedeemed }: FuelStationModalProps) {
  const theme = useTheme();
  const insets = useSafeAreaInsets();
  // Pixel-based ceiling — string percentages ('85%') race the Modal's layout
  // pass on iOS/Android. A concrete number from useWindowDimensions reaches
  // Yoga before the first measurement, so the sheet always has a hard cap.
  const { height: windowHeight } = useWindowDimensions();
  const [data, setData] = useState<string | null>(couponId);
  const visible = couponId !== null;

  const [stations, setStations] = useState<FuelStation[]>([]);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const redeemCoupon = useWalletStore((s) => s.redeemCoupon);

  useEffect(() => {
    if (couponId) {
      setData(couponId);
      setSelectedId(null);
      let cancelled = false;
      fetchFuelStations().then((list) => {
        if (!cancelled) setStations(list);
      });
      return () => {
        cancelled = true;
      };
    }
    const t = setTimeout(() => {
      setData(null);
      setStations([]);
    }, EXIT_DURATION_MS);
    return () => clearTimeout(t);
  }, [couponId]);

  async function handleConfirm() {
    if (!data || !selectedId) return;
    setSubmitting(true);
    try {
      await redeemCoupon(data, selectedId);
      haptic.success();
      onRedeemed();
      onClose();
    } catch {
      setSubmitting(false);
    }
  }

  return (
    <Modal
      visible={data !== null}
      transparent
      animationType="none"
      onRequestClose={onClose}
      statusBarTranslucent
    >
      {data ? (
        <View style={styles.root}>
          {visible ? (
            <>
              <Animated.View
                entering={FadeIn.duration(180)}
                exiting={FadeOut.duration(EXIT_DURATION_MS - 80)}
                style={[StyleSheet.absoluteFillObject, { backgroundColor: theme.colors.overlay }]}
              >
                <Pressable
                  style={styles.fill}
                  onPress={submitting ? undefined : onClose}
                  accessibilityRole="button"
                  accessibilityLabel="Fechar seleção de posto"
                />
              </Animated.View>

              {/* Sheet: pixel maxHeight + overflow:hidden = hard ceiling that
                  Yoga propagates into the ScrollView's scroll activation. */}
              <Animated.View
                entering={SlideInDown.duration(280)}
                exiting={SlideOutDown.duration(EXIT_DURATION_MS - 80)}
                style={[
                  styles.sheet,
                  {
                    maxHeight: windowHeight * 0.85,
                    marginHorizontal: theme.spacing.lg,
                    borderRadius: theme.radius.lg,
                    borderColor: theme.colors.border,
                  },
                ]}
              >
                {/* Glass background decoupled from content flow */}
                <GlassPanel
                  padding="none"
                  intensity={theme.blur.modal}
                  borderless
                  style={StyleSheet.absoluteFillObject}
                />

                {/* Header */}
                <View
                  style={{
                    paddingHorizontal: theme.spacing.xl,
                    paddingTop: theme.spacing.xl,
                    paddingBottom: theme.spacing.md,
                    gap: theme.spacing.sm,
                  }}
                >
                  <View
                    style={{
                      alignSelf: 'center',
                      width: 40,
                      height: 4,
                      borderRadius: theme.radius.full,
                      backgroundColor: theme.colors.borderStrong,
                      marginBottom: theme.spacing.xs,
                    }}
                  />
                  <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
                    <Text variant="h2">Selecionar posto</Text>
                    <Pressable
                      onPress={onClose}
                      hitSlop={12}
                      accessibilityRole="button"
                      accessibilityLabel="Fechar"
                      style={{
                        width: theme.touchTarget.min,
                        height: theme.touchTarget.min,
                        alignItems: 'center',
                        justifyContent: 'center',
                      }}
                    >
                      <Icon name="close" size={22} color="muted" />
                    </Pressable>
                  </View>
                  <Text variant="body" color="muted">
                    Escolha onde quer usar seu cashback em combustível.
                  </Text>
                </View>

                {/* ScrollView in place of FlatList — sheet's pixel ceiling + this
                    flexShrink make the native ScrollView activate scroll when the
                    content (header + list + footer) exceeds the cap. No
                    VirtualizedList measurement race on native. */}
                <ScrollView
                  style={styles.scroll}
                  contentContainerStyle={{
                    paddingHorizontal: theme.spacing.xl,
                    paddingBottom: theme.spacing.md,
                  }}
                  showsVerticalScrollIndicator={false}
                >
                  {stations.length === 0 ? (
                    <Text
                      variant="body"
                      color="muted"
                      style={{ textAlign: 'center', paddingVertical: 16 }}
                    >
                      Carregando postos...
                    </Text>
                  ) : (
                    stations.map((item) => {
                      const selected = item.id === selectedId;
                      return (
                        <Pressable
                          key={item.id}
                          onPress={() => setSelectedId(item.id)}
                          style={[
                            styles.stationRow,
                            {
                              borderColor: selected ? theme.plan.accent : theme.colors.border,
                              borderRadius: theme.radius.md,
                              padding: theme.spacing.md,
                              marginBottom: theme.spacing.sm,
                            },
                          ]}
                          accessibilityRole="radio"
                          accessibilityState={{ checked: selected }}
                        >
                          <View
                            style={[
                              styles.radio,
                              {
                                borderColor: selected ? theme.plan.accent : theme.colors.borderStrong,
                                backgroundColor: selected ? theme.plan.accent : 'transparent',
                              },
                            ]}
                          >
                            {selected ? (
                              <View style={{ width: 8, height: 8, borderRadius: 4, backgroundColor: '#FFF' }} />
                            ) : null}
                          </View>
                          <View style={{ flex: 1 }}>
                            <Text variant="bodyStrong">{item.name}</Text>
                            <Text variant="caption" color="muted" numberOfLines={1}>
                              {item.address}
                            </Text>
                            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4, marginTop: 2 }}>
                              <Icon name="location-outline" size={12} color="muted" />
                              <Text variant="caption" color="muted">
                                {item.distanceKm.toFixed(1)} km
                              </Text>
                            </View>
                          </View>
                        </Pressable>
                      );
                    })
                  )}
                </ScrollView>

                {/* Footer */}
                <View
                  style={{
                    paddingHorizontal: theme.spacing.xl,
                    paddingTop: theme.spacing.md,
                    paddingBottom: Math.max(insets.bottom, theme.spacing.lg),
                    gap: theme.spacing.sm,
                    borderTopWidth: StyleSheet.hairlineWidth,
                    borderTopColor: theme.colors.border,
                  }}
                >
                  <Button
                    label="Confirmar resgate"
                    disabled={!selectedId || submitting}
                    loading={submitting}
                    onPress={handleConfirm}
                    fullWidth
                  />
                  <Button label="Cancelar" variant="ghost" onPress={onClose} disabled={submitting} fullWidth />
                </View>
              </Animated.View>
            </>
          ) : null}
        </View>
      ) : null}
    </Modal>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  fill: { flex: 1 },
  sheet: {
    overflow: 'hidden',
    borderWidth: 1,
  },
  // flexShrink: 1 lets the ScrollView yield space to header + footer first,
  // then absorb the remainder under the sheet's pixel ceiling. When its
  // content exceeds that remainder, native scroll activates.
  scroll: {
    flexShrink: 1,
  },
  stationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    borderWidth: 1,
  },
  radio: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
