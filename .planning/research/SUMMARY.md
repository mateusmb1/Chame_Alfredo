# Research Summary — Chame Alfredo SaaS Refactoring

## Stack Consensus
- **Manter**: React 19 + TypeScript + Vite (stack frontend sólido)
- **Adicionar**: shadcn/ui, TanStack Query, Zustand, React Hook Form + Zod, Vitest
- **Migrar**: Supabase → Firebase (Auth, Firestore, Storage, Cloud Functions)
- **Corrigir**: Tailwind CDN → Tailwind npm com design tokens

## Table Stakes (Must-Have para SaaS)
- Multi-tenancy com isolamento total de dados
- Autenticação por empresa com RBAC
- CRUD de OS, clientes, orçamentos, faturas, estoque
- App mobile-first para técnicos
- Portal do cliente

## Critical Pitfalls
1. **NÃO** mapear tabelas SQL → collections 1:1 (denormalizar)
2. **NÃO** migrar tudo de uma vez (feature por feature)
3. **NÃO** confiar em tenantId do client (usar custom claims)
4. **DEFINIR** multi-tenancy ANTES de migrar dados
5. **CRIAR** camada de abstração (hooks) entre UI e Firebase

## Architecture Direction
- Feature-based directory structure (Domain-Driven)
- Path-based multi-tenancy: `/tenants/{tenantId}/...`
- Custom claims para tenant isolation via Auth
- Abstraction layer via custom hooks (permite trocar backend)

## Build Order Recomendado
1. Reestruturar codebase (feature-based)
2. Firebase setup + Auth multi-tenant
3. Design System (shadcn/ui + tokens)
4. Migrar features individualmente
5. Mobile PWA adaptations
6. Testing layer
