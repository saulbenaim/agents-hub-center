// Hub event-log entry. v1 envelope (MAI-5):
//   { ts: ISO8601, agent: string, event: string, ...arbitrary keys }
// v1.1 will add `workflow` and `skill` (MAI-7) — out of v0 scope.
export type HubLogEvent = {
  ts: string;
  agent: string;
  event: string;
  [k: string]: unknown;
};

// Mirrors the per-agent config.yaml schema (MAI-6).
export type AgentConfig = {
  name: string;
  project: string;
  class: "infrastructure" | "product" | "research" | "ops" | string;
  description?: string;
  triggers?: AgentTrigger[];
  tools?: string[];
  models?: Record<string, string>;
  workflows?: string[];
  skills?: string[];
};

export type AgentTrigger = {
  name: string;
  type: "scheduled" | "event" | "manual" | string;
  schedule?: string;
  description?: string;
};

// Memory shape (MAI-14 / memory-layer-spec). Loose for v0.
export type Memory = {
  conversations?: Record<string, unknown>;
  users?: Record<string, unknown>;
  [k: string]: unknown;
};

export type StatusDot = "green" | "yellow" | "red" | "grey";

// Card-shaped derived type used by the Agents List page.
export type AgentSummary = {
  name: string;
  project: string;
  agentClass: string;
  statusDot: StatusDot;
  lastActivityIso: string | null;
  runsToday: number;
  headline: string;
};
