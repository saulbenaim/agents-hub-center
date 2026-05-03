import { promises as fs } from "node:fs";
import path from "node:path";

import yaml from "js-yaml";

import type { AgentConfig, HubLogEvent, Memory } from "@/lib/types";

const FIXTURE_ROOT = path.join(process.cwd(), "fixtures");

function agentDir(agent: string): string {
  return path.join(FIXTURE_ROOT, agent);
}

export async function readConfig(agent: string): Promise<AgentConfig> {
  const raw = await fs.readFile(path.join(agentDir(agent), "config.yaml"), "utf8");
  return yaml.load(raw) as AgentConfig;
}

export async function readLogTail(
  agent: string,
  limit = 100,
): Promise<HubLogEvent[]> {
  const raw = await fs.readFile(path.join(agentDir(agent), "hub-log.jsonl"), "utf8");
  const lines = raw.split("\n").filter((l) => l.trim().length > 0);
  const events = lines.map((l) => JSON.parse(l) as HubLogEvent);
  // Newest-first, capped.
  events.sort((a, b) => b.ts.localeCompare(a.ts));
  return events.slice(0, limit);
}

export async function readMemory(agent: string): Promise<Memory> {
  const raw = await fs.readFile(path.join(agentDir(agent), "memory.json"), "utf8");
  return JSON.parse(raw) as Memory;
}
