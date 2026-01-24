# 🏗️ Plano de Implementação: Melhoria de Fluxo (System Flow)

## 🎯 Objetivo
Implementar um fluxo unificado e contínuo de **Lead → Proposta → OS → Agenda**, eliminando "ilhas" de navegação e garantindo que o ciclo de vida do cliente seja tratado sem retrabalho.

## 🛠️ Agentes Necessários
- **`database-architect`**: Para ajustes em tabelas, estados (enums) e integridade de dados.
- **`backend-specialist`**: Para APIs e regras de negócio de transição de estados.
- **`frontend-specialist`**: Para UX, telas de Leads, Propostas, OS e Hub do Cliente.
- **`test-engineer`**: Para garantir que os fluxos não quebrem funcionalidades existentes.

---

## 📅 Fase 1: Fundação e Dados (Database)
**Foco:** Garantir que o banco de dados suporte os novos fluxos e estados.

### mudancas_db
- [ ] **Mapeamento de Estados (Enums/Types)**:
    - `leads`: 'novo', 'qualificado', 'perdido'.
    - `quotes`: 'rascunho', 'enviada', 'aceita', 'recusada'.
    - `orders`: 'aberta', 'agendada', 'em_andamento', 'concluida', 'faturada', 'cancelada'.
    - `agenda_events`: Criar vínculo forte com `order_id`.
- [ ] **Integração de Inventário**:
    - Garantir tabela de relacionamento `order_items` que aponte para `inventory_items` com `quantity` e decrementar estoque.

## 🚀 Fase 2: Conversão e Fluxo Core (Frontend + Backend)
**Foco:** Conectar as pontas soltas (Leads -> Proposta -> OS).

### leads_flow
- [ ] **Tela de Leads (`LeadsDashboard.tsx`)**:
    - Adicionar botões de ação rápida na tabela/cards:
        - "Criar Proposta" (leva p/ `QuoteCreate` com dados do lead).
        - "Criar OS" (leva p/ `OrderCreate` com dados do lead).
        - "Converter em Cliente" (se ainda não for).

### quotes_flow
- [ ] **Tela de Propostas (`Quotes.tsx` / `QuoteCreate.tsx`)**:
    - Fluxo de "Converter em OS":
        - Ao clicar em "Aceitar/Converter", abrir modal ou redirecionar para criação de OS.
        - **Pré-preencher** todos os dados da proposta (itens, valores, cliente).
        - Opcional: Já abrir gaveta de agendamento.

## 🗓️ Fase 3: Agenda e Operação
**Foco:** O coração da operação. Tudo converge para a agenda.

### agenda_integration
- [ ] **Agenda (`Agenda.tsx` / `MobileAgenda.tsx`)**:
    - Permitir criar OS clicando em slot vazio.
    - Exibir status da OS pela cor do evento.
    - Drag-and-drop atualizando horário da OS.

### worker_app_sync
- [ ] **Sincronização**:
    - Garantir que ações no "App Técnico" (Check-in/Check-out) atualizem o status da OS e da Agenda em tempo real (Supabase Realtime).

## 👤 Fase 4: Visão 360º do Cliente
**Foco:** Centralizar informações.

### client_hub
- [ ] **Página de Detalhes do Cliente (`Clients.tsx` / `ClientDashboard.tsx`)**:
    - Criar abas: Resumo, OS, Propostas, Agenda, Financeiro.
    - Navegação: Clicar no cliente em QUALQUER lugar (Lead, OS, Agenda) deve abrir este Hub (ou drawer).

---

## ✅ Critérios de Verificação
1.  **Lead to OS**: Criar um lead, converter em proposta, aprovar proposta e verificar se a OS foi criada com os itens corretos.
2.  **Scheduling**: Agendar essa OS e verificar se apareceu na Agenda.
3.  **Inventory**: Concluir a OS e verificar se o estoque foi debitado (se aplicável).
4.  **Client View**: Acessar o cliente e ver essa OS e Proposta no histórico.
