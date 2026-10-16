import { Component } from '@angular/core';

import { RouteHeader } from '../components/route-header';
import { Callout, DocSample, Panel, SourceCode, TryIt } from '../components/ui';

@Component({
  selector: 'app-webmcp-page',
  imports: [RouteHeader, Panel, Callout, TryIt, SourceCode, DocSample],
  template: `
    <app-route-header path="/webmcp" />

    <div class="space-y-6">
      <ui-try-it>
        <p class="mt-1 text-slate-700">
          Open the demo. In Chrome 149+ (or with
          <code>chrome://flags/#enable-webmcp-testing</code> enabled), open the
          Model Context Tool Inspector or inspect <code>document.modelContext</code>
          in the browser DevTools console.
        </p>
        <p class="mt-2 text-slate-700">
          You can also test the tool through the CopilotKit chat: send
          <em>"Search for my open orders"</em> or
          <em>"What orders do I have with status open?"</em>
        </p>
        <p class="mt-2 text-slate-700">
          <strong>Pass:</strong>
          <code>document.modelContext</code> registers the <code>searchOrders</code>
          tool with its description, parameters schema, and
          <code>readOnlyHint: true</code> annotation. In chat, the agent calls
          the <code>searchOrders</code> frontend tool and returns the JSON order
          records.
          <strong>Fail:</strong>
          The tool is not registered on <code>document.modelContext</code> when the
          flag is active, or the chat does not invoke the frontend tool.
        </p>
      </ui-try-it>

      <ui-callout tone="warn" title="WebMCP browser requirements">
        WebMCP is an experimental W3C Community Group report. Chrome offers it
        through an origin trial beginning in Chrome 149, or through the
        <code>chrome://flags/#enable-webmcp-testing</code> flag for local development.
        When <code>document.modelContext</code> is unavailable, CopilotKit safely
        does nothing and the tool remains usable by the CopilotKit agent.
      </ui-callout>

      <ui-panel heading="Angular frontend tool — from the guide">
        <p class="mb-3 text-sm text-slate-700">
          Registers the tool in an Angular injection context with
          <code>webmcp: &#123; annotations: &#123; readOnlyHint: true &#125; &#125;</code>.
        </p>
        <ui-source path="src/app/features/webmcp/order-search.component.ts" />
      </ui-panel>

      <ui-panel heading="WebMCP only, with no agent — from the guide">
        <p class="mb-3 text-sm text-slate-700">
          For browser code without a framework provider, registers the tool
          directly onto a <code>CopilotKitCore</code> instance.
        </p>
        <ui-source path="src/app/features/webmcp/webmcp.ts" />
      </ui-panel>

      <ui-panel heading="Testing WebMCP beside chat (harness test page)">
        <p class="mb-3 text-sm text-slate-700">
          Mounts <code>OrderSearchComponent</code> beside <code>copilot-chat</code>
          and displays the live <code>document.modelContext</code> availability status.
        </p>
        <ui-source path="src/app/features/webmcp/webmcp-chat.component.ts" />
      </ui-panel>

      <ui-doc-sample
        caption="WebMCP tool registration — from the guide"
        [code]="sampleRegistration"
      />
    </div>
  `,
})
export default class WebmcpPage {
  protected readonly sampleRegistration = `registerFrontendTool({
  name: "searchOrders",
  description: "Search the signed-in user's orders by status",
  parameters: z.object({
    status: z.enum(["open", "shipped", "delivered"]),
  }),
  handler: async ({ status }) => {
    const orders = await searchOrders(status);
    return JSON.stringify(orders);
  },
  webmcp: {
    annotations: {
      readOnlyHint: true,
    },
  },
});`;
}

