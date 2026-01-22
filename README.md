# 🛠️ Chame Alfredo - Plataforma de Gestão de Serviços

> **A solução definitiva para orquestração de serviços, gestão de ativos e operações de campo.**

Bem-vindo à documentação oficial do **Chame Alfredo**. Este projeto é uma plataforma *full-stack* moderna projetada para transformar a operação de empresas de assistência técnica e manutenção.

---

## 📚 Documentação

Navegue pela documentação detalhada para entender cada aspecto do sistema:

*   📖 **[Guia do Usuário](./docs/USER_GUIDE.md)**: Manual visual com passo-a-passo de uso (Dashboard, Agenda, App Mobile). **(Novo!)**
*   🏗️ **[Arquitetura do Sistema](./docs/ARCHITECTURE.md)**: Stack tecnológica, estrutura de projeto e decisões de design.
*   💾 **[Modelo de Dados](./docs/DATA_MODEL.md)**: Estrutura do banco de dados e relacionamentos (Supabase).
*   🚀 **[Guia de Instalação](./docs/SETUP.md)**: Instruções para rodar o projeto do zero.

---

## 🚀 Quick Start

Rodando o projeto localmente em menos de 5 minutos:

1.  **Instale as dependências**:
    ```bash
    npm install
    ```

2.  **Configure o ambiente**:
    Crie um arquivo `.env.local` na raiz:
    ```env
    VITE_SUPABASE_URL=sua_url_aqui
    VITE_SUPABASE_ANON_KEY=sua_key_aqui
    ```

3.  **Execute**:
    ```bash
    npm run dev
    ```

4.  **Acesse**:
    *   Painel: `http://localhost:5173`
    *   App Mobile: `http://localhost:5173/mobile` (Simulado)

---

## ✨ Features em Destaque

*   **Command Center Operacional**: Nova Agenda com visualização de calendário e alocação de recursos em tempo real.
*   **Gestão de Ativos (Inventário)**: Tabela de alta densidade para controle de estoque com alertas visuais de nível crítico.
*   **App Mobile Offline-First**: Ferramenta para técnicos com agendas, ordens de serviço e assinatura digital.
*   **Automação Inteligente**: Preenchimento automático de CNPJ, cálculos de orçamento e sincronização em tempo real via Supabase.

---

## 🛠️ Tech Stack

*   **Frontend**: React 18, TypeScript, Vite
*   **UI/UX**: Tailwind CSS (v4 Patterns), Lucide Icons
*   **Backend**: Supabase (PostgreSQL, Auth, Realtime, Storage)
*   **State**: React Context API

---

## 📞 Suporte

Desenvolvido por **Mateus B. Silva** e **Antigravity Agentic AI**.
Para suporte técnico, abra uma issue ou contate o administrador do sistema.
