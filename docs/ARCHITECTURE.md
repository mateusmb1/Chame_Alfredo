# 🏗️ Arquitetura do Sistema

Este documento descreve as decisões técnicas, estrutura de pastas e padrões de design utilizados no **Chame Alfredo**.

---

## 🔧 Tech Stack

### Frontend Core
*   **Framework**: React 18 (SPA)
*   **Build Tool**: Vite (Rápido HMR e Build Otimizado)
*   **Linguagem**: TypeScript (Tipagem estrita para segurança)

### UI & UX
*   **CSS Framework**: Tailwind CSS v3/v4 (Utility-first)
*   **Ícones**: Lucide React (Consistência visual)
*   **Gráficos**: Recharts (Visualização de dados responsiva)
*   **Animações**: `tailwindcss-animate` + transições CSS nativas
*   **Notificações**: Contexto de Toast customizado

### Backend & Data (Serverless)
*   **Plataforma**: Supabase
*   **Banco de Dados**: PostgreSQL
*   **Autenticação**: Supabase Auth (Email/Senha)
*   **Realtime**: Supabase Realtime (Sincronização de Ordens/Chat)
*   **Storage**: Supabase Storage (Fotos de OS e Documentos)

---

## 📂 Estrutura de Pastas

```bash
/src
├── /components      # Componentes de UI reutilizáveis (Botões, Modais, Cards)
├── /contexts        # Estado global (AppContext, ToastContext, AuthContext)
├── /hooks           # Custom React Hooks (lógica reutilizável)
├── /lib             # Configurações de bibliotecas (cliente supabase.ts)
├── /pages           # Componentes de Página (rotas da aplicação)
│   ├── /mobile      # Telas específicas da versão Mobile
├── /types           # Definições de tipos TypeScript (Interfaces de Domínio)
├── /utils           # Funções auxiliares (formatadores, validadores)
├── App.tsx          # Entrada da aplicação e Roteamento
├── main.tsx         # Ponto de montagem React
```

---

## 📐 Padrões de Design

### 1. Context API para Gerenciamento de Estado
Utilizamos `AppContext` como uma "store" centralizada leve para dados da aplicação (Ordens, Clientes, Inventário).
*   **Motivação**: Evitar prop-drilling sem a complexidade de Redux/Zustand para este escopo.
*   **Acesso**: `const { orders, addOrder } = useApp();`

### 2. Padrão "Container/View" em Páginas
As páginas (`/pages`) atuam como containers que buscam dados do contexto e os passam para componentes de apresentação ou os renderizam diretamente em layouts responsivos.

### 3. Mobile-First (Híbrido)
O sistema não usa React Native, mas sim uma **Web App Responsiva** com rotas dedicadas para mobile (`/mobile/*`).
*   **Estratégia**: Detectamos o user-agent ou usamos rotas específicas para entregar uma interface otimizada para toque em celulares, enquanto mantemos a interface densa de administração para desktop na mesma base de código.

### 4. Supabase Direct Integration
Não há um backend Node.js intermediário (Middleware). O frontend conecta-se diretamente ao Supabase protegido por **Row Level Security (RLS)** (futura implementação) e Policies.

---

## 🔒 Segurança

*   **Autenticação**: Gerenciada inteiramente pelo Supabase Auth.
*   **Dados Sensíveis**: Credenciais de API ficam em `.env.local` e não são commitadas (exceto chaves anônimas públicas).
*   **Validação**: Inputs são validados no frontend (HTML5 + React State) e tipados via TypeScript.

---

## 🚀 Deployment

O projeto é otimizado para deploy em plataformas de Edge/Static Hosting como **Vercel** ou **Netlify**.
*   Build Command: `npm run build`
*   Output Directory: `dist`
*   SPA Routing: Requer configuração de rewrite para `index.html` em todas as rotas.
