import Link from "next/link";

type Params = Promise<{ agent: string }>;

export default async function AgentDetailPage({ params }: { params: Params }) {
  const { agent } = await params;

  return (
    <main className="mx-auto max-w-3xl px-6 py-10">
      <Link
        href="/"
        className="text-sm text-neutral-500 hover:text-neutral-800 dark:text-neutral-400 dark:hover:text-neutral-200"
      >
        ← Back to Agents
      </Link>
      <h1 className="mt-4 text-2xl font-semibold tracking-tight capitalize">
        {agent}
      </h1>
      <p className="mt-2 text-sm text-neutral-500 dark:text-neutral-400">
        Agent Detail — coming soon. Tabs land in MAI-12 (Activity), MAI-13
        (Configuration), MAI-14 (Memory), MAI-18 (Health).
      </p>
    </main>
  );
}
