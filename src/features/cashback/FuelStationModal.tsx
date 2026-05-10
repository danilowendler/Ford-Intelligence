import { useEffect, useState } from 'react';
import { FlatList, Modal, Pressable, StyleSheet, View } from 'react-native';
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
              {/* Backdrop ocupa o root inteiro (absoluteFill) e fica atras do
                  sheet por z-order natural (irmao anterior). */}
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

              {/* Sheet: filho NORMAL do root flex-end (sem position absolute).
                  maxHeight: '85%' resolve porque o root tem altura definida
                  (= viewport do Modal). */}
              <Animated.View
                entering={SlideInDown.duration(280)}
                exiting={SlideOutDown.duration(EXIT_DURATION_MS - 80)}
                style={[styles.sheet, { paddingHorizontal: theme.spacing.lg }]}
              >
                <GlassPanel
                  padding="none"
                  intensity={theme.blur.modal}
                  style={styles.glass}
                >
                  {/* Header (altura intrinseca) */}
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

                  {/* Lista: flex:1 reivindica o espaco restante DENTRO do
                      maxHeight resolvido do sheet. Rola se ultrapassar. */}
                  <FlatList
                    data={stations}
                    keyExtractor={(s) => s.id}
                    style={styles.list}
                    contentContainerStyle={{
                      paddingHorizontal: theme.spacing.xl,
                      paddingBottom: theme.spacing.md,
                    }}
                    showsVerticalScrollIndicator={false}
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

                  {/* Footer (altura intrinseca) — respeita home indicator */}
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
  // Root: ocupa todo o viewport do Modal e empurra o sheet para baixo.
  root: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  fill: { flex: 1 },
  // Sheet: filho NORMAL (sem position absolute), maxHeight em % do root.
  sheet: {
    width: '100%',
    maxHeight: '85%',
  },
  // Glass: container do conteudo. Sem flex:1 — abraca o conteudo
  // naturalmente. O sheet pai impoe maxHeight 85%, e o overflow:hidden
  // garante que filhos jamais vazem do raio do GlassPanel.
  glass: {
    overflow: 'hidden',
  },
  // List: flexShrink:1 — cresce com o conteudo intrinseco, mas encolhe
  // (e ativa scroll) quando o sheet bate no maxHeight de 85%.
  list: {
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
