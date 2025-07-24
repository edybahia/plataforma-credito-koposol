# Requirements Document - Koposol Partner Platform

## Introduction

A Plataforma Koposol Partner é uma aplicação web SaaS desenvolvida para gerenciar o ciclo de vida completo dos parceiros integradores de energia solar. A plataforma resolve problemas críticos de gestão descentralizada, processos manuais e falta de visibilidade no setor de energia solar, centralizando desde o cadastro e aprovação de parceiros até o gerenciamento de propostas e projetos.

## Requirements

### Requirement 1

**User Story:** Como administrador da Koposol, eu quero gerenciar o cadastro de novos parceiros integradores, para que eu possa controlar quem tem acesso à rede de parceiros e manter a qualidade dos serviços.

#### Acceptance Criteria

1. WHEN um novo parceiro se cadastra THEN o sistema SHALL criar um registro com status "pendente"
2. WHEN o administrador acessa o dashboard THEN o sistema SHALL exibir todos os parceiros organizados por status (Pendentes, Aprovados, Rejeitados)
3. WHEN o administrador clica em "aprovar" THEN o sistema SHALL alterar o status do parceiro para "aprovado" e enviar notificação
4. WHEN o administrador clica em "rejeitar" THEN o sistema SHALL alterar o status do parceiro para "rejeitado" e enviar notificação
5. WHEN o administrador visualiza um parceiro THEN o sistema SHALL exibir todos os dados cadastrais e documentos anexados

### Requirement 2

**User Story:** Como parceiro integrador, eu quero me cadastrar na plataforma através de um fluxo guiado, para que eu possa fornecer todas as informações necessárias de forma organizada e completa.

#### Acceptance Criteria

1. WHEN o parceiro acessa o cadastro THEN o sistema SHALL apresentar um formulário multi-etapas
2. WHEN o parceiro preenche a Etapa 1 THEN o sistema SHALL coletar dados da empresa (Razão Social, CNPJ, email, endereço)
3. WHEN o parceiro informa o CEP THEN o sistema SHALL preencher automaticamente o endereço via API ViaCEP
4. WHEN o parceiro preenche a Etapa 2 THEN o sistema SHALL coletar dados do titular (nome, CPF, contatos)
5. WHEN o parceiro preenche a Etapa 3 THEN o sistema SHALL permitir upload de documentos obrigatórios
6. WHEN o parceiro preenche a Etapa 4 THEN o sistema SHALL permitir upload de até 3 projetos como portfólio
7. WHEN todas as etapas são concluídas THEN o sistema SHALL validar os dados e criar o cadastro com status "pendente_documentacao"

### Requirement 3

**User Story:** Como parceiro aprovado, eu quero acessar um portal exclusivo, para que eu possa gerenciar minhas propostas e projetos de forma profissional.

#### Acceptance Criteria

1. WHEN o parceiro tem status "aprovado" THEN o sistema SHALL permitir acesso ao portal exclusivo
2. WHEN o parceiro tem status "pendente" ou "rejeitado" THEN o sistema SHALL bloquear o acesso ao portal
3. WHEN o parceiro acessa o portal THEN o sistema SHALL exibir um dashboard com resumos e notificações
4. WHEN o parceiro navega no portal THEN o sistema SHALL manter a sessão de autenticação segura

### Requirement 4

**User Story:** Como parceiro aprovado, eu quero criar e gerenciar propostas comerciais, para que eu possa apresentar soluções de energia solar aos meus clientes.

#### Acceptance Criteria

1. WHEN o parceiro cria uma proposta THEN o sistema SHALL permitir inserir dados do cliente e do projeto
2. WHEN o parceiro salva uma proposta THEN o sistema SHALL armazenar com status inicial "Em negociação"
3. WHEN o parceiro visualiza suas propostas THEN o sistema SHALL exibir em formato Kanban
4. WHEN o parceiro move uma proposta THEN o sistema SHALL permitir arrastar entre colunas (Em negociação, Aprovada, Instalação)
5. WHEN o parceiro adiciona comentários THEN o sistema SHALL registrar histórico na proposta

### Requirement 5

**User Story:** Como usuário do sistema, eu quero que meus dados estejam seguros, para que apenas pessoas autorizadas tenham acesso às informações.

#### Acceptance Criteria

1. WHEN um usuário tenta acessar dados THEN o sistema SHALL aplicar Row Level Security (RLS)
2. WHEN um parceiro acessa dados THEN o sistema SHALL mostrar apenas seus próprios registros
3. WHEN um administrador acessa dados THEN o sistema SHALL mostrar todos os registros conforme permissões
4. WHEN há tentativa de acesso não autorizado THEN o sistema SHALL bloquear e registrar a tentativa
5. WHEN arquivos são enviados THEN o sistema SHALL armazenar de forma segura no Supabase Storage

### Requirement 6

**User Story:** Como usuário do sistema, eu quero uma experiência fluida e responsiva, para que eu possa usar a plataforma em diferentes dispositivos e situações.

#### Acceptance Criteria

1. WHEN o usuário acessa a aplicação THEN o sistema SHALL carregar rapidamente como SPA
2. WHEN o usuário navega entre páginas THEN o sistema SHALL manter estado e não recarregar desnecessariamente
3. WHEN o usuário usa dispositivos móveis THEN o sistema SHALL adaptar a interface responsivamente
4. WHEN ocorrem erros THEN o sistema SHALL exibir mensagens claras e orientações
5. WHEN o usuário faz upload de arquivos THEN o sistema SHALL mostrar progresso e status