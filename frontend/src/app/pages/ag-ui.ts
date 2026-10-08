import { Component } from '@angular/core';

import { RouteHeader } from '../components/route-header';
import { Callout, DocSample, Panel, SourceCode, TryIt } from '../components/ui';

@Component({
  selector: 'app-ag-ui-page',
  imports: [RouteHeader, Panel, Callout, TryIt, SourceCode, DocSample],
  template: `
    <app-route-header path="/ag-ui" />

    <div class="space-y-6">
      <ui-try-it>
        <p class="mt-1 text-slate-700">
          Open the demo with the browser console open, and send
          <em>What is the weather in Paris?</em> (it calls the agent's
          <code>getWeather</code> tool, so a tool-call event fires)
        </p>
        <p class="mt-2 text-slate-700">
          <strong>Pass:</strong> the status strip counts messages and shows
          "Agent is running…" during the run. The console logs
          <code>Streaming text:</code>, <code>Tool called:</code> and
          <code>State changed:</code> lines.
          <strong>Fail:</strong> the chat raises
          <code>CopilotKitAgentDiscoveryError</code> for
          <code>research-agent</code>, or no console lines appear.
        </p>
      </ui-try-it>

      <ui-callout tone="warn" title="research-agent is never defined">
        Both of the guide's components call
        <code>injectAgentStore("research-agent")</code>, and nothing on the page
        defines that agent. <code>server.ts</code> registers the key as one more
        alias of this harness's agent (<code>myAgent</code>), the same way it
        registers <code>default</code> and <code>support</code>.
      </ui-callout>

      <ui-panel heading="Accessing your agent with injectAgentStore — verbatim">
        <ui-source path="src/app/features/ag-ui/agent-status.component.ts" />
      </ui-panel>

      <ui-panel heading="Subscribing to AG-UI events">
        <p class="mb-3 text-sm text-slate-700">
          The guide shows only the class members. The decorator and imports
          around them are the minimum needed to mount it.
        </p>
        <ui-source path="src/app/features/ag-ui/agent-events.component.ts" />
      </ui-panel>

      <ui-panel heading="Both, against one chat (self-defined)">
        <ui-source path="src/app/features/ag-ui/ag-ui-chat.component.ts" />
      </ui-panel>

      <ui-doc-sample
        caption="What your component sees — from the guide"
        [code]="proxySeenSample"
      />
      <ui-doc-sample
        caption="What happens underneath — from the guide"
        [code]="proxyUnderneathSample"
      />
    </div>
  `,
})
export default class AgUiPage {
  protected readonly proxySeenSample = `const store = injectAgentStore("default");
const agent = store().agent;
store().messages();
store().state();
agent.subscribe({ /* … */ });`;

  protected readonly proxyUnderneathSample = `// injectAgentStore() → registry checks /info → resolves a proxy agent
// core.runAgent({ agent }) → runtime POST → agent execution → SSE events`;
}
