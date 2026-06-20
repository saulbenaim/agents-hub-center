import Link from "next/link";

import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { relativeTime } from "@/lib/time";
import type { AgentSummary, StatusDot } from "@/lib/types";

const dotClass: Record<StatusDot, string> = {
  green: "bg-emerald-500",
  yellow: "bg-amber-500",
  red: "bg-red-500",
  grey: "bg-neutral-400",
};

const dotLabel: Record<StatusDot, string> = {
  green: "Healthy",
  yellow: "Warning",
  red: "Problem",
  grey: "Paused",
};

// Stable color per project so each one reads distinctly across the fleet.
// Any project not explicitly mapped gets a deterministic tone from the palette,
// so new projects stay visually consistent run-to-run without code changes.
const PROJECT_TONE_PALETTE = ["pink", "blue", "green", "amber"] as const;
const PROJECT_TONE_OVERRIDES: Record<string, (typeof PROJECT_TONE_PALETTE)[number]> = {
  maintly: "pink",
  listados: "blue",
  personal: "green",
};

function projectTone(project: string) {
  const key = project.toLowerCase();
  if (PROJECT_TONE_OVERRIDES[key]) return PROJECT_TONE_OVERRIDES[key];
  let hash = 0;
  for (let i = 0; i < key.length; i++) hash = (hash * 31 + key.charCodeAt(i)) | 0;
  return PROJECT_TONE_PALETTE[Math.abs(hash) % PROJECT_TONE_PALETTE.length];
}

function classLabel(c: string) {
  return c.charAt(0).toUpperCase() + c.slice(1);
}

export function AgentCard({ summary }: { summary: AgentSummary }) {
  const href = `/agents/${summary.key}`;
  return (
    <Link href={href} className="block focus:outline-none">
      <Card className="transition hover:-translate-y-0.5 hover:shadow-md focus-within:ring-2 focus-within:ring-neutral-300 dark:focus-within:ring-neutral-700">
        <CardHeader>
          <div className="flex items-center justify-between gap-3">
            <CardTitle>{summary.name}</CardTitle>
            <span
              aria-label={dotLabel[summary.statusDot]}
              title={dotLabel[summary.statusDot]}
              className={cn("h-2.5 w-2.5 rounded-full", dotClass[summary.statusDot])}
            />
          </div>
          <div className="flex flex-wrap items-center gap-1.5 pt-1">
            <Badge tone={projectTone(summary.project)}>{summary.project}</Badge>
            <Badge tone="neutral">{classLabel(summary.agentClass)}</Badge>
          </div>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-neutral-700 dark:text-neutral-300">
            {summary.headline}
          </p>
          <dl className="mt-3 grid grid-cols-2 gap-x-4 gap-y-1 text-xs text-neutral-500 dark:text-neutral-400">
            <dt>Last activity</dt>
            <dd className="text-right text-neutral-800 dark:text-neutral-200">
              {relativeTime(summary.lastActivityIso)}
            </dd>
            <dt>Runs today</dt>
            <dd className="text-right text-neutral-800 dark:text-neutral-200">
              {summary.runsToday}
            </dd>
          </dl>
        </CardContent>
      </Card>
    </Link>
  );
}
