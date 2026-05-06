export const planAccents = {
  agro: {
    accent: '#D97706',
    accentSoft: 'rgba(217,119,6,0.18)',
    accentContrast: '#0A0E14',
    label: 'Agro',
    description: 'Robusto, terreno acidentado',
  },
  urban: {
    accent: '#6FA3FF',
    accentSoft: 'rgba(111,163,255,0.18)',
    accentContrast: '#0A0E14',
    label: 'Urban',
    description: 'Limpo, minimalista',
  },
  premium: {
    accent: '#D4AF37',
    accentSoft: 'rgba(212,175,55,0.18)',
    accentContrast: '#0A0E14',
    label: 'Premium',
    description: 'Luxuoso, sofisticado',
  },
} as const;

export type PlanId = keyof typeof planAccents;
export type PlanAccent = (typeof planAccents)[PlanId];

export const planIds: readonly PlanId[] = ['agro', 'urban', 'premium'] as const;
