---
plan_id: 01-A
title: "Instalar dependências e configurar Tailwind CSS via npm"
wave: 1
depends_on: []
files_modified:
  - package.json
  - tailwind.config.ts
  - postcss.config.js
  - src/styles/globals.css
  - index.html
  - vite.config.ts
requirements:
  - ARCH-05
autonomous: true
---

# Plan 01-A: Instalar Dependências e Configurar Tailwind via npm

## Objective
Instalar todas as novas dependências do projeto (Tailwind CSS, shadcn/ui prerequisites, TanStack Query, Zustand, React Hook Form, Zod) e remover o Tailwind CDN do index.html.

## Tasks

<task id="01A-1">
<title>Instalar dependências npm</title>
<read_first>
- package.json (ver dependências atuais)
</read_first>
<action>
Executar no terminal:
```bash
npm install tailwindcss @tailwindcss/vite postcss autoprefixer
npm install @tanstack/react-query zustand react-hook-form @hookform/resolvers zod
npm install class-variance-authority clsx tailwind-merge
npm install -D @types/node
```

Essas dependências adicionam:
- tailwindcss + @tailwindcss/vite: Tailwind CSS via build system
- @tanstack/react-query: Server-state management
- zustand: Client-state management
- react-hook-form + @hookform/resolvers + zod: Formulários com validação
- class-variance-authority + clsx + tailwind-merge: Utilitários para shadcn/ui
</action>
<acceptance_criteria>
- package.json contém "tailwindcss" em dependencies ou devDependencies
- package.json contém "@tanstack/react-query" em dependencies
- package.json contém "zustand" em dependencies
- package.json contém "react-hook-form" em dependencies
- package.json contém "zod" em dependencies
- `npm ls tailwindcss` não retorna erro
</acceptance_criteria>
</task>

<task id="01A-2">
<title>Criar configuração Tailwind CSS</title>
<read_first>
- index.html (ver configuração atual do Tailwind CDN, especialmente cores customizadas)
</read_first>
<action>
Criar `tailwind.config.ts` na raiz:
```typescript
import type { Config } from 'tailwindcss'

const config: Config = {
  darkMode: 'class',
  content: [
    './index.html',
    './src/**/*.{ts,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        primary: '#135bec',
        'background-light': '#f6f6f8',
        'background-dark': '#101622',
        'card-light': '#ffffff',
        'card-dark': '#1a2230',
        'status-pending': '#F5A623',
        'status-progress': '#4A90E2',
        'status-completed': '#7ED321',
        'status-canceled': '#D0021B',
      },
      fontFamily: {
        display: ['Inter', 'sans-serif'],
      },
    },
  },
  plugins: [],
}

export default config
```

Criar `postcss.config.js`:
```javascript
export default {
  plugins: {
    tailwindcss: {},
    autoprefixer: {},
  },
}
```
</action>
<acceptance_criteria>
- Arquivo tailwind.config.ts existe na raiz
- tailwind.config.ts contém "darkMode: 'class'"
- tailwind.config.ts contém a cor primary '#135bec'
- postcss.config.js existe na raiz
</acceptance_criteria>
</task>

<task id="01A-3">
<title>Criar arquivo de estilos globais e atualizar Vite config</title>
<read_first>
- index.html (copiar estilos CSS inline para o novo arquivo)
- vite.config.ts (ver configuração atual)
</read_first>
<action>
Criar `src/styles/globals.css`:
```css
@tailwind base;
@tailwind components;
@tailwind utilities;

/* Design tokens como CSS variables */
:root {
  --sidebar-width: 280px;
  --sidebar-collapsed-width: 80px;
  --topbar-height: 64px;
  --density-padding: 1rem;
}

[data-dashboard-theme="commandCenter"] {
  --density-padding: 0.75rem;
  --background-light: #f8fafc;
  --background-dark: #0f172a;
}

/* Command Center scrollbar */
[data-dashboard-theme="commandCenter"] .custom-scrollbar::-webkit-scrollbar {
  width: 4px;
  height: 4px;
}
[data-dashboard-theme="commandCenter"] .custom-scrollbar::-webkit-scrollbar-thumb {
  background: #cbd5e1;
  border-radius: 10px;
}
[data-dashboard-theme="commandCenter"] .custom-scrollbar::-webkit-scrollbar-track {
  background: transparent;
}

/* Animation tokens */
.animate-in {
  animation-duration: 400ms;
  animation-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
  animation-fill-mode: both;
}

body {
  font-family: 'Inter', sans-serif;
  transition: background-color 0.3s ease;
}

html, body {
  overflow-x: hidden;
  max-width: 100vw;
}

#root {
  max-width: 100vw;
  overflow-x: hidden;
}

* {
  max-width: 100%;
  box-sizing: border-box;
}

/* Input visibility fix */
input, textarea, select {
  color: #0f172a !important;
}
input::placeholder, textarea::placeholder {
  color: #94a3b8 !important;
}
.dark label {
  color: #e2e8f0 !important;
}
```

Atualizar `vite.config.ts` para incluir o plugin Tailwind:
```typescript
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import path from 'path'

export default defineConfig({
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
})
```
</action>
<acceptance_criteria>
- src/styles/globals.css existe
- src/styles/globals.css contém "@tailwind base"
- vite.config.ts contém "tailwindcss" no array de plugins
- vite.config.ts contém alias '@' apontando para './src'
</acceptance_criteria>
</task>

<task id="01A-4">
<title>Limpar index.html — remover CDN e estilos inline</title>
<read_first>
- index.html
- src/styles/globals.css (confirmar que estilos foram migrados)
</read_first>
<action>
Editar index.html:
1. REMOVER a tag script do Tailwind CDN: `<script src="https://cdn.tailwindcss.com?plugins=forms,container-queries"></script>`
2. REMOVER o bloco `<script>tailwind.config = {...}</script>`
3. REMOVER o bloco `<style>` inteiro (já migrado para globals.css)
4. REMOVER o bloco `<script type="importmap">` (não necessário com Vite)
5. MANTER: meta tags, Google Fonts links, JSON-LD, body tag, e script module src

O index.html resultante deve conter apenas:
- DOCTYPE, html lang, head com metas e fonts
- Body com div#root e script module
</action>
<acceptance_criteria>
- index.html NÃO contém "cdn.tailwindcss.com"
- index.html NÃO contém "tailwind.config ="
- index.html NÃO contém "<style>"
- index.html NÃO contém "importmap"
- index.html CONTÉM "fonts.googleapis.com"
- index.html CONTÉM '<div id="root">'
</acceptance_criteria>
</task>

## Verification
```bash
npm run build
```
O build deve completar sem erros. A remoção do CDN pode quebrar estilos temporariamente — isso é esperado e será resolvido nas tarefas seguintes quando os componentes forem reorganizados.

## must_haves
- Tailwind CSS funciona via npm build pipeline
- Todas as cores customizadas preservadas na config
- CDN completamente removido
- Alias '@' configurado para imports limpos
