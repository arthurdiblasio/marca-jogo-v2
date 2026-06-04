# Permissoes

Permissoes pertencem ao `Membership`, ou seja, ao relacionamento entre `User` e `Organization`.

Um mesmo usuario pode ter papeis diferentes em organizacoes diferentes.

## Roles

Roles disponiveis:

- `Owner`
- `Admin`
- `Captain`
- `Player`

## Owner

Possui acesso total dentro da organizacao.

Pode:

- Gerenciar dados da organizacao
- Gerenciar membros
- Gerenciar permissoes
- Criar eventos
- Editar eventos
- Excluir eventos
- Gerenciar financeiro
- Gerenciar estatisticas
- Excluir organizacao

## Admin

Pode gerenciar a organizacao.

Nao pode excluir a organizacao.

Pode:

- Gerenciar membros
- Criar eventos
- Editar eventos
- Gerenciar convocacoes
- Gerenciar financeiro
- Gerenciar estatisticas

Nao pode:

- Excluir organizacao
- Remover Owner

## Captain

Pode atuar na operacao esportiva.

Pode:

- Convocar
- Criar jogos
- Criar peladas
- Gerenciar escalacoes
- Registrar resultados de jogos
- Registrar estatisticas

Nao pode:

- Excluir organizacao
- Gerenciar permissoes globais
- Gerenciar financeiro, exceto se tambem possuir papel administrativo no futuro

## Player

Pode participar da organizacao.

Pode:

- Visualizar informacoes
- Confirmar presenca
- Votar MVP
- Visualizar rankings
- Visualizar estatisticas

Nao pode:

- Criar eventos, salvo regra futura especifica
- Editar estatisticas oficiais
- Gerenciar membros
- Gerenciar permissoes
- Gerenciar financeiro

## Regras Gerais

Permissoes devem sempre ser avaliadas dentro do contexto da organizacao atual.

Nao deve existir permissao global baseada apenas no usuario.

Toda acao sensivel deve verificar:

- Usuario autenticado
- Organizacao atual
- Membership do usuario na organizacao
- Role do usuario naquele Membership
