# Projeto Amigo Secreto - TODO

## Funcionalidades Principais

- [x] Sistema de autenticação com Manus OAuth (apenas para organizador)
- [x] Criar novo grupo de amigo secreto
- [x] Organizador insere manualmente os nomes dos participantes (sem necessidade de cadastro)
- [x] Adicionar email/telefone opcional para cada participante
- [x] Definir valor sugerido para presente
- [x] Definir data do evento
- [x] Sortear pares automaticamente (garantindo que ninguém tire a si mesmo)
- [x] Gerar links únicos para cada participante ver quem tirou
- [x] Página de visualização individual (participante vê apenas quem tirou)
- [x] Listar meus grupos criados
- [x] Editar informações do grupo (apenas criador)
- [x] Excluir grupo (apenas criador)
- [x] Revelar todos os pares (apenas criador)
- [x] Interface responsiva para mobile e desktop
- [x] Tema visual natalino (cores, ícones, tipografia)
- [x] Página inicial com apresentação do sistema (tema natalino)
- [x] Dashboard com meus grupos criados
- [x] Página de detalhes do grupo com lista de participantes
- [x] Página de resultado individual para cada participante

## Melhorias e Recursos Adicionais

- [ ] Adicionar lista de desejos opcional para cada participante
- [ ] Enviar links por email automaticamente
- [ ] Histórico de grupos anteriores
- [ ] Exportar lista de pares em PDF

- [x] Implementar roleta animada na página de resultado do participante
- [x] Roleta gira com todos os nomes dos participantes
- [x] Animação para no nome sorteado para o participante
- [x] Permitir que organizador também participe do sorteio


## Migração para Netlify/Vercel

- [ ] Remover dependências do OAuth Manus
- [ ] Implementar sistema de login próprio (email + senha)
- [ ] Adicionar hash de senha com bcrypt
- [ ] Criar página de registro de usuários
- [ ] Criar página de login
- [ ] Atualizar contexto de autenticação
- [ ] Documentar variáveis de ambiente necessárias
- [ ] Criar guia de deploy para Netlify
- [ ] Criar guia de deploy para Vercel
- [ ] Adicionar exemplo de .env

- [x] Criar roleta circular visual que gira fisicamente (tipo cassino)
- [x] Nomes dispostos em círculo ao redor da roleta
- [x] Animação de rotação suave com desaceleração
- [x] Ponteiro/seta indicando o nome sorteado


## Correções de Privacidade e UX

- [x] Ocultar resultados do sorteio na página de detalhes do grupo
- [x] Mostrar apenas lista de participantes com botão "Copiar Link"
- [x] Adicionar botão "Revelar Todos os Resultados" (apenas após o evento)
- [x] Garantir que organizador mantenha surpresa se participar do sorteio
