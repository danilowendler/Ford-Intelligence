import { useState } from 'react';
import { Alert, Platform, View } from 'react-native';
import { router } from 'expo-router';
import { Button, Icon, Text } from '@/components';
import { useTheme } from '@/theme/ThemeProvider';
import { useSchedulingStore } from '@/stores/useSchedulingStore';
import { fetchDealers } from '@/services/mocks/dealersApi';
import { fetchAvailableSlots } from '@/services/mocks/schedulingApi';
import type { ServiceKind } from '@/types/scheduling';

function todayISO(): string {
  return new Date().toISOString().slice(0, 10);
}

function notifyError(message: string) {
  if (Platform.OS === 'web') {
    if (typeof window !== 'undefined') window.alert(message);
    return;
  }
  Alert.alert('Não foi possível agendar agora', message);
}

export type OneTapSchedulingButtonProps = {
  suggestedService?: ServiceKind;
};

export function OneTapSchedulingButton({
  suggestedService = 'revision',
}: OneTapSchedulingButtonProps) {
  const theme = useTheme();
  const startDraftWithSuggestion = useSchedulingStore((s) => s.startDraftWithSuggestion);
  const [loading, setLoading] = useState(false);

  const handlePress = async () => {
    if (loading) return;
    setLoading(true);
    try {
      const dealers = await fetchDealers();
      const dealer = dealers[0];
      if (!dealer) {
        notifyError('Nenhuma concessionária disponível no momento.');
        return;
      }
      const date = todayISO();
      const slots = await fetchAvailableSlots(dealer.id, date);
      const slot = slots[0];
      if (!slot) {
        notifyError('Sem horários livres para hoje. Abra o mapa para escolher outra data.');
        return;
      }
      startDraftWithSuggestion({
        dealerId: dealer.id,
        service: suggestedService,
        mode: 'in-person',
        date,
        slot,
      });
      router.replace('/scheduling/confirm');
    } catch {
      notifyError('Falha de comunicação. Tente novamente em instantes.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={{ gap: theme.spacing.xs }}>
      <Button
        label={loading ? 'Preparando…' : 'Agendar em 1 toque'}
        variant="primary"
        loading={loading}
        iconLeft={<Icon name="flash-outline" size={18} color="inverse" />}
        onPress={handlePress}
        fullWidth
      />
      <Text variant="caption" color="muted" style={{ textAlign: 'center' }}>
        Premium · usa concessionária mais próxima e próximo horário
      </Text>
    </View>
  );
}
