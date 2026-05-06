import { Link } from 'expo-router';
import { View } from 'react-native';
import { Button, Screen, Text } from '@/components';
import { useTheme } from '@/theme/ThemeProvider';

export default function HomeScreen() {
  const theme = useTheme();
  return (
    <Screen>
      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', gap: theme.spacing.sm }}>
        <Text variant="h1">Ford Intelligence</Text>
        <Text variant="body" color="muted">
          M1 — Design System & Tema
        </Text>
      </View>
      {__DEV__ ? (
        <Link href="/_dev/design-system" asChild>
          <Button label="Abrir Design System (DEV)" variant="secondary" />
        </Link>
      ) : null}
    </Screen>
  );
}
