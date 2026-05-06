import { useState } from 'react';
import { Alert, View } from 'react-native';
import { Badge, Button, Card, Screen, Text } from '@/components';
import { useTheme } from '@/theme/ThemeProvider';
import { useAuthStore } from '@/stores/useAuthStore';
import { usePlanStore } from '@/stores/usePlanStore';

export default function ProfileScreen() {
  const theme = useTheme();
  const user = useAuthStore((s) => s.user);
  const logout = useAuthStore((s) => s.logout);
  const plan = usePlanStore((s) => s.plan);
  const [signingOut, setSigningOut] = useState(false);

  const handleLogout = async () => {
    Alert.alert('Sair da conta', 'Deseja realmente encerrar a sessão?', [
      { text: 'Cancelar', style: 'cancel' },
      {
        text: 'Sair',
        style: 'destructive',
        onPress: async () => {
          setSigningOut(true);
          try {
            await logout();
          } finally {
            setSigningOut(false);
          }
        },
      },
    ]);
  };

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
