# AgentOps Hub

Read-only dashboard for **all of Saul's agents**, across every project (Maintly, Listados, personal). Lives at **hub.maintly.com**.

> **Scope**: This hub is the single place to **review** Saul's whole agent fleet — not one project's. Create/manage capabilities are planned (see `docs/create-manage-plan.md`); v0 is review-only.
>
> **v0 status**: scaffold + Agents List page only. Reads from in-repo fixtures. Once agents are pushing to Supabase Storage (MAI-10), the data adapter swaps over — no page or component changes required.

## Stack
- Next.js 15 App Router · TypeScript (strict) · Tailwind 4
- Minimal shadcn-style primitives (Card, Badge) under `components/ui/`
- `js-yaml` for parsing per-agent `config.yaml`

## What's here

| Path | What |
| --- | --- |
| `app/page.tsx` | Agents List (MAI-11). RSC; reads via `lib/adapter`. |
| `app/agents/[agent]/page.tsx` | Stub. Tabs land in MAI-12 / MAI-13 / MAI-14 / MAI-18. |
| `components/agent-card.tsx` | The card per MAI-11 (project pill, class badge, status dot, last activity, runs today, headline). |
| `lib/adapter/` | `AgentDataSource` interface + fixture impl. MAI-10 adds a Supabase Storage impl. |
| `lib/types.ts` | `AgentConfig`, `HubLogEvent` (v1 envelope), `AgentSummary`. |
| `fixtures/homie/` | Synthetic `config.yaml`, `hub-log.jsonl` (~50 events spanning 24h), `memory.json`. |
| `docs/decision-log.md` | What v0 ships vs defers. |

## Run locally

```bash
npm install
npm run dev
```

Open <http://localhost:3000>. You should see a card per agent in the roster — **Homie** (Maintly · Infrastructure) plus the four `/sprint` agents (Listados). Click any card → `/agents/<key>` stub.

## Build / lint

```bash
npm run build
npm run lint
```

## Deploy to Vercel

No env vars required for v0 (fixture mode). Once MAI-10 lands:

```
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
```

See `.env.example`.

## Fixtures note

`fixtures/homie/hub-log.jsonl` timestamps are anchored to **2026-05-03**. Past that date the "last activity" label drifts — that's expected for v0; the Supabase Storage adapter (MAI-10) will read live data instead.

## What's next (Linear)

- **MAI-10**: Supabase Storage sync (Hub reads from `agentops-hub/<agent>/` bucket).
- **MAI-12 / 13 / 14 / 18**: Agent Detail page tabs (Activity / Configuration / Memory / Health).
- **MAI-17**: Concierge Inbox at `/concierge`.
- **MAI-21**: Dynamic agents.yaml roster (replace hardcoded `["homie"]`).
- **MAI-9 auth**: Supabase magic-link single-admin gate.

Source of truth for scope: Linear project **AgentOps Hub — MVP**.
