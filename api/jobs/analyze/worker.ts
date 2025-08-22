import { Types } from "mongoose";
import { Job, Worker } from "bullmq";

import { IJob } from "./../types";
import { logger } from "./../../utils";
import {
  ISummary,
  CONTRACT_TYPE,
  DOCUMENT_STATUS,
} from "./../../models/document/interfaces";
import DocumentSummarizer from "./pipeline/summary";
import DocumentValidator from "./pipeline/validation";
import { redisService } from "./../../services/redis";
import DocumentStructurer from "./pipeline/structuring";
import DocumentDetailsExtractor from "./pipeline/extraction";
import { IValidationResult } from "./pipeline/validation/types";
import { IExtractionResult } from "./pipeline/extraction/types";
import { documentRepository } from "./../../models/repositories";
import { IStructuredContract } from "./pipeline/structuring/types";

export default class AnalyzeWorker implements IJob {
  private _worker: Worker;

  constructor() {
    this._worker = new Worker(
      "uploads",
      async (job) => {
        logger(`Processing job ${job.id}`);
        logger(`Job data: ${JSON.stringify(job.data)}`);

        await this.process(job);
      },
      {
        connection: {
          url: process.env.REDIS_URL,
        },
      }
    );
  }

  async process(job: Job): Promise<void> {
    const documentId = job?.data?._id as Types.ObjectId;
    const document = await documentRepository.findById(documentId.toString());

    if (!document) {
      throw new Error("Document not found");
    }

    /**
     *
     * I am adding the switch check just incase we add a retry on failure logic
     *
     * for failed jobs or timed out jobs.
     */
    switch (document.status) {
      case DOCUMENT_STATUS.PENDING:
        await documentRepository.update(documentId, {
          status: DOCUMENT_STATUS.PROCESSING,
        });

        /**
         * Emit event to client
         */

        break;

      case DOCUMENT_STATUS.PROCESSING:
        logger(`Document ${documentId} is already being processed`);
        break;

      case DOCUMENT_STATUS.COMPLETED:
        logger(`Document ${documentId} is already completed`);
        break;

      case DOCUMENT_STATUS.FAILED:
        logger(`Document ${documentId} is already failed`);
        break;

      default:
        logger(`Document ${documentId} is in an unknown status`);
        break;
    }

    await this.validateAndProcessDocument(documentId);

    await this.structureDocument(documentId);

    await this.summarizeDocument(documentId);

    await this.extractDocumentDetails(documentId);
  }

  public async extractDocumentDetails(documentId: Types.ObjectId) {
    const extractor = new DocumentDetailsExtractor();

    const contract = await redisService.get(`document:${documentId}`);
    const document = await documentRepository.findById(documentId.toString());

    const contractType = document.validationMetadata.contractType;
    const contractStructuredHTML = document.structuredContract.html;

    const extractionResult = await extractor.extract(
      contract as string,
      contractType,
      contractStructuredHTML
    );

    if (extractionResult.isFailure) {
      throw new Error(extractionResult.errors.join(", "));
    }

    const extractionDetails = extractionResult.value as IExtractionResult;

    await documentRepository.update(documentId, {
      risks: extractionDetails.risks,
      status: DOCUMENT_STATUS.COMPLETED,
      clauses: extractionDetails.clauses,
      obligations: extractionDetails.obligations,
      suggestions: extractionDetails.suggestions,
      extractionMetadata: extractionDetails.metadata,
    });

    //Emit event to client
  }

  private async summarizeDocument(documentId: Types.ObjectId) {
    const summarizer = new DocumentSummarizer();

    const contract = await redisService.get(`document:${documentId}`);
    const document = await documentRepository.findById(documentId.toString());

    const contractType = document.validationMetadata.contractType;
    const contractStructuredHTML = document.structuredContract.html;

    const summaryResult = await summarizer.summarize(
      contract as string,
      contractType,
      contractStructuredHTML
    );

    if (summaryResult.isFailure) {
      throw new Error(summaryResult.errors.join(", "));
    }

    const summary = summaryResult.value as ISummary;

    await documentRepository.update(documentId, {
      summary: summary,
    });

    // Emit event to client
  }

  private async structureDocument(documentId: Types.ObjectId) {
    const structurer = new DocumentStructurer();

    const structureResult = await structurer.structure(documentId);

    if (structureResult.isFailure) {
      throw new Error(structureResult.errors.join(", "));
    }

    const structuredContract = structureResult.value as IStructuredContract;

    logger(structuredContract);

    await documentRepository.update(documentId, {
      structuredContract: structuredContract,
    });

    // Emit to client
  }

  private async validateAndProcessDocument(
    documentId: Types.ObjectId
  ): Promise<void> {
    const documentContent = await redisService.get(`document:${documentId}`);

    logger(`Redis document content: ${documentContent}`);

    if (!documentContent) {
      throw new Error("Document content not found");
    }

    const documentValidator = new DocumentValidator();

    const validateContractResult = await documentValidator.validate(
      documentContent as string
    );

    if (validateContractResult.isFailure) {
      throw new Error(validateContractResult.errors.join(", "));
    }

    const validationResult = validateContractResult.value as IValidationResult;

    if (!validationResult.isValidContract) {
      await documentRepository.update(documentId, {
        status: DOCUMENT_STATUS.FAILED,
        failureReason: validationResult.reason,
        isFlagged: true,
      });

      return;
    }

    const contractType = validationResult.contractType.toLocaleLowerCase();

    if (
      contractType !== CONTRACT_TYPE.NDA &&
      contractType !== CONTRACT_TYPE.ICA &&
      contractType !== CONTRACT_TYPE.LICENSE_AGREEMENT
    ) {
      await documentRepository.update(documentId, {
        status: DOCUMENT_STATUS.FAILED,
        failureReason: "Invalid contract type",
      });
      return;
    }

    /**
     * Update the document details with the info we've gotten from validation
     */
    await documentRepository.update(documentId, {
      validationMetadata: {
        reason: validationResult.reason,
        inScope: validationResult.inScope,
        contractType: validationResult.contractType,
        isValidContract: validationResult.isValidContract,
        confidenceScore: validationResult.confidenceScore,
      },
    });

    // Emit an event to the client
  }

  start(): void {
    logger(`Starting analyze worker`);

    this._worker.on("completed", (job) => {
      logger(`Job ${job.id} completed`);
    });

    this._worker.on("failed", async (job, error) => {
      logger(`Job ${job.id} failed with error ${error.message}`);

      const documentId = job?.data?._id;

      if (documentId) {
        /**
         * Emit job failed event to client
         */
        await documentRepository.update(documentId as Types.ObjectId, {
          status: DOCUMENT_STATUS.FAILED,
          failureReason: error.message,
        });
      }
    });

    this._worker.on("error", (error) => {
      logger(`Worker error  ${error.message}`);
    });
  }
}
