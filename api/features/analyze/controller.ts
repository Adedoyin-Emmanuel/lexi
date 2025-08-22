import { Types } from "mongoose";
import { Request, Response } from "express";

import { analyzeSchema } from "./analyze.dto";
import AnalyzeQueue from "./../../jobs/analyze/queue";
import { redisService } from "./../../services/redis";
import { response, decryptText, logger } from "./../../utils";
import { documentRepository } from "models/repositories";

export default class AnalyzeController {
  private static readonly _analyzeQueue: AnalyzeQueue = new AnalyzeQueue();

  static async analyze(req: Request, res: Response) {
    const currentUser = req.user;
    const values = await analyzeSchema.validateAsync(req.body);

    const { key, type, content, name } = values;

    const decryptedContent = await decryptText(content, key);

    const newDocument = await documentRepository.create({
      userId: currentUser.userId as Types.ObjectId,
      title: name,
    } as any);

    await redisService.set(
      `document:${newDocument._id}`,
      decryptedContent,
      60 * 60 * 24
    );

    await this._analyzeQueue.add(newDocument);

    // Emit event to the client

    return response(res, 200, "Document analysis started");
  }
}
