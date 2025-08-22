import { Types } from "mongoose";
import { Request, Response } from "express";

import {
  userRepository,
  documentRepository,
} from "./../../models/repositories";
import { analyzeSchema } from "./analyze.dto";
import { SOCKET_EVENTS } from "./../../types/socket";
import AnalyzeQueue from "./../../jobs/analyze/queue";
import { redisService } from "./../../services/redis";
import { response, decryptText, logger, getSocket } from "./../../utils";

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

    const user = await userRepository.findById(currentUser.userId.toString());

    let onboardingDetails = {};

    if (user.isOnboarded) {
      onboardingDetails = {
        displayName: user.displayName || user.name,
        profession: user.userType,
        specialities: user.specialities,
      };

      await redisService.set(
        `user:${currentUser.userId}:onboarding`,
        JSON.stringify(onboardingDetails),
        60 * 60 * 24
      );
    }

    await redisService.set(
      `document:${newDocument._id}`,
      decryptedContent,
      60 * 60 * 24
    );

    await this._analyzeQueue.add(newDocument);

    getSocket()
      .to(currentUser.userId.toString())
      .emit(SOCKET_EVENTS.DOCUMENT_ANALYSIS_STARTED, {
        documentId: newDocument._id,
      });

    return response(res, 200, "Document analysis started");
  }
}
