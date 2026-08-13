# Especificação para Migração — API + App Flutter

Este documento consolida tudo o que existe hoje no Chama Time (monolito Next.js) para servir de base à criação de **dois novos repositórios**: uma **API** dedicada e um **app mobile em Flutter**. Ele é a fonte única de verdade sobre modelo de dados, regras de negócio, permissões, fluxos, design system e superfície de API atual (rotas HTTP + Server Actions que precisam virar endpoints).

> Este arquivo complementa (não substitui) os documentos `01` a `08` em `docs/`. Onde houver diferença, este documento reflete o estado **real do código** (schema Prisma e módulos implementados) em vez do estado aspiracional.

---

## 1. Visão do produto

Plataforma de futebol amador para organizar, acompanhar e evoluir a experiência de jogadores, peladas e times. Deve parecer um app esportivo profissional (referências: **Sofascore, FotMob, OneFootball, Flashscore**) — nunca um ERP/CRM/dashboard SaaS.

Modelo central: um usuário tem **uma única conta** e pode participar de **múltiplas organizações**. Existem dois tipos de organização:

- **PELADA** — encontros recorrentes/pontuais, sem resultado oficial.
- **TEAM** — time estruturado, joga partidas com adversário e resultado oficial.

Permissões pertencem sempre ao `Membership` (vínculo User↔Organization), nunca ao `User` diretamente. Toda ação sensível deve validar: usuário autenticado → organização ativa → membership do usuário nela → role do membership.

---

## 2. Stack

**Atual (monolito):** Next.js 15 (App Router) + React 19 + TypeScript, Server Actions e Route Handlers como "backend", Prisma ORM 7 + PostgreSQL, JWT (jose) + cookie HttpOnly, bcryptjs, Google OAuth (`google-auth-library`), Cloudinary (upload de imagens), IBGE API (estado/cidade) e Google Places API (autocomplete de endereço). Gerenciador de pacotes: **pnpm**.

**Alvo (nova arquitetura):**
- **API**: extrair as regras de `src/modules/*/actions` e `repositories` para um serviço HTTP próprio. O schema Prisma (seção 3) pode ser reaproveitado quase 1:1 como ponto de partida do banco. O doc de arquitetura já previa uma futura migração de backend para **Go + PostgreSQL + Redis + mensageria** — isso é uma direção, não uma obrigação; qualquer stack (Node/Nest, Go, etc.) pode implementar os mesmos contratos.
- **App**: Flutter, consumindo a API via REST (ou GraphQL, a definir) em vez de Server Actions.

Coisas que precisam de equivalente explícito na nova API porque hoje "escondidas" no Next.js:
- Sessão via **cookie HttpOnly** → no mobile deve virar **Bearer token** (JWT) armazenado em secure storage, com refresh se necessário (hoje não há refresh token, apenas expiração fixa de 7 dias — ver seção 9).
- "Organização ativa" hoje é um **cookie** (`active_org`) lido no servidor a cada Server Action → na API precisa virar um parâmetro explícito (header `X-Organization-Id` ou path param) em cada request, já que não há mais sessão de servidor Next.js guardando isso.
- Upload de imagem hoje roda dentro do Server Action (Cloudinary) → vira endpoint dedicado de upload (`POST /uploads/image` já existe como Route Handler, ver seção 8.3).

---

## 3. Modelo de dados (schema Prisma completo)

Fonte: `prisma/schema.prisma`. Todos os IDs são `cuid()`. Datas em UTC (`DateTime`). Timestamps `createdAt`/`updatedAt` padrão em quase todos os modelos (omitidos abaixo quando óbvios).

### 3.1 Enums

