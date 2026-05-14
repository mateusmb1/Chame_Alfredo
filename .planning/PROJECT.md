# Chame Alfredo — Plataforma SaaS de Gestão de Serviços

## What This Is

Plataforma multi-tenant de gestão de serviços para prestadores de assistência técnica e manutenção. Permite que empresas de diferentes segmentos (portões automáticos, ar condicionado, eletrodomésticos, mecânica, mídia social, fotografia, etc.) gerenciem ordens de serviço, equipes de técnicos, clientes, estoque, orçamentos, faturas e contratos. Possui 3 portais: Admin (gestor), App Mobile (técnico em campo) e Portal do Cliente.

## Core Value

O gestor de uma empresa de serviços deve conseguir criar, atribuir e acompanhar ordens de serviço do início ao fim — do orçamento à fatura — em uma única plataforma que funciona para qualquer segmento de prestação de serviço.

## Requirements

### Validated

<!-- Funcionalidades que já existem no código atual -->

- ✓ Dashboard operacional com métricas em tempo real — existing
- ✓ CRUD de ordens de serviço com status (pendente, em progresso, concluído, cancelado) — existing
- ✓ Gestão de clientes com preenchimento automático de CNPJ — existing
- ✓ Controle de estoque/inventário com alertas de nível crítico — existing
- ✓ Agenda com visualização de calendário — existing
- ✓ Gestão de equipe com perfis de técnicos — existing
- ✓ Sistema de orçamentos (criar, editar, detalhar, imprimir) — existing
- ✓ Sistema de faturas/notas fiscais (criar, visualizar, imprimir) — existing
- ✓ Gestão de contratos — existing
- ✓ Gestão de projetos com detalhamento — existing
- ✓ Sistema de comunicação interna — existing
- ✓ Relatórios operacionais — existing
- ✓ Configurações do sistema com temas (padrão e Command Center) — existing
- ✓ App Mobile para técnicos (agenda, ordens, chat, notificações, criar OS) — existing
- ✓ Portal do Cliente (dashboard, orçamentos, faturas, chat, relatórios) — existing
- ✓ Landing page com SEO otimizado para negócio local — existing
- ✓ Login/autenticação de admin e técnicos — existing
- ✓ Impressão configurável de OS e orçamentos — existing

### Active

<!-- Escopo do milestone atual: refatoração completa -->

- [ ] Migração completa do Supabase para Firebase (Auth, Firestore, Storage, Cloud Functions)
- [ ] Novo Design System com identidade visual profissional e escalável
- [ ] Arquitetura multi-tenant para suportar múltiplas empresas isoladas
- [ ] Reestruturação do código seguindo melhores práticas (tudo em src/, módulos bem definidos)
- [ ] Tailwind CSS instalado via npm com configuração de design tokens
- [ ] Sistema de planos e assinaturas (mensal, por usuários, por funcionalidades)
- [ ] Segurança com regras de acesso por tenant e RBAC aprimorado
- [ ] Configuração por segmento de empresa (personalizar campos, fluxos e terminologia)

### Out of Scope

- App nativo iOS/Android — PWA mobile-first é suficiente para esta fase
- Gateway de pagamento para assinaturas — será implementado em milestone futuro
- Marketplace de serviços — foco é na gestão, não na venda direta
- IA/automação avançada — será adicionada após a base estar sólida

## Context

- **Origem**: Sistema construído para o pai do founder, que presta serviços de portões automáticos e segurança eletrônica em Recife/PE
- **Equipe atual do pai**: 1 técnico fixo + freelancers esporádicos
- **Visão**: Transformar em SaaS vendível para qualquer prestador de serviço
- **Segmentos-alvo**: Portões automáticos, ar condicionado, mecânica, mídia social, fotografia, manutenção de eletrodomésticos (máquina de lavar, geladeira, secadora, freezer)
- **Modelo de negócio**: Planos com mix de modalidades (mensal fixa + por usuários + por funcionalidades)
- **Estado atual**: App funcional com Supabase, Tailwind CDN, React 19, deploy na Vercel
- **Tech debt**: Duplicação de diretórios (raiz vs src/), Tailwind via CDN, App.tsx monolítico, falta de testes unitários

## Constraints

- **Ecossistema**: Google/Firebase — o founder tem assinatura Google e quer integrar com serviços Google
- **Deploy**: Vercel (manter por enquanto, avaliar Firebase Hosting futuramente)
- **Framework**: React + TypeScript + Vite (manter stack frontend atual)
- **Idioma**: Interface em Português Brasileiro (pt-BR)
- **Budget**: Manter custos baixos — usar tiers gratuitos do Firebase onde possível

## Key Decisions

| Decision | Rationale | Outcome |
|----------|-----------|---------|
| Firebase ao invés de Supabase | Assinatura Google existente + integração com ecossistema Google | — Pending |
| Multi-tenant desde o início | Visão de produto SaaS para múltiplos prestadores de serviço | — Pending |
| Manter Vercel para deploy | Funciona bem, sem necessidade de mudar agora | — Pending |
| PWA ao invés de app nativo | Reduz complexidade, técnicos usam browser no celular | — Pending |
| Novo Design System | Identidade profissional para vender como produto SaaS | — Pending |

## Evolution

This document evolves at phase transitions and milestone boundaries.

**After each phase transition** (via `/gsd-transition`):
1. Requirements invalidated? → Move to Out of Scope with reason
2. Requirements validated? → Move to Validated with phase reference
3. New requirements emerged? → Add to Active
4. Decisions to log? → Add to Key Decisions
5. "What This Is" still accurate? → Update if drifted

**After each milestone** (via `/gsd-complete-milestone`):
1. Full review of all sections
2. Core Value check — still the right priority?
3. Audit Out of Scope — reasons still valid?
4. Update Context with current state

---
*Last updated: 2026-05-14 after initialization*
