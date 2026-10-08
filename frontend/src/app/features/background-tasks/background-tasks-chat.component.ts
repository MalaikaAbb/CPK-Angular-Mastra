/**
 * SELF-DEFINED — not from the docs. The guide's registration snippet is missing
 * (`<!-- Angular Showcase snippet skipped: missing region mastra-activity-registration -->`);
 * its prose only says to "register the config in an injection context". This
 * does that in the constructor, the way the registerRenderActivityMessage API
 * reference does, beside the standard chat — the guide says "the standard chat
 * surface renders registered activity messages inline, so no custom message
 * list is needed".
 *
 * `background-agents` is the runtime key server.ts gives `backgroundAgentsAgent`;
 * the guide does not name one.
 *
 * https://docs.copilotkit.ai/angular/mastra/background-tasks
 */
import { Component } from '@angular/core';
import { CopilotChat, registerRenderActivityMessage } from '@copilotkit/angular';

import { backgroundTaskActivityRendererConfig } from './background-task-card.component';

@Component({
  selector: 'app-background-tasks-chat',
  imports: [CopilotChat],
  template: `
    <div style="height: 100%">
      <copilot-chat agentId="background-agents" />
    </div>
  `,
})
export class BackgroundTasksChatComponent {
  constructor() {
    registerRenderActivityMessage(backgroundTaskActivityRendererConfig);
  }
}
