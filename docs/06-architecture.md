# Arquitetura

Este documento define a direção arquitetural oficial do projeto Chama Time.

---

# Visão Geral

O Chama Time é uma plataforma para organização de peladas, times, partidas, rankings e estatísticas de futebol amador.

A arquitetura deve priorizar:

- Velocidade de desenvolvimento
- Simplicidade
- Escalabilidade
- Organização por domínio
- Baixo acoplamento
- Facilidade de manutenção

---

# Frontend

Stack oficial:

- Next.js 15
- React 19
- TypeScript
- Tailwind CSS v4
- shadcn/ui
- Lucide React
- Motion
- Sonner

---

# Backend Atual

O backend roda dentro do próprio Next.js.

Stack:

- Route Handlers
- Server Actions
- Prisma ORM
- PostgreSQL
- JWT
- Cookies HttpOnly

---

# Backend Futuro

Stack prevista:

- Go
- PostgreSQL
- Redis
- Mensageria

A estrutura atual deve facilitar uma futura migração sem exigir reescrita das regras de negócio.

---

# Package Manager

Gerenciador oficial:

- pnpm

Não utilizar:

- npm
- yarn

Toda documentação e comandos devem utilizar pnpm.

---

# Princípios Arquiteturais

O projeto deve seguir:

- SOLID
- Separation of Concerns
- Dependency Injection quando necessário
- Strong Typing
- Low Coupling
- High Cohesion
- Feature Based Architecture

---

# Estratégia Arquitetural

O projeto NÃO utiliza Clean Architecture clássica com múltiplas camadas internas para cada funcionalidade.

Evitar estruturas excessivamente complexas como:

```text
Domain
Application
Infrastructure
Presentation
```

dentro de cada módulo.

Também evitar:

```text
DTO
Factory
UseCase
Controller
Mapper
```

quando não agregarem valor real.

O objetivo é manter a arquitetura simples, organizada e escalável.

---

# Organização Principal

```text
src/
├── app/
├── modules/
├── components/
├── lib/
├── hooks/
├── types/
├── styles/
└── generated/
```

---

# Organização Por Funcionalidade

Cada domínio possui seu próprio módulo.

Exemplo:

```text
modules/
├── auth/
├── organizations/
├── peladas/
├── matches/
├── rankings/
└── statistics/
```

---

# Estrutura De Um Módulo

Estrutura padrão:

```text
auth/
├── actions/
├── repositories/
├── schemas/
├── services/
└── types/
```

---

# Actions

Responsáveis pelas operações do sistema.

Exemplos:

```text
register-user.ts
login-user.ts
logout-user.ts
create-team.ts
create-pelada.ts
confirm-attendance.ts
```

As actions contêm a lógica da funcionalidade.

---

# Repositories

Responsáveis pelo acesso aos dados.

Toda comunicação com Prisma deve ocorrer através dos repositories.

Exemplo:

```ts
userRepository.findByEmail();
userRepository.findById();
userRepository.create();
```

Evitar chamadas Prisma espalhadas pelo sistema.

Correto:

```ts
await userRepository.findByEmail(email);
```

Evitar:

```ts
await prisma.user.findUnique(...)
```

em múltiplos lugares.

---

# Schemas

Responsáveis por validação.

Biblioteca oficial:

- Zod

Exemplos:

```text
register-user-schema.ts
login-user-schema.ts
create-team-schema.ts
```

Todo input externo deve ser validado.

---

# Services

Responsáveis por serviços compartilhados.

Exemplos:

```text
jwt-service.ts
password-hasher.ts
mail-service.ts
storage-service.ts
```

Services não devem conhecer interface de usuário.

---

# Types

Responsáveis por contratos internos.

Exemplos:

```text
auth-user.ts
create-team-input.ts
ranking-item.ts
```

---

# Prisma

ORM oficial:

- Prisma

Banco oficial:

- PostgreSQL

Prisma deve ser centralizado através dos repositories.

---

# Autenticação

Tecnologias oficiais:

- JWT
- Cookies HttpOnly
- bcryptjs
- jose
- Nodemailer

Não utilizar:

- LocalStorage para autenticação
- SessionStorage para autenticação

---

# Fluxo De Autenticação

## Registro

```http
POST /api/auth/register
```

Fluxo:

1. Validar dados
2. Verificar email existente
3. Gerar hash
4. Criar usuário
5. Criar perfil

---

## Login

```http
POST /api/auth/login
```

Fluxo:

1. Buscar usuário
2. Validar senha
3. Gerar JWT
4. Criar cookie HttpOnly

---

## Logout

```http
POST /api/auth/logout
```

Fluxo:

1. Remover cookie
2. Encerrar sessão

---

## Esqueci Minha Senha

```http
POST /api/auth/forgot-password
```

Fluxo:

1. Gerar token
2. Salvar token
3. Enviar email

---

## Resetar Senha

```http
POST /api/auth/reset-password
```

Fluxo:

1. Validar token
2. Atualizar senha
3. Invalidar token

---

# Design System

Toda interface deve seguir o Design System oficial do projeto.

Referências:

- Sofascore
- FotMob
- OneFootball
- Flashscore

Evitar aparência de:

- ERP
- CRM
- Dashboard SaaS
- Template genérico

---

# Convenções

## Idioma

Todo código deve ser escrito em inglês.

Correto:

```text
User
Profile
Organization
Membership
Match
Attendance
```

Evitar:

```text
Usuario
Pelada
Jogador
```

---

## Nomenclatura

Utilizar:

- PascalCase para componentes e classes
- camelCase para funções e variáveis
- kebab-case para arquivos
- UPPER_CASE para constantes

---

# Testes

Estrutura prevista:

```text
tests/
├── unit/
├── integration/
└── e2e/
```

Priorizar testes para:

- Autenticação
- Rankings
- Estatísticas
- Regras de negócio críticas

---

# Regra Geral

Priorizar sempre:

1. Simplicidade
2. Legibilidade
3. Organização por funcionalidade
4. Reutilização
5. Escalabilidade

Quando houver dúvida entre uma solução simples e uma abstração complexa, preferir a solução simples.
