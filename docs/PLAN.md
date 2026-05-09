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
- [x] `src/theme/tokens.ts` — cores base, espaçamentos, raios, sombras, blurs
- [x] `src/theme/plans.ts` — variantes Agro / Urban / Premium (acentos)
- [x] `src/theme/typography.ts` — escala tipográfica (h1–caption)
- [x] `src/theme/ThemeProvider.tsx` — context/hook `useTheme()` consumindo Zustand `usePlanStore`
- [x] Carregar fontes via `expo-font` em `app/_layout.tsx` (Inter ou Ford Antenna)
- [x] Componentes base em `src/components/`:
  - [x] `Text` (variantes h1/h2/h3/body/caption)
  - [x] `Button` (primary/secondary/ghost + ícone opcional)
  - [x] `GlassPanel` (wrapper `expo-blur` + borda sutil)
  - [x] `Card`
  - [x] `Input` (integrado com `react-hook-form`)
  - [x] `Badge` (status/alert)
  - [x] `Icon` (wrapper `@expo/vector-icons`)
  - [x] `Screen` (SafeArea + bg base)
- [x] `src/stores/usePlanStore.ts` (Zustand) com plano atual + setter
- [x] Tela de showcase `app/_dev/design-system.tsx` listando todos os componentes (apenas em DEV)

**Status:** ✅ Concluído — branch `feat/m1-design-system`
**Commit final:** `feat(design-system): tokens, theme provider e componentes base`

---

## M2 — Navegação & Auth Stack

**Branch:** `feat/m2-navigation-auth`
**Objetivo:** Estrutura de roteamento Expo Router com fluxos de autenticação (mock) e tabs principais.

### Entregas
- [x] `app/_layout.tsx` — root layout com fonts + ThemeProvider + StatusBar dark
- [x] `app/(auth)/_layout.tsx` — stack auth
  - [x] `app/(auth)/login.tsx`
  - [x] `app/(auth)/signup.tsx`
  - [x] `app/(auth)/forgot-password.tsx`
- [x] `app/(tabs)/_layout.tsx` — bottom tabs (Home / Mapa / Carteira / Perfil)
  - [x] `app/(tabs)/index.tsx` (Home placeholder)
  - [x] `app/(tabs)/map.tsx` (placeholder)
  - [x] `app/(tabs)/wallet.tsx` (placeholder)
  - [x] `app/(tabs)/profile.tsx` (placeholder + logout)
- [x] `app/+not-found.tsx`
- [x] `src/stores/useAuthStore.ts` — token, user, login/logout (mock async)
- [x] Guarda de rota: redireciona não autenticado para `/login`
- [x] `expo-secure-store` para persistir token mock (`src/services/secureStorage.ts`)
- [x] Animações de transição entre stacks (fade no root stack, slide no auth stack)

**Status:** ✅ Concluído — commit `5b50674` na branch `feat/m2-navigation-auth`
**Commit final:** `feat(navigation): expo router com auth stack e tabs base`

---

## M3 — Onboarding & Perfilamento

**Branch:** `feat/m3-onboarding`
**Objetivo:** Fluxo multi-step de onboarding capturando perfil de uso para alimentar o motor de IA (mock).

### Entregas
- [x] `app/(auth)/onboarding/_layout.tsx` — stack do wizard
- [x] Passo 1: Boas-vindas + branding
- [x] Passo 2: Modelo do veículo (seleção entre mocks: Ranger, Maverick, Territory, Mustang)
- [x] Passo 3: Estilo de uso (Urbano / Rural / Misto / Performance)
- [x] Passo 4: Quilometragem média mensal
- [x] Passo 5: Seleção de plano SaaS (Agro / Urban / Premium) com comparativo
- [x] Passo 6: Confirmação + animação de conclusão
- [x] Indicador de progresso (steps)
- [x] Validação por step com `zod` + `react-hook-form` (+ `trigger()` no mount para refletir defaultValues do draft)
- [x] `src/stores/useUserStore.ts` — perfil completo persistido em AsyncStorage
- [x] `src/services/mocks/profileApi.ts` — `submitProfile()` retorna risco mockado
- [x] Onboarding executa apenas no primeiro acesso (flag em AsyncStorage)
- [x] Botão Voltar (ghost) nos steps 2-6 já que `gestureEnabled: false`
- [x] Animações de mount via `react-native-reanimated` (substitui `moti` que quebrava o bundler web por incompatibilidade de `tslib`)

**Status:** ✅ Concluído — branch `feat/m3-onboarding`
**Commit final:** `feat(onboarding): implementa wizard de 6 steps e perfilamento do usuario`

> **Débito conhecido (resolver na M9):** o perfil hoje é por dispositivo. Quando a M9 introduzir o role do analista, migrar `useUserStore` para indexar perfil/flag por `userId`, junto com o role-gate.

---

## M4 — Home & Simulação de Telemetria IoT

