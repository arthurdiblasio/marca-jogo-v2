# Fluxos De Usuario

Este documento descreve os principais fluxos de uso do produto.

## Primeiro Acesso

```text
Login
↓
Selecionar organizacao
↓
Entrar no contexto da organizacao
```

Ao entrar no sistema, o usuario deve escolher em qual organizacao deseja atuar.

Depois da selecao, toda navegacao deve respeitar o contexto da organizacao atual.

## Fluxo De Pelada

```text
Selecionar Pelada
↓
Visualizar proxima ocorrencia
↓
Confirmar presenca
↓
Participar da Pelada
↓
Registrar estatisticas finais
↓
Votar MVP
↓
Atualizar ranking
```

### Observacoes

Pelada nao possui resultado oficial.

O fluxo deve priorizar:

- Proxima pelada
- Confirmacao de presenca
- Participantes confirmados
- Registro de gols
- Registro de assistencias
- Votacao de MVP
- Ranking da Pelada

## Fluxo De Team

```text
Selecionar Team
↓
Visualizar proximo jogo
↓
Confirmar presenca
↓
Definir ou visualizar escalacao
↓
Registrar resultado
↓
Registrar estatisticas
↓
Atualizar historico e estatisticas
```

### Observacoes

Team possui jogos com adversario e resultado.

O fluxo deve priorizar:

- Proximo jogo
- Adversario
- Confirmacao de presenca
- Escalacao
- Resultado
- Ultimos resultados
- Estatisticas do Team
- Elenco

## Fluxo De Busca De Adversario

```text
Selecionar Team
↓
Buscar adversario
↓
Enviar convite
↓
Adversario aceitar convite
↓
Criar jogo
```

### Observacoes

A busca de adversario pertence ao contexto de Team.

Peladas nao participam inicialmente do fluxo de busca de adversarios.

## Fluxo De Troca De Organizacao

```text
Abrir seletor de organizacao
↓
Escolher Pelada ou Team
↓
Atualizar contexto
↓
Exibir tela inicial correspondente ao tipo selecionado
```

O seletor de organizacao deve funcionar como ponto central de troca de contexto.

## Fluxo De Convocacao

```text
Criar convocacao
↓
Selecionar evento
↓
Notificar membros
↓
Membros confirmam presenca
↓
Acompanhar lista de confirmados
```

Convocacoes podem existir em Peladas e Teams, respeitando regras especificas de cada tipo.