| Enum | Valores |
|---|---|
| `OrganizationType` | `PELADA`, `TEAM` |
| `MembershipRole` | `OWNER`, `ADMIN`, `CAPTAIN`, `PLAYER` |
| `MembershipStatus` | `ACTIVE`, `INVITED`, `SUSPENDED`, `LEFT` |
| `AttendanceStatus` | `PENDING`, `CONFIRMED`, `DECLINED`, `WAITLISTED` |
| `MatchStatus` | `SCHEDULED`, `IN_PROGRESS`, `FINISHED`, `CANCELLED` |
| `MatchResult` | `WIN`, `DRAW`, `LOSS` |
| `InviteStatus` | `PENDING`, `ACCEPTED`, `DECLINED`, `CANCELLED`, `EXPIRED` |
| `FinancialTransactionType` | `INCOME`, `EXPENSE` |
| `FinancialTransactionStatus` | `PENDING`, `PAID`, `CANCELLED` |
| `SportModality` | `FIELD_11`, `SOCIETY_7`, `SOCIETY_8`, `FUTSAL_5` |
| `PreferredFoot` | `LEFT`, `RIGHT`, `BOTH` |
| `GameListingStatus` | `OPEN`, `MATCHED`, `EXPIRED`, `CANCELLED` |
| `GameListingResponseStatus` | `PENDING`, `ACCEPTED`, `DECLINED` |
| `GameListingFrequency` | `DAILY`, `WEEKLY`, `BIWEEKLY` (fixo 15 dias, não "semana sim, semana não"), `MONTHLY` |

### 3.2 Identidade e perfil

**`User`** — conta única do sistema.
- `id`, `email` (unique), `emailVerified?`
- `passwordHash?` (null se só login Google), `googleId?` (unique)
- Relações: `profile` (1:1), `memberships[]`, e dezenas de relações reversas de conteúdo criado/participado (attendances, stats, votos, ratings, etc. — ver schema completo para a lista, cada uma explicada nas seções de domínio abaixo).

**`PasswordResetToken`** — `token` (unique), `userId`, `expiresAt`, `usedAt?`. Usado no fluxo "esqueci minha senha".

**`Profile`** — dados de perfil, 1:1 com `User`.
- `fullName`, `nickname?`, `imageUrl?`, `phone?`, `birthDate?`
- `address?`, `city?`, `state?`, `lat?`, `lng?` (Decimal 10,7)
- `preferredFoot?` (enum), `shirtNumber?`, `bio?`
- `onboardingStep` (default 0), `onboardingCompletedAt?` — controla o wizard de onboarding (9 passos, seção 6.1)
- `modalityPositions[]` → `ProfileModality`

**`ProfileModality`** — posições do jogador por modalidade esportiva.
- `modality` (enum `SportModality`), `positions: String[]`
- `@@unique([profileId, modality])` — uma linha por modalidade que o jogador pratica.

### 3.3 Organização e membership

**`Organization`**
- `type` (`PELADA`|`TEAM`), `name`, `slug` (unique), `description?`, `logoUrl?`
- `address?`, `city?`, `state?`, `lat?`, `lng?`
- `isActive` (default true)
- `modality?` (enum `SportModality`)
- `weekday?` (Int), `scheduledTime?` (String) — horário fixo recorrente (para Pelada)
- `monthlyFee?`, `singleFee?` (Decimal 10,2) — mensalidade e valor avulso
- `createdById?` → `User` (SetNull ao apagar usuário)

**`Membership`** — vínculo User↔Organization, onde vivem as permissões.
- `role` (default `PLAYER`), `status` (default `ACTIVE`)
- `nickname?`, `shirtNumber?`, `position?` (apelido/camisa/posição específicos daquela organização — pode divergir do perfil global)
- `isMonthly` (default false) — jogador mensalista (usado no financeiro/gestão de pelada)
- `hasMergedGuest` (default false) — trava para impedir que um membership receba stats de mais de um `GuestPlayer` mesclado (ver 3.7)
- `joinedAt`, `leftAt?`
- `@@unique([userId, organizationId])` — um usuário só tem um membership por organização.

