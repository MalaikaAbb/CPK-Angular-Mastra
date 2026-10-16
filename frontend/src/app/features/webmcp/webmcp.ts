import { CopilotKitCore } from "@copilotkit/core";
import { z } from "zod";

async function searchOrders(status: "open" | "shipped" | "delivered") {
  return [
    { id: "ORD-941", status, item: "Ergonomic Keyboard", total: "$129.00" },
    { id: "ORD-942", status, item: "4K Monitor Arm", total: "$89.50" },
  ];
}

export const copilotkit = new CopilotKitCore({
  tools: [
    {
      name: "searchOrders",
      description: "Search the signed-in user's orders by status",
      parameters: z.object({
        status: z.enum(["open", "shipped", "delivered"]),
      }),
      handler: async ({ status }) => {
        const orders = await searchOrders(status);
        return JSON.stringify(orders);
      }, 
      webmcp: {
        annotations: {
          readOnlyHint: true,
        },
      },
    },
  ],
});
