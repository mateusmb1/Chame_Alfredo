---
plan_id: 01-C
title: "Migrar componentes e hooks dos diretórios raiz para features"
wave: 2
depends_on: [01-B]
files_modified:
  - src/features/orders/components/ServiceOrderReport.tsx
  - src/features/orders/components/OrderItemSelector.tsx
  - src/features/quotes/components/QuoteForm.tsx
  - src/features/projects/components/ProjectForm.tsx
  - src/features/projects/components/ProjectProgressBar.tsx
  - src/features/projects/components/ProjectStatusBadge.tsx
  - src/features/projects/components/ProjectTypeIcon.tsx
  - src/features/leads/components/LeadFormModal.tsx
  - src/features/leads/hooks/useLeadCapture.ts
  - src/features/agenda/components/AppointmentModal.tsx
  - src/features/dashboard/components/ResponsiveDashboard.tsx
  - src/features/dashboard/components/MetricCard.tsx
  - src/shared/components/Modal.tsx
  - src/shared/components/ConfirmDialog.tsx
  - src/shared/components/CurrencyInput.tsx
  - src/shared/components/BrandLogo.tsx
  - src/shared/components/Mascot.tsx
  - src/shared/components/ErrorBoundary.tsx
  - src/shared/components/ResponsiveTable.tsx
  - src/shared/components/ServiceCard.tsx
  - src/shared/components/SignaturePad.tsx
  - src/shared/components/DataImportModal.tsx
  - src/shared/components/ImportPreviewTable.tsx
  - src/shared/utils/csvImporters.ts
  - src/layouts/AdminLayout.tsx
  - src/layouts/MobileLayout.tsx
  - src/layouts/ClientLayout.tsx
requirements:
  - ARCH-01
  - ARCH-03
autonomous: true
---

# Plan 01-C: Migrar Componentes e Hooks para Features

## Objective
Mover todos os componentes do diretório raiz `components/` e `hooks/` para seus módulos feature-based ou para `shared/`, e os layouts para `src/layouts/`. Atualizar todos os import paths.

## Tasks

<task id="01C-1">
<title>Mover componentes domain-specific para features</title>
<read_first>
- components/ServiceOrderReport.tsx
- components/OrderItemSelector.tsx
- components/QuoteForm.tsx
- components/ProjectForm.tsx
- components/AppointmentModal.tsx
- components/ResponsiveDashboard.tsx
- components/MetricCard.tsx
</read_first>
<action>
Mover cada componente para sua feature correspondente:

| Origem | Destino | Razão |
|---|---|---|
| components/ServiceOrderReport.tsx | src/features/orders/components/ | Domain: ordens |
| components/OrderItemSelector.tsx | src/features/orders/components/ | Domain: ordens |
| components/QuoteForm.tsx | src/features/quotes/components/ | Domain: orçamentos |
| components/ProjectForm.tsx | src/features/projects/components/ | Domain: projetos |
| components/ProjectProgressBar.tsx | src/features/projects/components/ | Domain: projetos |
| components/ProjectStatusBadge.tsx | src/features/projects/components/ | Domain: projetos |
| components/ProjectTypeIcon.tsx | src/features/projects/components/ | Domain: projetos |
| components/LeadFormModal.tsx | src/features/leads/components/ | Domain: leads |
| components/AppointmentModal.tsx | src/features/agenda/components/ | Domain: agenda |
| components/ResponsiveDashboard.tsx | src/features/dashboard/components/ | Domain: dashboard |
| components/MetricCard.tsx | src/features/dashboard/components/ | Domain: dashboard |
| components/ServiceCard.tsx | src/shared/components/ | Reutilizável |

Atualizar imports em cada arquivo movido para usar `@/` alias.
</action>
<acceptance_criteria>
- src/features/orders/components/ServiceOrderReport.tsx existe
- src/features/orders/components/OrderItemSelector.tsx existe
- src/features/quotes/components/QuoteForm.tsx existe
- src/features/projects/components/ProjectForm.tsx existe
- src/features/agenda/components/AppointmentModal.tsx existe
- src/features/dashboard/components/ResponsiveDashboard.tsx existe
</acceptance_criteria>
</task>

<task id="01C-2">
<title>Mover componentes shared e layouts</title>
<read_first>
- components/Modal.tsx
- components/ConfirmDialog.tsx
- components/Layout.tsx
- components/MobileLayout.tsx
- components/ClientLayout.tsx
</read_first>
<action>
Componentes reutilizáveis → src/shared/components/:
| Origem | Destino |
|---|---|
| components/Modal.tsx | src/shared/components/ |
| components/ConfirmDialog.tsx | src/shared/components/ |
| components/CurrencyInput.tsx | src/shared/components/ |
| components/BrandLogo.tsx | src/shared/components/ |
| components/Mascot.tsx | src/shared/components/ |
| components/ErrorBoundary.tsx | src/shared/components/ |
| components/ResponsiveTable.tsx | src/shared/components/ |
| components/SignaturePad.tsx | src/shared/components/ |
| components/DataImportModal.tsx | src/shared/components/ |
| components/ImportPreviewTable.tsx | src/shared/components/ |

