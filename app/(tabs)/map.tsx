import { View } from 'react-native';
import { Badge, Card, Screen, Text } from '@/components';
import { useTheme } from '@/theme/ThemeProvider';

export default function MapScreen() {
  const theme = useTheme();
  return (
    <Screen>
      <View style={{ gap: theme.spacing.xs, marginTop: theme.spacing.lg }}>
        <Text variant="h1">Mapa</Text>
        <Text variant="body" color="muted">
          Concessionárias Ford próximas e fluxo &quot;leva e traz&quot;.
        </Text>
      </View>
      <Card>
        <View style={{ gap: theme.spacing.sm }}>
          <Badge label="M6" tone="info" />
          <Text variant="bodyStrong">Disponível em breve</Text>
          <Text variant="body" color="muted">
            Mapa com pins customizados, promoções por concessionária e agendamento.
          </Text>
        </View>
      </Card>
    </Screen>
  );
}
