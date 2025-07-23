# Plano de Desenvolvimento e Análise Técnica - Koposol Partner

**Última Atualização:** 22/07/2025

## 1. Introdução

Este documento é o guia central para o desenvolvimento e manutenção da plataforma **Koposol Partner**. Ele detalha a arquitetura da aplicação, a estrutura do banco de dados, os fluxos de trabalho e as diretrizes para futuras implementações. O objetivo é manter um registro claro e atualizado para facilitar a colaboração e a evolução do projeto.

### 1.2. Propósito e Justificativa

A plataforma Koposol Partner foi criada para resolver um desafio central no setor de energia solar: a gestão ineficiente e descentralizada de uma rede crescente de parceiros integradores. Antes desta solução, processos como cadastro, verificação de documentos, aprovação e acompanhamento de propostas eram frequentemente manuais, baseados em e-mails e planilhas.

**A aplicação visa atacar os seguintes problemas:**

*   **Falta de Padronização:** O processo de cadastro de novos parceiros era suscetível a erros e à falta de informações essenciais.
*   **Lentidão no Ciclo de Vendas:** A comunicação manual para aprovar parceiros e propostas gerava gargalos, atrasando o início dos projetos e impactando a receita.
*   **Falta de Visibilidade:** A gestão não tinha uma visão clara e em tempo real do status de cada parceiro ou do funil de propostas, dificultando o planejamento estratégico.
*   **Experiência do Parceiro:** A ausência de um portal unificado tornava a experiência do integrador fragmentada e pouco profissional.

**O objetivo da Koposol Partner é, portanto, ser a espinha dorsal operacional que:**

1.  **Centraliza e Automatiza:** Unifica todo o ciclo de vida do parceiro em um único sistema, desde o primeiro contato até a gestão de projetos.
2.  **Aumenta a Eficiência:** Reduz o tempo gasto em tarefas administrativas, permitindo que a equipe foque em atividades de maior valor, como o suporte estratégico aos parceiros.
3.  **Garante Escalabilidade:** Fornece uma base tecnológica sólida que permite à Koposol expandir sua rede de parceiros sem aumentar proporcionalmente a complexidade operacional.
4.  **Melhora a Colaboração:** Oferece um portal profissional para os integradores, melhorando a comunicação, a transparência e o relacionamento comercial.

## 2. Análise da Aplicação

### 2.1. Visão Geral e Arquitetura

A Koposol Partner é uma aplicação web (SaaS) desenvolvida para gerenciar o ciclo de vida dos parceiros integradores de energia solar, desde o cadastro e aprovação até o gerenciamento de propostas e projetos.

-   **Arquitetura Tecnológica**:
    -   **Frontend**: Single-Page Application (SPA) construída com **React** e **Vite**, proporcionando uma experiência de usuário rápida e moderna.
        -   **Linguagem**: **TypeScript**, para segurança de tipos e robustez do código.
        -   **Estilização**: **Tailwind CSS** e **shadcn/ui**, para uma UI consistente e de fácil manutenção.
    -   **Backend (BaaS)**: **Supabase**, que fornece uma suíte de serviços integrados:
        -   **Database**: Banco de dados **PostgreSQL**.
        -   **Authentication**: Gerenciamento completo de usuários (login, registro, etc.).
        -   **Storage**: Armazenamento de arquivos, como documentos de projetos.
        -   **Row Level Security (RLS)**: Camada de segurança que garante o isolamento e a permissão de dados.

### 2.2. O que a Plataforma Faz (Visão Funcional)

A plataforma é um **portal online exclusivo** criado para ser o **ponto central de controle e colaboração** entre a Koposol e seus parceiros integradores. Ela automatiza e organiza todo o ciclo de vida de um parceiro, com funcionalidades específicas para cada tipo de usuário:

**1. Para o Administrador (Equipe Koposol):**

O administrador tem uma visão completa e controle total sobre a rede de parceiros.