**`GuestPlayer`** — jogador "convidado" sem conta no sistema, usado para registrar presença/estatísticas de quem jogou mas não é usuário cadastrado.
- `name`, `organizationId`, `createdById?`
- Pode acumular `peladaStats` e `matchStats`.
- Pode ser **mesclado** (`mergeIntoUser`) para um `Membership` real quando a pessoa criar conta — ver ação `merge-guest-player` (seção 6.5).

### 3.4 Pelada

**`PeladaOccurrence`** — uma "rodada" de pelada.
- `title`, `scheduledAt`, `location`, `lat?`, `lng?`, `notes?`, `isCancelled` (default false)
- Janela de votação de MVP: `votingOpenedAt?`, `votingClosesAt?`, `votingClosedAt?`
- `organizationId`, `createdById?`, `mvpUserId?` (resultado final da votação)
- Relações: `attendances[]`, `playerStats[]`, `mvpVotes[]`, `ratings[]`

**`PeladaAttendance`** — presença confirmada por usuário.
- `status` (`AttendanceStatus`, default `PENDING`), `note?`
- `@@unique([peladaOccurrenceId, userId])`

**`PeladaPlayerStat`** — estatística final da rodada (não há placar por confronto interno, apenas totais).
- `goals` (default 0), `assists` (default 0), `isMvp` (default false)
- Pertence a `userId?` **ou** `guestPlayerId?` (um dos dois, nunca ambos) — `@@unique` separado para cada.

**`PeladaMvpVote`** — voto individual de MVP (um jogador vota em outro).
- `voterUserId`, `votedUserId`, `@@unique([peladaOccurrenceId, voterUserId])` — um voto por jogador por rodada.

**`PeladaPlayerRating`** — nota (rating) que um jogador dá a outro na rodada.
- `rating: Int`, `@@unique([peladaOccurrenceId, raterUserId, ratedUserId])`

### 3.5 Team / Match

**`Match`** — um jogo de Team (equivalente a "PeladaOccurrence" mas com resultado oficial).
- `title?`, `opponentName?` (texto livre, quando o adversário não é uma organização cadastrada), `scheduledAt`, `location`, `lat?`, `lng?`
- `status` (`MatchStatus`, default `SCHEDULED`), `homeScore?`, `awayScore?`, `result?` (`MatchResult`), `notes?`
- Janela de votação de MVP: `votingOpenedAt?`, `votingClosesAt?`, `votingClosedAt?`
- `homeOrganizationId`, `awayOrganizationId?` (null se adversário for texto livre), `createdById?`, `mvpUserId?`
- Relações: `attendances[]`, `lineup[]`, `playerStats[]`, `mvpVotes[]`, `ratings[]`, `gameListing?` (se este Match nasceu de um anúncio do Mural de Jogos)

**`MatchMvpVote`** / **`MatchPlayerRating`** — mesma estrutura da Pelada, mas por `matchId`.

**`MatchAttendance`** — presença confirmada, com `organizationId` explícito (porque um Match tem duas organizações possíveis confirmando gente).
- `@@unique([matchId, userId])`

**`MatchLineupEntry`** — escalação.
- `position?`, `isStarter` (default false), `@@unique([matchId, userId])`

**`MatchPlayerStat`** — estatística por jogo (bem mais rica que a de Pelada).
- `goals`, `assists`, `yellowCards`, `redCards` (defaults 0), `rating?` (Decimal 3,1)
- Pertence a `userId?` **ou** `guestPlayerId?`.

### 3.6 Financeiro e Ranking

**`FinancialTransaction`**
- `type` (`INCOME`|`EXPENSE`), `status` (default `PENDING`), `amountCents: Int` (sempre em centavos, nunca float), `description`, `occurredAt`
- `organizationId`, `createdById?`

