import { Request, Response } from "express";

import { logger, response } from "./../../utils";
import { Document } from "./../../models/document";
import { getContractSchema } from "./contracts.dto";
import { redisService } from "./../../services/redis";
import { documentRepository } from "./../../models/repositories";

export default class ContractController {
  static async getContracts(req: Request, res: Response) {
    const currentUser = req.user;

    const values = await getContractSchema.validateAsync(req.query);

    const { documents: contracts, total } =
      await documentRepository.getUserContractsByFilters(
        currentUser.userId.toString(),
        values
      );

    const formattedContract =
      ContractController.formatRecentContracts(contracts);

    const dataToSend = {
      skip: values.skip,
      take: values.take,
      total: total,
      contracts: formattedContract,
    };

    return response(res, 200, "Contracts fetched successfully", dataToSend);
  }

  private static formatRecentContracts(documents: Document[]) {
    return documents.map((document) => ({
      id: document._id,
      title: document.title,
      createdAt: (document as any).createdAt,
      riskScore: document.summary?.overallRiskScore || 0,
      confidenceScore: document.summary?.overallConfidenceScore || 0,
    }));
  }

  static async getContractById(req: Request, res: Response) {
    const currentUser = req.user;

    const contractId = req.params.id;

    const cachedContract = await redisService.get(`contract:${contractId}`);

    if (cachedContract) {
      return response(
        res,
        200,
        "Contract fetched successfully",
        cachedContract
      );
    }

    /**
     * To make sure the contract requested is owned by the user
     */
    const contract = await documentRepository.getContractById(
      contractId,
      currentUser.userId.toString()
    );

    if (!contract) {
      return response(res, 404, "Contract not found", {});
    }

    let dataToSend = {
      title: "",
      risks: [],
      chats: [],
      status: "",
      summary: {},
      clauses: [],
      isFlagged: false,
      suggestions: [],
      obligations: [],
      failureReason: "",
      structuredContract: {},
      validationMetadata: {},
      extractionMetadata: {},
      hasAbstainWarnings: false,
    };

    dataToSend.title = contract.title;
    dataToSend.risks = contract.risks;
    dataToSend.chats = contract.chats;
    dataToSend.status = contract.status;
    dataToSend.summary = contract.summary;
    dataToSend.clauses = contract.clauses;
    dataToSend.isFlagged = contract.isFlagged;

    dataToSend.suggestions = contract.suggestions;
    dataToSend.obligations = contract.obligations;
    dataToSend.failureReason = contract.failureReason;
    dataToSend.structuredContract = contract.structuredContract;
    dataToSend.validationMetadata = contract.validationMetadata;
    dataToSend.extractionMetadata = contract.extractionMetadata;
    dataToSend.hasAbstainWarnings = contract.hasAbstainWarnings;

    await redisService.set(
      `contract:${contractId}`,
      JSON.stringify(dataToSend),
      60 * 5
    );

    return response(res, 200, "Contract fetched successfully", dataToSend);
  }
}
