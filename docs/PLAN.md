# Ford Intelligence — Plano de Execução

Plano operacional dividido em milestones incrementais. Cada milestone tem **branch dedicada**, **objetivo claro**, **checklist de entregas** e **commit final**. Execução do setup ao "deploy" (build EAS de preview).

> Fonte de verdade: [PRD.md](PRD.md) · Briefing: [../CLAUDE.md](../CLAUDE.md)
> Escopo: Frontend Mobile only (React Native + Expo). Sem backend, sem ML, sem n8n.

---

## Convenções de Branch & Commit

- **Branch base:** `main` (produção) ← `develop` (integração)
- **Padrão de branch:** `feat/m{N}-{slug}` · `fix/{slug}` · `chore/{slug}`
- **Commits:** Conventional Commits — `feat(scope): ...`, `fix(scope): ...`, `chore(scope): ...`
- **Merge:** squash merge de cada milestone para `develop`; `develop → main` ao fim do projeto.

---

## M0 — Setup & Fundações

**Branch:** `chore/m0-setup`
**Objetivo:** Inicializar projeto Expo + TypeScript + Expo Router e instalar dependências core.

### Entregas
- [x] `npx create-expo-app@latest Mobile-Ford --template default` (managed)
- [x] Habilitar **TypeScript strict** em `tsconfig.json`
- [x] Configurar **Expo Router** (já vem no template default)
- [x] Configurar alias `@/*` → `./src/*` (`tsconfig.json`; em SDK 54 o Metro honra paths sem babel plugin)
- [x] Instalar deps core: `zustand`, `react-hook-form`, `zod`, `expo-blur`, `expo-secure-store`, `@react-native-async-storage/async-storage`, `react-native-reanimated`, `moti`
- [x] Instalar deps 3D: `three`, `expo-gl`, `@react-three/fiber`
- [x] Instalar deps mapas: `react-native-maps`
- [x] Instalar `@expo/vector-icons` (já incluso no Expo)
- [x] Configurar ESLint + Prettier (`eslint-config-expo` + `prettier`)
- [x] Criar estrutura de pastas conforme [CLAUDE.md](../CLAUDE.md#folder-structure)
- [x] `.gitignore`, `.env.example`, `README.md` mínimo
- [x] `app.json` com nome "Ford Intelligence", slug, ícone placeholder, splash dark
- [x] Smoke test: `npx expo start` abre app em branco sem erros

**Status:** ✅ Concluído — commit `8ea8ee4` na branch `chore/m0-setup`
**Commit final:** `chore(setup): bootstrap Expo + TS + Expo Router + base deps`

---

## M1 — Design System & Tema

**Branch:** `feat/m1-design-system`
**Objetivo:** Implementar tokens de design, paleta Ford, tipografia e componentes-base reutilizáveis.

### Entregas
- [ ] `src/theme/tokens.ts` — cores base, espaçamentos, raios, sombras, blurs
- [ ] `src/theme/plans.ts` — variantes Agro / Urban / Premium (acentos)
- [ ] `src/theme/typography.ts` — escala tipográfica (h1–caption)
- [ ] `src/theme/ThemeProvider.tsx` — context/hook `useTheme()` consumindo Zustand `usePlanStore`
- [ ] Carregar fontes via `expo-font` em `app/_layout.tsx` (Inter ou Ford Antenna)
- [ ] Componentes base em `src/components/`:
  - [ ] `Text` (variantes h1/h2/h3/body/caption)
  - [ ] `Button` (primary/secondary/ghost + ícone opcional)
  - [ ] `GlassPanel` (wrapper `expo-blur` + borda sutil)
  - [ ] `Card`
  - [ ] `Input` (integrado com `react-hook-form`)
  - [ ] `Badge` (status/alert)
  - [ ] `Icon` (wrapper `@expo/vector-icons`)
  - [ ] `Screen` (SafeArea + bg base)
- [ ] `src/stores/usePlanStore.ts` (Zustand) com plano atual + setter
- [ ] Tela de showcase `app/_dev/design-system.tsx` listando todos os componentes (apenas em DEV)

**Commit final:** `feat(design-system): tokens, theme provider e componentes base`

---

## M2 — Navegação & Auth Stack

**Branch:** `feat/m2-navigation-auth`
**Objetivo:** Estrutura de roteamento Expo Router com fluxos de autenticação (mock) e tabs principais.

### Entregas
- [ ] `app/_layout.tsx` — root layout com fonts + ThemeProvider + StatusBar dark
- [ ] `app/(auth)/_layout.tsx` — stack auth
  - [ ] `app/(auth)/login.tsx`
  - [ ] `app/(auth)/signup.tsx`
  - [ ] `app/(auth)/forgot-password.tsx`
- [ ] `app/(tabs)/_layout.tsx` — bottom tabs (Home / Mapa / Carteira / Perfil)
  - [ ] `app/(tabs)/index.tsx` (Home placeholder)
  - [ ] `app/(tabs)/map.tsx` (placeholder)
  - [ ] `app/(tabs)/wallet.tsx` (placeholder)
  - [ ] `app/(tabs)/profile.tsx` (placeholder)
- [ ] `app/+not-found.tsx`
- [ ] `src/stores/useAuthStore.ts` — token, user, login/logout (mock async)
- [ ] Guarda de rota: redireciona não autenticado para `/login`
- [ ] `expo-secure-store` para persistir token mock
- [ ] Animações de transição entre stacks (Reanimated)

**Commit final:** `feat(navigation): expo router com auth stack e tabs base`

---

## M3 — Onboarding & Perfilamento

**Branch:** `feat/m3-onboarding`
**Objetivo:** Fluxo multi-step de onboarding capturando perfil de uso para alimentar o motor de IA (mock).

### Entregas
- [ ] `app/(auth)/onboarding/_layout.tsx` — stack do wizard
- [ ] Passo 1: Boas-vindas + branding
- [ ] Passo 2: Modelo do veículo (seleção entre mocks: Ranger, Maverick, Territory, Mustang)
- [ ] Passo 3: Estilo de uso (Urbano / Rural / Misto / Performance)
- [ ] Passo 4: Quilometragem média mensal
- [ ] Passo 5: Seleção de plano SaaS (Agro / Urban / Premium) com comparativo
- [ ] Passo 6: Confirmação + animação de conclusão
- [ ] Indicador de progresso (steps)
- [ ] Validação por step com `zod` + `react-hook-form`
- [ ] `src/stores/useUserStore.ts` — perfil completo persistido
- [ ] `src/services/mocks/profileApi.ts` — `submitProfile()` retorna risco mockado
- [ ] Onboarding executa apenas no primeiro acesso (flag em AsyncStorage)

**Commit final:** `feat(onboarding): wizard multi-step com perfilamento e seleção de plano`

---

## M4 — Home & Simulação de Telemetria IoT

**Branch:** `feat/m4-telemetry-home`
**Objetivo:** Tela principal com dados em tempo real simulados (OBD2) e sistema de alertas preditivos.

### Entregas
- [ ] `src/features/telemetry/simulator.ts` — `EventEmitter` emitindo a cada 2s: hodômetro, pressão pneus (4), temperatura motor, nível combustível, bateria
- [ ] `src/features/telemetry/useTelemetry.ts` — hook que assina o emitter
- [ ] `src/stores/useVehicleStore.ts` — estado do veículo + leituras atuais
- [ ] `src/services/mocks/alertsApi.ts` — gera alertas baseados em thresholds (ex: km > 9000 → "Revisão antecipada")
- [ ] `src/stores/useAlertsStore.ts` — fila de alertas
- [ ] Tela Home (`app/(tabs)/index.tsx`):
  - [ ] Header com saudação + plano atual (badge)
  - [ ] Card destaque: próxima manutenção prevista (IA mock)
  - [ ] Carrossel de KPIs em GlassPanels: km, pneus, temp, bateria
  - [ ] Lista de alertas ativos (com severidade)
  - [ ] CTA "Agendar serviço" (navega para M6)
- [ ] Animações reativas (Moti) em mudança de leituras
- [ ] Pull-to-refresh resincroniza simulador

**Commit final:** `feat(telemetry): home com simulação IoT em tempo real e alertas preditivos`

---

## M5 — Visualização 3D do Veículo

**Branch:** `feat/m5-vehicle-3d`
**Objetivo:** Cena 3D interativa do veículo com hotspots de alerta sincronizados com a telemetria.

### Entregas
- [ ] `app/vehicle/[id].tsx` — rota detalhe do veículo
- [ ] `src/features/vehicle3d/Scene.tsx` — `<Canvas>` com `@react-three/fiber/native`
- [ ] Carregar modelo `.glb` placeholder em `assets/models/` (carro low-poly genérico)
- [ ] Iluminação: ambient + directional + rim light azul Ford
- [ ] Câmera orbital com gestos (toque para girar, pinch para zoom)
- [ ] `src/features/vehicle3d/Hotspot.tsx` — esfera pulsante 3D em pontos críticos (pneus, motor, bateria)
- [ ] Hotspots reagem aos alertas do `useAlertsStore` (cor warn/critical)
- [ ] Toque em hotspot abre `BottomSheet` com detalhes do alerta
- [ ] Botões: "Vista frontal", "Vista lateral", "Vista superior"
- [ ] Loading skeleton enquanto modelo carrega
- [ ] Otimização: `frameloop="demand"` quando estático

**Commit final:** `feat(vehicle3d): cena 3D interativa com hotspots de alerta`

---

## M6 — Mapa de Concessionárias & Agendamento

**Branch:** `feat/m6-map-scheduling`
**Objetivo:** Mapa com concessionárias Ford próximas e fluxo completo de agendamento incluindo "leva e traz".

### Entregas
- [ ] `app/(tabs)/map.tsx` — `<MapView>` com `react-native-maps`
- [ ] `src/services/mocks/dealersApi.ts` — lista mock de concessionárias (nome, endereço, lat/long, promoções, distância)
- [ ] Pins customizados Ford com badge de promoção
- [ ] Bottom sheet ao tocar pin: nome, endereço, avaliação, promoções ativas, CTA "Agendar"
- [ ] `app/scheduling/_layout.tsx` — stack do fluxo de agendamento
  - [ ] Passo 1: Seleção do serviço (revisão / troca de óleo / pneus / outros)
  - [ ] Passo 2: Modalidade (presencial / **leva e traz**)
  - [ ] Passo 3: Endereço de retirada (se leva e traz) com mock geocoding
  - [ ] Passo 4: Data e horário (calendário + slots disponíveis mockados)
  - [ ] Passo 5: Confirmação com resumo + animação sucesso
- [ ] `src/stores/useSchedulingStore.ts`
- [ ] `src/services/mocks/schedulingApi.ts` — `createBooking()` com delay
- [ ] Histórico de agendamentos em Perfil
- [ ] Filtros no mapa: distância, promoções, serviços disponíveis

**Commit final:** `feat(scheduling): mapa de concessionárias e fluxo leva-e-traz`

---

## M7 — Carteira de Cashback

**Branch:** `feat/m7-cashback-wallet`
**Objetivo:** Módulo de fidelidade com saldo, extrato, cupons geolocalizados em combustível e manutenção.

### Entregas
- [ ] `app/(tabs)/wallet.tsx` — Tela principal da carteira
- [ ] Card de saldo com glassmorphism + animação numérica de contagem
- [ ] Aba "Extrato" — lista de transações (entrada/saída) com filtro por tipo
- [ ] Aba "Cupons" — grid de cupons disponíveis
- [ ] `src/features/cashback/CouponCard.tsx` — visual ticket-style com perfuração
- [ ] Cupons geolocalizados: badge "Próximo a você" usando mock distance
- [ ] `app/wallet/coupon/[id].tsx` — detalhe do cupom + QR code mock
- [ ] `src/services/mocks/walletApi.ts` — saldo, extrato, cupons
- [ ] `src/stores/useWalletStore.ts`
- [ ] CTA "Resgatar em combustível" → modal de seleção de posto (mock)
- [ ] Animação celebrativa ao receber novo cashback

**Commit final:** `feat(wallet): carteira de cashback com cupons e extrato`

---

## M8 — Diferenciação Visual por Plano SaaS

**Branch:** `feat/m8-plan-variants`
**Objetivo:** Aplicar variantes visuais sutis (Agro / Urban / Premium) de forma harmônica em todas as telas.

### Entregas
- [ ] Validar `src/theme/plans.ts` cobre todos os tokens necessários
- [ ] Variantes de ícones por plano (rústico / minimalista / refinado) — set de ícones por plano
- [ ] Background sutil diferenciado por plano (gradiente / textura / overlay)
- [ ] Acento aplicado em: botões primários, badges, hotspots 3D, pin do mapa
- [ ] Tela de troca de plano em Perfil com preview visual
- [ ] Animação de transição de tema ao mudar plano (cross-fade)
- [ ] **Plano Premium**: comandos de voz mock (botão de microfone fake) + agendamento "1-tap"
- [ ] **Plano Agro**: alertas extra para terreno acidentado (mock)
- [ ] **Plano Urban**: card "rota inteligente" mock na home
- [ ] Validar contraste WCAG AA em todas as variantes

**Commit final:** `feat(plans): diferenciação visual e funcional Agro/Urban/Premium`

---

## M9 — Dashboard do Analista Ford (Backoffice)

**Branch:** `feat/m9-analyst-dashboard`
**Objetivo:** Área restrita do analista/concessionária com visão de "Service Share" e leads qualificados (mock).

### Entregas
- [ ] `app/(analyst)/_layout.tsx` — stack com role-gate em `useAuthStore`
- [ ] Login mock com toggle "Sou analista Ford" expõe área
- [ ] `app/(analyst)/dashboard.tsx`:
  - [ ] KPIs topo: VIN Share, leads ativos, agendamentos do mês, taxa de conversão
  - [ ] Gráfico de barras (lib leve: `react-native-svg` custom ou `victory-native`)
  - [ ] Lista de leads qualificados pela "IA" (mock) com score
  - [ ] Filtros: período, plano do cliente, tipo de serviço
- [ ] `app/(analyst)/leads/[id].tsx` — detalhe do lead + ações mock
- [ ] `src/services/mocks/analystApi.ts` — KPIs, leads, séries temporais
- [ ] Tema visual diferenciado (mais "data-dense", denso de informação)

**Commit final:** `feat(analyst): dashboard interno com KPIs e leads qualificados`

---

## M10 — Polimento, Acessibilidade & QA

**Branch:** `chore/m10-polish-qa`
**Objetivo:** Ajustes finos, performance, acessibilidade e revisão de UX antes do build.

### Entregas
- [ ] Auditoria de performance: `react-native-performance` ou DevTools
- [ ] Lazy load de telas pesadas (3D, mapa)
- [ ] Skeletons em todas as telas com fetch
- [ ] Estados de erro e empty state em todas as listas
- [ ] Acessibilidade: `accessibilityLabel`, `accessibilityRole`, contraste, tamanhos toque
- [ ] Suporte a fontes ampliadas do sistema
- [ ] Haptic feedback (`expo-haptics`) em ações críticas
- [ ] Splash screen e ícone finalizados (placeholder Ford)
- [ ] Revisão de microcopy PT-BR
- [ ] Testes manuais em iOS e Android (Expo Go ou dev client)
- [ ] Atualizar `README.md` com instruções de execução

**Commit final:** `chore(polish): acessibilidade, performance e QA final`

---

## M11 — "Deploy" (EAS Build de Preview)

**Branch:** `chore/m11-eas-deploy`
**Objetivo:** Gerar builds de preview iOS/Android via EAS para distribuição interna.

### Entregas
- [ ] Instalar `eas-cli` e autenticar (`eas login`)
- [ ] `eas init` — vincular projeto
- [ ] `eas.json` com perfis: `development`, `preview`, `production`
- [ ] Configurar `app.json`: bundleIdentifier iOS, package Android, versionCode
- [ ] `eas build --profile preview --platform all` (ou `--platform android` se sem conta Apple)
- [ ] Upload de QR code do build no `README.md`
- [ ] Configurar EAS Update para OTA (`eas update --branch preview`)
- [ ] Documentar processo de smoke test pós-build em `docs/RELEASE.md`
- [ ] Merge final `develop → main` com tag `v1.0.0-preview`

**Commit final:** `chore(release): eas build preview e tag v1.0.0-preview`

---

## Resumo Executivo

| # | Milestone | Branch | Foco |
|---|---|---|---|
| M0 | Setup | `chore/m0-setup` | Bootstrap |
| M1 | Design System | `feat/m1-design-system` | Tema + componentes |
| M2 | Navegação & Auth | `feat/m2-navigation-auth` | Expo Router + auth mock |
| M3 | Onboarding | `feat/m3-onboarding` | Wizard de perfilamento |
| M4 | Telemetria & Home | `feat/m4-telemetry-home` | Simulação IoT + alertas |
| M5 | 3D do Veículo | `feat/m5-vehicle-3d` | Three.js + hotspots |
| M6 | Mapa & Agendamento | `feat/m6-map-scheduling` | Concessionárias + leva-traz |
| M7 | Carteira | `feat/m7-cashback-wallet` | Cashback + cupons |
| M8 | Planos SaaS | `feat/m8-plan-variants` | Agro/Urban/Premium |
| M9 | Analista | `feat/m9-analyst-dashboard` | Backoffice mock |
| M10 | Polimento | `chore/m10-polish-qa` | A11y + perf |
| M11 | Deploy | `chore/m11-eas-deploy` | EAS preview build |

Cada milestone deve ser **testado em device/emulador** antes do merge. Não avançar sem que a entrega anterior esteja funcional.
