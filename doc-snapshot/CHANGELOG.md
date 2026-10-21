# Doc drift changelog

What the CopilotKit docs changed under this repo, written by the sync on
`/doc-sync`. Only pages that actually moved are recorded — a sync that finds
everything unchanged writes nothing here at all.

Holds the 3 most recent dated entries. When a change lands on a fourth
date, the oldest entry is dropped. Entries are counted, not aged, so a gap of
weeks between changes does not expire anything.

## 2026-10-19

### 12:57 UTC — 10 pages, highest severity high

**High — A2UI schemas, styling, and recovery** · _local snapshot edit, not an upstream change_

`/angular/mastra/guides/a2ui` · route `/a2ui` · under “Choose a schema strategy” · in a `typescript` block

24 code lines, 1 heading, 17 prose lines changed. The number of fenced code blocks changed.

````diff
- // features/a2ui/a2ui-catalogs.ts
- const fixedDefinitions = {
+ // features/a2ui/a2ui-definitions.ts
+ export const fixedDefinitions = {
- };
+ } satisfies A2UICatalogDefinitions;
+ A catalog is required: without one, A2UI stays off even when the runtime
+ enables it, and CopilotKit logs a warning.
````

**High — Voice and multimodal input** · _local snapshot edit, not an upstream change_

`/angular/mastra/guides/voice-multimodal` · route `/voice-multimodal` · under “Accept voice input”

5 code lines, 1 heading, 15 prose lines changed. The number of fenced code blocks changed.

````diff
- access. Your Runtime must also have transcription configured; a visible
- microphone does not make an unavailable transcription service succeed.
+ access.
+ 
+ ### Configure Runtime transcription
+ 
+ Follow the [Voice backend setup](/angular/mastra/guides/voice-multimodal#backend) to add a dedicated Runtime
+ route and transcription service. Keep speech-provider credentials separate
````

**Medium — Introduction** · _local snapshot edit, not an upstream change_

`/angular/mastra` · routes `/`, `/doc-sync` · under “Angular”

1 heading, 11 prose lines changed.

````diff
- body="Add durable threads, inspection, and managed or self-hosted CopilotKit Intelligence without changing the Angular frontend APIs in this guide."
+ body="Add threads, inspection, and cloud-hosted or self-hosted CopilotKit Intelligence without changing the Angular frontend APIs in this guide."
+ ## Start with your coding agent
+ 
+ Use this prompt to connect your Angular app to Copilot Runtime with the selected agent backend, then verify a working conversation. You can also follow the manual steps below.
+ 
+ Ask your coding agent to follow the setup steps on this page for your selected framework and frontend.
+ 
````

**Medium — Quickstart** · _local snapshot edit, not an upstream change_

`/angular/mastra/quickstart` · route `/quickstart` · under “Angular”

1 heading, 11 prose lines changed.

````diff
- body="Add durable threads, inspection, and managed or self-hosted CopilotKit Intelligence without changing the Angular frontend APIs in this guide."
+ body="Add threads, inspection, and cloud-hosted or self-hosted CopilotKit Intelligence without changing the Angular frontend APIs in this guide."
+ ## Start with your coding agent
+ 
+ Use this prompt to connect your Angular app to Copilot Runtime with the selected agent backend, then verify a working conversation. You can also follow the manual steps below.
+ 
+ Ask your coding agent to follow the setup steps on this page for your selected framework and frontend.
+ 
````

**Low — Frontend tools and generative UI** · _local snapshot edit, not an upstream change_

`/angular/mastra/guides/frontend-tools-generative-ui` · route `/frontend-tools-generative-ui` · under “Choose a generative UI path”

2 prose lines changed.

````diff
- | A2UI | A server emits A2UI operations or snapshots | Runtime capability turns on the built-in renderer; an optional `a2ui` config supplies a catalog or theme |
+ | A2UI | A server emits A2UI operations or snapshots | Set `a2ui.catalog` in `provideCopilotKit` to turn on the built-in renderer; without a catalog A2UI stays off |
````

**Info — AG-UI**

`/angular/mastra/ag-ui` · route `/ag-ui`

Now tracked for the first time.

**Info — Background tasks**

`/angular/mastra/background-tasks` · route `/background-tasks`

Now tracked for the first time.

**Info — Copilot Runtime**

`/angular/mastra/copilot-runtime` · route `/copilot-runtime`

Now tracked for the first time.

**Info — Sub-agents**

`/angular/mastra/multi-agent/subagents` · route `/subagents`

Now tracked for the first time.

**Info — WebMCP**

`/angular/mastra/webmcp` · route `/webmcp`

Content changed.

---

## 2026-08-30

### 13:43 UTC — 2 pages, highest severity low

**Low — Introduction**

`/angular/mastra` · routes `/`, `/doc-sync` · under “Open Inspector and confirm setup”

2 prose lines changed.

````diff
- Angular does not mount Inspector by default. First follow [Inspector for Angular](/angular/mastra/inspector). Then, on localhost, click the Inspector button.
+ On localhost, click the Inspector button in the corner of the app.
````

**Low — Quickstart**

`/angular/mastra/quickstart` · route `/quickstart` · under “Open Inspector and confirm setup”

2 prose lines changed.

````diff
- Angular does not mount Inspector by default. First follow [Inspector for Angular](/angular/mastra/inspector). Then, on localhost, click the Inspector button.
+ On localhost, click the Inspector button in the corner of the app.
````

---

---

## 2026-08-26

### 19:51 UTC — 3 pages, highest severity low

**Low — Introduction**

`/angular/mastra` · routes `/`, `/doc-sync` · under “Angular”

8 prose lines changed.

````diff
- body="Add durable threads, inspection, and managed or self-hosted Enterprise Intelligence without changing the Angular frontend APIs in this guide."
+ body="Add durable threads, inspection, and managed or self-hosted CopilotKit Intelligence without changing the Angular frontend APIs in this guide."
- - Angular 20, 21, or 22
+ - Angular 22
- If you don't have one already, pin the CLI to one of the supported majors. This example uses Angular 22:
+ If you don't have one already, pin the CLI to the supported major:
- - [Enterprise Intelligence](premium/overview): add durable threads, inspection, and cloud-hosted or self-hosted operations.
+ - [CopilotKit Intelligence](premium/overview): add durable threads, inspection, and cloud-hosted or self-hosted operations.
````

**Low — A2UI schemas, styling, and recovery**

`/angular/mastra/guides/a2ui` · route `/a2ui` · under “Angular support boundaries”

2 prose lines changed.

````diff
- - **Hashbrown is unsupported.** The stable Hashbrown Angular package does not support the complete Angular 20 through 22 policy.
+ - **Hashbrown is unsupported.** The stable Hashbrown Angular package does not support the Angular 22 policy.
````

**Low — Quickstart**

`/angular/mastra/quickstart` · route `/quickstart` · under “Angular”

8 prose lines changed.

````diff
- body="Add durable threads, inspection, and managed or self-hosted Enterprise Intelligence without changing the Angular frontend APIs in this guide."
+ body="Add durable threads, inspection, and managed or self-hosted CopilotKit Intelligence without changing the Angular frontend APIs in this guide."
- - Angular 20, 21, or 22
+ - Angular 22
- If you don't have one already, pin the CLI to one of the supported majors. This example uses Angular 22:
+ If you don't have one already, pin the CLI to the supported major:
- - [Enterprise Intelligence](premium/overview): add durable threads, inspection, and cloud-hosted or self-hosted operations.
+ - [CopilotKit Intelligence](premium/overview): add durable threads, inspection, and cloud-hosted or self-hosted operations.
````

---

---