**`RankingSnapshot`**
- `scope: String` (identifica o tipo/período do ranking — não é enum, é livre), `payload: Json` (estrutura do ranking calculado), `startsAt?`, `endsAt?`
- Modelo de **snapshot materializado**: o ranking não é calculado em tempo real a partir de um JOIN pesado, é persistido como JSON por organização/escopo/data.

### 3.7 Convites e conexão entre organizações

**`OpponentInvite`** — convite **privado 1:1** entre duas organizações Team já conhecidas, para marcar um jogo.
- `status` (`InviteStatus`), `message?`, `scheduledAt?`, `location?`, `expiresAt?`
- `fromOrganizationId`, `toOrganizationId`, `sentById?`
- **Decisão de design importante:** este modelo existe no schema mas hoje **não tem camada de aplicação implementada** (nenhuma action/repository usa). É diferente do Mural de Jogos (broadcast público) — não confundir os dois conceitos ao desenhar a API nova.

**`PlayerInvite`** — convite (link/token) para um jogador entrar numa organização.
- `token` (unique), `status` (`InviteStatus`), `role` (default `PLAYER` — o criador escolhe com qual role a pessoa entra), `expiresAt` (7 dias a partir da criação — regra fixa em código, não configurável hoje)
- `organizationId`, `createdById`, `usedByUserId?`
- Apenas roles `OWNER`/`ADMIN`/`CAPTAIN` podem criar.

### 3.8 Mural de Jogos (Game Listings)

Feature de "buscar adversário" pública: uma organização Team anuncia um horário de campo já reservado, outras organizações Team demonstram interesse, a anunciante escolhe uma e isso fecha o anúncio criando um `Match`.

**`GameListingSeries`** — quando o anúncio é recorrente (repete por até 12 meses).
- `frequency` (`GameListingFrequency`), `startDate`, `endDate` (sempre `startDate + 12 meses`, calculado em `computeSeriesEndDate`), `isCancelled`
- **Importante:** não existe infraestrutura de cron/job no projeto. A recorrência é **materializada no momento da criação**: cada ocorrência já nasce como uma linha própria de `GameListing`, ligada por `seriesId`. `computeSeriesOccurrences` gera as datas (DAILY = +1 dia, WEEKLY = +7 dias, BIWEEKLY = +15 dias fixos, MONTHLY = recalculado sempre a partir da `startDate` original para evitar deriva de "clamp" em meses curtos, ex. 31/jan → 28/fev não deve virar 28/mar).

**`GameListing`** — um anúncio individual (ou uma ocorrência de uma série).
- `modality` (`SportModality`), `scheduledAt`, `location`, `city`, `state`, `lat?`, `lng?`
- `priceCents?`, `priceNotes?`, `notes?`
- `status` (default `OPEN`)
- `organizationId`, `createdById?`, `seriesId?`, `matchId?` (unique — setado quando o anúncio "casa" e vira um Match real)

**`GameListingPhoto`** — fotos do anúncio, upload via **Cloudinary** (não Vercel Blob), pasta `marca-jogo/organizations/{organizationId}`.
- `url`, `order` (default 0)

**`GameListingResponse`** — manifestação de interesse de outra organização.
- `status` (default `PENDING`), `message?`
- `organizationId`, `respondedById?`
- `@@unique([gameListingId, organizationId])` — uma organização só demonstra interesse uma vez por anúncio.
- Regras de negócio (de `express-interest.ts`/`accept-response.ts`): só pode expressar interesse em listing `OPEN`; não pode manifestar interesse no próprio anúncio; só a organização dona do listing pode aceitar uma resposta.

---

## 4. Regras de negócio por domínio

