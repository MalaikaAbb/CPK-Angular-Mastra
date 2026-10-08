import { openai } from "@ai-sdk/openai";
import { Agent } from "@mastra/core/agent";
import { createTool } from "@mastra/core/tools";
import { z } from "zod";
import { runDeepResearchTool } from "../tools/background-research"; // [!code highlight]

export const getWeather = createTool({
  id: "getWeather",
  inputSchema: z.object({
    location: z.string(),
  }),
  description: `Fetches the current weather information for a given location`,
  execute: async ({ location }) => {
    // Tool logic here (e.g., API call)
    console.log("Using tool to fetch weather information for", location);
    return { temperature: 20, conditions: "Sunny" }; // Example return
  },
});

export const myAgent = new Agent({
  id: "myAgent",
  name: "My Agent",
  instructions: "You are a helpful assistant!",
  model: openai("gpt-5.4"),
  tools: {
    getWeather,
  },
});

// background-tasks : "Add the tool to your agent" start
// https://docs.copilotkit.ai/angular/mastra/background-tasks
// Verbatim except the import path: the guide imports
// "@/mastra/tools/background-research", an alias this repo's tsconfig does
// not define, so it is the equivalent relative path here.
export const backgroundAgentsAgent = new Agent({
  id: "background-agents",
  name: "Background Agents Agent",
  tools: { runDeepResearchTool }, // [!code highlight]
  model: openai("gpt-4.1"),
  instructions:
    "You are a research assistant that dispatches long-running work to the " +
    "background. When the user asks you to research a topic, call the " +
    "run_deep_research tool ONCE, then send a short message saying the work " +
    "is running in the background.",
});
// background-tasks : "Add the tool to your agent" end
