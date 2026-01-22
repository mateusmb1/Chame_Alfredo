# Plano de Implementação: Redesign Premium da Página de Serviços/Ordens

Este plano visa elevar a estética e a usabilidade da página de Ordens de Serviço (Serviços), transformando-a em uma central de comando de alto impacto visual ("Command Center").

## 🎨 DESIGN COMMITMENT: "Industrial Command Center"

- **Topological Choice:** Romperemos o grid 50/50 interno dos cards por uma estrutura de camadas sobrepostas e zonas de contraste agressivo (Dark/Light).
- **Risk Factor:** Uso de bordas afiadas (0-2px) em elementos de status para evocar uma sensação técnica e profissional "Zero Error". 
- **Readability Conflict:** Utilizaremos tipografia massiva para o ID da OS em segundo plano (background watermarks) para facilitar a busca visual rápida sem poluir o conteúdo.
- **Cliché Liquidation:** Removeremos o uso excessivo de sombras suaves arredondadas em favor de profundidade por sobreposição de camadas de cores sólidas.

## 📋 Fases de Implementação

### Fase 1: Redesign dos Cards de OS (Grid Mode)
- Implementar "Status Bars" verticais na borda esquerda dos cards.
- Refatorar a zona do técnico para um estilo "Profile Badge" mais moderno.
- Adicionar marca d'água com o número da OS no fundo do card.
- Melhorar o contraste dos budgets e datas.

### Fase 2: Interatividade e Micro-Animações
- Adicionar animações de entrada escalonadas (staggered reveal) usando CSS Vanilla/Tailwind.
- Implementar efeitos de "Hover Lift" com escala asimétrica.
- Refinar as transições entre a visão de Grid e Lista.

### Fase 3: Refinamento da Barra de Filtros e Tabs
- Transformar as abas em uma barra de estado persistente com indicadores de contagem.
- Melhorar o input de busca com foco em "Premium Search Experience".

### Fase 4: Verificação e Auditoria
- Validar se o "Purple Ban" (proibição de roxo) foi mantido.
- Verificar consistência no modo escuro.
- Rodar `lint_runner.py` para garantir integridade do código.

## 👥 Agentes Envolvidos
1. **project-planner**: Orquestração e Estratégia.
2. **frontend-specialist**: Implementação do Redesign e Animações.
3. **test-engineer**: Auditoria de UI e Scripts de Verificação.
