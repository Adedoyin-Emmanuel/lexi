import { Request, Response } from "express";

import { analyzeSchema } from "./analyze.dto";
import { response, decryptText, logger } from "./../../utils";

export default class AnalyzeController {
  static async analyze(req: Request, res: Response) {
    const values = await analyzeSchema.validateAsync(req.body);

    const { key, type, content, name } = values;

    const decryptedContent = await decryptText(content, key);

    return response(res, 200, "Analysis result will come here");
  }
}
