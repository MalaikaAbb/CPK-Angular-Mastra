/**
 * "Subscribing to AG-UI events".
 * https://docs.copilotkit.ai/angular/mastra/ag-ui
 *
 * The class members between the region markers are the guide's snippet,
 * unchanged. The guide gives only the class members; the decorator, imports and
 * class around them are SELF-DEFINED, the minimum needed to mount it. Output
 * goes to the browser console, as published.
 */
import { Component, DestroyRef, inject } from "@angular/core";
import { injectAgentStore } from "@copilotkit/angular";

@Component({
  selector: "app-agent-events",
  template: ``,
})
export class AgentEventsComponent {
  // ag-ui : "Subscribing to AG-UI events" start
  private readonly destroyRef = inject(DestroyRef);
  readonly store = injectAgentStore("research-agent");

  constructor() {
    const subscription = this.store().agent.subscribe({
      onTextMessageContentEvent({ textMessageBuffer }) {
        console.log("Streaming text:", textMessageBuffer);
      },
      onToolCallEndEvent({ toolCallName, toolCallArgs }) {
        console.log("Tool called:", toolCallName, toolCallArgs);
      },
      onStateChanged({ agent }) {
        console.log("State changed:", agent.state);
      },
    });
    this.destroyRef.onDestroy(() => subscription.unsubscribe());
  }
  // ag-ui : "Subscribing to AG-UI events" end
}
