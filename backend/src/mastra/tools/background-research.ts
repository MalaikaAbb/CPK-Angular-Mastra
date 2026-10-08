/**
 * "Define a backgroundable tool", verbatim.
 * https://docs.copilotkit.ai/angular/mastra/background-tasks
 */
import { createTool } from "@mastra/core/tools";
import { z } from "zod";

export const runDeepResearchTool = createTool({
  id: "run_deep_research",
  description:
    "Kick off a long-running deep-research task on a topic. This runs in " +
    "the background while the conversation continues.",
  inputSchema: z.object({
    topic: z.string().describe("The topic to research in depth."),
  }),
  background: { enabled: true }, // [!code highlight]
  execute: async ({ topic }) => {
    // Runs when the background worker executes the task.
    return JSON.stringify({
      topic,
      summary: `Deep research on "${topic}" completed.`,
    });
  },
});