### 4.1 Autenticação
- Duas formas de entrada: **email+senha** (bcrypt) ou **Google OAuth**.
- Sessão = JWT assinado (HS256, `jose`), payload `{ sub: userId, email }`, **expiração fixa de 7 dias**, sem refresh token.
- Hoje entregue via **cookie HttpOnly**; no app mobile deve virar **Authorization: Bearer `<jwt>`** guardado em secure storage (Keychain/Keystore).
- Fluxo Google: o cliente manda `{ code, redirectUri }` (Authorization Code flow), a API troca por tokens via `google-auth-library`, valida o `id_token`, extrai `sub/email/name` e faz login-or-create.
- Reset de senha: token de uso único (`PasswordResetToken`), com `expiresAt` e `usedAt` (invalidação após uso). O fluxo está documentado em `docs/06` mas os endpoints `/forgot-password` e `/reset-password` **não existem hoje como Route Handler** — só register/login/logout/google estão implementados (ver seção 8.1). Isso é lacuna a fechar na nova API, não algo já pronto para copiar.

### 4.2 Organização ativa
- Usuário pode pertencer a N organizações; o sistema mantém o conceito de **"organização ativa"** (contexto atual de navegação). Hoje isso é um cookie de servidor (`active_org`); a nova API precisa de um equivalente explícito por request (ver seção 2).
- Toda ação que mexe em dados de organização primeiro resolve: sessão válida → organização ativa → membership do usuário nessa organização → checagem de role.

### 4.3 Pelada
- Uma ocorrência de pelada **não tem** resultado oficial, classificação, tabela ou vencedor — apenas presença, estatísticas finais (gols/assistências) e MVP.
- Confrontos internos (times formados dentro da pelada) não são persistidos — só os totais da rodada.
- **Votação de MVP**: só `OWNER`/`ADMIN` podem abrir/fechar a votação de uma rodada. Ao abrir, `votingOpenedAt = now`, `votingClosesAt = now + 48h` (janela fixa, `computeVotingClosesAt`). Está "aberta" (`isVotingOpen`) enquanto `now < votingClosesAt` e não tiver sido fechada manualmente antes disso.

### 4.4 Team / Match
- Um Match pertence a uma organização "mandante" (`homeOrganizationId`) e opcionalmente a uma organização "visitante" cadastrada (`awayOrganizationId`) — ou um nome livre de adversário (`opponentName`) quando o rival não usa o sistema.
- Tem resultado oficial (`homeScore`/`awayScore`/`result`), escalação e estatísticas por jogador (incluindo cartões e rating, que a Pelada não tem).
- **Votação de MVP**: mesma mecânica de 48h da Pelada, mas quem pode abrir/fechar é `OWNER`/`ADMIN`/`CAPTAIN` de qualquer uma das duas organizações envolvidas no jogo (mandante ou visitante).

### 4.5 Guest Player (jogador convidado)
- Permite registrar presença/estatísticas de gente que jogou mas não tem conta.
- Um `GuestPlayer` pode ser **mesclado** para um `Membership` real (`mergeIntoUser`), transferindo o histórico. Só `OWNER`/`ADMIN`/`CAPTAIN` podem mesclar. Regra de trava: um `Membership` só pode receber **um** merge de guest na vida inteira (`hasMergedGuest`), para não duplicar/misturar históricos de pessoas diferentes.

### 4.6 Financeiro
- `amountCents` sempre inteiro (nunca float) para evitar erro de arredondamento.
- Ligado à organização, não ao usuário. `isMonthly` no `Membership` marca jogadores mensalistas (usado para cobrança recorrente, ainda sem automação implementada).

### 4.7 Ranking
- Modelo de **snapshot**: calculado e persistido como JSON (`RankingSnapshot.payload`), não computado on-the-fly a cada leitura. Rankings de Pelada consideram presença/gols/assistências/MVP; rankings de Team consideram resultados e desempenho.