-   **Gerenciamento de Cadastros:** Acompanha os novos parceiros que se cadastram, que aparecem com o status "Pendente".
-   **Aprovação e Rejeição:** Analisa os dados de cada parceiro e, com um clique, **aprova** ou **rejeita** o cadastro, controlando quem pode vender os produtos da Koposol.
-   **Dashboard Centralizado:** Visualiza todos os parceiros organizados por status (Pendentes, Aprovados, Rejeitados) para uma gestão rápida.
-   **(Futuro) Gestão de Propostas:** Acompanha o funil de vendas em tempo real, visualizando as propostas que os parceiros estão criando para clientes finais.

**2. Para o Parceiro (Empresa Integradora):**

O parceiro ganha um portal profissional para gerenciar seu trabalho com a Koposol.

-   **Autocadastro:** O parceiro interessado preenche um formulário completo com os dados da sua empresa.
-   **Portal Exclusivo:** Após ser **aprovado**, o parceiro ganha acesso a uma área logada.
-   **(Futuro) Criação de Propostas:** Utiliza uma ferramenta para simular sistemas, gerar propostas comerciais com a marca da Koposol e enviá-las aos clientes.
-   **(Futuro) Acompanhamento de Vendas (Kanban):** Gerencia suas propostas em um painel Kanban, movendo-as entre colunas como "Em negociação", "Aprovada" e "Instalação".
-   **(Futuro) Gestão de Projetos:** Faz o upload de documentos técnicos de projetos (ART, memoriais) após fechar uma venda, mantendo tudo organizado.

### 2.3. Estrutura do Código-Fonte (`/src`)

O projeto segue uma estrutura modular e organizada para facilitar a escalabilidade:

-   `components/`: Contém componentes React reutilizáveis (ex: `Button`, `Card`, `Input`). A subpasta `ui/` abriga os componentes base do shadcn.
-   `pages/`: Define as principais rotas e visualizações da aplicação (ex: `Login.tsx`, `Register.tsx`, `admin/Dashboard.tsx`).
-   `hooks/`: Armazena hooks customizados que encapsulam lógicas de negócio (ex: `useAuth` para informações de autenticação).
-   `lib/`: Funções utilitárias, como `utils.ts` (para formatação) e `brazil-states.ts`.
-   `integrations/supabase/`: Centraliza a comunicação com o Supabase:
    -   `client.ts`: Inicializa e exporta o cliente Supabase para ser usado em toda a aplicação.
    -   `types.ts`: Contém as definições de tipos TypeScript geradas a partir do schema do banco de dados, garantindo a consistência entre o frontend e o backend.
-   `contexts/`: Provedores de Contexto React para gerenciamento de estado global, como o `AuthContext.tsx`.

## 3. Estrutura Detalhada do Banco de Dados (Supabase)

A seguir, uma descrição detalhada das tabelas, suas colunas e relacionamentos, baseada na inspeção direta do banco de dados.

### 3.1. Autenticação e Perfis

-   **`auth.users`** (Gerenciada pelo Supabase)
    -   **Propósito**: Armazena as credenciais de todos os usuários.
    -   **Colunas Chave**: `id` (UUID), `email`, `encrypted_password`.

-   **`public.profiles`**
    -   **Propósito**: Estende a tabela `auth.users` com dados específicos da aplicação.
    -   **Colunas**: `id` (PK), `tipo_usuario` (TEXT), `nome` (TEXT), `avatar_url` (TEXT).
    -   **Relacionamento**: `profiles.id` → `auth.users.id` (Um-para-Um).

### 3.2. Entidades Principais

-   **`public.integradores`**
    -   **Propósito**: Tabela central com os dados cadastrais das empresas parceiras.
    -   **Colunas**: `id` (PK), `user_id` (FK), `nome_empresa`, `cnpj`, `email`, `telefone`, `endereco`, `status` (TEXT: 'pendente', 'aprovado', 'rejeitado'), `created_at`.
    -   **Relacionamento**: `integradores.user_id` → `auth.users.id`.

