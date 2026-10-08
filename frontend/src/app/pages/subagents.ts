import { Component } from '@angular/core';

import { RouteHeader } from '../components/route-header';
import { Callout, Panel, SourceCode, TryIt } from '../components/ui';

@Component({
  selector: 'app-subagents-page',
  imports: [RouteHeader, Panel, Callout, TryIt, SourceCode],
  template: `
    <app-route-header path="/subagents" />

    <div class="space-y-6">
      <ui-try-it>
        <p class="mt-1 text-slate-700">
          Start the runtime and read its log, then open the demo and ask
          <em>Write a short paragraph about the history of the bicycle.</em>
        </p>
        <p class="mt-2 text-slate-700">
          <strong>Pass:</strong> the supervisor delegates research → writing →
          critique, a card renders for each sub-agent call, and the delegation
          log on the left grows with each one.
          <strong>Fail (current):</strong> the runtime logs
          <code>[subagents] supervisor failed to load: … Cannot find package
          '&#64;/mastra'</code>. <code>/api/copilotkit/info</code> lists no
          <code>subagents</code> key, and the chat cannot resolve its agent.
        </p>
      </ui-try-it>

      <ui-callout tone="warn" title="The guide's backend imports two files it never shows">
        <code>src/mastra/tools/subagents.ts</code> imports
        <code>openai</code> from <code>"&#64;/mastra/_header_forwarding"</code>
        (a shim for the docs team's own aimock test server, per its comment) and
        <code>writeDelegationsToWorkingMemory</code> from
        <code>"./working-memory"</code>. Neither file is on the page or in its
        demo-code tab. Both are kept as published, so the module cannot load.
        The "Setting up sub-agents" step is also absent from the page
        (<code>setup skipped: subagents-setup is not bundled for mastra</code>).
      </ui-callout>

      <ui-panel heading="Exposing sub-agents as tools — verbatim">
        <ui-source path="../backend/src/mastra/tools/subagents.ts" />
      </ui-panel>

      <ui-panel heading="The supervisor — from the guide's demo-code tab">
        <p class="mb-3 text-sm text-slate-700">
          The page's text never shows the supervisor agent or its
          <code>SubagentsAgentState</code>. Both are copied from the
          <code>src/mastra/agents/index.ts</code> tab of the page's interactive
          demo; the header lists every change.
        </p>
        <ui-source path="../backend/src/mastra/agents/subagents-supervisor.ts" />
      </ui-panel>

      <ui-panel heading="How the failure is contained (self-defined)">
        <p class="mb-3 text-sm text-slate-700">
          The runtime loads the Mastra instance in-process, so a static import of
          the supervisor would stop the whole runtime. <code>server.ts</code>
          imports it behind a guard instead. Only the
          <code>subagents</code> key depends on it.
        </p>
        <ui-source path="server.ts" />
      </ui-panel>

      <ui-panel heading="Rendering a live delegation log">
        <p class="mb-3 text-sm text-slate-700">
          The class members between the region markers are the guide's snippet.
          The snippet reads <code>this.agentId</code> and
          <code>this.feature</code> without declaring them.
        </p>
        <ui-source path="src/app/features/subagents/subagents-chat.component.ts" />
      </ui-panel>

      <ui-callout tone="warn" title="The frontend helpers are not shown (self-defined)">
        The snippet uses <code>readDelegations</code>,
        <code>SubAgentName</code> and <code>subAgentRendererConfig</code>, and
        the guide shows none of them or the cards they render. The guide's demo
        tab has only React files (<code>page.tsx</code>,
        <code>delegation-log.tsx</code>). The versions below are
        <strong>self-defined</strong>, shaped on the guide's own backend
        payload.
      </ui-callout>

      <ui-panel heading="readDelegations and SubAgentName (self-defined)">
        <ui-source path="src/app/features/subagents/subagent-model.ts" />
      </ui-panel>

      <ui-panel heading="subAgentRendererConfig and its card (self-defined)">
        <ui-source path="src/app/features/subagents/subagent-renderer-config.ts" />
      </ui-panel>
    </div>
  `,
})
export default class SubagentsPage {}
