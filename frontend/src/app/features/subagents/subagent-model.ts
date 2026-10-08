/**
 * SELF-DEFINED — not from the docs. The guide's frontend snippet uses
 * `SubAgentName` and `readDelegations` without showing either. The shape is
 * taken from the guide's own backend: `SubagentsAgentState` (demo-code tab)
 * and `buildDelegationPayload` in src/mastra/tools/subagents.ts.
 *
 * https://docs.copilotkit.ai/angular/mastra/multi-agent/subagents
 */
export type SubAgentName = 'research_agent' | 'writing_agent' | 'critique_agent';

export interface Delegation {
  id: string;
  sub_agent: SubAgentName;
  task: string;
  status: 'running' | 'completed' | 'failed';
  result: string;
}

/** Reads the `delegations` slot out of agent state, tolerating its absence. */
export function readDelegations(state: unknown): Delegation[] {
  if (typeof state !== 'object' || state === null) return [];
  const delegations = (state as { delegations?: unknown }).delegations;
  return Array.isArray(delegations) ? (delegations as Delegation[]) : [];
}
