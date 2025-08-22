export enum SOCKET_EVENTS {
  DOCUMENT_ANALYSIS_STARTED = "document-analysis-started",
  DOCUMENT_ANALYSIS_PROCESSING = "document-analysis-processing",
}

export interface IDocumentAnalysisStartedPayload {
  documentId: string;
}
