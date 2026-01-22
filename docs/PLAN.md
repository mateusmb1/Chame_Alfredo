# Plano de Implementação: Redesign Premium e Correção da Agenda (Planejamento)

Este plano visa elevar a estética da página de Planejamento (Agenda) e corrigir as funcionalidades de alocação de recursos e interação com o calendário.

## 🎨 DESIGN COMMITMENT: "Precision Scheduler"

- **Topological Choice:** Utilizaremos um layout de grade técnica com foco em profundidade. O calendário deixará de ser uma tabela simples para se tornar um "painel de monitoramento", com efeitos de vidro (glassmorphism) sutis e áreas de foco dinâmicas.
- **Risk Factor:** Bordas extremamente nítidas (2px) para os slots de tempo, evocando precisão militar/industrial. Uso de animações de "Spring Physics" para a transição entre meses.
- **Readability Conflict:** IDs técnicos e metadados serão exibidos em micro-tipografia, permitindo uma densidade de informação maior sem sacrificar o visual "clean".
- **Cliché Liquidation:** Removeremos os botões de controle padrão do navegador em favor de uma barra de ferramentas customizada integrada ao cabeçalho premium.

## 📋 Fases de Implementação

### Fase 1: Arquitetura de Dados (AppContext)
- Adicionar `addAppointment`, `updateAppointment` e `deleteAppointment` à interface `AppContextType`.
- Implementar estas funções no `AppProvider` com integração ao Supabase.
- Adicionar mappers (mapAppointmentFromDB, mapAppointmentToDB).

### Fase 2: Redesign da Interface (Agenda.tsx)
- Refatorar o cabeçalho para seguir o padrão "Command Center".
- Implementar o novo design dos cards de dia (slots).
- Adicionar animações de entrada e transição.
- Criar o `AppointmentModal` para adição e edição de compromissos.

### Fase 3: Correção de Funcionalidades
- Ligar o botão "Alocar Recurso" ao modal de criação.
- Ligar os cliques nos dias do calendário para abrir o modal com a data pré-selecionada.
- Adicionar handlers de clique nos eventos existentes para edição/deleção.

### Fase 4: Verificação e Auditoria
- Validar conformidade com as regras do `frontend-specialist`.
- Rodar `lint_runner.py` e `npx tsc --noEmit`.

## 👥 Agentes Envolvidos
1. **project-planner**: Orquestração e Planejamento de Tarefas.
2. **backend-specialist**: Implementação das operações de dados no Contexto.
3. **frontend-specialist**: Redesign UI/UX e implementação do Modal.
4. **test-engineer**: Verificação de bugs e lints.