### 4.8 Mural de Jogos (busca de adversário)
- Só organizações `TEAM` podem publicar (`createGameListingAction` valida `organization.type !== "TEAM"`).
- Upload de fotos é feito antes da criação do registro (Cloudinary), URLs resultantes salvas em `GameListingPhoto`.
- Recorrência: se marcado como recorrente, cria uma `GameListingSeries` + N `GameListing` (uma linha por ocorrência calculada, até 12 meses à frente) em vez de uma única linha reavaliada depois.
- Outra organização demonstra interesse (`GameListingResponse`) — só se o listing estiver `OPEN`, não pode ser a própria organização dona, e só uma manifestação por organização por listing.
- A organização dona aceita uma resposta → fecha o listing e gera um `Match` real (`gameListingRepository.acceptResponse`, chamado só por membro da organização dona).
- `OpponentInvite` (convite privado 1:1) foi **deliberadamente deixado fora** deste fluxo — é um conceito diferente (privado vs. broadcast público) e ainda não tem implementação.

### 4.9 Convite de jogador (PlayerInvite)
- Só `OWNER`/`ADMIN`/`CAPTAIN` podem gerar. Token expira em 7 dias fixos. Ao ser aceito, cria/atualiza o `Membership` do usuário convidado com a `role` definida na criação do convite.

### 4.10 Onboarding
Wizard de 9 passos controlado por `Profile.onboardingStep` (0 a 9) + `onboardingCompletedAt`:
1. Nome (fullName, nickname)
2. Localização (city, state)
3. Data de nascimento
4. Modalidades praticadas (`SportModality[]`)
5. Posições por modalidade (`Record<modality, string[]>`, salva em `ProfileModality`)
6. Pé preferido
7. Número da camisa
8. Bio
9. Telefone

---

## 5. Permissões (roles do Membership)

Roles, do maior para o menor poder: **OWNER > ADMIN > CAPTAIN > PLAYER**. Sempre avaliadas dentro do contexto da organização atual — nunca existe permissão global baseada só no `User`.

| Ação | Owner | Admin | Captain | Player |
|---|:---:|:---:|:---:|:---:|
| Gerenciar dados/membros da organização | ✅ | ✅ | ❌ | ❌ |
| Excluir organização | ✅ | ❌ | ❌ | ❌ |
| Gerenciar financeiro | ✅ | ✅ | ❌ | ❌ |
| Criar/editar/excluir eventos (rodada/jogo) | ✅ | ✅ | ✅ (criar jogos/peladas, escalação, resultado) | ❌ |
| Convocar / criar convite de jogador | ✅ | ✅ | ✅ | ❌ |
| Abrir/fechar votação MVP (Pelada) | ✅ | ✅ | ❌ | ❌ |
| Abrir/fechar votação MVP (Match) | ✅ | ✅ | ✅ | ❌ |
| Mesclar guest player | ✅ | ✅ | ✅ | ❌ |
| Marcar jogador como mensalista | ✅ | ✅ | ✅ | ❌ |
| Confirmar presença, votar MVP, ver rankings/stats | ✅ | ✅ | ✅ | ✅ |

---

## 6. Fluxos principais

### 6.1 Primeiro acesso
`Login → Selecionar organização → Onboarding (se perfil incompleto) → Entrar no contexto da organização`. Toda navegação depois respeita a organização ativa.

### 6.2 Fluxo de Pelada
`Selecionar Pelada → Ver próxima ocorrência → Confirmar presença → Participar → Registrar estatísticas finais → Abrir/votar MVP → Fechar votação → Ranking atualizado`

### 6.3 Fluxo de Team
`Selecionar Team → Ver próximo jogo → Confirmar presença → Escalação → Registrar resultado → Registrar estatísticas → Abrir/votar/fechar MVP → Atualizar histórico`

### 6.4 Fluxo de busca de adversário (Mural de Jogos)
`Time publica anúncio (com ou sem recorrência) → Outros times demonstram interesse → Time dono aceita um interessado → Match é criado automaticamente → Anúncio fecha (MATCHED)`

### 6.5 Fluxo de troca de organização
`Abrir seletor → Escolher Pelada ou Team → Atualiza contexto/organização ativa → Home correspondente ao tipo`

