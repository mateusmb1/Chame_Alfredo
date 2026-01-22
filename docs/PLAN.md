# Plano de Correção: Erro no Painel OS e Melhoria de UI em Clientes

Este plano visa corrigir o crash na página de Ordens de Serviço e melhorar a experiência visual na página de Clientes.

## 🛠️ Detalhes dos Problemas
1.  **Página de Serviços (Orders.tsx):** Erro `ReferenceError: handleConfirmDelete is not defined`. Funções de deleção foram referenciadas mas não implementadas.
2.  **Página de Clientes (Clients.tsx):** Reclamação sobre a visualização. A UI atual pode estar saturada ou pouco intuitiva em dispositivos específicos.

## 📋 Fases de Implementação

### Fase 1: Correção de Crítico (Orders.tsx)
- Implementar `handleConfirmDelete`.
- Implementar `handleConfirmBulkDelete`.
- Garantir que `deleteOrders` exista no `AppContext`.

### Fase 2: Refatoração de UI (Clients.tsx)
- Tornar a lista de clientes mais compacta e elegante.
- Refinar o estado "Ativo" da lista para ser menos agressivo visualmente.
- Ajustar espaçamentos no painel de detalhes para melhor legibilidade.

### Fase 3: Verificação
- Testar deleção individual e em massa.
- Validar nova visualização de clientes.

## 👥 Agentes Envolvidos
1.  **project-planner:** Responsável por este plano.
2.  **frontend-specialist:** Implementará as melhorias de UI e corrigirá os handlers.
3.  **debugger:** Verificará a causa raiz do erro de referência e garantirá a estabilidade.
4.  **test-engineer:** Validará as funcionalidades de deleção.
