import { Queue } from "bullmq";

import { logger } from "../../utils";
import { Document } from "../../models/document";

export default class AnalyzeQueue {
  private readonly queue: Queue;

  constructor() {
    this.queue = new Queue("contract-analysis", {
      connection: {
        url: process.env.REDIS_URL,
      },
    });
  }

  public async add(data: Document) {
    await this.queue.add("analyze", data);

    logger(`Adding document ${data._id} to the queue`);
  }

  public async remove(jobId: string) {
    await this.queue.remove(jobId);

    logger(`Removing document ${jobId} from the queue`);
  }
}
