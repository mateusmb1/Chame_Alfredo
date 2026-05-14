# Stack Research — Chame Alfredo SaaS

## Recommended Stack (2025)

### Frontend (Manter + Evoluir)
| Technology | Version | Rationale | Confidence |
|-----------|---------|-----------|------------|
| React | 19.x | Já em uso, ecossistema maduro | ⬛ High |
| TypeScript | 5.8+ | Já em uso, non-negotiable para SaaS | ⬛ High |
| Vite | 6.x | Já em uso, build rápido | ⬛ High |
| Tailwind CSS (npm) | 4.x | Migrar do CDN para instalação local com design tokens | ⬛ High |
| shadcn/ui | latest | Componentes acessíveis baseados em Radix UI + Tailwind, full ownership do código | ⬛ High |
| TanStack Query | 5.x | Server-state management, caching, sync com Firebase | ⬛ High |
| Zustand | 5.x | Client-state leve para estado global (substituir Context API excessivo) | ⬗ Medium-High |
| React Hook Form + Zod | latest | Formulários complexos com validação de schema | ⬛ High |
| Framer Motion | 12.x | Já em uso, manter para animações | ⬛ High |

### Backend (Migrar para Firebase)
| Technology | Version | Rationale | Confidence |
|-----------|---------|-----------|------------|
| Firebase Auth | v9+ | Autenticação multi-tenant com Identity Platform | ⬛ High |
| Cloud Firestore | v9+ | NoSQL document DB — denormalizar dados para performance | ⬛ High |
| Firebase Storage | v9+ | Upload de fotos, documentos, assinaturas digitais | ⬛ High |
| Cloud Functions | v2 | Lógica server-side, triggers, webhooks | ⬛ High |
| Firebase Local Emulator | latest | Desenvolvimento local seguro | ⬛ High |

### Infraestrutura
| Technology | Rationale | Confidence |
|-----------|-----------|------------|
| Vercel | Deploy frontend (manter por enquanto) | ⬛ High |
| GitHub Actions | CI/CD pipeline | ⬗ Medium-High |

### Testing
| Technology | Rationale | Confidence |
|-----------|-----------|------------|
| Vitest | Unit/integration tests (rápido, integra com Vite) | ⬛ High |
| Playwright | E2E tests para fluxos críticos | ⬗ Medium-High |

## O que NÃO usar
- **Supabase** — sendo substituído por Firebase (decisão do projeto)
- **Tailwind CDN** — instalar via npm para production builds otimizados
- **Context API excessivo** — substituir por Zustand/TanStack Query onde apropriado
- **Next.js** — não migrar framework agora, Vite + React funciona bem para SPA
