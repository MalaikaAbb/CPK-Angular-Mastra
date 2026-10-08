/**
 * "Which name identifies an agent" and "The Default Agent".
 * https://docs.copilotkit.ai/angular/mastra/copilot-runtime
 *
 * Left: no agentId, so the chat uses the runtime's `default` key. Right: the
 * guide's `<copilot-chat agentId="my_agent" />`, verbatim — server.ts registers
 * `my_agent` as a key (bound to the Mastra record key `myAgent`), so the name
 * the frontend asks for is the agents-map key, not the agent's `name`
 * ("My Agent") or `id`.
 *
 * The side-by-side layout is SELF-DEFINED; it is not in the guide.
 */
import { Component } from '@angular/core';
import { CopilotChat } from '@copilotkit/angular';

@Component({
  selector: 'app-runtime-keys-chat',
  imports: [CopilotChat],
  template: `
    <div style="display: flex; height: 100%; gap: 0.75rem">
      <section
        style="flex: 1; min-width: 0; display: flex; flex-direction: column"
        data-testid="default-agent-chat"
      >
        <h2 class="px-3 py-2 text-sm font-semibold">default</h2>
        <div style="flex: 1; min-height: 0"><copilot-chat /></div>
      </section>
      <section
        style="flex: 1; min-width: 0; display: flex; flex-direction: column"
        data-testid="my-agent-chat"
      >
        <h2 class="px-3 py-2 text-sm font-semibold">my_agent</h2>
        <div style="flex: 1; min-height: 0">
          <copilot-chat agentId="my_agent" />
        </div>
      </section>
    </div>
  `,
})
export class RuntimeKeysChatComponent {}
