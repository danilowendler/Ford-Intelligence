import { Modal, Pressable, StyleSheet, View } from 'react-native';
import Animated, { FadeIn, FadeOut, SlideInDown, SlideOutDown } from 'react-native-reanimated';
import { Badge, Button, GlassPanel, Icon, Text, type IconName } from '@/components';
import { useTheme } from '@/theme/ThemeProvider';
import type { HotspotCategory, HotspotSeverity, HotspotState } from './derive';

const ICON_BY_CATEGORY: Record<HotspotCategory, IconName> = {
  'tire-fl': 'ellipse-outline',
  'tire-fr': 'ellipse-outline',
  'tire-rl': 'ellipse-outline',
  'tire-rr': 'ellipse-outline',
  engine: 'thermometer-outline',
  battery: 'battery-half-outline',
};

const SEVERITY_LABEL: Record<HotspotSeverity, string> = {
  idle: 'Saudável',
  warn: 'Atenção',
  critical: 'Crítico',
};

export type AlertSheetProps = {
  hotspot: HotspotState | null;
  onClose: () => void;
  onSchedule: () => void;
};

export function AlertSheet({ hotspot, onClose, onSchedule }: AlertSheetProps) {
  const theme = useTheme();
  const visible = hotspot !== null;

  return (
    <Modal
      visible={visible}
      transparent
      animationType="none"
      onRequestClose={onClose}
      statusBarTranslucent
    >
      {hotspot ? (
        <View style={styles.fill}>
          <Animated.View
            entering={FadeIn.duration(180)}
            exiting={FadeOut.duration(160)}
            style={[styles.fill, styles.backdrop, { backgroundColor: theme.colors.overlay }]}
          >
            <Pressable
              style={styles.fill}
              onPress={onClose}
              accessibilityRole="button"
              accessibilityLabel="Fechar detalhes do alerta"
            />
          </Animated.View>

          <Animated.View
            entering={SlideInDown.duration(260)}
            exiting={SlideOutDown.duration(200)}
            style={[styles.sheetWrapper, { paddingHorizontal: theme.spacing.lg }]}
            pointerEvents="box-none"
          >
            <GlassPanel
              padding="xl"
              intensity={theme.blur.modal}
              style={{ gap: theme.spacing.md }}
            >
              <View style={styles.header}>
                <View
                  style={{
                    width: 44,
                    height: 44,
                    borderRadius: theme.radius.md,
                    alignItems: 'center',
                    justifyContent: 'center',
                    backgroundColor:
                      hotspot.severity === 'critical'
                        ? `${theme.colors.alertCritical}26`
                        : hotspot.severity === 'warn'
                          ? `${theme.colors.alertWarn}26`
                          : theme.colors.bgElevated,
                  }}
                >
                  <Icon
                    name={ICON_BY_CATEGORY[hotspot.category]}
                    size={22}
                    color={
                      hotspot.severity === 'critical'
                        ? 'critical'
                        : hotspot.severity === 'warn'
                          ? 'warn'
                          : 'muted'
                    }
                  />
                </View>
                <View style={{ flex: 1, gap: 2 }}>
                  <Text
                    variant="caption"
                    color={
                      hotspot.severity === 'critical'
                        ? 'critical'
                        : hotspot.severity === 'warn'
                          ? 'warn'
                          : 'muted'
                    }
                    style={{ textTransform: 'uppercase', letterSpacing: 0.6 }}
                  >
                    {SEVERITY_LABEL[hotspot.severity]}
                  </Text>
                  <Text variant="h2">{hotspot.label}</Text>
                </View>
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
                {hotspot.description}
              </Text>

              {hotspot.severity !== 'idle' ? (
                <View style={styles.metaRow}>
                  <Badge
                    label={
                      hotspot.severity === 'critical'
                        ? 'Ação imediata'
                        : 'Monitorar'
                    }
                    tone={hotspot.severity === 'critical' ? 'critical' : 'warn'}
                  />
                  <Text variant="caption" color="muted">
                    Origem: telemetria OBD2
                  </Text>
                </View>
              ) : null}

              <View style={{ gap: theme.spacing.sm, marginTop: theme.spacing.xs }}>
                <Button
                  label="Agendar serviço"
                  iconLeft={<Icon name="calendar-outline" size={18} color="inverse" />}
                  onPress={onSchedule}
                  fullWidth
                />
                <Button label="Fechar" variant="ghost" onPress={onClose} fullWidth />
              </View>
            </GlassPanel>
          </Animated.View>
        </View>
      ) : null}
    </Modal>
  );
}

const styles = StyleSheet.create({
  fill: {
    flex: 1,
  },
  backdrop: {
    ...StyleSheet.absoluteFillObject,
  },
  sheetWrapper: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    paddingBottom: 32,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 8,
  },
});
