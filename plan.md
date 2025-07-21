# Plano de Desenvolvimento - Koposol Partner

## Introdução

Este documento serve como um guia técnico e de planejamento para a plataforma Koposol Partner. Ele detalha a arquitetura, a lógica de funcionamento e a estrutura de dados, e deve ser mantido rigorosamente atualizado a cada nova implementação.

### 1. Visão Geral e Arquitetura

A plataforma Koposol Partner é um sistema web (SaaS) projetado para otimizar e gerenciar o ciclo de vida dos parceiros integradores, desde o cadastro inicial até a aprovação e o gerenciamento contínuo.

-   **Arquitetura Tecnológica**:
    -   **Frontend**: Uma Single-Page Application (SPA) construída com **React** e **Vite**, garantindo uma experiência de usuário rápida e reativa. O uso de **TypeScript** assegura a tipagem estática, reduzindo erros em tempo de desenvolvimento. A interface é estilizada com **Tailwind CSS** e componentes pré-construídos de **shadcn/ui**, resultando em um design moderno e consistente.
    -   **Backend (BaaS)**: A aplicação utiliza **Supabase** como sua espinha dorsal, aproveitando seus serviços integrados:
        -   **Database**: Um banco de dados **PostgreSQL** relacional para armazenar todos os dados da aplicação.
        -   **Authentication**: Serviço completo para gerenciamento de usuários, incluindo registro, login, recuperação de senha e segurança baseada em JWT.
        -   **Row Level Security (RLS)**: Políticas de segurança a nível de linha do banco de dados que garantem que os usuários só possam acessar os dados que lhes são permitidos.

### 2. Lógica de Funcionamento e Fluxos de Usuário

A aplicação opera com base em dois papéis de usuário distintos: **Integrador** e **Administrador**.

-   **Fluxo do Integrador (Cadastro e Acesso)**:
    1.  **Registro**: O processo começa na página `/register`. O futuro parceiro preenche um formulário com suas credenciais (e-mail/senha) e os dados da sua empresa.
    2.  **Criação no Banco de Dados**: Ao submeter o formulário, a aplicação executa duas operações atômicas no Supabase:
        -   Cria uma nova entrada na tabela `auth.users` do Supabase Auth.
        -   Cria um novo registro na tabela `public.integradores`, preenchendo-o com os dados da empresa e vinculando-o ao `user_id` recém-criado. O campo `status` é definido, por padrão, como `'pendente'`.
    3.  **Acesso Restrito**: Após o cadastro, se o integrador tentar fazer login, o sistema (futuramente) deve verificar seu status. Se for `'pendente'`, o acesso ao dashboard principal é bloqueado, e uma mensagem informativa é exibida.
    4.  **Acesso Total**: Uma vez que um administrador aprova o cadastro (alterando o status para `'aprovado'`), o integrador obtém acesso completo às funcionalidades da plataforma.

-   **Fluxo do Administrador (Gerenciamento)**:
    1.  **Login**: O administrador acessa o sistema através da página `/login` com suas credenciais de `admin`.
    2.  **Visualização Centralizada**: Na página "Gerenciar Integradores" (`/admin/integrators`), o sistema busca todos os registros da tabela `integradores`.
    3.  **Interface de Gestão**: Os dados são apresentados em uma interface com abas que separam os integradores por `status` (Pendentes, Aprovados, Rejeitados), permitindo uma análise rápida e organizada.
    4.  **Ação de Aprovação/Rejeição**: O administrador pode visualizar os detalhes de cada integrador e, através de botões de ação, aprovar ou rejeitar um cadastro. Essa ação dispara um comando `UPDATE` no Supabase, que altera o valor do campo `status` na tabela `integradores` para o registro específico.

### 3. Estrutura Detalhada do Banco de Dados (Supabase)

A integridade dos dados e a lógica de negócios dependem fundamentalmente da correta interação entre as seguintes tabelas:

