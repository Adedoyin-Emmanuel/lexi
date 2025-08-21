import { IJob } from "./../types";
import { logger } from "./../../utils";
import AnalyzeWorker from "./../analyze/worker";

export default class JobsConfig {
  private readonly _workers: IJob[];

  constructor() {
    this._workers = [new AnalyzeWorker()];
  }

  public start() {
    this._workers.forEach((worker) => {
      worker.start();
    });

    logger("All workers started");
  }
}
