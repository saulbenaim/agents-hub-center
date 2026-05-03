import type { AgentConfig, HubLogEvent, Memory } from "@/lib/types";

import * as fixture from "./fixture";

export interface AgentDataSource {
  readConfig(agent: string): Promise<AgentConfig>;
  readLogTail(agent: string, limit?: number): Promise<HubLogEvent[]>;
  readMemory(agent: string): Promise<Memory>;
}

// Fixture adapter for v0. MAI-10 swaps this to a Supabase Storage adapter
// that implements the same interface — no page or component changes needed.
export const dataSource: AgentDataSource = {
  readConfig: fixture.readConfig,
  readLogTail: fixture.readLogTail,
  readMemory: fixture.readMemory,
};
