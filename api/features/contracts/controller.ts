import { Request, Response } from "express";

import { logger, response } from "./../../utils";
import { getContractSchema } from "./contracts.dto";
import { redisService } from "./../../services/redis";
import { documentRepository } from "./../../models/repositories";

export default class ContractController {
  static async getContracts(req: Request, res: Response) {
    const currentUser = req.user;

    const values = await getContractSchema.validateAsync(req.query);

    const contracts = await documentRepository.getUserContractsByFilters(
      currentUser.userId.toString(),
      values
    );

    const dataToSend = {
      contracts,
      skip: values.skip,
      take: values.take,
      total: contracts.length,
    };

    return response(res, 200, "Contracts fetched successfully", dataToSend);
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

    await redisService.set(
      `contract:${contractId}`,
      JSON.stringify(contract),
      60 * 5
    );

    return response(res, 200, "Contract fetched successfully", contract);
  }
}
