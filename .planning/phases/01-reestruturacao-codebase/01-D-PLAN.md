---
plan_id: 01-D
title: "Configurar providers globais (QueryClient, Zustand) e atualizar App.tsx"
wave: 3
depends_on: [01-A, 01-B, 01-C]
files_modified:
  - src/app/providers.tsx
  - src/app/router.tsx
  - App.tsx
  - contexts/AppContext.tsx
  - contexts/ToastContext.tsx
  - contexts/DashboardThemeContext.tsx
requirements:
  - ARCH-02
  - ARCH-04
autonomous: true
---

# Plan 01-D: Configurar Providers Globais e Atualizar App.tsx

## Objective
Criar o arquivo de providers centralizados (QueryClientProvider, stores Zustand), mover contexts para src/, e reestruturar App.tsx para usar a nova arquitetura.

## Tasks

<task id="01D-1">
<title>Criar providers centralizados</title>
<read_first>
- App.tsx (ver providers atuais e wrappers)
- contexts/AppContext.tsx (ver o que o AppContext fornece)
- contexts/ToastContext.tsx
- contexts/DashboardThemeContext.tsx
</read_first>
<action>
Criar `src/app/providers.tsx`:
```typescript
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { ReactNode, useState } from 'react'
import { ToastProvider } from '@/shared/contexts/ToastContext'

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // 5 minutos
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
})

interface ProvidersProps {
  children: ReactNode
}

export function Providers({ children }: ProvidersProps) {
  return (
    <QueryClientProvider client={queryClient}>
      <ToastProvider>
        {children}
      </ToastProvider>
    </QueryClientProvider>
  )
}
```

Mover contexts para src/shared/contexts/:
| Origem | Destino |
|---|---|
| contexts/AppContext.tsx | src/shared/contexts/AppContext.tsx |
| contexts/ToastContext.tsx | src/shared/contexts/ToastContext.tsx |
| contexts/DashboardThemeContext.tsx | src/shared/contexts/DashboardThemeContext.tsx |

Deletar diretório contexts/ (raiz) após migração.
</action>
<acceptance_criteria>
- src/app/providers.tsx existe
- src/app/providers.tsx contém "QueryClientProvider"
- src/shared/contexts/AppContext.tsx existe
- src/shared/contexts/ToastContext.tsx existe
- Diretório contexts/ (raiz) NÃO existe mais
</acceptance_criteria>
</task>

<task id="01D-2">
<title>Reestruturar App.tsx</title>
<read_first>
- App.tsx (ver estrutura completa de routing e layouts)
- src/app/providers.tsx (novo providers)
- src/layouts/AdminLayout.tsx (novo path)
- src/layouts/MobileLayout.tsx (novo path)
- src/layouts/ClientLayout.tsx (novo path)
</read_first>
<action>
Reescrever App.tsx para usar a nova estrutura:

1. Substituir imports antigos por novos paths com alias @/:
   - `import { Layout } from './components/Layout'` → `import { AdminLayout } from '@/layouts/AdminLayout'`
   - `import { MobileLayout } from './components/MobileLayout'` → `import { MobileLayout } from '@/layouts/MobileLayout'`
   - `import { ClientLayout } from './components/ClientLayout'` → `import { ClientLayout } from '@/layouts/ClientLayout'`

2. Envolver a app com Providers:
```typescript
import { Providers } from '@/app/providers'

function App() {
  return (
    <Providers>
      {/* existing routing logic */}
    </Providers>
  )
}
```

3. Atualizar TODOS os imports de componentes para usar os novos paths @/features/...

4. Importar globals.css:
```typescript
import '@/styles/globals.css'
```
</action>
<acceptance_criteria>
- App.tsx contém "import { Providers }" ou "import { Providers } from '@/app/providers'"
- App.tsx contém "import '@/styles/globals.css'"
- App.tsx NÃO contém imports de './components/' (paths raiz antigos)
- App.tsx NÃO contém imports de './contexts/' (paths raiz antigos)
</acceptance_criteria>
</task>

<task id="01D-3">
<title>Atualizar todos os import paths quebrados no codebase</title>
<read_first>
- (executar grep para encontrar imports antigos)
</read_first>
<action>
Buscar e substituir TODOS os imports que referenciam paths antigos:

```bash
# Encontrar imports quebrados
grep -rn "from '\.\./components/" src/ --include="*.tsx" --include="*.ts"
grep -rn "from '\.\./contexts/" src/ --include="*.tsx" --include="*.ts"
grep -rn "from '\.\./hooks/" src/ --include="*.tsx" --include="*.ts"
grep -rn "from '\.\./types/" src/ --include="*.tsx" --include="*.ts"
grep -rn "from '\.\./utils/" src/ --include="*.tsx" --include="*.ts"
```

Para cada match, atualizar para o novo path usando alias @/:
- `../components/Modal` → `@/shared/components/Modal`
- `../contexts/AppContext` → `@/shared/contexts/AppContext`
- `../types/order` → `@/features/orders/types`
- etc.

Criar um map de redirecionamento:
| Path antigo (padrão) | Novo path |
|---|---|
| */components/Layout | @/layouts/AdminLayout |
| */components/MobileLayout | @/layouts/MobileLayout |
| */components/ClientLayout | @/layouts/ClientLayout |
| */components/Modal | @/shared/components/Modal |
| */components/ConfirmDialog | @/shared/components/ConfirmDialog |
| */contexts/AppContext | @/shared/contexts/AppContext |
| */contexts/ToastContext | @/shared/contexts/ToastContext |
| */types/* | @/features/*/types |
</action>
<acceptance_criteria>
- `grep -r "from '\.\./components/" src/` retorna 0 matches
- `grep -r "from '\.\./contexts/" src/` retorna 0 matches
- `grep -r "from '\.\./types/" src/` retorna 0 matches
- `npm run build` completa sem erros de import
</acceptance_criteria>
</task>

## Verification
```bash
npm run build
npm run dev
```
A aplicação deve compilar sem erros. O `npm run dev` deve abrir sem crash no browser.

## must_haves
- QueryClientProvider configurado como wrapper global
- Todos os imports atualizados para paths @/
- Zero referências a diretórios raiz antigos (components/, contexts/, hooks/, types/, utils/)
- App roda sem erros
