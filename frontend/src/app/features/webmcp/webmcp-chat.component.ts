/**
 * Mounts OrderSearchComponent (registering searchOrders with webmcp enabled)
 * beside a chat interface so the tool can be tested both within CopilotKit chat
 * and by WebMCP-aware browser agents via document.modelContext.
 *
 * https://docs.copilotkit.ai/angular/mastra/webmcp
 */
import { Component, signal } from '@angular/core';
import { CopilotChat } from '@copilotkit/angular';

import { OrderSearchComponent } from './order-search.component';

@Component({
  selector: 'app-webmcp-chat',
  imports: [CopilotChat, OrderSearchComponent],
  template: `
    <div style="display: flex; flex-direction: column; height: 100%">
      <app-order-search />

      <div style="flex: 1; min-height: 0">
        <copilot-chat />
      </div>
    </div>
  `,
})
export class WebmcpChatComponent {
  protected readonly hasModelContext = signal(
    typeof document !== 'undefined' && 'modelContext' in document,
  );
}
