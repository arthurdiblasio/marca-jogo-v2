# Arquitetura

Este documento define a direcao arquitetural do projeto.

## Frontend

Stack oficial do frontend:

- Next.js 15
- React 19
- TypeScript
- Tailwind CSS v4
- shadcn/ui
- Lucide React
- Motion
- Sonner

## Backend Futuro

Stack prevista para backend:

- Go
- PostgreSQL
- Redis

## Principios Arquiteturais

O projeto deve seguir:

- Clean Architecture
- SOLID
- Dependency Injection
- Separacao clara de responsabilidades
- Tipagem forte
- Baixo acoplamento
- Alta coesao

## Camadas

Separar responsabilidades em:

- Domain
- Application
- Infrastructure
- Presentation

## Domain

Contem regras de negocio centrais.

Exemplos:

- User
- Organization
- Membership
- Pelada
- Team
- Match
- Statistics
- Ranking

Domain nao deve depender de frameworks.

## Application

Contem casos de uso.

Exemplos:

- Confirmar presenca
- Criar Pelada
- Criar jogo de Team
- Registrar estatisticas
- Votar MVP
- Buscar adversarios

Application coordena regras do dominio, mas nao deve conter detalhes de UI ou infraestrutura.

## Infrastructure

Contem detalhes externos.

Exemplos:

- Banco de dados
- Cache
- APIs externas
- Filas
- Repositorios concretos
- Gateways

## Presentation

Contem interface e experiencia do usuario.

Exemplos:

- Pages
- Layouts
- Components
- Navigation
- Design System
- Client interactions

Presentation nao deve concentrar regras de negocio.

## Organizacao De Pastas Frontend

Estrutura recomendada:

```text
src/
  app/
  components/
    ui/
    layout/
    navigation/
    football/
    statistics/
    cards/
  features/
  hooks/
  lib/
  services/
  types/
  constants/
  styles/
```

## Regra Geral

O frontend atual pode conter dados mockados para validacao visual.

Regras de negocio definitivas devem ser implementadas futuramente em camadas apropriadas, respeitando este documento e os documentos de dominio.