-   **`auth.users`** (Gerenciada pelo Supabase)
    -   **Propósito**: Coração da autenticação. Armazena de forma segura as identidades dos usuários.
    -   **Campos Chave**: `id` (UUID), `email`, `encrypted_password`.
    -   **Interação**: O `id` desta tabela é a chave estrangeira (`user_id`) que conecta um login a um perfil e a um cadastro de integrador, garantindo que todos os dados de um usuário estejam interligados.

-   **`public.profiles`**
    -   **Propósito**: Estender a tabela `auth.users` com metadados específicos da aplicação, principalmente para controle de acesso.
    -   **Campos Relevantes**:
        -   `id` (PK, FK para `auth.users.id`): Garante uma relação 1-para-1 com a tabela de usuários.
        -   `tipo_usuario` (TEXT): Campo crítico que armazena o papel do usuário (`'admin'` ou `'integrador'`). As políticas de RLS se baseiam neste campo para decidir quem pode ver o quê. Por exemplo: `SELECT` em `integradores` só é permitido para `tipo_usuario = 'admin'`.

-   **`public.integradores`**
    -   **Propósito**: Tabela central que armazena todas as informações comerciais e de status dos parceiros integradores.
    -   **Campos Relevantes**:
        -   `id` (PK, UUID): Identificador único para cada registro de integrador.
        -   `user_id` (FK para `auth.users.id`): Vínculo essencial que conecta a empresa ao usuário que a cadastrou.
        -   `nome_empresa`, `email`, `cnpj`, etc.: Dados cadastrais da empresa.
        -   `status` (TEXT): Campo vital que define o estado do integrador no fluxo de trabalho (`'pendente'`, `'aprovado'`, `'rejeitado'`). A lógica de aprovação e acesso se baseia diretamente neste campo.
        -   `created_at` (TIMESTAMPTZ): Timestamp automático que registra quando o cadastro foi criado, útil para ordenação e relatórios.

## Próximas Tarefas

- [ ] **Segurança**: Implementar bloqueio de acesso para integradores com status diferente de 'aprovado'.
- [ ] **Funcionalidade (Kanban)**: Criar a estrutura da nova página de Propostas.
- [ ] **Banco de Dados (Kanban)**: Criar tabelas `propostas` e `proposta_comentarios` no Supabase.
- [ ] **UI (Kanban)**: Desenvolver a interface do Kanban com colunas e cards (sem drag-and-drop).
- [ ] **Funcionalidade (Kanban)**: Implementar a funcionalidade de arrastar e soltar (drag-and-drop) para mover propostas entre colunas.
- [ ] **Funcionalidade (Kanban)**: Implementar o sistema de comentários dentro dos cards.
- [ ] **Funcionalidade**: Implementar a função de "Editar" integrador.
- [ ] **Funcionalidade**: Implementar a página de Kanban para gerenciamento de propostas.
- [ ] **Banco de Dados**: Realizar limpeza no banco de dados após finalização da aplicação (remover colunas/dados obsoletos).
- [ ] **Deploy**: Depurar e corrigir configuração de SMTP (Supabase + Resend) para envio de e-mails transacionais.

## Tarefas Concluídas

- [x] **Refatoração**: Remover menu, rota e componente 'Integradores Pendentes' que se tornaram obsoletos.
- [x] **Correção**: Corrigir busca de dados (tabela e título) na página de Gerenciamento de Integradores.
- [x] **Correção**: Solucionar erro de tipagem do TypeScript na página de integradores.
- [x] **Correção**: Separar listagem de integradores por status (Pendentes, Aprovados, Rejeitados) na página de gerenciamento.

- [x] Implementar fluxo de autenticação (Login, Cadastro).
- [x] Implementar fluxo de recuperação de senha (Forgot/Reset Password).
- [x] Criar estrutura de layout para a área administrativa (Sidebar, Header).
- [x] Implementar Dashboard inicial do Admin.
- [x] Implementar listagem de integradores recentes no Dashboard.
- [x] Implementar página completa de gerenciamento de integradores (Listar, Filtrar, Aprovar, Reprovar).
- [x] Criar e aplicar políticas RLS para segurança de dados de admins e integradores.
- [x] **UI**: Corrigir alinhamento do título e adicionar ícone na página de "Gerenciamento de Integradores".
