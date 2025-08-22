import { Types } from "mongoose";
import { Job, Worker } from "bullmq";

import { IJob } from "./../types";
import { logger, getSocket } from "./../../utils";
import {
  ISummary,
  CONTRACT_TYPE,
  DOCUMENT_STATUS,
} from "./../../models/document/interfaces";
import DocumentSummarizer from "./pipeline/summary";
import { SOCKET_EVENTS } from "./../../types/socket";
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
    const userId = job?.data?.userId;
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

        getSocket()
          .to(userId.toString())
          .emit(SOCKET_EVENTS.DOCUMENT_ANALYSIS_PROCESSING);

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

    await this.validateAndProcessDocument(documentId, userId);

    await this.structureDocument(documentId, userId);

    await this.summarizeDocument(documentId, userId);

    await this.extractDocumentDetails(documentId, userId);
  }

  public async extractDocumentDetails(
    documentId: Types.ObjectId,
    userId: Types.ObjectId
  ) {
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

    getSocket()
      .to(userId.toString())
      .emit(SOCKET_EVENTS.DOCUMENT_ANALYSIS_DETAILS_EXTRACTED, {
        documentId: documentId.toString(),
        extractionDetails: extractionDetails,
      });
  }

  private async summarizeDocument(
    documentId: Types.ObjectId,
    userId: Types.ObjectId
  ) {
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

    getSocket()
      .to(userId.toString())
      .emit(SOCKET_EVENTS.DOCUMENT_ANALYSIS_SUMMARIZED, {
        documentId: documentId.toString(),
        summary: summary,
      });
  }

  private async structureDocument(
    documentId: Types.ObjectId,
    userId: Types.ObjectId
  ) {
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

    getSocket()
      .to(userId.toString())
      .emit(SOCKET_EVENTS.DOCUMENT_ANALYSIS_STRUCTURED, {
        documentId: documentId.toString(),
        structuredContract: structuredContract,
      });
  }

  private async validateAndProcessDocument(
    userId: Types.ObjectId,
    documentId: Types.ObjectId
  ): Promise<void> {
    const validUserId = userId.toString();
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
      throw new Error(validationResult.reason);
    }

    const contractType = validationResult.contractType.toLocaleLowerCase();

    if (
      contractType !== CONTRACT_TYPE.NDA &&
      contractType !== CONTRACT_TYPE.ICA &&
      contractType !== CONTRACT_TYPE.LICENSE_AGREEMENT
    ) {
      throw new Error("Invalid contract type");
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

    getSocket()
      .to(validUserId)
      .emit(SOCKET_EVENTS.DOCUMENT_ANALYSIS_VALIDATED, {
        documentId: documentId.toString(),
        reason: validationResult.reason,
        inScope: validationResult.inScope,
        contractType: validationResult.contractType,
        isValidContract: validationResult.isValidContract,
        confidenceScore: validationResult.confidenceScore,
      });
  }

  start(): void {
    logger(`Starting analyze worker`);

    this._worker.on("completed", (job) => {
      logger(`Job ${job.id} completed`);

      getSocket()
        .to(job?.data?.userId.toString())
        .emit(SOCKET_EVENTS.DOCUMENT_ANALYSIS_COMPLETED, {
          documentId: job?.data?._id.toString(),
        });
    });

    this._worker.on("failed", async (job, error) => {
      logger(`Job ${job.id} failed with error ${error.message}`);

      const documentId = job?.data?._id;

      if (documentId) {
        console.log(error);

        await documentRepository.update(documentId as Types.ObjectId, {
          status: DOCUMENT_STATUS.FAILED,
          failureReason: error.message,
        });

        getSocket()
          .to(job?.data?.userId.toString())
          .emit(SOCKET_EVENTS.DOCUMENT_ANALYSIS_FAILED, {
            documentId: documentId.toString(),
            failureReason: error.message,
          });
      }
    });

    this._worker.on("error", (error) => {
      logger(`Worker error  ${error.message}`);
    });
  }
}
