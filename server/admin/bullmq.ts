import { createBullBoard } from "@bull-board/api";
import { BullMQAdapter } from "@bull-board/api/bullMQAdapter";
import { ExpressAdapter } from "@bull-board/express";

import { systemQueue } from "../queues/system.queue";

export const setupBullMQDashboard = () => {
  const serverAdapter = new ExpressAdapter();

  serverAdapter.setBasePath("/admin/queues");

  createBullBoard({
    queues: [
      new BullMQAdapter(systemQueue),
    ],
    serverAdapter,
  });

  return serverAdapter;
};