import { CONTRACT_TYPE, ISummary } from "./../models/document/interfaces";
import { IExtractionResult } from "./../jobs/analyze/pipeline/extraction/types";
import { IStructuredContract } from "./../jobs/analyze/pipeline/structuring/types";

export enum SOCKET_EVENTS {
  CHAT_MESSAGE_JOIN_ROOM = "chat-message-join-room",

  DOCUMENT_ANALYSIS_FAILED = "document-analysis-failed",

  CHAT_MESSAGE_AI_RESPONSE = "chat-message-ai-response",

  DOCUMENT_ANALYSIS_STARTED = "document-analysis-started",

  CHAT_MESSAGE_USER_MESSAGE = "chat-message-user-message",

  DOCUMENT_ANALYSIS_COMPLETED = "document-analysis-completed",

  DOCUMENT_ANALYSIS_VALIDATED = "document-analysis-validated",

  DOCUMENT_ANALYSIS_PROCESSING = "document-analysis-processing",

  DOCUMENT_ANALYSIS_SUMMARIZED = "document-analysis-summarized",

  DOCUMENT_ANALYSIS_STRUCTURED = "document-analysis-structured",

  DOCUMENT_ANALYSIS_DETAILS_EXTRACTED = "document-analysis-details-extracted",
}

export interface IDocumentAnalysisStartedPayload {
  documentId: string;
}

export interface IDocumentAnalysisFailedPayload {
  documentId: string;
  failureReason: string;
}

export interface IDocumentAnalysisValidatedPayload {
  reason: string;
  inScope: boolean;
  documentId: string;
  confidenceScore: number;
  isValidContract: boolean;
  contractType: CONTRACT_TYPE;
}

export interface IDocumentAnalysisStructuredPayload {
  documentId: string;
  structuredContract: IStructuredContract;
}

export interface IDocumentAnalysisSummarizedPayload {
  summary: ISummary;
  documentId: string;
}

export interface IDocumentAnalysisDetailsExtractedPayload {
  documentId: string;
  extractionDetails: IExtractionResult;
}
