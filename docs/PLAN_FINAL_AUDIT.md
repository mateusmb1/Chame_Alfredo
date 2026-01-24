# 📋 Plano de Auditoria Final e Testes Completos - Chame Alfredo

Este documento detalha o escopo e os passos para a validação final das implementações recentes e a garantia de qualidade do sistema antes da entrega.

## 1. Escopo da Auditoria

### 🛠️ Verificações Automatizadas
Utilizaremos os scripts de suporte definidos no projeto para garantir a integridade técnica:
- **`lint_runner.py`**: Validar a consistência do código e conformidade com as regras de estilo.
- **`security_scan.py`**: Analisar possíveis vulnerabilidades, especialmente nas novas lógicas de contexto e persistência de dados.
- **`checklist.py`**: Confirmar que todos os requisitos de qualidade do projeto foram atendidos.

### 🔍 Verificação de Funcionalidades (Features)
Foco específico nas alterações realizadas em `ProjectForm.tsx`, `Clients.tsx`, `QuoteDetail.tsx` e `AppContext.tsx`:
- **Cadastro de Clientes**:
    - Validar a busca automática por **CEP** (BrasilAPI).
    - Verificar se os campos de endereço são preenchidos corretamente após a busca.
- **Criação de Projetos**:
    - Testar o comportamento dos **inputs monetários (CurrencyInput)**, garantindo que o erro do "0" persistente foi resolvido.
    - Validar o **vínculo com Ordens de Serviço (OS)** no momento do cadastro.
    - Validar se o input de Progresso permite limpeza/edição correta.
- **Criação de Orçamentos**:
    - Testar a busca dinâmica de produtos.
    - Validar os cálculos automáticos de subtotal e total com formatação em R$.

## 2. Agentes Necessários para Implementação (Fase 2)

Para a execução deste plano, os seguintes agentes serão mobilizados:
- `test-engineer`: Responsável pela execução dos scripts de teste automatizados e Playwright/E2E.
- `security-auditor`: Analisará os resultados do scan de segurança e revisará a integridade do `AppContext`.
- `frontend-specialist`: Atuará na correção imediata de qualquer inconsistência visual ou de UX encontrada durante os testes manuais.

## 3. Plano de Execução Passo a Passo

1.  **Passo 1: Análise Estática**: Executar Lint e Security Scan para identificar erros de sintaxe ou riscos de segurança imediatos.
2.  **Passo 2: Suíte de Testes**: Rodar testes unitários e testes de ponta a ponta (E2E) focados nos fluxos de Projetos e Clientes.
3.  **Passo 3: Verificação Manual**: Realizar o fluxo completo de criação de um cliente, seguido por um projeto e um orçamento, simulando a experiência do usuário real.
4.  **Passo 4: Correções e Ajustes**: Resolver quaisquer falhas identificadas nos passos anteriores antes da validação final.
