# Requirements — Chame Alfredo SaaS v1

## v1 Requirements

### Arquitetura
- [ ] **ARCH-01**: Reestruturar codebase para feature-based directory structure (src/features/*)
- [ ] **ARCH-02**: Criar camada de abstração de dados via custom hooks (useOrders, useClients, etc.)
- [ ] **ARCH-03**: Eliminar duplicação de diretórios raiz vs src/
- [ ] **ARCH-04**: Substituir Context API excessivo por Zustand para client-state e TanStack Query para server-state
- [ ] **ARCH-05**: Instalar e configurar Tailwind CSS via npm (remover CDN)

### Firebase
- [ ] **FIRE-01**: Configurar projeto Firebase (Auth, Firestore, Storage, Cloud Functions)
- [ ] **FIRE-02**: Implementar autenticação Firebase com multi-tenancy (Identity Platform + custom claims)
- [ ] **FIRE-03**: Definir schema Firestore multi-tenant (/tenants/{tenantId}/...)
- [ ] **FIRE-04**: Implementar Security Rules com verificação de tenantId via custom claims
- [ ] **FIRE-05**: Migrar dados de ordens de serviço para Firestore
- [ ] **FIRE-06**: Migrar dados de clientes para Firestore
- [ ] **FIRE-07**: Migrar dados de orçamentos e faturas para Firestore
- [ ] **FIRE-08**: Migrar dados de estoque/inventário para Firestore
- [ ] **FIRE-09**: Migrar dados de equipe/técnicos para Firestore
- [ ] **FIRE-10**: Migrar dados de contratos e projetos para Firestore
- [ ] **FIRE-11**: Migrar dados de comunicação/chat para Firestore
- [ ] **FIRE-12**: Configurar Firebase Storage para uploads (fotos, documentos)
- [ ] **FIRE-13**: Implementar Cloud Functions para lógica server-side (ex: triggers de notificação)

### Design System
- [ ] **DS-01**: Definir design tokens (cores, tipografia, espaçamento, sombras, border-radius)
- [ ] **DS-02**: Instalar e configurar shadcn/ui com Radix UI
- [ ] **DS-03**: Criar componentes base (Button, Input, Card, Modal, Table, Badge, Toast)
- [ ] **DS-04**: Implementar sistema de temas (light/dark mode) via CSS variables
- [ ] **DS-05**: Redesenhar Layout Admin com sidebar colapsável e navegação moderna
- [ ] **DS-06**: Redesenhar Layout Mobile (técnico) responsivo e touch-friendly
- [ ] **DS-07**: Redesenhar Layout Cliente clean e profissional
- [ ] **DS-08**: Aplicar novo design em todas as páginas existentes

### Multi-Tenancy
- [ ] **MT-01**: Implementar registro de empresa (tenant provisioning)
- [ ] **MT-02**: Implementar convite de membros à equipe
- [ ] **MT-03**: Implementar RBAC (Admin, Gestor, Técnico, Cliente) por tenant
- [ ] **MT-04**: Garantir isolamento total de dados entre tenants

### Qualidade
- [ ] **QA-01**: Configurar Vitest para testes unitários
- [ ] **QA-02**: Escrever testes para hooks de dados críticos (orders, clients, auth)
- [ ] **QA-03**: Configurar Playwright para E2E dos fluxos críticos

## v2 Requirements (Deferred)

- Configuração por segmento de negócio (templates, campos customizáveis, terminologia)
- Sistema de planos e assinaturas com billing
- Gateway de pagamento
- Relatórios avançados com KPIs (MTTR, taxa de resolução)
- Funcionalidade offline completa para app do técnico
- Notificações push
- Integração com Google Calendar
- Landing page SaaS (marketing)

## Out of Scope

- App nativo iOS/Android — PWA mobile-first é suficiente
- IA/ML para otimização — requer volume de dados
- Marketplace de serviços — muda o modelo de negócio
- Integração com ERPs externos — complexidade prematura
- Internacionalização (i18n) — foco no mercado brasileiro

## Traceability

| REQ-ID | Phase | Status |
|--------|-------|--------|
| ARCH-01 | Phase 1 | ⬜ |
| ARCH-02 | Phase 1 | ⬜ |
| ARCH-03 | Phase 1 | ⬜ |
| ARCH-04 | Phase 1 | ⬜ |
| ARCH-05 | Phase 1 | ⬜ |
| FIRE-01 | Phase 2 | ⬜ |
| FIRE-02 | Phase 2 | ⬜ |
| FIRE-03 | Phase 2 | ⬜ |
| FIRE-04 | Phase 2 | ⬜ |
| FIRE-05 | Phase 3 | ⬜ |
| FIRE-06 | Phase 3 | ⬜ |
| FIRE-07 | Phase 3 | ⬜ |
| FIRE-08 | Phase 3 | ⬜ |
| FIRE-09 | Phase 3 | ⬜ |
| FIRE-10 | Phase 3 | ⬜ |
| FIRE-11 | Phase 3 | ⬜ |
| FIRE-12 | Phase 3 | ⬜ |
| FIRE-13 | Phase 3 | ⬜ |
| DS-01 | Phase 4 | ⬜ |
| DS-02 | Phase 4 | ⬜ |
| DS-03 | Phase 4 | ⬜ |
| DS-04 | Phase 4 | ⬜ |
| DS-05 | Phase 5 | ⬜ |
| DS-06 | Phase 5 | ⬜ |
| DS-07 | Phase 5 | ⬜ |
| DS-08 | Phase 5 | ⬜ |
| MT-01 | Phase 6 | ⬜ |
| MT-02 | Phase 6 | ⬜ |
| MT-03 | Phase 6 | ⬜ |
| MT-04 | Phase 6 | ⬜ |
| QA-01 | Phase 7 | ⬜ |
| QA-02 | Phase 7 | ⬜ |
| QA-03 | Phase 7 | ⬜ |
