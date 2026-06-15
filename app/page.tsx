import { AgentCard } from "@/components/agent-card";
import { dataSource } from "@/lib/adapter";
import { isToday } from "@/lib/time";
import type { AgentSummary, StatusDot } from "@/lib/types";

export const dynamic = "force-dynamic";

const ROSTER = [
  "homie",
  // /sprint agent team (Listados) — committee plans, builder builds, gatekeeper
  // reviews, retro learns. See fixtures/sprint-*. MAI-21 will make this dynamic.
  "sprint-committee",
  "sprint-builder",
  "sprint-gatekeeper",
  "sprint-retro",
] as const;
const HEADLINE_PLACEHOLDER = "Working normally";

async function loadSummary(agent: string): Promise<AgentSummary> {
  const [config, log] = await Promise.all([
    dataSource.readConfig(agent),
    dataSource.readLogTail(agent, 200),
  ]);

  const lastActivityIso = log[0]?.ts ?? null;
  const runsToday = log.filter((e) => isToday(e.ts)).length;

  let statusDot: StatusDot = "grey";
  if (lastActivityIso) {
    const ageMs = Date.now() - new Date(lastActivityIso).getTime();
    statusDot = ageMs <= 60 * 60 * 1000 ? "green" : "yellow";
  }

  return {
    key: agent,
    name: config.name,
    project: config.project,
    agentClass: config.class,
    statusDot,
    lastActivityIso,
    runsToday,
    headline: HEADLINE_PLACEHOLDER,
  };
}

export default async function HomePage() {
  const summaries = await Promise.all(ROSTER.map(loadSummary));

  return (
    <main className="mx-auto max-w-5xl px-6 py-10">
      <header className="mb-8">
        <h1 className="text-2xl font-semibold tracking-tight">Agents</h1>
        <p className="text-sm text-neutral-500 dark:text-neutral-400">
          AgentOps Hub · read-only dashboard
        </p>
      </header>
      <section className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {summaries.map((s) => (
          <AgentCard key={s.name} summary={s} />
        ))}
      </section>
    </main>
  );
}
