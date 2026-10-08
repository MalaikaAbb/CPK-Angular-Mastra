// subagents : supervisor agent start
// Not in the guide's text. Copied from the guide's own demo-code tab
// ("src/mastra/agents/index.ts") at
// https://docs.copilotkit.ai/angular/mastra/multi-agent/subagents — only the
// pieces the supervisor needs. Changes from that file:
//   - imports trimmed to what these pieces use;
//   - the "@/mastra/tools" barrel import is the relative "../tools/subagents"
//     (the alias is not defined in this repo);
//   - "@/mastra/_header_forwarding" is left as published and does not resolve.
// Not registered in ./index.ts: server.ts loads it behind a guard.

// Header-forwarding shim: the ag-ui/mastra adapter does not propagate
// inbound x-* headers (e.g. x-aimock-context) to the Vercel AI SDK provider.
// `@/mastra/_header_forwarding` re-exports `openai` with a fetch wrapper
// that merges ALS-bound headers into every outbound LLM call. The
// CopilotKit route is responsible for binding the per-request snapshot via
// `withForwardedHeaders(req, () => handleRequest(req))`.
import { openai } from "@/mastra/_header_forwarding";
import { Agent } from "@mastra/core/agent";
import { LibSQLStore } from "@mastra/libsql";
import { z } from "zod";
import { Memory } from "@mastra/memory";
import {
  researchAgentTool,
  writingAgentTool,
  critiqueAgentTool,
} from "../tools/subagents";

/**
 * Persistent SQLite URL for working-memory storage.
 *
 * Why not `file::memory:`: an in-memory store resets on every process
 * restart. For demos that surface user state to the UI (notes panel, agent
 * delegations, preferences), that is silent data loss — the user adds notes,
 * the dev hits save, Next.js HMR restarts the server, and the notes vanish
 * with no error.
 *
 * Tests can override via `MASTRA_WORKING_MEMORY_URL=file::memory:` to keep
 * fixture isolation. The default is a relative file path so the DB lives
 * next to the package and survives reloads.
 */
export const WORKING_MEMORY_DB_URL =
  process.env.MASTRA_WORKING_MEMORY_URL ?? "file:./mastra-memory.db";

/**
 * Shared-state schema for the Sub-Agents demo.
 *
 * `delegations` is appended to by the supervisor as it fans out work to the
 * research / writing / critique sub-agents. The UI subscribes via
 * `useAgent({ updates: [OnStateChanged] })` and renders a live delegation
 * log.
 */
export const SubagentsAgentState = z.object({
  delegations: z
    .array(
      z.object({
        id: z.string(),
        sub_agent: z.enum([
          "research_agent",
          "writing_agent",
          "critique_agent",
        ]),
        task: z.string(),
        status: z.enum(["running", "completed", "failed"]),
        result: z.string(),
      }),
    )
    .default([]),
});

/**
 * Mastra agent backing the Sub-Agents demo.
 *
 * Supervisor pattern: this agent delegates to three specialized sub-agents
 * (research / writing / critique) exposed as tools. Each tool runs the
 * matching sub-agent under the hood and returns both its output and a
 * `delegation` entry the supervisor must append to working memory's
 * `delegations` array. The UI renders that array live as a delegation log.
 *
 * Sub-agents are defined alongside the tools in
 * `src/mastra/tools/subagents.ts` — they're full `Agent` instances with
 * their own system prompts and don't share memory with the supervisor.
 */
export const subagentsSupervisorAgent = new Agent({
  id: "subagents-supervisor",
  name: "Subagents Supervisor",
  tools: {
    researchAgentTool,
    writingAgentTool,
    critiqueAgentTool,
  },
  model: openai("gpt-5-mini"),
  instructions: `You are a supervisor agent that coordinates three specialized sub-agents to produce high-quality deliverables.

Available sub-agents (call them as tools):
  - research_agent: gathers facts on a topic.
  - writing_agent: turns facts + a brief into a polished draft.
  - critique_agent: reviews a draft and suggests improvements.

For most non-trivial user requests, delegate in sequence: research -> write -> critique. Pass the relevant facts/draft through the \`task\` argument of each tool. Keep your own messages short — explain the plan once, delegate, then return a concise summary once done.

DELEGATION LOG (working memory):
Each sub-agent tool returns a JSON payload of the form \`{ "result": <text>, "delegation": <Delegation> }\`. The tool itself appends the \`delegation\` object to the \`delegations\` array in working memory — you do NOT need to call \`updateWorkingMemory\` for delegations. Just keep delegating; the live log updates automatically.

If a delegation's \`status\` field is \`"failed"\`, treat it as a real error: do not pretend the sub-agent succeeded. Decide whether to retry, fall back to a different sub-agent, or summarize the failure to the user.`,
  memory: new Memory({
    storage: new LibSQLStore({
      id: "subagents-supervisor-memory",
      url: WORKING_MEMORY_DB_URL,
    }),
    options: {
      workingMemory: {
        enabled: true,
        schema: SubagentsAgentState,
      },
    },
  }),
});

// subagents : supervisor agent end
