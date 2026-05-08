import { useState } from 'react';
import { Alert, Platform, View } from 'react-native';
import { Badge, Button, Card, GlassPanel, Icon, Screen, Text } from '@/components';
import { useTheme } from '@/theme/ThemeProvider';
import { useAuthStore } from '@/stores/useAuthStore';
import { usePlanStore } from '@/stores/usePlanStore';
import { useSchedulingStore } from '@/stores/useSchedulingStore';
import { BookingListItem } from '@/features/scheduling/BookingListItem';
import type { Booking } from '@/types/scheduling';

export default function ProfileScreen() {
  const theme = useTheme();
  const user = useAuthStore((s) => s.user);
  const logout = useAuthStore((s) => s.logout);
  const plan = usePlanStore((s) => s.plan);
  const bookings = useSchedulingStore((s) => s.bookings);
  const cancelBooking = useSchedulingStore((s) => s.cancelBooking);
  const [signingOut, setSigningOut] = useState(false);

  const performLogout = async () => {
    setSigningOut(true);
    try {
      await logout();
    } finally {
      setSigningOut(false);
    }
  };

  const handleLogout = () => {
    if (Platform.OS === 'web') {
      const ok =
        typeof window !== 'undefined' &&
        window.confirm('Deseja realmente encerrar a sessão?');
      if (ok) performLogout();
      return;
    }
    Alert.alert('Sair da conta', 'Deseja realmente encerrar a sessão?', [
      { text: 'Cancelar', style: 'cancel' },
      { text: 'Sair', style: 'destructive', onPress: performLogout },
    ]);
  };

  const confirmCancel = (booking: Booking) => {
    if (booking.status === 'cancelled') return;
    const message = `Cancelar agendamento ${booking.protocol}?`;
    if (Platform.OS === 'web') {
      const ok = typeof window !== 'undefined' && window.confirm(message);
      if (ok) cancelBooking(booking.id);
      return;
    }
    Alert.alert('Cancelar agendamento', message, [
      { text: 'Manter', style: 'cancel' },
      {
        text: 'Cancelar agendamento',
        style: 'destructive',
        onPress: () => {
          cancelBooking(booking.id);
        },
      },
    ]);
  };

  const activeBookings = bookings.filter((b) => b.status === 'confirmed');

  return (
    <Screen scroll>
      <View style={{ gap: theme.spacing.xs, marginTop: theme.spacing.lg }}>
        <Text variant="h1">Perfil</Text>
        <Text variant="body" color="muted">
          Sua conta e preferências.
        </Text>
      </View>

      <Card>
        <View style={{ gap: theme.spacing.sm }}>
          <Text variant="caption" color="muted">
            CONTA
          </Text>
          <Text variant="h3">{user?.name ?? 'Motorista'}</Text>
          <Text variant="body" color="muted">
            {user?.email ?? '—'}
          </Text>
          <View style={{ flexDirection: 'row', gap: theme.spacing.sm }}>
            <Badge label={`Plano ${plan}`} tone="accent" />
          </View>
        </View>
      </Card>

      <View style={{ gap: theme.spacing.sm }}>
        <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
          <Text variant="h3">Meus agendamentos</Text>
          {activeBookings.length > 0 ? (
            <Badge label={`${activeBookings.length} ativos`} tone="info" />
          ) : null}
        </View>

        {bookings.length === 0 ? (
          <GlassPanel padding="lg" style={{ gap: theme.spacing.sm }}>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: theme.spacing.sm }}>
              <Icon name="calendar-outline" size={20} color="muted" />
              <Text variant="bodyStrong">Sem agendamentos por aqui</Text>
            </View>
            <Text variant="body" color="muted">
              Quando você agendar um serviço pelo mapa, ele aparece aqui.
            </Text>
          </GlassPanel>
        ) : (
          <View style={{ gap: theme.spacing.sm }}>
            {bookings.map((b) => (
              <BookingListItem key={b.id} booking={b} onPress={confirmCancel} />
            ))}
          </View>
        )}
      </View>

      <Button
        label="Sair da conta"
        variant="secondary"
        onPress={handleLogout}
        loading={signingOut}
        fullWidth
      />
    </Screen>
  );
}
