# Minha Copa 2026

Aplicativo mobile para gerenciamento de álbum de figurinhas da Copa do Mundo 2026. Acompanhe sua coleção, veja estatísticas, jogos e estádios do torneio.

## Tech Stack

- **React Native** com **Expo** (SDK 54)
- **Expo Router** — navegação baseada em arquivos
- **NativeWind** (TailwindCSS) — estilização
- **Zustand** — gerenciamento de estado
- **TypeScript**

## Pré-requisitos

- [Node.js](https://nodejs.org/) (v18+)
- [Expo CLI](https://docs.expo.dev/get-started/installation/) — instalado globalmente ou via `npx`
- [Android Studio](https://developer.android.com/studio) — para builds locais de produção
- [Expo Go](https://expo.dev/go) — app no celular para testar (iOS / Android)

## Instalação

```bash
git clone [https://github.com/robotics-br/rbr-album-copa2026-app.git](https://github.com/robotics-br/rbr-album-copa2026-app.git)
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

### Outros comandos de execução

| Comando           | Descrição                  |
| ----------------- | -------------------------- |
| `npm run android` | Inicia no emulador Android |
| `npm run ios`     | Inicia no simulador iOS    |
| `npm run web`     | Inicia no navegador        |

---

## 🚀 Guia de Deploy Android (Build Local no Windows)

Como a cota de builds na nuvem do EAS é limitada, siga este processo para gerar o arquivo de produção (`.aab`) para a Play Store usando sua própria máquina.

### 1. Preparação no `app.json`

Antes de gerar o build, verifique no arquivo `app.json`:

- Se o campo `"versionCode"` dentro de `"android"` foi incrementado (ex: de 1 para 2). **Toda atualização precisa de um número maior.**
- Se o pacote está correto (`br.com.robotics.albumcopa2026`).

### 2. Gerar pasta nativa

No terminal do projeto, rode o comando para recriar a pasta `android` com as configurações atualizadas:

```bash
npx expo prebuild --clean
```

### 3. Build no Android Studio

1. Abra o **Android Studio**.
2. Clique em **Open** e selecione apenas a pasta `android` que fica dentro do seu projeto.
3. Aguarde o Gradle sincronizar (barra de carregamento no canto inferior direito).
4. No menu superior, clique em **Build > Generate Signed Bundle / APK...**
5. Selecione **Android App Bundle** e clique em Next.
6. **Em Key store path (⚠️ ATENÇÃO MÁXIMA AQUI):**
   - **Se for a PRIMEIRA VEZ gerando o app:** Clique em **Create new...** para gerar sua chave de produção (`.jks`). Salve em um local seguro e anote as senhas. _(Se você perder este arquivo, nunca mais conseguirá atualizar o app na loja)._
   - **Se for uma ATUALIZAÇÃO (Versão 2, 3, etc):** NUNCA clique em "Create new". Clique em **Choose existing...**, selecione o arquivo `.jks` que você criou da primeira vez e insira as senhas.
7. Na última tela, selecione a variante **release** e clique em Finish.
8. O arquivo `.aab` pronto para a Play Store será gerado na pasta: `android/app/release/`.

### 4. Sincronizar Credenciais com Expo (Apenas na 1ª Vez)

Para garantir que o Expo saiba qual chave você usou localmente (caso você volte a usar a nuvem no futuro), rode no terminal:

```bash
eas credentials
```

Selecione **Android > production** e faça o upload do arquivo `.jks` que você acabou de criar.

---

### Outros comandos de Build

| Comando                               | Descrição                                                     |
| :------------------------------------ | :------------------------------------------------------------ |
| `npm run build:android:prod:local`    | Tenta gerar build local via EAS (Requer macOS/Linux)          |
| `npm run build:android:debug:apk`     | Gera APK manual via Gradle (para testes rápidos)              |
| `npm run build:android:preview:cloud` | Gera build de teste (Preview) na nuvem EAS                    |
| `npm run build:all:prod:cloud`        | Gera build de produção para todas as plataformas na nuvem EAS |

---

## Estrutura do projeto

```text
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

## Créditos e Dados

- **API de Jogos:** Os dados de partidas e estatísticas são fornecidos gentilmente pela API aberta [OpenLigaDB](https://www.openligadb.de/).
