# Plano de Correção: Visibilidade de Texto em Inputs e Textareas

Este plano detalha a correção para o problema de texto "invisível" (provavelmente branco sobre fundo claro) em campos de formulário, especialmente no modo escuro, e a padronização global de estilos de input para garantir acessibilidade.

## 🛠️ Detalhes do Problema
- **Sintoma:** Ao digitar no campo "Detalhe adicional", o texto não aparece (cor branca em fundo branco).
- **Causa Provável:** O projeto utiliza Tailwind CDN com suporte a `darkMode: "class"`. O `body` possui `dark:text-gray-200`, o que faz com que o texto herdado em inputs com fundo branco seja muito claro ou branco no modo escuro.
- **Escopo:** `Landing.tsx`, `LeadFormModal.tsx` e estilos globais em `index.html`.

## 📋 Fases de Implementação

### Fase 1: Ajustes Globais (index.html)
- Adicionar uma regra CSS global no bloco `<style>` do `index.html` para garantir que `input` e `textarea` tenham cores de texto e fundo consistentes, independentemente do modo do sistema, a menos que especificado explicitamente.
- Forçar `text-slate-900` em campos com fundo claro.

### Fase 2: Ajustes nos Componentes
1. **Landing.tsx:**
   - Atualizar o `textarea` ("Detalhe adicional") para incluir explicitamente `text-slate-900`.
   - Revisar outros inputs de Nome e WhatsApp.
2. **LeadFormModal.tsx:**
   - Atualizar o `textarea` ("Descreva o serviço") e outros inputs para incluir `text-slate-900` e fundos consistentes.

### Fase 3: Verificação e Testes
- Testar em Modo Claro e Modo Escuro.
- Verificar contraste e legibilidade.
- Executar scripts de lint e segurança.

## 👥 Agentes Envolvidos
1. **project-planner:** Responsável por este plano (Phace 1 da orquestração).
2. **frontend-specialist:** Implementará as mudanças de CSS e Tailwind nos componentes.
3. **debugger:** Verificará se não há regressões em outros formulários do sistema.
4. **test-engineer:** Executará as verificações de integridade.

## ✅ Critérios de Sucesso
- Texto digitado em todos os campos é claramente visível em ambos os modos (Light/Dark).
- O design permanece "premium" e fiel ao solicitado anteriormente.
- Nenhum erro de lint ou build.
