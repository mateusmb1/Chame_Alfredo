# Roadmap — Chame Alfredo SaaS Refactoring

## Milestone: v2.0 — SaaS Multi-Tenant Platform

**7 phases** | **30 requirements** | Standard granularity

---

## Phase 1: Reestruturação do Codebase
**Goal**: Reorganizar a base de código para feature-based architecture, instalar dependências e preparar a fundação para todas as mudanças subsequentes.

**Requirements**: ARCH-01, ARCH-02, ARCH-03, ARCH-04, ARCH-05

**Success Criteria**:
1. Diretório src/features/ contém todos os módulos de domínio com seus componentes, hooks e tipos
2. Nenhum componente ou página existe fora de src/ (diretórios raiz eliminados)
3. Tailwind CSS funciona via npm build (CDN removido do index.html)
4. TanStack Query e Zustand instalados e configurados como providers
5. App roda sem erros após reestruturação (`npm run dev` + `npm run build`)

**UI hint**: no

---

## Phase 2: Firebase Setup e Autenticação Multi-Tenant
**Goal**: Configurar o projeto Firebase, implementar autenticação com Identity Platform e estabelecer a fundação multi-tenant.

**Requirements**: FIRE-01, FIRE-02, FIRE-03, FIRE-04

**Success Criteria**:
1. Projeto Firebase criado com Auth, Firestore, Storage e Cloud Functions habilitados
2. Usuário pode fazer login/registro e recebe um token com tenantId nos custom claims
3. Schema Firestore multi-tenant definido e documentado (/tenants/{tenantId}/...)
4. Security Rules testadas no Firebase Emulator — tenant A não acessa dados do tenant B
5. Firebase Local Emulator Suite configurado para desenvolvimento

**UI hint**: no

---

## Phase 3: Migração de Dados — Supabase → Firestore
**Goal**: Migrar todos os módulos de dados do Supabase para Firestore, feature por feature, usando a camada de abstração de hooks.

**Requirements**: FIRE-05, FIRE-06, FIRE-07, FIRE-08, FIRE-09, FIRE-10, FIRE-11, FIRE-12, FIRE-13

**Success Criteria**:
1. Todos os hooks de dados (useOrders, useClients, etc.) funcionam com Firestore
2. Upload de arquivos funciona via Firebase Storage
3. Cloud Functions implementadas para triggers críticos (ex: notificação ao atribuir OS)
4. Nenhuma referência ao Supabase SDK no codebase
5. Real-time listeners funcionam para ordens de serviço e chat

**UI hint**: no

---

## Phase 4: Design System — Fundação
**Goal**: Criar o novo Design System com tokens, componentes base shadcn/ui e sistema de temas.

**Requirements**: DS-01, DS-02, DS-03, DS-04

**Success Criteria**:
1. Design tokens definidos em CSS variables (cores, tipografia, espaçamento, sombras)
2. shadcn/ui instalado com pelo menos 10 componentes base configurados
3. Tema light e dark mode funciona via toggle com persistência
4. Componentes base renderizam corretamente e são acessíveis (keyboard nav, ARIA)

**UI hint**: yes

---

## Phase 5: Design System — Aplicação nos Layouts e Páginas
**Goal**: Redesenhar os 3 layouts (Admin, Mobile, Cliente) e aplicar o novo design em todas as páginas existentes.

**Requirements**: DS-05, DS-06, DS-07, DS-08

**Success Criteria**:
1. Layout Admin tem sidebar colapsável, navegação moderna e breadcrumbs
2. Layout Mobile é touch-friendly com bottom navigation e gestos
3. Layout Cliente é clean, profissional e responsivo
4. Todas as 33+ páginas usam componentes do novo Design System (zero Tailwind CDN classes)
5. Responsividade verificada em mobile, tablet e desktop

**UI hint**: yes

---

## Phase 6: Multi-Tenancy — Registro e RBAC
**Goal**: Implementar o fluxo completo de registro de empresa, convite de membros e controle de acesso por role.

**Requirements**: MT-01, MT-02, MT-03, MT-04

**Success Criteria**:
1. Nova empresa pode se registrar e receber seu tenant isolado
2. Admin pode convidar técnicos e gestores via email
3. Permissões por role funcionam (técnico não acessa relatórios financeiros, etc.)
4. Dados de teste com 2+ tenants demonstram isolamento total

**UI hint**: yes

---

## Phase 7: Quality Assurance
**Goal**: Estabelecer a camada de testes automatizados para os fluxos críticos.

**Requirements**: QA-01, QA-02, QA-03

**Success Criteria**:
1. Vitest configurado com coverage report
2. Testes unitários cobrindo hooks de auth, orders e clients (>80% branch coverage)
3. Playwright configurado com pelo menos 5 testes E2E (login, criar OS, listar clientes, orçamento, multi-tenant isolation)
4. CI pipeline roda testes no push

**UI hint**: no

---

## Phase Summary

| # | Phase | Goal | Requirements | Success Criteria |
|---|-------|------|-------------|-----------------|
| 1 | Reestruturação do Codebase | Feature-based architecture + deps | ARCH-01..05 | 5 |
| 2 | Firebase Setup e Auth | Firebase + auth multi-tenant | FIRE-01..04 | 5 |
| 3 | Migração de Dados | Supabase → Firestore completo | FIRE-05..13 | 5 |
| 4 | Design System — Fundação | Tokens + componentes base | DS-01..04 | 4 |
| 5 | Design System — Aplicação | Redesign layouts + páginas | DS-05..08 | 5 |
| 6 | Multi-Tenancy | Registro + RBAC | MT-01..04 | 4 |
| 7 | Quality Assurance | Testes unit + E2E | QA-01..03 | 4 |
