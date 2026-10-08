/**
 * SELF-DEFINED — not from the docs. Mounts the guide's two components beside a
 * chat on the same agent, so there is a run for them to observe. The guide's
 * components hard-code `research-agent`; the chat addresses that key too.
 *
 * https://docs.copilotkit.ai/angular/mastra/ag-ui
 */
import { Component } from '@angular/core';
import { CopilotChat } from '@copilotkit/angular';

import { AgentEventsComponent } from './agent-events.component';
import { AgentStatusComponent } from './agent-status.component';

@Component({
  selector: 'app-ag-ui-chat',
  imports: [CopilotChat, AgentStatusComponent, AgentEventsComponent],
  template: `
    <div style="display: flex; flex-direction: column; height: 100%">
      <div
        class="border-b border-slate-200 px-3 py-2 text-sm"
        data-testid="agent-status"
      >
        <app-agent-status />
        <app-agent-events />
      </div>
      <div style="flex: 1; min-height: 0">
        <copilot-chat agentId="research-agent" />
      </div>
    </div>
  `,
})
export class AgUiChatComponent {}
