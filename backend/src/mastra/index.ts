// background-tasks : "Enable the BackgroundTaskManager on the Mastra instance" start
// https://docs.copilotkit.ai/angular/mastra/background-tasks
// The guide's instance holds only `backgroundAgentsAgent`; `myAgent` is this
// harness's existing agent, kept alongside it in the same record.
import { Mastra } from "@mastra/core/mastra";
import { LibSQLStore } from "@mastra/libsql";
import { myAgent, backgroundAgentsAgent } from "./agents";

export const mastra = new Mastra({
  agents: { myAgent, backgroundAgentsAgent },
  storage: new LibSQLStore({ id: "mastra-storage", url: ":memory:" }),
  backgroundTasks: { enabled: true }, // [!code highlight]
});
// background-tasks : "Enable the BackgroundTaskManager on the Mastra instance" end
