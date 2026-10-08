/**
 * Copilot Runtime for this harness.
 *
 * Shape comes from the Angular quickstart's Node runtime server
 * (https://docs.copilotkit.ai/angular/mastra/quickstart), with the agent bound
 * to the Mastra backend in `../backend` — the Angular/Mastra quickstart defers
 * the backend step to "register this backend as the `default` agent".
 *
 * `@ag-ui/mastra` is the bridge: `MastraAgent` wraps a Mastra agent and speaks
 * AG-UI to the runtime, so no generic `HttpAgent` is needed. The Mastra
 * instance is imported directly from `backend/src/mastra`, so
 * `MastraAgent.getLocalAgent` runs the agent in THIS process — there is no
 * second server and no HTTP hop to the agent.
 *
 * `default` and `support` resolve to the same Mastra agent under two ids, each
 * with its own `resourceId` so their memory does not collide. `support` exists
 * so the doc snippets that use `agentId="support"` (Chat UI, Threads) run
 * verbatim.
 *
 * `a2ui: {}` enables A2UIMiddleware for every registered agent, per
 * https://docs.copilotkit.ai/angular/mastra/backend/copilot-runtime
 */
import { createServer } from "node:http";
import { CopilotRuntime } from "@copilotkit/runtime/v2";
import { createCopilotNodeListener } from "@copilotkit/runtime/v2/node";
import { MastraAgent } from "@ag-ui/mastra";
import { mastra } from '../backend/src/mastra';

// subagents : guarded supervisor import start
// SELF-DEFINED — not from the docs. The sub-agents guide's code imports two
// modules it never shows, so the supervisor cannot load. Importing it
// statically would take the whole runtime down with it; this keeps the
// failure to the `subagents` key and logs why.
const supervisorReady: Promise<boolean> = import(
  '../backend/src/mastra/agents/subagents-supervisor'
)
  .then(({ subagentsSupervisorAgent }) => {
    mastra.addAgent(subagentsSupervisorAgent, 'subagentsSupervisorAgent');
    return true;
  })
  .catch((err: unknown) => {
    console.error('[subagents] supervisor failed to load:', err);
    return false;
  });
// subagents : guarded supervisor import end

const runtime = new CopilotRuntime({
  agents: async () => ({
    default: MastraAgent.getLocalAgent({
      mastra,
      agentId: 'myAgent',
      resourceId: 'agent-1',
    }),
    support: MastraAgent.getLocalAgent({
      mastra,
      agentId: 'myAgent',
      resourceId: 'agent-2',
    }),
    // copilot-runtime : "Which name identifies an agent" — the guide's
    // `<copilot-chat agentId="my_agent" />` addresses this key.
    my_agent: MastraAgent.getLocalAgent({
      mastra,
      agentId: 'myAgent',
      resourceId: 'agent-3',
    }),
    // background-tasks : the guide does not name a runtime key; this one is
    // the agent's own id.
    'background-agents': MastraAgent.getLocalAgent({
      mastra,
      agentId: 'backgroundAgentsAgent',
      resourceId: 'agent-4',
    }),
    // ag-ui : `research-agent` is used by the AG-UI guide and defined nowhere;
    // it is one more alias of this harness's agent, like `default`/`support`.
    'research-agent': MastraAgent.getLocalAgent({
      mastra,
      agentId: 'myAgent',
      resourceId: 'agent-6',
    }),
    // subagents : registered only if the supervisor loaded.
    ...((await supervisorReady)
      ? {
          subagents: MastraAgent.getLocalAgent({
            mastra,
            agentId: 'subagentsSupervisorAgent',
            resourceId: 'agent-5',
          }),
        }
      : {}),
  }),
  a2ui: {}
});


const port = Number(process.env["PORT"] ?? 8200);

createServer(
  createCopilotNodeListener({
    runtime,
    basePath: "/api/copilotkit",
    cors: true,
  }),
).listen(port, () => {
  console.log(
    `Copilot Runtime listening at http://localhost:${port}/api/copilotkit`,
  );
});
