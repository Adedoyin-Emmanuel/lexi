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
      "contract-analysis",
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

    logger(
      `Starting processing for document ${documentId} with status: ${document.status}`
    );

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
        return; // Exit early to avoid duplicate processing

      case DOCUMENT_STATUS.COMPLETED:
        logger(`Document ${documentId} is already completed`);
        return; // Exit early

      case DOCUMENT_STATUS.FAILED:
        logger(`Document ${documentId} is already failed`);
        return; // Exit early

      default:
        logger(
          `Document ${documentId} is in an unknown status: ${document.status}`
        );
        break;
    }

    try {
      logger(`Step 1: Validating document ${documentId}`);
      await this.validateAndProcessDocument(userId, documentId);
      logger(`Step 1 completed: Document validation successful`);

      logger(`Step 2: Structuring document ${documentId}`);
      await this.structureDocument(documentId, userId);
      logger(`Step 2 completed: Document structuring successful`);

      logger(`Step 3: Summarizing document ${documentId}`);
      await this.summarizeDocument(documentId, userId);
      logger(`Step 3 completed: Document summarization successful`);

      logger(`Step 4: Extracting document details ${documentId}`);
      await this.extractDocumentDetails(documentId, userId);
      logger(`Step 4 completed: Document extraction successful`);

      logger(
        `All processing steps completed successfully for document ${documentId}`
      );
    } catch (error) {
      logger(
        `Error during processing document ${documentId}: ${error.message}`
      );
      logger(`Error stack: ${error.stack}`);
      throw error; // Re-throw to trigger the failed job handler
    }
  }

  public async extractDocumentDetails(
    documentId: Types.ObjectId,
    userId: Types.ObjectId
  ) {
    const extractor = new DocumentDetailsExtractor();

    const contract = await redisService.get(`document:${documentId}`);
    const document = await documentRepository.findById(documentId.toString());

    if (!document.structuredContract || !document.structuredContract.html) {
      throw new Error(
        "Document structure not found - structuring step may have failed"
      );
    }

    const contractType = document.validationMetadata.contractType;
    const contractStructuredHTML = document.structuredContract.html;

    logger(`Extracting details for contract type: ${contractType}`);
    logger(`Structured HTML length: ${contractStructuredHTML.length}`);

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

    if (!document.structuredContract || !document.structuredContract.html) {
      throw new Error(
        "Document structure not found - structuring step may have failed"
      );
    }

    const contractType = document.validationMetadata.contractType;
    const contractStructuredHTML = document.structuredContract.html;

    logger(`Summarizing document for contract type: ${contractType}`);
    logger(`Structured HTML length: ${contractStructuredHTML.length}`);

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
      logger(structureResult.errors);
      throw new Error(structureResult.errors[0].message);
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

    logger(contractType);
    logger(validationResult);

    if (
      contractType.toLowerCase() !== CONTRACT_TYPE.NDA.toLocaleLowerCase() &&
      contractType.toLowerCase() !== CONTRACT_TYPE.ICA.toLocaleLowerCase() &&
      contractType.toLowerCase() !==
        CONTRACT_TYPE.LICENSE_AGREEMENT.toLocaleLowerCase()
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
