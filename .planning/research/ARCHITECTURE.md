# Architecture Research — FSM SaaS Platform

## Component Architecture

### Data Layer (Firebase)
```
/tenants/{tenantId}/
  ├── profile/        → dados da empresa, plano, configurações
  ├── users/          → membros da equipe (admin, técnicos)
  ├── clients/        → clientes da empresa
  ├── orders/         → ordens de serviço
  ├── quotes/         → orçamentos
  ├── invoices/       → faturas
  ├── inventory/      → estoque/produtos
  ├── contracts/      → contratos
  ├── projects/       → projetos
  └── communications/ → mensagens internas
```

### Multi-Tenancy Strategy
- **Modelo**: Shared Database, Isolated Collections (path-based)
- **Razão**: Melhor custo-benefício, security rules simples, sem overhead de múltiplos projetos Firebase
- **Auth**: Custom claims com `tenantId` no token do usuário
- **Rules**: `allow read: if request.auth.token.tenantId == tenantId`

### Frontend Architecture (Feature-Based)
```
src/
  ├── app/              → App entry, routing, providers
  ├── features/         → Feature modules (domain-driven)
  │   ├── auth/         → Login, registro, guards
  │   ├── dashboard/    → Dashboard e métricas
  │   ├── orders/       → Ordens de serviço
  │   ├── clients/      → Gestão de clientes
  │   ├── inventory/    → Estoque
  │   ├── quotes/       → Orçamentos
  │   ├── invoices/     → Faturas
  │   ├── team/         → Equipe/técnicos
  │   ├── agenda/       → Calendário/agenda
  │   ├── reports/      → Relatórios
  │   ├── settings/     → Configurações
  │   └── communication/→ Chat/mensagens
  ├── shared/           → Componentes compartilhados
  │   ├── components/   → UI components (shadcn/ui based)
  │   ├── hooks/        → Custom hooks genéricos
  │   ├── lib/          → Firebase config, utils
  │   ├── types/        → TypeScript types globais
  │   └── utils/        → Funções utilitárias
  ├── layouts/          → Admin, Mobile, Client layouts
  └── styles/           → Tailwind config, design tokens
```

### Data Flow
1. User action → React component
2. Component → Custom hook (useOrders, useClients, etc.)
3. Hook → Firebase SDK (via abstraction layer)
4. Firebase → Security Rules → Firestore
5. Firestore → Real-time listener → Hook → Component update

### Build Order (Dependencies)
1. Firebase setup + Auth (tudo depende disso)
2. Data layer abstraction (hooks/services)
3. Design System (componentes base)
4. Feature modules (podem ser paralelos entre si)
5. Mobile layout adaptations
6. Testing layer
