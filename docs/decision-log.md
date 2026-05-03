# Decision log

What this v0 deliberately ships, what it defers, and why. Each deferral has a clear seam for the follow-up.

## Stack
- **Next.js 15** (App Router) + **TypeScript** (strict) + **Tailwind 4** + minimal shadcn-style primitives.
- No `@supabase/supabase-js` in v0 — there's nothing to read from Supabase yet. Added in MAI-10.
- No `class-variance-authority` — Card and Badge are too small to need it. Add only when a primitive grows two-plus variant axes.

## In v0
- **MAI-9**: scaffold, build clean, deployable to Vercel.
- **MAI-11**: Agents List page at `/`, hardcoded roster `["homie"]`, card per spec.
- Read-only fixture data adapter at `lib/adapter/`. One agent (`homie`) with realistic `config.yaml`, `hub-log.jsonl`, `memory.json` under `fixtures/homie/`.
- `/agents/[agent]` stub so the card click target works.

## Deferred (in priority order)

| Linear | What | Seam |
| --- | --- | --- |
| MAI-10 | Supabase Storage adapter (Hub reads from bucket) | Replace `fixture` import in `lib/adapter/index.ts` with a `supabase` adapter implementing `AgentDataSource`. One file. |
| MAI-12 | Activity Timeline tab on Agent Detail | `app/agents/[agent]/page.tsx` is a stub; tabs slot in here. Adapter already has `readLogTail()`. |
| MAI-13 | Configuration tab | Same page. Adapter has `readConfig()`. |
| MAI-14 | Memory tab | Same page. Adapter has `readMemory()`. |
| MAI-17 | Concierge Inbox at `/concierge` | New route. Adapter needs a `readConciergeFlags()` once MAI-15 ships. |
| MAI-18 | Health tab | Same Agent Detail page. |
| MAI-21 | Dynamic agents.yaml roster | `ROSTER` const in `app/page.tsx` — replace with `readRoster()` from the adapter. |
| MAI-9 (auth) | Supabase magic-link single-admin gate | Wire when going off fixtures. v0 deploy is publicly readable — fine for synthetic data. |

## Conventions held to
- **Three-layer event model v1** (`ts/agent/event` only). MAI-7's v1.1 (`workflow`/`skill` fields) is a follow-up; `HubLogEvent` keeps the open-ended `[k: string]: unknown` shape that v1.1 fits into without a breaking change.
- **Concierge headline** — hardcoded `"Working normally"`. The `AgentSummary.headline` field is the seam; once `concierge-flags.jsonl` exists in the bucket (MAI-15), populate it from there.

## Custom domain
`hub.maintly.com` DNS cutover deferred until Saul is ready. Vercel preview URL is enough for MVP smoke tests.

## Foundation docs (TODO)
The following inheritance docs should be added under `docs/` when Saul has them at hand:
- `saul-identity.md`
- `architecture-spec.md` (Hub Architecture Spec v1)
- `concierge-spec.md` (Hub Concierge Full Spec v1)
- `memory-layer-spec.md`
- `project-context.md`
- `agent-os-foundation-prompts-v1.md`

These are reference-only for the Hub repo; the source of truth for what gets built is Linear (project: AgentOps Hub — MVP).
