import Joi from "joi";
import { DOCUMENT_STATUS } from "./../../models/document/interfaces";

export const getContractSchema = Joi.object({
  take: Joi.number().optional().default(10).max(20),
  skip: Joi.number().optional().default(0),

  statusFilter: Joi.string()
    .optional()
    .valid(...Object.values(DOCUMENT_STATUS))
    .default("ALL"),

  sort: Joi.string()
    .optional()
    .valid("createdAt", "updatedAt", "riskScore", "confidenceScore"),

  sortOrder: Joi.string().optional().valid("asc", "desc").default("desc"),
});
