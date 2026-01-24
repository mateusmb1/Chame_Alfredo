# 🏗️ Plano de Implementação: Design Option 2 (Central de Comando)

## 🎯 Objetivo
Transformar a interface do **Chame Alfredo** em um "Centro de Comando" moderno, denso e minimalista. O foco é a eficiência operacional, reduzindo scroll e centralizando informações críticas através de widgets modulares e um sistema de temas robusto.

## 🛠️ Agentes & Atribuições (Orquestração Phase 2)
- **`database-architect`**: Persistência de preferências de tema do usuário no Supabase.
- **`frontend-specialist`**: Construção da biblioteca de componentes (Shadcn-like) e layout macro.
- **`performance-optimizer`**: Garantir que a densidade de dados não afete o tempo de renderização.

---

## 📅 Fase 1: Fundação e Design System
**Foco:** Infraestrutura de temas e componentes base.

- [ ] **Contexto de Tema**: Criar `DashboardThemeContext.tsx` para gerenciar entre "Classic" e "CommandCenter".
- [ ] **Tokens CSS**: Definir variáveis CSS (spacing 8/12px, cores neutras, shadows leves) em `index.css`.
- [ ] **Layout Macro**: Implementar `DashboardShell`, `SidebarNav` (compacta) e `Topbar` (com busca global).

## 🚀 Fase 2: Componentes de Dashboard
**Foco:** Widgets e cartões de KPI.

- [ ] **KpiCard**: Componente denso com rótulo, valor, delta e ícone.
- [ ] **WidgetCard**: Container modular com título, ações internas e scroll opcional.
- [ ] **ActivityFeed**: Feed de atividades otimizado estilo "timeline compacta".
- [ ] **DashboardGrid**: Sistema de grid 12 colunas para mosaico de widgets.

## 📋 Fase 3: Reformulação das Páginas
**Foco:** Aplicar o novo padrão em todas as rotas operacionais.

- [ ] **Monitor (Dashboard)**: Organizar os 5 blocos (KPIs, Cronograma, Funil de OS, Clientes, Atividades).
- [ ] **Serviços (OS)**: Nova `DataTable` compacta com `ServiceOrderDrawer` (gaveta lateral).
- [ ] **Agenda operacional**: Integração com o novo layout da `PageShell`.
- [ ] **Ajustes**: Tela para alternar temas (`ThemeSwitcher`).

## 🔍 Critérios de Verificação
1. **Densidade**: A tela de "Monitor" deve mostrar os principais KPIs e atividades sem necessidade de scroll em telas 1080p.
2. **Alternância de Tema**: A troca de tema deve ser instantânea (via data-attributes) e persistir após o refresh.
3. **Responsividade**: O mosaico de widgets deve se adaptar corretamente para tablets e dispositivos móveis.

---

## 🛑 User Approval Required

![Aprovação](https://img.shields.io/badge/Aprova%C3%A7%C3%A3o-Pendente-orange)

**Confirmar Início da Fase 2?**
- **Y**: Iniciarei a criação dos componentes base.
- **N**: Ajustar pontos específicos do plano.
