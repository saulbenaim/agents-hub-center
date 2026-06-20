# Create / Manage plan

The hub today is **review-only**: it reads each agent's `config.yaml`, `hub-log.jsonl`,
and `memory.json` from fixtures (and, after MAI-10, from Supabase Storage) and renders
them. There is no write path. This doc plans the jump from *review* to *create + manage*,
keeping every step shippable on its own.

Scope reminder: the hub is now scoped to **all of Saul's agents across every project**
(Maintly, Listados, personal), not one fleet. Create/manage must be project-aware from
day one — every agent already carries a `project` field.

## What "create / manage" means here

| Verb | Concretely |
| --- | --- |
| **Review** (done in v0) | See the roster, status, last activity, runs today; soon the detail tabs (Activity / Config / Memory / Health). |
| **Manage** | Edit an existing agent's `config.yaml` from the UI — description, class, project, triggers, tools, models, workflows, skills. Pause/resume. |
| **Create** | Add a brand-new agent: pick a name + project + class, scaffold a `config.yaml`, and have it appear in the roster without a code change. |

## The core blocker: there is no write path

`lib/adapter/AgentDataSource` is **read-only** (`readConfig`, `readLogTail`, `readMemory`).
The fixture adapter reads files; the planned Supabase adapter reads a bucket. Neither
writes. Create/manage needs a *writable* adapter surface plus a server-side mutation route
(RSC pages can't write on their own — this needs Route Handlers / Server Actions).

This also forces the **MAI-21 dynamic roster** to land first: today the roster is the
hardcoded `ROSTER` const in `app/page.tsx`. You can't "create an agent and see it appear"
while the roster is a literal array.

## Proposed phases (each independently shippable)

### Phase A — Detail tabs (the review surface to manage *from*)
Build the stubbed Agent Detail tabs (MAI-12 Activity / MAI-13 Config / MAI-14 Memory /
MAI-18 Health). These are read-only but are the screens the "Edit" affordance will live on.
Ship value immediately; no write path needed yet.

### Phase B — Dynamic roster (MAI-21)
Replace the `ROSTER` const with `dataSource.readRoster()` backed by an `agents.yaml`
(or a `roster.json`) listing `{ key, project }`. Pure refactor of the read path — no UI
change beyond cards now coming from data. **Prereq for create.**

### Phase C — Writable adapter + Manage (edit config)
1. Extend the interface: `writeConfig(agent, config)`, `setStatus(agent, "paused" | "active")`.
2. Implement for the fixture adapter first (writes back to `fixtures/<key>/config.yaml`)
   so it works locally with zero infra, then for Supabase Storage.
3. Add a server mutation: a Route Handler `app/api/agents/[agent]/config/route.ts` (or a
   Server Action) that validates and calls `writeConfig`. **Validate with a schema** —
   reuse/promote the `AgentConfig` type into a Zod schema so bad edits can't corrupt YAML.
4. UI: an "Edit" mode on the Config tab — a form bound to `AgentConfig`. Save → mutation →
   revalidate the page.

### Phase D — Create
1. `dataSource.createAgent({ key, name, project, class })` — scaffolds a minimal
   `config.yaml` + empty `hub-log.jsonl` + `memory.json`, and appends to the roster.
2. UI: a "New agent" button on `/` → a short create form (name, project picker seeded from
   existing projects + free-text, class). On submit → redirect to the new agent's Config tab
   in edit mode to finish setup.

### Phase E — Guardrails (do not skip once writes exist)
- **Auth**: MAI-9 (Supabase magic-link single-admin gate) becomes mandatory the moment the
  app can write. A publicly writable hub is not acceptable. Gate all mutation routes.
- **Validation**: every write goes through the schema (Phase C.3).
- **Audit**: append a `hub-log` event (`config_edited`, `agent_created`, `agent_paused`) so
  changes show up in the very Activity timeline the hub renders. The hub manages itself.

## Open decisions for Saul

1. **Store of truth for config**: keep editing YAML files (git-friendly, diffable) or move
   config into a Supabase table (queryable, but no git history)? Recommendation: YAML in the
   bucket — keeps the "agents are files" model and stays diffable.
2. **Does the hub *run* agents, or just describe them?** This plan covers managing agent
   *definitions*. Triggering/executing agents from the hub is a separate, larger question
   (it would need to reach into wherever agents actually run). Out of scope here.
3. **Create scope**: just scaffold config (this plan), or also generate starter
   prompts/skills from a template? Templates can be a fast-follow.

## Sequencing summary
A (tabs) → B (dynamic roster) → C (manage/edit) → D (create) → E (auth+validation+audit,
landed alongside C since it's a hard prerequisite for any write).
