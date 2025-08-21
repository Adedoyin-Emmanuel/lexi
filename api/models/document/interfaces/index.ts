export enum DOCUMENT_STATUS {
  FAILED = "failed",
  UPLOADED = "uploaded",
  COMPLETED = "completed",
  PROCESSING = "processing",
}

export enum CONTRACT_TYPE {
  NDA = "nda",
  ICA = "ica",
  LICENSE_AGREEMENT = "license agreement",
}

export interface IHighlight {
  id: string;
  text: string;
  endIndex: number;
  startIndex: number;
  confidenceScore: number;
}

export interface IRisk {
  id: string;
  title: string;
  riskScore: number;
  description: string;
  confidenceScore: number;
}

export interface IClase {
  id: string;
  name: string;
  endIndex: number;
  isRisky: boolean;
  startIndex: number;
  description: string;
  confidenceScore: number;
}

export interface IObligation {
  id: string;
  title: string;
  deadline: Date;
  endIndex: number;
  startIndex: number;
  description: string;
  confidenceScore: number;
  dueInDays: number | null;
}

export interface ISuggestion {
  id: string;
  title: string;
  reason: string;
  endIndex: number;
  startIndex: number;
  currentText: string;
  suggestedText: string;
  confidenceScore: number;
}

export interface ISummary {
  duration: string;
  type: CONTRACT_TYPE;
  rawSummary: string;
  jurisdiction: string;
  effectiveDate: string;
  overviewSummary: string;

  overallRiskScore: number;
  totalPartiesInvolved: number;
  overallConfidenceScore: number;
  terminationClasePresent: boolean;
}
