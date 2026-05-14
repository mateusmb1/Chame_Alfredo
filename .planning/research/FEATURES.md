# Features Research — FSM SaaS Platform

## Table Stakes (Usuários esperam — sem isso, abandonam)

### Gestão de Ordens de Serviço
- CRUD completo de ordens com status workflow
- Atribuição e reatribuição de técnicos
- Histórico de alterações por OS
- Fotos/vídeos anexados à OS
- Assinatura digital do cliente

### Autenticação e Multi-Tenancy
- Login/registro por empresa
- Isolamento total de dados entre empresas
- Roles: Admin, Gestor, Técnico, Cliente
- Convite de membros da equipe

### Gestão de Clientes
- Cadastro com dados fiscais (CPF/CNPJ)
- Histórico de serviços por cliente
- Dados de contato e endereço

### Agenda e Calendário
- Visualização de calendário (dia/semana/mês)
- Agendamento de serviços
- Notificações de compromissos

### App Mobile para Técnicos
- Interface mobile-first/PWA
- Visualização de agenda pessoal
- Atualização de status em campo
- Funcionalidade offline básica

## Diferenciadores (Vantagem competitiva)

### Configuração por Segmento
- Templates pré-configurados por tipo de negócio
- Campos customizáveis por segmento
- Terminologia adaptável (ex: "OS" vs "Chamado" vs "Ticket")
- Complexidade: ALTA | Dependências: multi-tenancy

### Relatórios Inteligentes
- KPIs: Taxa de resolução na primeira visita, MTTR, utilização de recursos
- Dashboards role-specific
- Complexidade: MÉDIA

### Orçamentos e Faturamento
- Geração automática de orçamentos
- Conversão orçamento → OS → fatura
- Templates de impressão customizáveis
- Complexidade: MÉDIA

## Anti-Features (NÃO construir agora)
- Gateway de pagamento — complexidade regulatória, adicionar depois
- App nativo — PWA é suficiente para MVP SaaS
- IA/ML para otimização de rotas — requer volume de dados primeiro
- Marketplace de serviços — muda o modelo de negócio
