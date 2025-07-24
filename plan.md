# Plano de Desenvolvimento e Análise Técnica - Koposol Partner

**Última Atualização:** 24/07/2025

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

O parceiro ganha um portal profissional para gerenciar seu trabalho com a Koposol, começando por um fluxo de cadastro detalhado e robusto.

-   **Fluxo de Cadastro Guiado (Componente `Register.tsx`):** O processo de cadastro foi reestruturado para ser um formulário multi-etapas, garantindo que a Koposol receba todas as informações necessárias para a análise do parceiro de uma só vez.
    -   **Etapa 1: Dados da Empresa:** Coleta de informações como Razão Social, CNPJ, e-mail e endereço. Integração com a API ViaCEP para preenchimento automático do endereço a partir do CEP.
    -   **Etapa 2: Dados do Titular:** Coleta de informações sobre o responsável legal (nome completo, CPF, contatos).
    -   **Etapa 3: Upload de Documentos:** O parceiro anexa documentos essenciais (Contrato Social, Comprovante de Endereço, RG/CNH dos sócios, Dados Bancários, Foto da Fachada).
    -   **Etapa 4: Projetos de Engenharia (Opcional):** O parceiro pode submeter até três projetos como portfólio, com upload de ART, memorial descritivo e outros arquivos.
-   **Validação e Submissão:** Cada etapa é validada antes de permitir o avanço. Ao final, todos os dados e arquivos são enviados para o Supabase, atualizando o status do integrador para `pendente_documentacao`.
-   **Portal Exclusivo:** Após ser **aprovado** pela equipe da Koposol, o parceiro ganha acesso a uma área logada com as demais funcionalidades.
-   **(Futuro) Criação de Propostas:** Utiliza uma ferramenta para simular sistemas, gerar propostas comerciais com a marca da Koposol e enviá-las aos clientes.
-   **(Futuro) Acompanhamento de Vendas (Kanban):** Gerencia suas propostas em um painel Kanban, movendo-as entre colunas como "Em negociação", "Aprovada" e "Instalação".

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
    -   **Colunas Principais**: `id` (PK), `user_id` (FK), `nome_empresa`, `cnpj`, `email`, `telefone`, `status` ('pendente', 'pendente_documentacao', 'aprovado', 'rejeitado'), `owner_name`, `owner_cpf`, `owner_email`, `owner_phone`, `cep`, `street`, `number`, `city`, `state`, `neighborhood`, `contrato_social_url`, `comprovante_endereco_url`, `rg_socios_url`, `cnh_socios_url`, `dados_bancarios_url`, `foto_fachada_url`, `created_at`, `updated_at`.
    -   **Relacionamento**: `integradores.user_id` → `auth.users.id`.

-   **`public.propostas`**
    -   **Propósito**: Armazena as propostas comerciais criadas pelos integradores.
    -   **Colunas**: `id` (PK), `integrador_id` (FK), `simulacao_id` (FK), `nome_cliente`, `email_cliente`, `telefone_cliente`, `valor_proposta`, `status` (TEXT), `data_validade`.
    -   **Relacionamentos**: `propostas.integrador_id` → `integradores.id`; `propostas.simulacao_id` → `simulacoes.id`.

-   **`public.projetos_integrador`**
    -   **Propósito**: Armazena o portfólio de projetos de um integrador, submetido durante o cadastro.
    -   **Colunas**: `id` (PK), `integrador_id` (FK), `nome_cliente` (TEXT), `potencia_kwp` (NUMBER), `art_url` (TEXT), `orcamento_conexao_url` (TEXT), `outros_documentos_url` (TEXT).
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
- [x] **Código**: Reforçar a tipagem estrita, eliminando o uso de `any` e utilizando os tipos do Supabase.
- [ ] **Código**: Centralizar chamadas ao Supabase em hooks específicos (ex: `useIntegradores`) para encapsular a lógica de dados.
- [ ] **Código**: Padronizar o tratamento de erros das chamadas à API com mensagens claras ao usuário.
- [ ] **Manutenção**: Criar rotinas ou scripts para limpar dados de teste dos ambientes.

