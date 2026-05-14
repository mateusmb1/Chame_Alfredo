---
plan_id: 01-B
title: "Criar estrutura feature-based e mover tipos"
wave: 1
depends_on: []
files_modified:
  - src/features/auth/types.ts
  - src/features/orders/types.ts
  - src/features/clients/types.ts
  - src/features/quotes/types.ts
  - src/features/invoices/types.ts
  - src/features/inventory/types.ts
  - src/features/team/types.ts
  - src/features/projects/types.ts
  - src/features/contracts/types.ts
  - src/features/communication/types.ts
  - src/features/agenda/types.ts
  - src/shared/types/index.ts
requirements:
  - ARCH-01
  - ARCH-03
autonomous: true
---

# Plan 01-B: Criar Estrutura Feature-Based e Mover Tipos

## Objective
Criar a árvore de diretórios feature-based dentro de src/ e migrar os 11 arquivos de tipos do diretório raiz `types/` para seus respectivos módulos de domínio.

## Tasks

<task id="01B-1">
<title>Criar árvore de diretórios feature-based</title>
<read_first>
- (nenhum — criação pura)
</read_first>
<action>
Criar a seguinte estrutura de diretórios:
```
src/
  features/
    auth/
      components/
      hooks/
      types.ts
    dashboard/
      components/
      hooks/
    orders/
      components/
      hooks/
      types.ts
    clients/
      components/
      hooks/
      types.ts
    quotes/
      components/
      hooks/
      types.ts
    invoices/
      components/
      hooks/
      types.ts
    inventory/
      components/
      hooks/
      types.ts
    team/
      components/
      hooks/
      types.ts
    projects/
      components/
      hooks/
      types.ts
    contracts/
      components/
      hooks/
      types.ts
    communication/
      components/
      hooks/
      types.ts
    agenda/
      components/
      hooks/
      types.ts
    reports/
      components/
      hooks/
    settings/
      components/
      hooks/
    leads/
      components/
      hooks/
      types.ts
  shared/
    components/
    hooks/
    lib/
    types/
    utils/
  layouts/
  styles/
```

Criar cada diretório com `mkdir -p` ou equivalente. Para diretórios vazios, criar um `.gitkeep`.
</action>
<acceptance_criteria>
- Diretório src/features/ existe
- Diretório src/features/orders/ existe com subdiretórios components/ e hooks/
- Diretório src/features/clients/ existe com subdiretórios components/ e hooks/
- Diretório src/shared/components/ existe
- Diretório src/shared/lib/ existe
- Diretório src/layouts/ existe
- Pelo menos 15 diretórios criados dentro de src/features/
</acceptance_criteria>
</task>

<task id="01B-2">
<title>Migrar arquivos de tipos para módulos de domínio</title>
<read_first>
- types/order.ts
- types/client.ts
- types/quote.ts
- types/invoice.ts
- types/inventory.ts
- types/technician.ts
- types/project.ts
- types/contract.ts
- types/communication.ts
- types/appointment.ts
- types/productService.ts
</read_first>
<action>
Mover cada arquivo de tipo para seu módulo de domínio:

| Origem (raiz) | Destino (feature) |
|---|---|
| types/order.ts | src/features/orders/types.ts |
| types/client.ts | src/features/clients/types.ts |
| types/quote.ts | src/features/quotes/types.ts |
| types/invoice.ts | src/features/invoices/types.ts |
| types/inventory.ts | src/features/inventory/types.ts |
| types/technician.ts | src/features/team/types.ts |
| types/project.ts | src/features/projects/types.ts |
| types/contract.ts | src/features/contracts/types.ts |
| types/communication.ts | src/features/communication/types.ts |
| types/appointment.ts | src/features/agenda/types.ts |
| types/productService.ts | src/features/inventory/productService.types.ts |

Criar `src/shared/types/index.ts` com re-exports de todos os tipos para manter compatibilidade:
```typescript
// Re-exports para backward compatibility durante migração
export * from '@/features/orders/types'
export * from '@/features/clients/types'
export * from '@/features/quotes/types'
export * from '@/features/invoices/types'
export * from '@/features/inventory/types'
export * from '@/features/team/types'
export * from '@/features/projects/types'
export * from '@/features/contracts/types'
export * from '@/features/communication/types'
export * from '@/features/agenda/types'
```
</action>
<acceptance_criteria>
- src/features/orders/types.ts existe e contém interfaces de Order
- src/features/clients/types.ts existe e contém interface Client
- src/features/team/types.ts existe e contém interface Technician
- src/shared/types/index.ts existe e re-exporta de pelo menos 8 features
- Diretório types/ (raiz) pode ser removido após verificar que não há imports quebrados
</acceptance_criteria>
</task>

## Verification
```bash
npx tsc --noEmit 2>&1 | head -20
```
Verificar que os tipos são acessíveis via `@/features/*/types` e via `@/shared/types/index`.

## must_haves
- Todos os 11 arquivos de tipos migrados para seus módulos
- Re-exports funcionando para backward compatibility
- Estrutura feature-based criada com pelo menos 15 feature modules
