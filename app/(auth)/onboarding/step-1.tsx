import { View } from 'react-native';
import { useRouter } from 'expo-router';
import { MotiView } from 'moti';
import { Button, Icon, Screen, Text } from '@/components';
import { StepIndicator } from '@/features/onboarding/StepIndicator';
import { useTheme } from '@/theme/ThemeProvider';

export default function OnboardingStep1() {
  const theme = useTheme();
  const router = useRouter();

  return (
    <Screen>
      <StepIndicator total={6} current={1} />

      <View style={{ flex: 1, justifyContent: 'center', gap: theme.spacing.xl }}>
        <MotiView
          from={{ opacity: 0, translateY: 12 }}
          animate={{ opacity: 1, translateY: 0 }}
          transition={{ type: 'timing', duration: 500 }}
          style={{
            alignSelf: 'center',
            width: 96,
            height: 96,
            borderRadius: theme.radius.full,
            backgroundColor: theme.plan.accentSoft,
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <Icon name="sparkles-outline" size={44} color="accent" />
        </MotiView>

        <View style={{ gap: theme.spacing.md, alignItems: 'center' }}>
          <Text variant="h1" style={{ textAlign: 'center' }}>
            Bem-vindo à Ford Intelligence
          </Text>
          <Text variant="body" color="muted" style={{ textAlign: 'center' }}>
            Vamos personalizar sua experiência em 5 passos rápidos para que a IA preveja a manutenção
            do seu veículo com precisão.
          </Text>
        </View>
      </View>

      <Button
        label="Começar"
        fullWidth
        onPress={() => router.push('/(auth)/onboarding/step-2')}
      />
    </Screen>
  );
}
