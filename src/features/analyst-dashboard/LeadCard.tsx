import { Pressable, View } from 'react-native';
import { useRouter } from 'expo-router';
import { Badge, Card, Icon, Text } from '@/components';
import { useTheme } from '@/theme/ThemeProvider';
import type { Lead, RiskLabel, LeadStatus } from '@/services/mocks/analystApi';

const VEHICLE_LABEL: Record<Lead['vehicleModel'], string> = {
  ranger: 'Ranger',
  maverick: 'Maverick',
  territory: 'Territory',
  mustang: 'Mustang',
};

const PLAN_LABEL: Record<Lead['plan'], string> = {
  agro: 'Agro',
  urban: 'Urban',
  premium: 'Premium',
};

const STATUS_LABEL: Record<LeadStatus, string> = {
  novo: 'Novo',
  contactado: 'Contactado',
  convertido: 'Convertido',
  perdido: 'Perdido',
};

const STATUS_TONE: Record<LeadStatus, 'info' | 'warn' | 'success' | 'neutral' | 'critical' | 'accent'> = {
  novo: 'accent',
  contactado: 'warn',
  convertido: 'success',
  perdido: 'neutral',
};

const RISK_TONE: Record<RiskLabel, 'info' | 'warn' | 'success' | 'neutral' | 'critical' | 'accent'> = {
  alto: 'critical',
  moderado: 'warn',
  baixo: 'success',
};

function daysAgo(iso: string): string {
  const diff = Date.now() - new Date(iso).getTime();
  const days = Math.floor(diff / 86_400_000);
  if (days === 0) return 'hoje';
  if (days === 1) return '1 dia atrás';
  return `${days} dias atrás`;
}

interface LeadCardProps {
  lead: Lead;
}

export function LeadCard({ lead }: LeadCardProps) {
  const theme = useTheme();
  const router = useRouter();

  return (
    <Pressable
      onPress={() => router.push(`/(analyst)/leads/${lead.id}` as never)}
      style={({ pressed }) => ({ opacity: pressed ? 0.85 : 1 })}
      accessibilityRole="button"
      accessibilityLabel={`Lead ${lead.clientName}, score ${lead.aiScore}`}
    >
      <Card padding="md">
        {/* Row 1: name + score badge */}
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: theme.spacing.sm }}>
          <Text variant="bodyStrong" style={{ flex: 1 }} numberOfLines={1}>
            {lead.clientName}
          </Text>
          <Badge label={`IA ${lead.aiScore}`} tone={RISK_TONE[lead.riskLabel]} />
        </View>

        {/* Row 2: vehicle · plan · service */}
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            gap: theme.spacing.xs,
            flexWrap: 'wrap',
          }}
        >
          <Text variant="caption" color="muted">
            {VEHICLE_LABEL[lead.vehicleModel]}
          </Text>
          <Text variant="caption" color="muted">·</Text>
          <Badge label={PLAN_LABEL[lead.plan]} tone="info" />
          <Text variant="caption" color="muted">·</Text>
          <Text variant="caption" color="muted" numberOfLines={1} style={{ flex: 1 }}>
            {lead.service}
          </Text>
        </View>

        {/* Row 3: last activity + status */}
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: theme.spacing.sm }}>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4, flex: 1 }}>
            <Icon name="time-outline" size={13} color="muted" />
            <Text variant="caption" color="muted">
              {daysAgo(lead.lastActivity)}
            </Text>
          </View>
          <Badge label={STATUS_LABEL[lead.status]} tone={STATUS_TONE[lead.status]} />
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 2 }}>
            <Text variant="caption" color="muted">
              R$ {lead.estimatedRevenue.toLocaleString('pt-BR')}
            </Text>
          </View>
        </View>
      </Card>
    </Pressable>
  );
}
