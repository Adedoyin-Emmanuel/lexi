import { Request, Response } from "express";

import { logger, response } from "./../../utils";
import { Document } from "./../../models/document";
import { redisService } from "./../../services/redis";
import { documentRepository } from "./../../models/repositories";
import { DOCUMENT_STATUS } from "./../../models/document/interfaces";

export default class MetricsController {
  public static async getDashboardStats(req: Request, res: Response) {
    const currentUser = req.user;

    let dashboardStats = {
      totalContracts: 0,
      needsAttention: 0,
      inProcessing: 0,
      contractsPassed: 0,
    };

    const cachedDashboardStats = await redisService.get(
      `dashboardStats:${currentUser.userId.toString()}`
    );

    if (cachedDashboardStats) {
      return response(
        res,
        200,
        "Dashboard stats retrived successfully",
        cachedDashboardStats
      );
    }

    const documents = await documentRepository.findAllDocumentsByUserId(
      currentUser.userId.toString()
    );

    if (!documents || documents.length === 0) {
      return response(res, 404, "No document found", dashboardStats);
    }

    const contractsRequiringAttention = documents.filter(
      (contract) =>
        contract.summary?.overallRiskScore >= 70 ||
        contract.status === DOCUMENT_STATUS.FAILED
    );

    const contractsInProcessing = documents.filter(
      (contract) => contract.status === DOCUMENT_STATUS.PROCESSING
    );

    const contractsPassed = documents.filter(
      (contract) =>
        contract.status === DOCUMENT_STATUS.COMPLETED &&
        contract.summary.overallRiskScore > 65 // 65 is the threshold for a contract to be considered passed
    );

    dashboardStats.totalContracts = documents.length;
    dashboardStats.contractsPassed = contractsPassed.length;
    dashboardStats.inProcessing = contractsInProcessing.length;
    dashboardStats.needsAttention = contractsRequiringAttention.length;

    await redisService.set(
      `dashboardStats:${currentUser.userId.toString()}`,
      dashboardStats,
      60
    );

    return response(
      res,
      200,
      "Dashboard stats retrived successfully",
      dashboardStats
    );
  }

  public static async getDashboardRecentContracts(req: Request, res: Response) {
    const currentUser = req.user;

    const cachedRecentContracts = await redisService.get(
      `recentContracts:${currentUser.userId.toString()}`
    );

    if (cachedRecentContracts) {
      return response(
        res,
        200,
        "Recent contracts retrived successfully",
        MetricsController.formatRecentContracts(cachedRecentContracts as any)
      );
    }

    const documents = await documentRepository.getRecentContractsByUserId(
      currentUser.userId.toString()
    );

    if (!documents || documents.length === 0) {
      return response(res, 404, "No document found", []);
    }

    await redisService.set(
      `recentContracts:${currentUser.userId.toString()}`,
      documents,
      60
    );

    return response(
      res,
      200,
      "Recent contracts retrived successfully",
      MetricsController.formatRecentContracts(documents)
    );
  }

  private static formatRecentContracts(documents: Document[]) {
    return documents.map((document) => ({
      id: document._id,
      title: document.title,
      createdAt: (document as any).createdAt,
      riskScore: document.summary.overallRiskScore,
      confidenceScore: document.summary.overallConfidenceScore,
    }));
  }
}
