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
 *
 * `intelligence` puts the runtime in Intelligence mode, which is what serves
 * the thread endpoints the Threads guide's list and drawer read.
 */
import { createServer } from "node:http";
import { fileURLToPath } from "node:url";
import { CopilotKitIntelligence, CopilotRuntime } from "@copilotkit/runtime/v2";
import { createCopilotNodeListener } from "@copilotkit/runtime/v2/node";
import { MastraAgent } from "@ag-ui/mastra";
import { mastra } from '../backend/src/mastra';

/**
 * Only `node ci/automate.mjs` loads the root `.env`; `npm run dev` by hand
 * does not, so `CPK_INTELLIGENCE_API_KEY` would never reach the Intelligence
 * client. Load it here, before anything reads `process.env`.
 *
 * The root is the only `.env` this project reads (see `.env.example`), so the
 * path is `../.env`, resolved from `import.meta.url` so it does not depend on
 * the cwd. `process.loadEnvFile` is Node's own loader (>= 20.12) and never
 * overrides a variable the shell already exported. Guarded so a missing `.env`
 * leaves dev running instead of crashing.
 */
try {
  process.loadEnvFile(fileURLToPath(new URL("../.env", import.meta.url)));
} catch {
  // No root .env — fall back to whatever the shell exported.
}

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

/**
 * CopilotKit Intelligence client.
 * https://docs.copilotkit.ai/intelligence/connect-your-runtime
 *
 * `apiKey` is the only required field — the key scopes the project. `apiUrl`
 * and `wsUrl` are deliberately left unset so both planes point at the managed
 * platform; that page is explicit that they are overridden together or not at
 * all, because the REST and realtime planes live on different hosts.
 */
const intelligence = new CopilotKitIntelligence({
  apiKey: process.env["CPK_INTELLIGENCE_API_KEY"]!,
});

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
  a2ui: {},
  // Passing `intelligence` (never `runner` — the two cannot be combined) is
  // what puts this runtime in Intelligence mode. An SSE runtime replies in the
  // browser exactly the same way with the credential never read.
  intelligence,
  /**
   * LOCAL PLACEHOLDER — NOT AN AUTHENTICATION CHECK.
   *
   * Threads are per-user, and the runtime options type requires
   * `identifyUser` for any runtime serving a web surface. This harness has no
   * login, and the browser sends no `x-user-id` / `x-user-name` header, so in
   * practice every local visitor falls through to the same constant id and
   * shares one thread history. That is acceptable for a local doc harness and
   * for nothing else.
   *
   * In production, resolve the user from a server-verified session or bearer
   * token on `request` and THROW on an unauthenticated request. Never trust a
   * caller-supplied id header: anyone can set one and read another user's
   * threads.
   */
  identifyUser: (request) => ({
    id: request.headers.get("x-user-id") ?? "local-harness-user",
    name: request.headers.get("x-user-name") ?? "Local harness user",
  }),
  /**
   * Memory is opt-in even in Intelligence mode: without this every
   * `/memories/*` request 404s and `injectMemories().isAvailable()` stays
   * false. `access` runs per request, for the agent and for the browser
   * (`consumer`), and grants each scope separately.
   *
   * LOCAL PLACEHOLDER, like `identifyUser` above: a constant grant for every
   * caller. In production, derive it from the verified `user`.
   */
  memory: {
    access: () => ({ user: "read-write", project: "read" }),
  },
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