Layouts → src/layouts/:
| Origem | Destino |
|---|---|
| components/Layout.tsx | src/layouts/AdminLayout.tsx |
| components/MobileLayout.tsx | src/layouts/MobileLayout.tsx |
| components/ClientLayout.tsx | src/layouts/ClientLayout.tsx |

Utilitários → src/shared/utils/:
| Origem | Destino |
|---|---|
| utils/csvImporters.ts | src/shared/utils/ |
</action>
<acceptance_criteria>
- src/shared/components/Modal.tsx existe
- src/shared/components/ErrorBoundary.tsx existe
- src/layouts/AdminLayout.tsx existe
- src/layouts/MobileLayout.tsx existe
- src/layouts/ClientLayout.tsx existe
- src/shared/utils/csvImporters.ts existe
</acceptance_criteria>
</task>

<task id="01C-3">
<title>Mover hooks e componentes duplicados de src/</title>
<read_first>
- hooks/useLeadCapture.ts (raiz)
- src/hooks/useLeadCapture.ts (duplicado em src)
- src/hooks/useLeadDetail.ts
- src/hooks/useLeadsList.ts
- src/hooks/useResponsive.ts
- src/components/LeadFormModal.tsx
- src/pages/LeadConfirmation.tsx
- src/pages/LeadsDashboard.tsx
- src/constants/categories.ts
</read_first>
<action>
Resolver duplicações e mover para feature modules:

| Origem | Destino | Nota |
|---|---|---|
| src/hooks/useLeadCapture.ts | src/features/leads/hooks/ | Versão mais recente (6046 bytes vs 5430) |
| src/hooks/useLeadDetail.ts | src/features/leads/hooks/ | |
| src/hooks/useLeadsList.ts | src/features/leads/hooks/ | |
| src/hooks/useResponsive.ts | src/shared/hooks/ | Hook genérico |
| src/components/LeadFormModal.tsx | src/features/leads/components/ | Versão src (17298 bytes) |
| src/pages/LeadConfirmation.tsx | src/features/leads/components/ | |
| src/pages/LeadsDashboard.tsx | src/features/leads/components/ | |
| src/constants/categories.ts | src/shared/constants/ | |
| hooks/useLeadCapture.ts | DELETAR | Duplicata (versão raiz mais antiga) |

Criar src/features/leads/hooks/index.ts:
```typescript
export { useLeadCapture } from './useLeadCapture'
export { useLeadDetail } from './useLeadDetail'
export { useLeadsList } from './useLeadsList'
```
</action>
<acceptance_criteria>
- src/features/leads/hooks/useLeadCapture.ts existe
- src/features/leads/hooks/useLeadDetail.ts existe
- src/features/leads/hooks/index.ts existe com 3 exports
- src/shared/hooks/useResponsive.ts existe
- hooks/useLeadCapture.ts (raiz) NÃO existe mais
- src/shared/constants/categories.ts existe
</acceptance_criteria>
</task>

<task id="01C-4">
<title>Mover dashboard e settings sub-components</title>
<read_first>
- components/dashboard/ (listar conteúdo)
- components/settings/ (listar conteúdo)
- components/layout/ (listar conteúdo)
- components/tables/ (listar conteúdo)
</read_first>
<action>
Mover os sub-diretórios:
| Origem | Destino |
|---|---|
| components/dashboard/* | src/features/dashboard/components/ |
| components/settings/* | src/features/settings/components/ |
| components/layout/* | src/layouts/components/ |
| components/tables/* | src/shared/components/tables/ |

Remover diretórios raiz após migração:
- components/ (raiz) — DELETAR
- hooks/ (raiz) — DELETAR
- utils/ (raiz) — DELETAR
- types/ (raiz) — DELETAR (já migrado em 01-B)
</action>
<acceptance_criteria>
- src/features/dashboard/components/ contém os arquivos de dashboard
- src/features/settings/components/ contém os arquivos de settings
- Diretório components/ (raiz) NÃO existe mais
- Diretório hooks/ (raiz) NÃO existe mais
- Diretório utils/ (raiz) NÃO existe mais
- Diretório types/ (raiz) NÃO existe mais
</acceptance_criteria>
</task>

## Verification
```bash
# Verificar que nenhum diretório raiz duplicado existe
ls -d components hooks utils types 2>&1 | grep "No such file"
# Verificar que features tem conteúdo
find src/features -name "*.tsx" -o -name "*.ts" | wc -l
```

## must_haves
- Zero arquivos .tsx/.ts em diretórios raiz (components/, hooks/, utils/, types/)
- Todos os componentes acessíveis em src/features/ ou src/shared/
- Layouts em src/layouts/