### 6.6 Fluxo de convite de jogador
`Manager gera link (token, expira em 7 dias) → Compartilha → Convidado acessa e aceita → Membership criado com a role definida`

---

## 7. Design system

- **Referências:** Sofascore, FotMob, OneFootball, Flashscore. Nunca deve parecer ERP/CRM/dashboard SaaS/painel administrativo/template genérico de IA.
- **Tipografia:** Manrope.
- **Paleta:**
  - Primary `#16A34A` — ações principais, indicadores ativos, destaques positivos, navegação selecionada
  - Secondary `#111827` — áreas de placar, headers esportivos, contraste
  - Accent `#FACC15` — MVP, destaques especiais, badges
  - Background `#F8FAFC` — fundo geral
  - Success `#22C55E` — presença confirmada, vitória
  - Danger `#EF4444` — derrota, erro, status crítico
  - Warning `#F59E0B` — pendente, empate, alerta
- **Diretrizes:** mobile first, hierarquia tipográfica forte, números grandes, estatísticas em destaque, listas densas, divisores claros. Evitar excesso de cards/sombras, bordas muito arredondadas, grandes áreas vazias, componentes genéricos "de biblioteca".
- **Layout:** inspirado em match center — placar em destaque, tabelas/rankings, abas horizontais, feed de eventos, alta densidade informacional.
- **Dark mode:** deve ser suportado desde o início (equivalente Flutter: `ThemeData`/`ColorScheme` claro e escuro desde o primeiro commit).

No Flutter, isso se traduz em: `ThemeData` customizado (nada de Material genérico "padrão"), fonte Manrope via `google_fonts` ou embutida, componentes próprios para placar/card de jogo/ranking em vez de widgets Material puros sem customização.

---

## 8. Superfície de API atual (o que precisa virar endpoints)

Hoje a "API" é uma mistura de **Route Handlers** (HTTP de verdade, chamados pelo client) e **Server Actions** (RPC interno do Next.js, invisível como HTTP). Para o app Flutter, **toda Server Action listada abaixo precisa virar um endpoint HTTP real** na nova API.

### 8.1 Route Handlers existentes (`src/app/api/`)
| Rota | Método | Descrição |
|---|---|---|
| `/api/auth/register` | POST | Cria usuário + profile |
| `/api/auth/login` | POST | Login email+senha, retorna sessão |
| `/api/auth/google` | POST | Recebe `{code, redirectUri}`, troca por tokens Google, login-or-create |
| `/api/auth/logout` | POST | Remove cookie/sessão |
| `/api/places/autocomplete` | GET/POST | Proxy para Google Places Autocomplete (endereço) |
| `/api/places/details` | GET/POST | Proxy para Google Places Details |
| `/api/uploads/image` | POST | Upload genérico de imagem (Cloudinary) |

> Faltam hoje (documentados como intenção em `docs/06` mas sem implementação): `POST /api/auth/forgot-password`, `POST /api/auth/reset-password`.

### 8.2 Server Actions por módulo (candidatas a virar endpoints REST)

**`auth`**: `registerUser`, `loginUser`, `loginWithGoogle`

**`organizations`**: `createOrganization`, `updateOrganization`, `setActiveOrg`, `updateMembershipMonthlyAction`

**`onboarding`**: `saveOnboardingStep`

**`pelada-occurrences`**: `createPeladaOccurrence`, `setPeladaParticipants`, `savePeladaPlayerStats`, `removePeladaPlayerStat`, `openPeladaVotingAction`, `closePeladaVotingAction`, `submitPeladaVote`

**`matches`**: `setMatchParticipants`, `saveMatchPlayerStats`, `removeMatchPlayerStat`, `updateMatchScore`, `openMatchVotingAction`, `closeMatchVotingAction`, `submitMatchVote`

**`guest-players`**: `createGuestPlayer`, `mergeGuestPlayerAction`

**`game-listings`**: `createGameListingAction`, `expressInterestAction`, `acceptResponseAction`, `cancelGameListingAction`, `cancelGameListingSeriesAction`