### 4.4. Decisões de Design e Notas
- [x] **Layout da Página de Login**: O layout atual da página de login (`/auth`) é considerado ideal e não deve ser alterado.

---

## 5. Relatório de Depuração: Estabilização do Fluxo de Autenticação (24/07/2025)

Esta seção documenta o processo intensivo de depuração e correção do fluxo de autenticação e controle de acesso da plataforma. O objetivo é registrar os problemas, as tentativas de solução (incluindo as falhas) e a arquitetura final implementada.

### 5.1. Problemas Iniciais Identificados

A aplicação sofria de uma série de instabilidades críticas que impediam o uso:

1.  **Carregamento Infinito (Infinite Loading):** Após o cadastro ou login, a aplicação frequentemente travava em uma tela de carregamento, nunca exibindo o dashboard ou a página correta.
2.  **Redirecionamentos Incorretos e Loops:** Usuários eram enviados para páginas erradas ou ficavam presos em loops de redirecionamento, resultando em uma tela em branco.
3.  **Falha Silenciosa no Cadastro:** Em fases posteriores da depuração, o formulário de cadastro parou de funcionar sem apresentar erros visíveis ao usuário.

### 5.2. Análise e Diagnóstico (A Jornada)

A investigação seguiu várias etapas, com diagnósticos que evoluíram à medida que uma camada do problema era resolvida e outra, mais profunda, era revelada.

**Falha nº 1: A Hipótese da Condição de Corrida**
*   **Observação:** Os logs do console mostravam que o `AuthContext` tentava ler o perfil do integrador (`SELECT`) imediatamente após o evento `SIGNED_IN` do Supabase.
*   **Diagnóstico Inicial:** Concluímos que havia uma **condição de corrida**: a leitura acontecia *antes* que a função de cadastro (`handleSignUp`) conseguisse inserir o perfil mínimo (`INSERT`) no banco de dados. A Política de Segurança (RLS) bloqueava a leitura, causando o carregamento infinito.
*   **Lição:** O diagnóstico da condição de corrida estava correto, mas as primeiras tentativas de solução foram falhas.

**Falha nº 2: Erro 406 Not Acceptable**
*   **Observação:** Após uma correção inicial, a aplicação começou a falhar com um erro `HTTP 406`.
*   **Diagnóstico:** Este erro indicava que a nossa consulta (`.single()`) esperava um único registro, mas encontrou múltiplos registros para o mesmo `user_id` na tabela `integradores`. Isso foi causado por cadastros de teste repetidos durante o desenvolvimento.
*   **Lição:** A integridade dos dados no banco é tão crucial quanto a lógica no frontend. A ausência de uma restrição `UNIQUE` na coluna `user_id` era uma falha de design do banco.

**Falha nº 3: Violação das Regras do React e Erros de Importação**
*   **Observação:** Em uma fase final, o cadastro parou de funcionar silenciosamente.
*   **Diagnóstico:** Uma série de erros de código foram introduzidos durante as tentativas de correção:
    1.  **Violação de Regra de Hook:** A chamada `useAuth()` foi colocada erroneamente dentro da função `handleSignUp`, o que quebra as regras do React e causa uma falha silenciosa.
    2.  **Erros de Importação:** `useEffect` foi usado sem ser importado, e o caminho de importação para `useAuth` estava incorreto.
*   **Lição:** A pressa em corrigir um problema pode levar a erros básicos. A análise cuidadosa do linter e do código completo é fundamental.

### 5.3. A Solução Final (Arquitetura Implementada)

A solução foi multifacetada, abordando cada camada do problema:

1.  **Banco de Dados (Integridade):**
    *   **Ação:** Foi aplicada uma restrição **`UNIQUE`** na coluna `user_id` da tabela `integradores`.
    *   **Resultado:** Garante que nunca mais haverá perfis duplicados para um mesmo usuário, prevenindo a causa raiz do erro 406.

2.  **Contexto de Autenticação (`AuthContext.tsx` - Resiliência):**
    *   **Ação:** A consulta de perfil foi alterada de `.single()` para **`.limit(1).maybeSingle()`**. Além disso, a função `checkUserAndProfile` foi devidamente exportada no tipo e no valor do contexto.
    *   **Resultado:** O código se tornou mais resiliente, capaz de lidar com a (agora improvável) possibilidade de dados duplicados sem quebrar. A função de verificação ficou disponível para outros componentes.

