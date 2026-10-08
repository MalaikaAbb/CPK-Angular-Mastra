import { Component } from '@angular/core';

import { RouteHeader } from '../components/route-header';
import { Callout, DocSample, Panel, SourceCode, TryIt } from '../components/ui';

@Component({
  selector: 'app-background-tasks-page',
  imports: [RouteHeader, Panel, Callout, TryIt, SourceCode, DocSample],
  template: `
    <app-route-header path="/background-tasks" />

    <div class="space-y-6">
      <ui-try-it>
        <p class="mt-1 text-slate-700">
          Open the demo and send the guide's prompt:
          <em
            >Kick off deep research on the current landscape of AI agent
            frameworks.</em
          >
        </p>
        <p class="mt-2 text-slate-700">
          <strong>Pass:</strong> an activity card appears inline with no tool
          pill, the agent replies that the work is running in the background,
          and the chat stays responsive. The card staying in a non-completed
          state is expected, because the guide says completion is out of band.
          Observed over AG-UI: one <code>ACTIVITY_SNAPSHOT</code> with status
          <code>running</code> (the guide says <code>started</code>) and
          <code>toolName: "runDeepResearchTool"</code>, the tools-record key
          rather than the tool id <code>run_deep_research</code>. A
          <code>TOOL_CALL_RESULT</code> follows with no
          <code>TOOL_CALL_START</code> before it.
          <strong>Fail:</strong> a plain tool pill renders, or nothing renders
          for the call.
        </p>
      </ui-try-it>

      <ui-panel heading="Define a backgroundable tool">
        <ui-source path="../backend/src/mastra/tools/background-research.ts" />
      </ui-panel>

      <ui-panel heading="Enable the BackgroundTaskManager on the Mastra instance">
        <ui-source path="../backend/src/mastra/index.ts" />
      </ui-panel>

      <ui-panel heading="Add the tool to your agent">
        <p class="mb-3 text-sm text-slate-700">
          The agent is the block between the <code>background-tasks</code>
          region markers at the end of the file.
        </p>
        <ui-source path="../backend/src/mastra/agents/index.ts" />
      </ui-panel>

      <ui-callout tone="warn" title="The guide's import alias is undefined">
        The guide imports
        <code>"&#64;/mastra/tools/background-research"</code>. Neither tsconfig in
        this repo defines <code>&#64;/</code>, and the guide never says to add it,
        so the import uses the equivalent relative path here.
      </ui-callout>

      <ui-callout tone="warn" title="The frontend step is missing from the guide">
        "Render the activity card in your frontend" says the Angular Showcase
        exports ready-to-register configs for both Mastra activity types, then
        publishes neither. Both code regions render as
        <code
          >&lt;!-- Angular Showcase snippet skipped: missing region
          mastra-activity-renderer-configs --&gt;</code
        >
        and <code>… mastra-activity-registration --&gt;</code>. The card and
        registration below are <strong>self-defined</strong>. They follow the
        <code>registerRenderActivityMessage</code> API reference the guide links
        to, and the content shape documented in <code>&#64;ag-ui/mastra</code>.
      </ui-callout>

      <ui-panel heading="Activity card and config (self-defined)">
        <ui-source
          path="src/app/features/background-tasks/background-task-card.component.ts"
        />
      </ui-panel>

      <ui-panel heading="Registration beside the chat (self-defined)">
        <ui-source
          path="src/app/features/background-tasks/background-tasks-chat.component.ts"
        />
      </ui-panel>

      <ui-panel heading="Runtime key">
        <p class="text-sm text-slate-700">
          The guide does not say which runtime key to register the agent under.
          <code>server.ts</code> registers it as
          <code>background-agents</code> through
          <code>MastraAgent.getLocalAgent</code>, like this harness's other
          agents. The guide's <code>getLocalAgents</code> route and
          <code>untilIdle</code> are not used; the guide says
          <code>untilIdle</code> has no benefit without a real background
          worker.
        </p>
      </ui-panel>

      <ui-callout tone="warn" title="Observational Memory section — not wired">
        Its agent snippet passes <code>storage</code> to
        <code>new Memory(...)</code> without defining it. The prose then points
        to <code>observationalMemoryActivityRendererConfig</code> "shown in the
        Angular source regions above", but those are the regions that were
        skipped. Quoted here, not run.
      </ui-callout>

      <ui-doc-sample
        caption="src/mastra/agents/index.ts — from the guide"
        [code]="omMemorySample"
      />
      <ui-doc-sample
        caption="app/api/copilotkit/route.ts — from the guide"
        [code]="omRouteSample"
      />
    </div>
  `,
})
export default class BackgroundTasksPage {
  protected readonly omMemorySample = `memory: new Memory({
  storage,
  options: {
    observationalMemory: {
      scope: "thread",
      observation: { messageTokens: 600, bufferTokens: 300 },
      model: openai("gpt-4.1"),
    },
  },
}),`;

  protected readonly omRouteSample = `const localAgents = getLocalAgents({
  mastra,
  resourceId: "user-1",
  observationalMemory: true, // [!code highlight]
});`;
}
