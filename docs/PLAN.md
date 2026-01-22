# Plano de Implementação: Visibilidade de Solicitações da Landing Page (Leads)

Este plano visa tornar as solicitações feitas pelos clientes no site (Landing Page) visíveis e fáceis de identificar no painel administrativo.

## 🛠️ Detalhes técnicos
- As solicitações do site são salvas na tabela `orders` com os campos `origin: 'landing_quick_quote'` ou `origin: 'landing_form'`.
- Atualmente, essas solicitações estão misturadas com as Ordens de Serviço (OS) comuns e não possuem um destaque visual.

## 📋 Fases de Implementação

### Fase 1: Atualização de Dados (Modelagem)
- Adicionar o campo `origin` à interface `Order` em `types/order.ts`.
- Atualizar os mapers `mapOrderFromDB` e `mapOrderToDB` em `AppContext.tsx` para garantir que o campo `origin` seja recuperado do Supabase.

### Fase 2: Identificação Visual em Serviços (Orders.tsx)
- Adicionar uma nova aba "Site Leads" ou "Solicitações" na página de Serviços.
- Exibir um badge visual (ex: "Site") nos cards e na lista para identificar a origem.
- Adicionar um filtro rápido para ver apenas solicitações externas.

### Fase 3: Destaque no Dashboard (Dashboard.tsx)
- Adicionar um pequeno indicador ou card no Dashboard mostrando quantas "Novas Solicitações" (leads não processados) existem hoje.
- Refinar as "Atividades Recentes" para destacar quando uma atividade vem do site.

### Fase 4: Verificação
- Criar um lead de teste no site.
- Verificar se ele aparece na aba correta no Painel ADM com o badge de origem.

## 👥 Agentes Envolvidos
1. **project-planner**: Responsável por este plano operacional.
2. **backend-specialist**: Responsável por atualizar tipos e contextos (Typescript/Supabase mapping).
3. **frontend-specialist**: Responsável pelas mudanças de UI (badges, abas e filtros).