3.  **Página de Autenticação (`AuthPage.tsx` - Lógica de Fluxo):**
    *   **Ação 1 (Eliminar Condição de Corrida):** A função `handleSignUp` agora chama explicitamente `await checkUserAndProfile(user)` **após** inserir o perfil no banco. Isso força a sincronização do estado no momento exato, resolvendo a condição de corrida de forma definitiva.
    *   **Ação 2 (Redirecionamento Pós-Login/Cadastro):** Um `useEffect` foi adicionado à `AuthPage`. Ele monitora o estado do `user` no contexto. Assim que um usuário é detectado (e o carregamento inicial termina), ele é **imediatamente redirecionado** para o dashboard. Isso resolve o problema do usuário ficar na página de login após se cadastrar ou logar.
    *   **Ação 3 (Correção de Bugs):** A chamada incorreta de `useAuth` foi removida de dentro de `handleSignUp` e todas as importações foram corrigidas.

### 5.4. Fluxo do Usuário Final

O comportamento final e correto da aplicação é:

1.  **Cadastro:** Usuário se cadastra -> Recebe notificação de sucesso -> É redirecionado para a rota de dashboard.
2.  **Proteção de Rota:** O `ProtectedRoute` intercepta a navegação, verifica que o perfil está incompleto (`cnpj` é nulo) e redireciona para `/complete-profile`.
3.  **Conclusão do Perfil:** Usuário preenche o perfil -> É redirecionado para `/awaiting-approval`.
4.  **Aprovação:** Admin aprova o cadastro.
5.  **Acesso Final:** Usuário faz login e agora o `ProtectedRoute` valida seu perfil como `'aprovado'`, concedendo acesso ao dashboard principal.

---

### Definições de Status do Integrador

- **Pendente Cadastro (`pendente_cadastro`):** O usuário criou um login e senha, mas ainda não preencheu os dados completos do seu perfil (CNPJ, endereço, etc.). O sistema deve forçar o redirecionamento para a página de conclusão de perfil.

- **Pendente Aprovação (`pendente_aprovacao`):** O usuário já preencheu todos os dados do perfil. Ele pode fazer login, mas deve ser direcionado para uma página de "Aguardando Aprovação" até que um administrador aprove seu cadastro.

---

## Integração com API ViaCEP

Para melhorar a experiência do usuário e garantir a precisão dos dados de endereço, o formulário de cadastro de integrador (`src/pages/Register.tsx`) utiliza a API pública **ViaCEP**.

### Funcionamento

1.  **Gatilho:** A função é acionada quando o usuário preenche o campo **CEP** e o campo perde o foco (evento `onBlur`).
2.  **Requisição:** O sistema faz uma requisição `GET` para o endpoint `https://viacep.com.br/ws/{cep}/json/`, onde `{cep}` é o número digitado pelo usuário (apenas dígitos).
3.  **Resposta (Sucesso):** Se o CEP for válido, a API retorna um objeto JSON com os dados do endereço.
    ```json
    {
      "cep": "01001-000",
      "logradouro": "Praça da Sé",
      "complemento": "lado ímpar",
      "bairro": "Sé",
      "localidade": "São Paulo",
      "uf": "SP",
      "ibge": "3550308",
      "gia": "1004",
      "ddd": "11",
      "siafi": "7107"
    }
    ```
4.  **Preenchimento Automático:** O sistema utiliza os dados recebidos para preencher automaticamente os seguintes campos do formulário:
    -   `logradouro` → **Logradouro**
    -   `bairro` → **Bairro**
    -   `localidade` → **Cidade**
    -   `uf` → **Estado**
    -   `complemento` → **Complemento**
5.  **Feedback ao Usuário:** Uma notificação do tipo "toast" é exibida, informando que o endereço foi preenchido com sucesso.
6.  **Tratamento de Erro:** Se o CEP digitado for inválido ou não for encontrado, a API retorna um erro. O sistema captura esse erro e exibe uma notificação informando que o CEP não foi localizado.
