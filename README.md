# Ford Intelligence

App mobile multiplataforma (iOS/Android) de fidelização do pós-venda Ford — frontend em React Native + Expo, com IA preditiva de manutenção (mock), telemetria IoT simulada (OBD2), visualização 3D do veículo, agendamento "leva e traz" e carteira de cashback.

> Escopo do repositório: **Frontend Mobile only**. Backend, ML e n8n estão fora do escopo — interfaces são mockadas localmente.

## Stack

- **React Native + Expo** (managed workflow, SDK 54)
- **Expo Router** (file-based routing)
- **TypeScript** strict
- **Zustand** (estado global)
- **three.js** + `@react-three/fiber/native` + `expo-gl` (3D)
- `react-native-maps`, `react-native-reanimated`, `moti`, `expo-blur`
- `react-hook-form` + `zod`

## Pré-requisitos

- Node.js 20+ (testado em 24.x)
- npm 10+
- Expo Go (iOS/Android) ou simulador/emulador

## Setup

```bash
git clone https://github.com/danilowendler/Ford-Intelligence.git
cd Ford-Intelligence
npm install
cp .env.example .env.local   # opcional, ajuste as variáveis
```

## Execução

```bash
npm run start           # inicia Metro (escolha plataforma no terminal)
npm run android         # abre no emulador/dispositivo Android
npm run ios             # abre no simulador iOS (macOS)
npm run web             # abre versão web (debug rápido)
```

## Scripts

| Script | Descrição |
|---|---|
| `npm run start` | Inicia o Expo dev server |
| `npm run android` | Build dev + abre Android |
| `npm run ios` | Build dev + abre iOS (macOS) |
| `npm run web` | Versão web |
| `npm run lint` | ESLint |
| `npm run format` | Prettier write |
| `npm run typecheck` | TypeScript sem emit |

## Estrutura

```
app/         # rotas Expo Router (file-based)
src/
  components/    # UI compartilhada
  features/      # módulos por domínio
  stores/        # Zustand
  services/      # api/mocks
  hooks/
  theme/
  utils/
assets/      # fonts, imagens, modelos 3D
docs/        # PRD.md e PLAN.md
```

## Documentação

- Briefing técnico → [CLAUDE.md](./CLAUDE.md)
- Plano de execução por milestones → [docs/PLAN.md](./docs/PLAN.md)
- PRD do produto → [docs/PRD.md](./docs/PRD.md)
