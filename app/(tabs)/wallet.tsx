import { View } from 'react-native';
import { Badge, Card, Screen, Text } from '@/components';
import { useTheme } from '@/theme/ThemeProvider';

export default function WalletScreen() {
  const theme = useTheme();
  return (
    <Screen>
      <View style={{ gap: theme.spacing.xs, marginTop: theme.spacing.lg }}>
        <Text variant="h1">Carteira</Text>
        <Text variant="body" color="muted">
          Saldo, extrato e cupons geolocalizados.
        </Text>
      </View>
      <Card>
        <View style={{ gap: theme.spacing.sm }}>
          <Badge label="M7" tone="info" />
          <Text variant="bodyStrong">Disponível em breve</Text>
          <Text variant="body" color="muted">
            Cashback de fidelidade Ford com cupons em combustível e manutenção.
          </Text>
        </View>
      </Card>
    </Screen>
  );
}
