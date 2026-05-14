---
plan_id: 01-E
title: "Criar camada de abstração de dados (hooks de serviço)"
wave: 3
depends_on: [01-A, 01-B]
files_modified:
  - src/shared/lib/cn.ts
  - src/features/orders/hooks/useOrders.ts
  - src/features/clients/hooks/useClients.ts
  - src/features/quotes/hooks/useQuotes.ts
  - src/features/invoices/hooks/useInvoices.ts
  - src/features/inventory/hooks/useInventory.ts
  - src/features/team/hooks/useTeam.ts
  - src/features/projects/hooks/useProjects.ts
  - src/features/contracts/hooks/useContracts.ts
  - src/features/communication/hooks/useCommunication.ts
  - src/features/agenda/hooks/useAgenda.ts
requirements:
  - ARCH-02
autonomous: true
---

# Plan 01-E: Criar Camada de Abstração de Dados

## Objective
Criar hooks de serviço que abstraem o acesso a dados. Esses hooks serão o ponto único de acesso entre UI e backend, permitindo trocar de Supabase para Firebase na Phase 3 sem alterar componentes.

## Tasks

<task id="01E-1">
<title>Criar utilitário cn() para shadcn/ui</title>
<read_first>
- (nenhum — arquivo novo)
</read_first>
<action>
Criar `src/shared/lib/cn.ts`:
```typescript
import { type ClassValue, clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}
```

Este utilitário será usado por todos os componentes shadcn/ui para merge de classes Tailwind.
</action>
<acceptance_criteria>
- src/shared/lib/cn.ts existe
- src/shared/lib/cn.ts exporta função `cn`
- src/shared/lib/cn.ts importa de 'clsx' e 'tailwind-merge'
</acceptance_criteria>
</task>

<task id="01E-2">
<title>Criar hooks de abstração por feature module</title>
<read_first>
- contexts/AppContext.tsx (ver como os dados são geridos atualmente — é um Context monolítico)
- src/features/orders/types.ts
- src/features/clients/types.ts
</read_first>
<action>
Criar hooks stub para cada feature module. Os hooks encapsulam a lógica de acesso a dados que atualmente vive dentro do AppContext monolítico. Na Phase 2-3, o interior desses hooks será trocado para Firebase.

**src/features/orders/hooks/useOrders.ts:**
```typescript
/**
 * Hook de abstração para acesso a dados de Ordens de Serviço.
 * Atualmente delega para AppContext. Na Phase 3, migrará para Firebase/TanStack Query.
 */
import { useAppContext } from '@/shared/contexts/AppContext'

export function useOrders() {
  const ctx = useAppContext()
  return {
    orders: ctx.orders,
    addOrder: ctx.addOrder,
    updateOrder: ctx.updateOrder,
    deleteOrder: ctx.deleteOrder,
    isLoading: false,
  }
}
```

Criar hooks análogos para:
- `src/features/clients/hooks/useClients.ts` → clients, addClient, updateClient, deleteClient
- `src/features/quotes/hooks/useQuotes.ts` → quotes, addQuote, updateQuote, deleteQuote
- `src/features/invoices/hooks/useInvoices.ts` → invoices, addInvoice, updateInvoice, deleteInvoice
- `src/features/inventory/hooks/useInventory.ts` → inventory, addProduct, updateProduct, deleteProduct
- `src/features/team/hooks/useTeam.ts` → technicians, addTechnician, updateTechnician, deleteTechnician
- `src/features/projects/hooks/useProjects.ts` → projects, addProject, updateProject, deleteProject
- `src/features/contracts/hooks/useContracts.ts` → contracts, addContract, updateContract, deleteContract
- `src/features/communication/hooks/useCommunication.ts` → communications, addMessage
- `src/features/agenda/hooks/useAgenda.ts` → appointments, addAppointment, updateAppointment, deleteAppointment

Cada hook deve:
1. Importar useAppContext
2. Extrair os dados e funções relevantes
3. Retornar um objeto com interface limpa
4. Incluir `isLoading: false` (será `true` com TanStack Query na Phase 3)
</action>
<acceptance_criteria>
- src/features/orders/hooks/useOrders.ts existe e exporta useOrders
- src/features/clients/hooks/useClients.ts existe e exporta useClients
- src/features/quotes/hooks/useQuotes.ts existe e exporta useQuotes
- src/features/invoices/hooks/useInvoices.ts existe e exporta useInvoices
- src/features/inventory/hooks/useInventory.ts existe e exporta useInventory
- src/features/team/hooks/useTeam.ts existe e exporta useTeam
- src/features/projects/hooks/useProjects.ts existe e exporta useProjects
- src/features/contracts/hooks/useContracts.ts existe e exporta useContracts
- src/features/agenda/hooks/useAgenda.ts existe e exporta useAgenda
- Todos os hooks importam de '@/shared/contexts/AppContext'
</acceptance_criteria>
</task>

## Verification
```bash
npx tsc --noEmit
```
Todos os hooks devem compilar sem erros de tipo.

## must_haves
- Utilitário cn() criado e funcional
- Hooks de abstração para todos os 9+ feature modules
- Cada hook delega para AppContext (futuro: Firebase)
- Interface de retorno limpa com isLoading
