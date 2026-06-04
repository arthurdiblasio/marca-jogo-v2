# Regras De Dominio

Este documento descreve as regras centrais do dominio. Todos os desenvolvimentos futuros devem respeitar estas regras.

## User

O usuario possui uma unica conta no sistema.

O mesmo usuario pode participar de multiplas organizacoes.

Dados de perfil pertencem ao `User`.

Permissoes nao pertencem diretamente ao `User`; permissoes pertencem ao relacionamento entre `User` e `Organization`.

## Organization

Uma `Organization` representa um grupo do qual usuarios participam.

Existem dois tipos de organizacao:

- `PELADA`
- `TEAM`

Toda regra especifica de evento, estatistica, permissao e exibicao deve considerar o tipo da organizacao.

## Pelada

`Pelada` e um tipo de organizacao.

Uma pelada organiza encontros recorrentes ou pontuais entre participantes.

### Regra Principal

Pelada nao e um jogo oficial.

Uma ocorrencia de pelada possui:

- Data
- Horario
- Local
- Participantes
- Estatisticas finais
- MVP

Uma ocorrencia de pelada nao possui:

- Resultado oficial
- Classificacao oficial
- Tabela
- Vencedor oficial

### Confrontos Internos

Dentro de uma pelada podem existir diversos confrontos internos.

Esses confrontos internos nao serao armazenados inicialmente.

Na fase inicial, o sistema deve armazenar apenas estatisticas finais da ocorrencia:

- Gols
- Assistencias
- MVP
- Participacao

## Team

`Team` e um tipo de organizacao.

Um Team representa um time estruturado que disputa jogos contra adversarios.

Team possui jogos.

Um jogo de Team possui:

- Adversario
- Data
- Horario
- Local
- Resultado
- Escalacao
- Estatisticas

Ao contrario da Pelada, um jogo de Team pode possuir resultado oficial e historico competitivo.

## Membership

`Membership` representa o relacionamento entre:

- `User`
- `Organization`

Permissoes pertencem ao `Membership`.

Um mesmo `User` pode ter papeis diferentes em organizacoes diferentes.

Exemplo:

- Owner em uma Pelada
- Player em um Team
- Captain em outro Team

## Ranking

Rankings devem respeitar o contexto da organizacao.

Rankings de Pelada devem considerar estatisticas finais de participacao, gols, assistencias e MVP.

Rankings de Team devem considerar estatisticas de jogos, resultados e desempenho individual ou coletivo.

## Estatisticas

Estatisticas devem sempre estar associadas ao contexto correto:

- Pelada
- Team
- Ocorrencia de Pelada
- Jogo de Team
- User dentro de uma Organization

Nenhuma estatistica deve ser interpretada fora do seu contexto de organizacao.
