/**
 * SELF-DEFINED — not from the docs.
 *
 * The guide's "Render the activity card in your frontend" step says the Angular
 * Showcase "exports ready-to-register configs for both Mastra activity types",
 * then publishes neither: both regions render as
 * `<!-- Angular Showcase snippet skipped: missing region mastra-activity-renderer-configs -->`.
 *
 * Shape follows the component in the registerRenderActivityMessage API reference
 * the guide links to (https://docs.copilotkit.ai/reference/angular/functions/registerRenderActivityMessage).
 * The content fields come from the `mastra-background-task` doc comment in
 * @ag-ui/mastra's type declarations; only the ones this card shows are parsed.
 * The config name mirrors the guide's `observationalMemoryActivityRendererConfig`.
 *
 * https://docs.copilotkit.ai/angular/mastra/background-tasks
 */
import { JsonPipe } from '@angular/common';
import { Component, input } from '@angular/core';
import type { AbstractAgent, ActivityMessage } from '@ag-ui/client';
import {
  type ActivityRenderer,
  type RenderActivityMessageConfig,
} from '@copilotkit/angular';
import { z } from 'zod';

const backgroundTaskSchema = z.object({
  taskId: z.string(),
  toolName: z.string(),
  status: z.enum([
    'started',
    'running',
    'suspended',
    'resumed',
    'completed',
    'failed',
    'cancelled',
  ]),
  args: z.record(z.string(), z.unknown()).optional(),
  result: z.unknown().optional(),
  error: z.string().optional(),
});

type BackgroundTaskContent = z.infer<typeof backgroundTaskSchema>;

@Component({
  selector: 'app-background-task-card',
  template: `
    @let task = content();
    <article
      class="my-2 rounded-lg border border-slate-200 bg-white p-3 text-sm"
      data-testid="background-task-card"
      [attr.data-status]="task.status"
    >
      <p class="font-semibold text-slate-900">{{ task.toolName }}</p>
      <p class="text-slate-600">
        Status: <strong>{{ task.status }}</strong>
      </p>
      @if (task.args) {
        <pre class="mt-1 whitespace-pre-wrap text-xs text-slate-600">{{
          task.args | json
        }}</pre>
      }
      @if (task.status === 'completed') {
        <pre class="mt-1 whitespace-pre-wrap text-xs text-slate-800">{{
          task.result | json
        }}</pre>
      }
      @if (task.error) {
        <p class="mt-1 text-red-700">{{ task.error }}</p>
      }
    </article>
  `,
  imports: [JsonPipe],
})
export class BackgroundTaskCardComponent
  implements ActivityRenderer<BackgroundTaskContent>
{
  readonly activityType = input.required<string>();
  readonly content = input.required<BackgroundTaskContent>();
  readonly message = input.required<ActivityMessage>();
  readonly agent = input<AbstractAgent>();
}

export const backgroundTaskActivityRendererConfig: RenderActivityMessageConfig<BackgroundTaskContent> =
  {
    activityType: 'mastra-background-task',
    content: backgroundTaskSchema,
    component: BackgroundTaskCardComponent,
  };
