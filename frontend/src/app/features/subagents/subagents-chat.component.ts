/**
 * "Rendering a live delegation log".
 * https://docs.copilotkit.ai/angular/mastra/multi-agent/subagents
 *
 * The class members between the region markers are the guide's snippet,
 * unchanged. Everything else is SELF-DEFINED: the guide shows class members
 * only, and reads `this.agentId` and `this.feature` without declaring them.
 * `agentId` is the runtime key server.ts registers the supervisor under;
 * `feature` is "subagents" so the snippet's branch runs. The delegation log
 * template is this harness's own — the guide's renders it in React
 * (delegation-log.tsx in its demo-code tab).
 */
import { Component, computed } from '@angular/core';
import {
  CopilotChat,
  injectAgentStore,
  registerRenderToolCall,
} from '@copilotkit/angular';

import { type SubAgentName, readDelegations } from './subagent-model';
import { subAgentRendererConfig } from './subagent-renderer-config';

@Component({
  selector: 'app-subagents-chat',
  imports: [CopilotChat],
  template: `
    <div style="display: flex; height: 100%; gap: 0.75rem">
      <section
        style="width: 22rem; overflow: auto; padding: 0.75rem"
        aria-label="Delegation log"
        data-testid="delegation-log"
      >
        <h2 class="text-sm font-semibold text-slate-900">
          Delegations ({{ delegations().length }})
        </h2>
        <ol class="mt-2 space-y-2">
          @for (d of delegations(); track d.id) {
            <li
              class="rounded-lg border border-slate-200 bg-white p-2 text-sm"
              [attr.data-status]="d.status"
            >
              <p class="font-semibold">{{ d.sub_agent }} · {{ d.status }}</p>
              <p class="text-slate-600">{{ d.task }}</p>
              <p class="mt-1 whitespace-pre-wrap text-slate-800">
                {{ d.result }}
              </p>
            </li>
          }
        </ol>
      </section>
      <div style="flex: 1; min-width: 0">
        <copilot-chat [agentId]="agentId" />
      </div>
    </div>
  `,
})
export class SubagentsChatComponent {
  protected readonly agentId = 'subagents';
  protected readonly feature: string = 'subagents';

  // subagents : "Rendering a live delegation log" start
  private readonly agentStore = injectAgentStore(this.agentId);
  protected readonly delegations = computed(() =>
    readDelegations(this.agentStore().state()),
  );

  constructor() {
    if (this.feature === "subagents") {
      this.registerSubAgent("research_agent");
      this.registerSubAgent("writing_agent");
      this.registerSubAgent("critique_agent");
    }
  }

  private registerSubAgent(name: SubAgentName): void {
    registerRenderToolCall(subAgentRendererConfig(name));
  }
  // subagents : "Rendering a live delegation log" end
}