**`player-invites`**: `createPlayerInviteAction`, `acceptPlayerInviteAction`, `cancelPlayerInviteAction`

Cada action já encapsula sua própria regra de autorização (`requireAuth` + `requireOrgMembership` + checagem de role) — essa lógica deve ser portada para middlewares/guards da nova API, não redescoberta do zero.

### 8.3 Serviços externos usados
- **Cloudinary** — upload de imagem (`uploadImageToCloudinary(file, folder)`), pasta convencionada `marca-jogo/organizations/{organizationId}`. Precisa das envs `CLOUDINARY_CLOUD_NAME`, `CLOUDINARY_API_KEY`, `CLOUDINARY_API_SECRET`.
- **Google OAuth** (`GOOGLE_CLIENT_ID`, `GOOGLE_CLIENT_SECRET`) — login social.
- **Google Places API** — autocomplete/detalhes de endereço.
- **IBGE API** — lista de estados/cidades do Brasil (`src/constants/brazil-locations.ts`), usada no onboarding e cadastro de organização. É pública, não precisa de key.

---

## 9. Autenticação — detalhe técnico para a nova API

- JWT HS256, secret em `JWT_SECRET`, payload mínimo `{ sub: userId, email }`, expiração **7 dias fixos**, sem rotação/refresh hoje.
- Para mobile, recomenda-se manter o token JWT mas trocar o transporte de cookie HttpOnly para `Authorization: Bearer` — e **considerar adicionar refresh token** nessa migração, já que 7 dias fixos sem refresh é uma limitação aceitável num MVP web mas ruim numa experiência mobile persistente (usuário sendo deslogado no meio do uso).
- Senha: bcryptjs, hash armazenado em `User.passwordHash` (nulo se a conta só usa Google).
- `googleId` fica salvo em `User.googleId` (unique) após o primeiro login social, permitindo login subsequente sem repetir o fluxo de criação.

---

## 10. O que já pode ser reaproveitado 1:1 vs. o que precisa ser reprojetado

**Reaproveitar quase sem mudança:**
- `prisma/schema.prisma` inteiro — é o contrato de dados, independe de framework.
- Regras de negócio e validações (Zod schemas em `modules/*/schemas`) — só trocam de "Server Action" para "handler HTTP", a lógica interna não muda.
- Paleta, tipografia e diretrizes de design (seção 7).

**Precisa ser reprojetado para o novo modelo cliente-servidor:**
- Sessão: cookie → Bearer token (+ avaliar refresh token).
- Organização ativa: cookie de servidor → header/param explícito por request.
- Upload: hoje acoplado à Server Action (`createGameListingAction` faz upload E cria o registro na mesma chamada) → separar em dois passos (upload primeiro, depois criar registro com as URLs) é mais amigável a um cliente mobile.
- Endpoints de auth que só existem como intenção (`forgot-password`, `reset-password`) precisam ser implementados de fato na nova API.
- `OpponentInvite` está no schema mas sem nenhuma implementação — decidir se entra no escopo do app novo ou continua adiado.

---

## 11. Roadmap (para priorização das duas novas apps)

- **Fase 1 — Fundação:** Autenticação, Organizações, Peladas, Teams, Convocações (Membership/PlayerInvite).
- **Fase 2 — Camada esportiva:** Estatísticas, Ranking, MVP, Financeiro.
- **Fase 3 — Conexão entre times:** Busca de adversários (Mural de Jogos — já implementado no monolito), Convites privados (`OpponentInvite` — pendente), Desafios, Histórico entre times.
- **Fase 4 — Expansão:** Campeonatos, Marketplace, Patrocínios.

Critérios permanentes em todas as fases: mobile first, PWA/app nativo, design esportivo, regras de domínio respeitadas, permissões sempre por Membership, separação clara Pelada vs. Team, tipagem forte.
