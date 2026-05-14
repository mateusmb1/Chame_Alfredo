# Pitfalls Research — FSM SaaS Migration

## 1. Mapeamento Relacional → NoSQL Direto
- **Risco**: Copiar tabelas SQL como collections Firestore 1:1
- **Sinais**: Muitas queries separadas para montar uma view, latência alta
- **Prevenção**: Denormalizar dados baseado em como o app lê, não como os dados se relacionam
- **Fase**: 2 (Migração Firebase)

## 2. Security Rules Insuficientes
- **Risco**: Rules permissivas demais ou ausência de verificação de tenantId
- **Sinais**: Dados de um tenant visíveis para outro
- **Prevenção**: Testar rules com Firebase Emulator Suite. Nunca confiar em tenantId vindo do client — usar custom claims do Auth token
- **Fase**: 2 (Migração Firebase)

## 3. Admin SDK Bypassa Rules
- **Risco**: Cloud Functions usando Admin SDK não passam por Security Rules
- **Sinais**: Funções server-side acessam dados sem verificação de permissão
- **Prevenção**: Implementar autorização explícita em toda Cloud Function
- **Fase**: 2 (Migração Firebase)

## 4. Design System Inconsistente
- **Risco**: Misturar componentes shadcn/ui com Tailwind classes ad-hoc
- **Sinais**: Estilos inconsistentes entre páginas, dificuldade de manter tema
- **Prevenção**: Definir design tokens primeiro, criar component library com Storybook, nunca usar cores/fontes hardcoded
- **Fase**: 3 (Design System)

## 5. Migração Big-Bang
- **Risco**: Tentar migrar tudo de uma vez e quebrar a app em produção
- **Sinais**: Deploy que quebra funcionalidades existentes
- **Prevenção**: Migrar feature por feature. Criar camada de abstração (hooks) que permita trocar o backend sem mudar components
- **Fase**: 1-2 (Arquitetura + Firebase)

## 6. Multi-Tenancy Afterthought
- **Risco**: Adicionar multi-tenancy depois de migrar os dados
- **Sinais**: Refatoração massiva de queries e rules
- **Prevenção**: Definir a estrutura multi-tenant ANTES de migrar qualquer dado. Toda query deve incluir tenantId desde o dia 1
- **Fase**: 2 (Migração Firebase)

## 7. Custo Firestore Descontrolado
- **Risco**: Reads excessivos por má modelagem ou listeners desnecessários
- **Sinais**: Billing spikes inesperados
- **Prevenção**: Auditar real-time listeners. Usar pagination. Cachear com TanStack Query. Monitorar usage no Firebase Console
- **Fase**: 2 (Migração Firebase)
