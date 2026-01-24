# Plano de Correção de UI - Formulário de Projetos

## Contexto
O usuário reportou um bug de usabilidade no campo "Orçamento (R$)" do formulário de projetos (`ProjectForm.tsx`). O valor inicial `0` persiste incorretamente e não é limpo ao digitar, causando má experiência (ex: `01500`).

## Diagnóstico
- **Componente**: `ProjectForm.tsx`
- **Causa**: O input é do tipo `number` controlado por estado numérico direto (`parseFloat || 0`). Isso impede que o campo fique vazio e força o zero visualmente.
- **Solução**: Substituir o input nativo pelo componente `CurrencyInput` já existente no projeto, unificando a experiência com outras telas (ex: Orçamentos).

## Tarefas

### 1. Preparação (Frontend Specialist)
- [ ] Verificar a interface do componente `CurrencyInput`.
- [ ] Identificar pontos de substituição em `ProjectForm.tsx`.

### 2. Implementação (Frontend Specialist)
- [ ] Importar `CurrencyInput` em `ProjectForm.tsx`.
- [ ] Substituir o input de "Orçamento" por `CurrencyInput`.
- [ ] Ajustar o input de "Progresso (%)" para permitir limpar o campo (mudar lógica de state para permitir string temporária ou tratar `NaN`).

### 3. Verificação (Quality Assurance)
- [ ] Verificar se as props passadas para `CurrencyInput` correspondem à interface.
- [ ] Garantir que não existem erros de lint.

## Agentes Envolvidos
1.  **Project Planner**: Elaboração deste plano.
2.  **Frontend Specialist**: Execução do código.
3.  **Quality Assurance**: Validação da implementação.
