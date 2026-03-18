# Minha Copa 2026

Aplicativo mobile para gerenciamento de álbum de figurinhas da Copa do Mundo 2026. Acompanhe sua coleção, veja estatísticas, jogos e estádios do torneio.

## Tech Stack

- **React Native** com **Expo** (SDK 54)
- **Expo Router** — navegação baseada em arquivos
- **NativeWind** (TailwindCSS) — estilização
- **Zustand** — gerenciamento de estado
- **TypeScript**
- **TypeScript**

## Pré-requisitos

- [Node.js](https://nodejs.org/) (v18+)
- [Expo CLI](https://docs.expo.dev/get-started/installation/) — instalado globalmente ou via `npx`
- [Expo Go](https://expo.dev/go) — app no celular para testar (iOS / Android)

## Instalação

```bash
git clone https://github.com/robotics-br/rbr-album-copa2026-app.git
cd rbr-album-copa2026-app
npm install
```

## Executando o projeto

```bash
npm start
```

Isso executa `expo start --tunnel -c`, que:

- **`--tunnel`** — cria um túnel público via ngrok, permitindo acessar o app de qualquer dispositivo (mesmo fora da rede local)
- **`-c` (`--clear`)** — limpa o cache do Metro bundler antes de iniciar

Após iniciar, escaneie o QR code exibido no terminal com o app **Expo Go**.

### Outros comandos

| Comando           | Descrição                  |
| ----------------- | -------------------------- |
| `npm run android` | Inicia no emulador Android |
| `npm run ios`     | Inicia no simulador iOS    |
| `npm run web`     | Inicia no navegador        |

### Build de Produção Local (Android/AAB)

Para gerar seu build de produção (Play Store) **localmente**, utilize o novo script:

```bash
npm run build:android:prod:local
```

### Outros comandos de Build

| Comando | Descrição |
| :--- | :--- |
| `npm run build:android:debug:apk` | Gera APK manual via Gradle (para testes rápidos) |
| `npm run build:android:preview:cloud` | Gera build de teste (Preview) na nuvem EAS |
| `npm run build:all:prod:cloud` | Gera build de produção para todas as plataformas na nuvem EAS |

## Estrutura do projeto

```
├── app/                   # Rotas (Expo Router)
│   ├── _layout.tsx        # Layout raiz
│   └── (tabs)/            # Navegação por abas
│       ├── index.tsx      # Álbum (tela principal)
│       ├── games.tsx      # Jogos
│       ├── stadiums.tsx   # Estádios
│       ├── stats.tsx      # Estatísticas
│       ├── general.tsx    # Geral
│       └── settings.tsx   # Configurações
├── src/
│   ├── components/        # Componentes reutilizáveis
│   ├── data/              # Dados estáticos (times, jogos, estádios)
│   ├── services/          # Serviços de API das partidas
│   ├── store/             # Stores Zustand
│   ├── theme/             # Temas e ThemeProvider
│   ├── types/             # Tipos TypeScript
│   └── utils/             # Utilitários (haptics, sons)
├── app.json               # Configuração do Expo
├── tailwind.config.js     # Configuração do TailwindCSS
├── metro.config.js        # Configuração do Metro (NativeWind)
├── babel.config.js        # Configuração do Babel
└── global.css             # CSS global (Tailwind directives)
```

## Path aliases

O projeto usa `@/*` como alias para `./src/*`. Exemplo:

```typescript
import { useCollectionStore } from '@/store/useCollectionStore';
```