-   **`public.propostas`**
    -   **Propósito**: Armazena as propostas comerciais criadas pelos integradores.
    -   **Colunas**: `id` (PK), `integrador_id` (FK), `simulacao_id` (FK), `nome_cliente`, `email_cliente`, `telefone_cliente`, `valor_proposta`, `status` (TEXT), `data_validade`.
    -   **Relacionamentos**: `propostas.integrador_id` → `integradores.id`; `propostas.simulacao_id` → `simulacoes.id`.

-   **`public.projetos_integrador`**
    -   **Propósito**: Armazena documentos de projetos executivos.
    -   **Colunas**: `id` (PK), `integrador_id` (FK), `proposta_id` (FK), `art_url`, `memorial_descritivo_url`, `outros_documentos_url`.
    -   **Relacionamento**: `projetos_integrador.integrador_id` → `integradores.id`.

### 3.3. Módulos de Suporte

-   **`public.proposta_comentarios`**
    -   **Propósito**: Guarda o histórico de comentários em uma proposta.
    -   **Colunas**: `id` (PK), `proposta_id` (FK), `user_id` (FK), `comentario` (TEXT).
    -   **Relacionamentos**: `proposta_comentarios.proposta_id` → `propostas.id`; `proposta_comentarios.user_id` → `auth.users.id`.

-   **`public.simulacoes`**
    -   **Propósito**: Armazena os dados de entrada para uma simulação de sistema.
    -   **Colunas**: `id` (PK), `integrador_id` (FK), `consumo_medio_kwh`, `tipo_telhado`, `cep`.
    -   **Relacionamento**: `simulacoes.integrador_id` → `integradores.id`.

-   **`public.simulacao_equipamentos` e `public.simulacao_resultados`**
    -   **Propósito**: Detalham os equipamentos usados e os resultados de uma simulação.
    -   **Relacionamento**: Ambas se conectam a `simulacoes.id`.

-   **`public.kits_referencia`**
    -   **Propósito**: Tabela de consulta com configurações de kits pré-definidos para agilizar simulações.
    -   **Colunas**: `id` (PK), `conta_energia`, `potencia_sistema`, `qtd_modulos`, `valor_kit`.

## 4. Plano de Ação (Próximas Tarefas)

Esta seção centraliza todas as tarefas e melhorias planejadas para a plataforma.

### 4.1. Segurança e Acesso
- [ ] **Segurança**: Implementar bloqueio de acesso para integradores com status `'pendente'` ou `'rejeitado'`. 
- [ ] **Segurança**: Auditar todas as políticas de Row Level Security para garantir que não haja brechas de acesso.
- [ ] **Notificações**: Configurar o serviço de SMTP (ex: Resend) para notificar integradores sobre a mudança de status.

### 4.2. Funcionalidades e UX
- [ ] **Funcionalidade**: Implementar a função de "Editar" integrador para administradores.
- [ ] **Funcionalidade**: Criar um painel inicial (Dashboard) para o integrador com resumos e notificações.
- [ ] **UX**: Adicionar filtros e busca avançada nas páginas de gerenciamento (integradores, propostas).
- [ ] **UX**: Melhorar a interface de upload de arquivos, mostrando progresso e status.
- [ ] **Funcionalidade (Kanban)**: Desenvolver a interface do Kanban de propostas (colunas e cards).
- [ ] **Funcionalidade (Kanban)**: Implementar a funcionalidade de arrastar e soltar (drag-and-drop) no Kanban.
- [ ] **Funcionalidade (Kanban)**: Implementar o sistema de comentários dentro dos cards de proposta.

### 4.3. Código e Manutenção
- [ ] **Código**: Reforçar a tipagem estrita, eliminando o uso de `any` e utilizando os tipos do Supabase.
- [ ] **Código**: Centralizar chamadas ao Supabase em hooks específicos (ex: `useIntegradores`) para encapsular a lógica de dados.
- [ ] **Código**: Padronizar o tratamento de erros das chamadas à API com mensagens claras ao usuário.
- [ ] **Manutenção**: Criar rotinas ou scripts para limpar dados de teste dos ambientes.
