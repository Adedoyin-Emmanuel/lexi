import {
  RISK_LEVEL,
  SUGGESTION_TYPE,
  ACTIONABLE_OBLIGATION_TYPE,
} from "./../../../jobs/analyze/pipeline/extraction/types";

export enum DOCUMENT_STATUS {
  FAILED = "failed",
  PENDING = "pending",
  COMPLETED = "completed",
  PROCESSING = "processing",
}

export enum CONTRACT_TYPE {
  NDA = "NDA",
  ICA = "ICA",
  LICENSE_AGREEMENT = "License Agreement",
}

export interface IExtractionMetadata {
  totalRisks: number;
  totalClauses: number;
  processingTime: number;
  totalObligations: number;
  totalSuggestions: number;
  overallConfidence: number;
}

export interface IRisk {
  title: string;
  endIndex: number;
  startIndex: number;
  description: string;
  riskLevel: RISK_LEVEL;
  confidenceScore: number;
}

export interface IClause {
  title: string;
  endIndex: number;
  fullText: string;
  startIndex: number;
  confidenceScore: number;
}

export interface IObligation {
  title: string;
  dueDate?: string;
  endIndex: number;
  startIndex: number;
  description: string;
  clauseSource: string; // Which clause this obligation comes from
  shouldAbstain: boolean; // True if confidence < threshold
  confidenceScore: number;
  userFriendlyExplanation: string; // Plain English explanation
  actionableType: ACTIONABLE_OBLIGATION_TYPE;
}

export interface ISuggestion {
  title: string;
  reason: string;
  endIndex: number;
  startIndex: number;
  confidenceScore: number;
  currentStatement: string;
  suggestedStatement: string;
  suggestionType: SUGGESTION_TYPE;
  priority: "HIGH" | "MEDIUM" | "LOW";
}

export interface ISummary {
  duration: string;
  type: CONTRACT_TYPE;
  rawSummary: string;
  jurisdiction: string;
  effectiveDate: string;
  overviewSummary: string;
  plainEnglishSummary: string;

  overallRiskScore: number;
  totalPartiesInvolved: number;
  overallConfidenceScore: number;
  terminationClasePresent: boolean;
}

export interface IValidationMetadata {
  reason: string;
  inScope: boolean;
  confidenceScore: number;
  isValidContract: boolean;
  contractType: CONTRACT_TYPE;
}
