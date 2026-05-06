import { View } from 'react-native';
import { Link } from 'expo-router';
import { Badge, Button, Card, Screen, Text } from '@/components';
import { useTheme } from '@/theme/ThemeProvider';
import { useAuthStore } from '@/stores/useAuthStore';

export default function HomeScreen() {
  const theme = useTheme();
  const user = useAuthStore((s) => s.user);

  return (
    <Screen scroll>
      <View style={{ gap: theme.spacing.xs, marginTop: theme.spacing.lg }}>
        <Text variant="caption" color="muted">
          Bem-vindo de volta
        </Text>
        <Text variant="h1">{user?.name ?? 'Motorista'}</Text>
      </View>

      <Card>
        <View style={{ gap: theme.spacing.sm }}>
          <Badge label="M3 — em breve" tone="info" />
          <Text variant="h3">Telemetria & alertas</Text>
          <Text variant="body" color="muted">
            Acompanhe leituras OBD2 simuladas e receba alertas preditivos.
          </Text>
        </View>
      </Card>

      {__DEV__ ? (
        <Link href="/_dev/design-system" asChild>
          <Button label="Abrir Design System (DEV)" variant="secondary" />
        </Link>
      ) : null}
    </Screen>
  );
}
