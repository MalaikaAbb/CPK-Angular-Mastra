/**
 * SELF-DEFINED — not from the docs. The guide calls
 * `registerRenderToolCall(subAgentRendererConfig(name))` without showing
 * `subAgentRendererConfig` or the card it renders. The args schema is each
 * sub-agent tool's `inputSchema` (`{ task: string }`) from the guide's
 * src/mastra/tools/subagents.ts; the card follows the guide's own
 * "Render a tool result" component on the frontend-tools page.
 *
 * https://docs.copilotkit.ai/angular/mastra/multi-agent/subagents
 */
import { Component, input } from '@angular/core';
import {
  type AngularToolCall,
  type RenderToolCallConfig,
  type ToolRenderer,
} from '@copilotkit/angular';
import { z } from 'zod';

import { type SubAgentName } from './subagent-model';

type SubAgentArgs = { task: string };

@Component({
  selector: 'app-subagent-call-card',
  template: `
    @let call = toolCall();
    <article
      class="my-2 rounded-lg border border-slate-200 bg-white p-3 text-sm"
      data-testid="subagent-call-card"
      [attr.data-status]="call.status"
    >
      <p class="font-semibold text-slate-900">{{ call.name }}</p>
      <p class="text-slate-600">{{ call.args.task ?? '…' }}</p>
      @if (call.status === 'complete') {
        <p class="mt-1 text-slate-800">Done</p>
      } @else {
        <p class="mt-1 text-slate-500">Delegating…</p>
      }
    </article>
  `,
})
export class SubAgentCallCardComponent implements ToolRenderer<SubAgentArgs> {
  readonly toolCall = input.required<AngularToolCall<SubAgentArgs>>();
}

export function subAgentRendererConfig(
  name: SubAgentName,
): RenderToolCallConfig<SubAgentArgs> {
  return {
    name,
    args: z.object({ task: z.string() }),
    component: SubAgentCallCardComponent,
  };
}
