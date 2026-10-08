import { Component } from '@angular/core';

import { RouteHeader } from '../components/route-header';
import { Callout, DocSample, Panel, SourceCode, TryIt } from '../components/ui';

@Component({
  selector: 'app-copilot-runtime-page',
  imports: [RouteHeader, Panel, Callout, TryIt, SourceCode, DocSample],
  template: `
    <app-route-header path="/copilot-runtime" />

    <div class="space-y-6">
      <ui-try-it>
        <p class="mt-1 text-slate-700">
          Run <code>curl http://localhost:8200/api/copilotkit/info</code>, then
          open the demo and send <em>Hello</em> in each chat.
        </p>
        <p class="mt-2 text-slate-700">
          <strong>Pass:</strong> <code>/info</code> lists <code>default</code>
          and <code>my_agent</code> among its agents. Both chats answer: the
          left one with no <code>agentId</code> (the default agent), and the
          right one with the guide's <code>agentId="my_agent"</code>.
          <strong>Fail:</strong> the right chat raises
          <code>CopilotKitAgentDiscoveryError</code>, which means the name is
          not a key of the runtime's <code>agents</code> map.
        </p>
      </ui-try-it>

      <ui-panel heading="This harness's runtime">
        <p class="mb-3 text-sm text-slate-700">
          Each key in the <code>agents</code> map is a name the frontend can ask
          for. <code>my_agent</code> is bound to the Mastra record key
          <code>myAgent</code>, whose agent is named "My Agent". Neither of
          those two names routes; only the key does. The agents are local
          (<code>getLocalAgent</code>, in-process).
        </p>
        <ui-source path="server.ts" />
      </ui-panel>

      <ui-panel heading="Which name identifies an agent / the default agent">
        <ui-source
          path="src/app/features/copilot-runtime/runtime-keys-chat.component.ts"
        />
      </ui-panel>

      <ui-panel heading="Point the frontend at the endpoint">
        <ui-source path="src/app/app.config.ts" />
      </ui-panel>

      <ui-callout title="What this repo does not run from the guide">
        The guide's server examples are a Next.js catch-all route handler built
        on <code>createCopilotRuntimeHandler</code>. This repo serves the same
        <code>CopilotRuntime</code> from Node with
        <code>createCopilotNodeListener</code>, the quickstart's shape for
        Angular. <code>getRemoteAgents</code> needs a separate
        <code>mastra dev</code> process this harness does not run.
        <code>mcpApps</code> needs an MCP server, and
        <code>selfManagedAgents</code> bypasses the runtime entirely. These are
        quoted below, not run.
      </ui-callout>

      <ui-doc-sample
        caption="app/api/copilotkit/[[...slug]]/route.ts — from the guide"
        [code]="handlerSample"
      />
      <ui-doc-sample caption="Remote agents — from the guide" [code]="remoteSample" />
    </div>
  `,
})
export default class CopilotRuntimePage {
  protected readonly handlerSample = `import {
  CopilotRuntime,
  createCopilotRuntimeHandler,
  InMemoryAgentRunner,
} from "@copilotkit/runtime/v2";

const runtime = new CopilotRuntime({
  agents: {
    // your agents go here
  },
  runner: new InMemoryAgentRunner(),
});

const handler = createCopilotRuntimeHandler({
  runtime,
  basePath: "/api/copilotkit",
});

export const GET = handler;
export const POST = handler;
export const PATCH = handler;
export const DELETE = handler;`;

  protected readonly remoteSample = `import { CopilotRuntime, createCopilotRuntimeHandler, InMemoryAgentRunner } from "@copilotkit/runtime/v2";
import { MastraAgent } from "@ag-ui/mastra";
import { MastraClient } from "@mastra/client-js";

const mastraClient = new MastraClient({
  baseUrl: process.env.MASTRA_BASE_URL ?? "http://127.0.0.1:4111",
});

const runtime = new CopilotRuntime({
  agents: () =>
    MastraAgent.getRemoteAgents({
      mastraClient,
      resourceId: "user-1",
    }),
  runner: new InMemoryAgentRunner(),
});`;
}
