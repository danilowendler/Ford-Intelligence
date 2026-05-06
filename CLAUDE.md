# Ford Intelligence — Briefing para Claude Code

## Project Overview

App mobile multiplataforma (iOS/Android) de fidelização do pós-venda Ford, com IA preditiva de manutenção, telemetria IoT simulada (OBD2), visualização 3D do veículo, agendamento "leva e traz" e carteira de cashback. Segmentado em três planos SaaS: **Agro**, **Urban** e **Premium**.

Fonte canônica de produto: [docs/PRD.md](docs/PRD.md).

---

## Agent Scope (CRITICAL — leia antes de qualquer ação)

Escopo de atuação **estritamente Frontend Mobile** (React Native / Expo) e simulação de consumo de APIs.

**NÃO faça:**
- ❌ Não crie infraestrutura de Backend (Node, Python, Supabase schemas, microsserviços, etc.)
- ❌ Não desenvolva algoritmos de Machine Learning (Python/Scikit-learn/Jupyter)
- ❌ Não configure fluxos no n8n
- ❌ Não escreva migrations de banco nem políticas RLS

**FAÇA:**
- ✅ Componentes visuais e telas (React Native)
- ✅ Gestão de estado global (Zustand)
- ✅ Consumo de endpoints RESTful **mockados** localmente
- ✅ Simulação assíncrona de telemetria IoT (intervalos / EventEmitter)
- ✅ Renderização 3D, mapas, animações e UX

Quando uma feature exigir backend/ML/n8n, **mocke a interface** e siga em frente.

---

## Tech Stack

| Camada | Ferramenta |
|---|---|
| Framework | **React Native + Expo** (managed workflow) |
| Roteamento | **Expo Router** (file-based) |
| Linguagem | **TypeScript** (strict) |
| Estado global | **Zustand** |
| 3D | **three.js** + `expo-gl` + `@react-three/fiber/native` |
| Mapas | `react-native-maps` |
| Animação | `react-native-reanimated`, `moti` |
| Glassmorphism | `expo-blur` |
| Ícones | `@expo/vector-icons` (Lucide / Ionicons) |
| Forms | `react-hook-form` + `zod` |
| HTTP mock | `fetch` + módulos em `src/services/mocks/` |
| Storage local | `expo-secure-store` (tokens), `AsyncStorage` (preferências) |

---

## Folder Structure

```
Mobile-Ford/
├── app/                         # Rotas Expo Router (file-based)
│   ├── (auth)/                  # login, signup, onboarding
│   ├── (tabs)/                  # home, mapa, carteira, perfil
│   ├── vehicle/[id].tsx         # detalhe + 3D
│   ├── scheduling/              # fluxo de agendamento
│   ├── _layout.tsx              # root layout (theme provider, fonts)
│   └── +not-found.tsx
├── src/
│   ├── components/              # UI compartilhada (Button, Card, GlassPanel...)
│   ├── features/                # módulos por domínio
│   │   ├── onboarding/
│   │   ├── telemetry/           # hooks + simulador IoT
│   │   ├── vehicle3d/           # cena Three.js + alerts overlay
│   │   ├── scheduling/
│   │   ├── cashback/
│   │   └── analyst-dashboard/   # área backoffice (mock)
│   ├── stores/                  # Zustand stores (user, plan, vehicle, alerts...)
│   ├── services/
│   │   ├── api/                 # clientes HTTP (mockáveis)
│   │   └── mocks/               # respostas simuladas + telemetria IoT
│   ├── hooks/
│   ├── theme/                   # tokens, paletas por plano, tipografia
│   └── utils/
├── assets/                      # fonts, images, 3D models (.glb)
├── docs/
│   └── PRD.md
├── CLAUDE.md
├── app.json                     # config Expo
├── tsconfig.json
└── package.json
```

---

## Visual Identity

### Fundamentos
- **Dark mode first** (sem light mode na v1)
- **Touch-first**, áreas mínimas de toque ≥ 44pt
- **Glassmorphism** em: cards de alerta, carteira de cashback, overlays do mapa, modais

### Paleta base (Ford)
- `--ford-blue`: `#003478` (azul institucional)
- `--ford-blue-light`: `#1F6FEB`
- `--bg-base`: `#0A0E14` (quase preto)
- `--bg-elevated`: `#13171F`
- `--surface-glass`: `rgba(255,255,255,0.06)` + `blur(20)`
- `--text-primary`: `#F5F7FA`
- `--text-muted`: `#8A93A6`
- `--alert-warn`: `#FFB020`
- `--alert-critical`: `#E5484D`
- `--success`: `#30A46C`

### Variantes por plano (sutil, harmônico)
| Plano | Acento | Tom | Ícones |
|---|---|---|---|
| **Agro** | `#D97706` (terra/laranja) | Robusto, rústico | Pesados, contornos grossos |
| **Urban** | `#6FA3FF` (azul claro) | Limpo, minimalista | Linhas finas, geométricos |
| **Premium** | `#D4AF37` (dourado) | Luxuoso, sofisticado | Refinados, detalhes finos |

A diferenciação acontece via **tokens de tema** trocados em runtime com base no plano do usuário (Zustand `usePlanStore`). Estrutura de tela e tipografia permanecem idênticas.

### Tipografia
- Primária: **Ford Antenna** (se disponível) — fallback **Inter**
- Pesos: 400, 500, 600, 700
- Carregamento via `expo-font` em `app/_layout.tsx`

---

## Conventions

- **TypeScript strict** — sem `any` implícito
- **Componentes funcionais + hooks** — sem class components
- **Zustand** para estado global; **`useState`/`useReducer`** para estado local
- Sem Redux, sem Context API para estado de aplicação
- **Mocks** centralizados em `src/services/mocks/` retornando `Promise<T>` com delay realista (200–800ms)
- **Telemetria IoT simulada** via `setInterval` ou `EventEmitter` em `src/features/telemetry/simulator.ts`
- Imports absolutos via alias `@/` apontando para `src/`
- Componentes exportados por **named export**; rotas Expo Router por `default export`
- Comentários **só** quando o "porquê" não é óbvio

---

## Personas

1. **Cliente Final (Proprietário Ford)** — usuário do app. Recebe alertas proativos, vê telemetria, agenda serviços. Interface adapta-se ao plano (Agro/Urban/Premium).
2. **Analista Ford / Concessionária** — backoffice. Visualiza dashboard de "Service Share" e leads qualificados pela IA. Acessível em `app/(analyst)/` com role-gate (mock RBAC).

---

## Milestones

| # | Entrega |
|---|---|
| **M1** | Setup Expo + Expo Router + tema + tipografia + navegação base (tabs + auth stack) |
| **M2** | Onboarding multi-step + perfilamento (modelo, uso) → `useUserStore` |
| **M3** | Home com mock de telemetria (hodômetro, pneus, temp) + sistema de alertas |
| **M4** | Visualização 3D do veículo (`@react-three/fiber/native`) com hotspots de alerta |
| **M5** | Mapa de concessionárias + fluxo de agendamento "leva e traz" |
| **M6** | Carteira de cashback (saldo, extrato, cupons geolocalizados) |
| **M7** | Diferenciação visual por plano SaaS (Agro/Urban/Premium) |
| **M8** | Dashboard interno do Analista Ford (mock) |

Cada milestone deve ser **incremento entregável** e testado em device/emulador antes do próximo.

---

## Reference

- PRD completo: [docs/PRD.md](docs/PRD.md)
- Sempre que houver conflito entre este briefing e o PRD, **o PRD prevalece**.
