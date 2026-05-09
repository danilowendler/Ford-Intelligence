import { useEffect, useState } from 'react';
import { FlatList, Modal, Pressable, StyleSheet, View } from 'react-native';
import Animated, { FadeIn, FadeOut, SlideInDown, SlideOutDown } from 'react-native-reanimated';
import { Button, GlassPanel, Icon, Text } from '@/components';
import { useTheme } from '@/theme/ThemeProvider';
import { useWalletStore } from '@/stores/useWalletStore';
import { fetchFuelStations } from '@/services/mocks/walletApi';
import type { FuelStation } from './types';

const EXIT_DURATION_MS = 280;

export type FuelStationModalProps = {
  couponId: string | null;
  onClose: () => void;
  onRedeemed: () => void;
};

export function FuelStationModal({ couponId, onClose, onRedeemed }: FuelStationModalProps) {
  const theme = useTheme();
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
        <View style={styles.fill}>
          {visible ? (
            <>
              <Animated.View
                entering={FadeIn.duration(180)}
                exiting={FadeOut.duration(EXIT_DURATION_MS - 80)}
                style={[styles.fill, styles.backdrop, { backgroundColor: theme.colors.overlay }]}
              >
                <Pressable
                  style={styles.fill}
                  onPress={submitting ? undefined : onClose}
                  accessibilityRole="button"
                  accessibilityLabel="Fechar seleção de posto"
                />
              </Animated.View>

              <Animated.View
                entering={SlideInDown.duration(280)}
                exiting={SlideOutDown.duration(EXIT_DURATION_MS - 80)}
                style={[styles.sheetWrapper, { paddingHorizontal: theme.spacing.lg }]}
                pointerEvents="box-none"
              >
                <GlassPanel
                  padding="xl"
                  intensity={theme.blur.modal}
                  style={{ gap: theme.spacing.md }}
                >
                  {/* Drag handle */}
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

                  <FlatList
                    data={stations}
                    keyExtractor={(s) => s.id}
                    scrollEnabled={false}
                    renderItem={({ item }) => {
                      const selected = item.id === selectedId;
                      return (
                        <Pressable
                          onPress={() => setSelectedId(item.id)}
                          style={[
                            styles.stationRow,
                            {
                              borderColor: selected
                                ? theme.plan.accent
                                : theme.colors.border,
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
                                borderColor: selected
                                  ? theme.plan.accent
                                  : theme.colors.borderStrong,
                                backgroundColor: selected ? theme.plan.accent : 'transparent',
                              },
                            ]}
                          >
                            {selected ? (
                              <View
                                style={{
                                  width: 8,
                                  height: 8,
                                  borderRadius: 4,
                                  backgroundColor: '#FFF',
                                }}
                              />
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
                    }}
                    ListEmptyComponent={
                      <Text variant="body" color="muted" style={{ textAlign: 'center', paddingVertical: 16 }}>
                        Carregando postos...
                      </Text>
                    }
                  />

                  <View style={{ gap: theme.spacing.sm }}>
                    <Button
                      label="Confirmar resgate"
                      disabled={!selectedId || submitting}
                      loading={submitting}
                      onPress={handleConfirm}
                      fullWidth
                    />
                    <Button label="Cancelar" variant="ghost" onPress={onClose} disabled={submitting} fullWidth />
                  </View>
                </GlassPanel>
              </Animated.View>
            </>
          ) : null}
        </View>
      ) : null}
    </Modal>
  );
}

const styles = StyleSheet.create({
  fill: { flex: 1 },
  backdrop: { ...StyleSheet.absoluteFillObject },
  sheetWrapper: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    paddingBottom: 40,
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