**Branch:** `feat/m4-telemetry-home`
**Objetivo:** Tela principal com dados em tempo real simulados (OBD2) e sistema de alertas preditivos.

### Entregas
- [x] `src/features/telemetry/simulator.ts` — `EventEmitter` emitindo a cada 2s: hodômetro, pressão pneus (4), temperatura motor, nível combustível, bateria
- [x] `src/features/telemetry/useTelemetry.ts` — hook que assina o emitter
- [x] `src/stores/useVehicleStore.ts` — estado do veículo + leituras atuais
- [x] `src/services/mocks/alertsApi.ts` — gera alertas baseados em thresholds (ex: km > 9000 → "Revisão antecipada")
- [x] `src/stores/useAlertsStore.ts` — fila de alertas
- [x] Tela Home (`app/(tabs)/index.tsx`):
  - [x] Header com saudação + plano atual (badge)
  - [x] Card destaque: próxima manutenção prevista (IA mock)
  - [x] Carrossel de KPIs em GlassPanels: km, pneus, temp, bateria
  - [x] Lista de alertas ativos (com severidade)
  - [x] CTA "Agendar serviço" (navega para M6)
- [x] Animações reativas em mudança de leituras (`react-native-reanimated`; `moti` evitado pelo mesmo motivo do M3)
- [x] Pull-to-refresh resincroniza simulador

**Status:** ✅ Concluído — branch `feat/m4-telemetry-home`
**Commit final:** `feat(telemetry): home com simulação IoT em tempo real e alertas preditivos`

---

## M5 — Visualização 3D do Veículo

**Branch:** `feat/m5-vehicle-3d`
**Objetivo:** Cena 3D interativa do veículo com hotspots de alerta sincronizados com a telemetria.

### Entregas
- [x] `app/vehicle/[id].tsx` — rota detalhe do veículo
- [x] `src/features/vehicle3d/Scene.tsx` — `<Canvas>` com `@react-three/fiber/native`
- [x] Modelo placeholder em `src/features/vehicle3d/CarMesh.tsx` montado com primitivas (boxes + cilindros) — sem `.glb` para manter o repo leve nesta etapa
- [x] Iluminação: ambient + directional + rim light azul Ford (`#1F6FEB`) + point light auxiliar
- [x] Câmera orbital com gestos via `react-native-gesture-handler` (Pan para girar, Pinch para zoom)
- [x] `src/features/vehicle3d/Hotspot.tsx` — esfera pulsante 3D nos 4 pneus, motor e bateria
- [x] Hotspots derivados da telemetria (`useVehicleStore`) com cor warn/critical sincronizada à mesma fonte do `useAlertsStore`
- [x] Toque em hotspot via raycast manual → `AlertSheet` (Modal RN + Reanimated `SlideInDown` + `GlassPanel`)
- [x] Botões: "Frontal", "Lateral", "Superior" com lerp animado entre presets
- [x] Loading skeleton enquanto cena monta
- [x] Otimização: `frameloop="demand"` no estado ocioso; `"always"` apenas durante gestos, animação de preset, ou enquanto algum hotspot estiver pulsando
- [x] CTA "Ver em 3D" no header da seção de telemetria da Home

**Status:** ✅ Concluído — branch `feat/m5-vehicle-3d`
**Commit final:** `feat(vehicle3d): cena 3D interativa com hotspots de alerta`

**Revisão pós-implementação (correções aplicadas):**
- `frameloop` agora destrava corretamente após gestos cancelarem uma animação de preset (zera `targetOrbitRef` + `setAnimating(false)` no `onStart` do Pan/Pinch)
- Gestos usam `.onFinalize()` em vez de `.onEnd()` para garantir reset de `interacting` mesmo em cancelamentos
- Pan e Pinch passaram a usar refs separadas (`panStartRef` / `pinchStartRef`) — eliminado o salto visual em gestos simultâneos
- Materiais customizados em `CarMesh.tsx` agora chamam `.dispose()` no unmount — sem leak de GPU ao voltar para a Home
- `AlertSheet` mantém o Modal montado por 280ms após o fechamento para que `SlideOutDown` + `FadeOut` toquem por completo (antes o Modal cortava a árvore antes da animação de saída)
- Polimento visual: corpo do veículo unificado na paleta Ford blue do capô, iluminação com `hemisphereLight` + fill light suave para legibilidade

---

## M6 — Mapa de Concessionárias & Agendamento

**Branch:** `feat/m6-map-scheduling`
**Objetivo:** Mapa com concessionárias Ford próximas e fluxo completo de agendamento incluindo "leva e traz".

