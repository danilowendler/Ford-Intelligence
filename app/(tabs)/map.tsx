import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { ActivityIndicator, Platform, StyleSheet, View } from 'react-native';
import MapView, { Marker, PROVIDER_GOOGLE, type Region } from 'react-native-maps';
import { router } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useBottomTabBarHeight } from '@react-navigation/bottom-tabs';
import { GlassPanel, Text } from '@/components';
import { useTheme } from '@/theme/ThemeProvider';
import { DEFAULT_ORIGIN, fetchDealers } from '@/services/mocks/dealersApi';
import type { Dealer } from '@/types/scheduling';
import { darkMapStyle } from '@/features/scheduling/mapStyle';
import { DealerPin } from '@/features/scheduling/DealerPin';
import { DealerSheet } from '@/features/scheduling/DealerSheet';
import { MapFiltersBar, type MapFilterId } from '@/features/scheduling/MapFiltersBar';
import { useSchedulingStore } from '@/stores/useSchedulingStore';

const INITIAL_REGION: Region = {
  latitude: DEFAULT_ORIGIN.latitude,
  longitude: DEFAULT_ORIGIN.longitude,
  latitudeDelta: 0.5,
  longitudeDelta: 0.5,
};

const HEADER_FOOTPRINT = 140;

function applyFilter(dealers: Dealer[], filter: MapFilterId): Dealer[] {
  switch (filter) {
    case 'all':
      return dealers;
    case 'has-promo':
      return dealers.filter((d) => d.promotions.length > 0);
    case 'near-10':
      return dealers.filter((d) => (d.distanceKm ?? Infinity) <= 10);
    default:
      return dealers.filter((d) => d.services.includes(filter));
  }
}

export default function MapScreen() {
  const theme = useTheme();
  const insets = useSafeAreaInsets();
  const tabBarHeight = useBottomTabBarHeight();
  const startDraft = useSchedulingStore((s) => s.startDraft);

  const [dealers, setDealers] = useState<Dealer[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<MapFilterId>('all');
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [trackingId, setTrackingId] = useState<string | null>(null);
  const mapRef = useRef<MapView | null>(null);

  useEffect(() => {
    if (!selectedId) {
      setTrackingId(null);
      return;
    }
    setTrackingId(selectedId);
    const t = setTimeout(() => setTrackingId(null), 200);
    return () => clearTimeout(t);
  }, [selectedId]);

  useEffect(() => {
    let cancelled = false;
    fetchDealers().then((list) => {
      if (!cancelled) {
        setDealers(list);
        setLoading(false);
      }
    });
    return () => {
      cancelled = true;
    };
  }, []);

  const visibleDealers = useMemo(() => applyFilter(dealers, filter), [dealers, filter]);
  const selectedDealer = useMemo(
    () => visibleDealers.find((d) => d.id === selectedId) ?? null,
    [visibleDealers, selectedId],
  );

  const handleSelect = useCallback((dealer: Dealer) => {
    setSelectedId(dealer.id);
    mapRef.current?.animateToRegion(
      {
        latitude: dealer.coords.latitude,
        longitude: dealer.coords.longitude,
        latitudeDelta: 0.08,
        longitudeDelta: 0.08,
      },
      320,
    );
  }, []);

  const handleSchedule = useCallback(
    (dealerId: string) => {
      startDraft(dealerId);
      setSelectedId(null);
      router.push('/scheduling/service');
    },
    [startDraft],
  );

  const mapPadding = useMemo(
    () => ({
      top: insets.top + HEADER_FOOTPRINT,
      bottom: tabBarHeight,
      left: 0,
      right: 0,
    }),
    [insets.top, tabBarHeight],
  );

  return (
    <View style={[styles.root, { backgroundColor: theme.colors.bgBase }]}>
      <MapView
        ref={(ref) => {
          mapRef.current = ref;
        }}
        provider={Platform.OS === 'android' ? PROVIDER_GOOGLE : undefined}
        style={StyleSheet.absoluteFill}
        initialRegion={INITIAL_REGION}
        customMapStyle={darkMapStyle}
        showsCompass={false}
        showsPointsOfInterest={false}
        showsBuildings={false}
        toolbarEnabled={false}
        mapPadding={mapPadding}
        onPress={() => setSelectedId(null)}
      >
        {visibleDealers.map((dealer) => (
          <Marker
            key={dealer.id}
            coordinate={dealer.coords}
            onPress={() => handleSelect(dealer)}
            anchor={{ x: 0.5, y: 0.5 }}
            tracksViewChanges={trackingId === dealer.id}
          >
            <DealerPin
              selected={selectedId === dealer.id}
              hasPromotion={dealer.promotions.length > 0}
            />
          </Marker>
        ))}
      </MapView>

      <View
        pointerEvents="box-none"
        style={[styles.topOverlay, { paddingTop: insets.top + theme.spacing.sm }]}
      >
        <View style={{ paddingHorizontal: theme.spacing.lg, gap: theme.spacing.sm }}>
          <GlassPanel
            padding="md"
            intensity={40}
            tint="dark"
            style={[
              theme.shadow.md,
              { backgroundColor: 'rgba(10,14,20,0.55)' },
            ]}
          >
            <View
              pointerEvents="none"
              style={[
                StyleSheet.absoluteFillObject,
                { backgroundColor: 'rgba(10,14,20,0.55)' },
              ]}
            />
            <View style={{ gap: 4 }}>
              <Text
                variant="caption"
                style={{
                  color: theme.colors.textPrimary,
                  opacity: 0.72,
                  textTransform: 'uppercase',
                  letterSpacing: 0.8,
                  fontFamily: theme.fontFamily.medium,
                }}
              >
                Concessionárias Ford
              </Text>
              <Text variant="h3" style={{ color: theme.colors.textPrimary }}>
                {loading ? 'Carregando…' : `${visibleDealers.length} próximas`}
              </Text>
            </View>
          </GlassPanel>
        </View>

        <View style={{ marginTop: theme.spacing.sm }}>
          <MapFiltersBar selected={filter} onSelect={setFilter} />
        </View>
      </View>

      {loading ? (
        <View pointerEvents="none" style={styles.loader}>
          <ActivityIndicator color={theme.plan.accent} />
        </View>
      ) : null}

      <DealerSheet
        dealer={selectedDealer}
        onClose={() => setSelectedId(null)}
        onSchedule={handleSchedule}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
  },
  topOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
  },
  loader: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
