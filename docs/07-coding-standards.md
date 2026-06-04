# Padroes De Codigo

Este documento define os padroes de desenvolvimento do projeto.

## TypeScript

Regras:

- Nao utilizar `any`
- Usar tipagem forte
- Preferir tipos explicitos em contratos compartilhados
- Evitar tipos muito genericos
- Reutilizar tipos de dominio quando existirem

## React E Next.js

Regras:

- Server Components por padrao
- Client Components apenas quando necessario
- Componentes pequenos
- Componentes focados em uma responsabilidade
- Evitar logica de negocio dentro de componentes visuais

Client Components devem ser usados para:

- Estado local interativo
- Eventos de usuario
- Hooks de navegador
- Animacoes que dependam do cliente
- Bibliotecas que exijam client-side rendering

## Componentizacao

Preferir:

- Componentes reutilizaveis
- Composicao
- Props bem tipadas
- Variantes claras
- Nomes explicitos

Evitar:

- Componentes grandes demais
- Duplicacao visual
- Props ambiguas
- Logica condicional complexa em JSX

## Regras De Negocio

Evitar logica de negocio em componentes visuais.

Preferir:

- Hooks
- Services
- Use Cases
- Funcoes puras
- Camadas de dominio e aplicacao

## Estilo

Regras:

- Clean Code
- Reutilizacao maxima
- Baixo acoplamento
- Alta coesao
- Nomes claros
- Arquivos pequenos quando possivel

## UI

Regras:

- Seguir o design system documentado
- Evitar aparencia de dashboard SaaS
- Evitar componentes genericos sem customizacao
- Priorizar densidade de informacao esportiva
- Validar responsividade mobile first

## Dados Mockados

Dados mockados podem existir para validacao visual.

Dados mockados nao devem ser confundidos com regras de negocio definitivas.

Quando backend e casos de uso forem implementados, mocks devem ser isolados e substituiveis.

## Dependencias

Adicionar dependencias apenas quando houver justificativa clara.

Preferir recursos ja existentes no projeto.

Evitar bibliotecas que dupliquem responsabilidades.