### Entregas
- [x] `app/(tabs)/map.tsx` — `<MapView>` com `react-native-maps` (dark map style embarcado em `src/features/scheduling/mapStyle.ts`)
- [x] `src/services/mocks/dealersApi.ts` — 10 concessionárias mock (nome, endereço, lat/long, promoções, serviços, rating) com `fetchDealers()` ordenando por distância (haversine em `src/utils/distance.ts`) + `fetchAddressSuggestions()` para geocoding mockado
- [x] Pins customizados Ford com badge de promoção sensível ao plano (`src/features/scheduling/DealerPin.tsx`, memoizado)
- [x] Bottom sheet glass ao tocar pin: nome, endereço, distância, rating, promoções ativas, lista de serviços, CTA "Agendar" (`src/features/scheduling/DealerSheet.tsx` — Modal RN + Reanimated `SlideInDown/Out` no padrão do `AlertSheet` do M5)
- [x] `app/scheduling/_layout.tsx` — stack do fluxo de agendamento (`gestureEnabled: false`, animação `slide_from_right`)
  - [x] Passo 1: Seleção do serviço — revisão / troca de óleo / pneus / diagnóstico / outros
  - [x] Passo 2: Modalidade — presencial / **leva e traz** (badge "Premium" quando o plano permite VIP)
  - [x] Passo 3: Endereço de retirada com sugestões mockadas + debounce 300ms (apenas para modalidade "leva e traz" — pulado automaticamente quando "presencial")
  - [x] Passo 4: Data (FlatList horizontal de 10 dias) + slots disponíveis (`fetchAvailableSlots()` determinístico por dealer+data)
  - [x] Passo 5: Confirmação com resumo em Card + checkbox de termos + animação de sucesso (Reanimated `withSequence` no check)
- [x] `src/stores/useSchedulingStore.ts` — draft volátil + bookings persistidos em AsyncStorage; `startDraft(dealerId)` reseta cross-flow
- [x] `src/services/mocks/schedulingApi.ts` — `createBooking()` (delay 500–800ms, protocolo `FRD-XXXXXX`) + `fetchAvailableSlots()` (delay 250ms)
- [x] Histórico de agendamentos em Perfil (`src/features/scheduling/BookingListItem.tsx`) com cancelamento (Alert nativo + status "Cancelado")
- [x] Filtros no mapa em `MapFiltersBar`: "Todas", "Com promoção", "Até 10km", "Revisão", "Pneus", "Óleo"
- [x] Conexão com Home (M4) e detalhe 3D (M5) — CTA "Agendar serviço" agora navega para `/(tabs)/map`
- [x] `mapPadding` dinâmico via `useBottomTabBarHeight()` + `useSafeAreaInsets()` para que copyright nativo do mapa fique acima da tab bar e centro geográfico respeite header

**Status:** ✅ Concluído — commit `e8f6b4e` na branch `feat/m6-map-scheduling`
**Commit final:** `feat(scheduling): mapa de concessionárias e fluxo leva-e-traz (+ audit fixes)`

**Auditoria pós-implementação (Staff Review — 7 patches aplicados antes do commit):**
- 🔴 **C1**: race + leak no debounce de `address.tsx` — `cancelled` movido para a closure do `useEffect` para que o cleanup realmente dispare em re-execução/unmount
- 🟡 **W1**: `tracksViewChanges` virou one-shot via efeito timer (200ms) em `selectedId` — para de regenerar bitmap nativo continuamente enquanto pin está selecionado
- 🟡 **W2**: `DealerPin` envolto em `React.memo` (props primitivas)
- 🟡 **W3**: `setSubmitting(false)` movido do `finally` para o `catch` em `confirm.tsx` — evita warning de update em componente desmontado após `router.replace` no caminho feliz
- 🟡 **W4**: `mapPadding` memoizado com `useMemo([insets.top, tabBarHeight])` — estabiliza prop nativa do `MapView`
- 🟡 **W5**: `useSchedulingStore.hydrated` incluído no gate de boot do `app/_layout.tsx` — sem flash de empty state no Perfil
- 🟡 **W6**: `e.stopPropagation?.()` no `Marker.onPress` removido (era no-op)

---

## M7 — Carteira de Cashback

**Branch:** `feat/m7-cashback-wallet`
**Objetivo:** Módulo de fidelidade com saldo, extrato, cupons geolocalizados em combustível e manutenção.

### Entregas
- [x] `app/(tabs)/wallet.tsx` — Tela principal da carteira
- [x] Card de saldo com glassmorphism + animação numérica de contagem
- [x] Aba "Extrato" — lista de transações (entrada/saída) com filtro por tipo
- [x] Aba "Cupons" — grid de cupons disponíveis
- [x] `src/features/cashback/CouponCard.tsx` — visual ticket-style com perfuração
- [x] Cupons geolocalizados: badge "Próximo a você" usando mock distance
- [x] `app/wallet/coupon/[id].tsx` — detalhe do cupom + QR code mock
- [x] `src/services/mocks/walletApi.ts` — saldo, extrato, cupons
- [x] `src/stores/useWalletStore.ts`
- [x] CTA "Resgatar em combustível" → modal de seleção de posto (mock)
- [x] Animação celebrativa ao receber novo cashback

**Status:** ✅ Concluído — branch `feat/m7-cashback-wallet`
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
