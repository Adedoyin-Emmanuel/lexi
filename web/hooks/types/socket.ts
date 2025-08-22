export enum CONTRACT_TYPE {
  NDA = "NDA",
  ICA = "ICA",
  LICENSE_AGREEMENT = "License Agreement",
}

export enum RISK_LEVEL {
  LOW = "Low",
  HIGH = "High",
  MEDIUM = "Medium",
}

export enum ICA_CLAUSE_TYPES {
  PAYMENT_TERMS = "Payment Terms",
  PARTIES_SCOPE = "Parties & Scope",
  CONFIDENTIALITY = "Confidentiality",
  BOILERPLATE = "Boilerplate Clauses",
  TERM_TERMINATION = "Term & Termination",
  FORCE_MAJEURE = "Force Majeure / Hardship",
  RISK_LIABILITY = "Risk Allocation & Liability",
  INTELLECTUAL_PROPERTY = "Intellectual Property",
  TRANSFER_PRICING = "Transfer Pricing Methodology",
  GOVERNING_LAW = "Governing Law & Dispute Resolution",
}

export enum NDA_CLAUSE_TYPES {
  SURVIVAL = "Survival Clause",
  DURATION = "Duration of Confidentiality",
  REMEDIES = "Injunctive Relief and Remedies",
  JURISDICTION = "Jurisdiction and Governing Law",
  THIRD_PARTY_DISCLOSURE = "Disclosure to Third Parties",
  OBLIGATIONS_USE = "Obligations and Use of Information",
  CARVE_OUTS = "Carve-Outs (Exclusions from Confidentiality)",
  RETURN_DESTRUCTION = "Return or Destruction of Information",
  NON_SOLICITATION = "Non-Solicitation and Standstill Provisions",
  CONFIDENTIAL_INFO_DEFINITION = "Definition of Confidential Information",
}

export enum LICENSE_CLAUSE_TYPES {
  EXCLUSIVITY = "Exclusivity",
  GRANT_LICENSE = "Grant of License",
  CONFIDENTIALITY = "Confidentiality",
  ROYALTY_PAYMENT = "Royalty and Payment Terms",
  INDEMNITY_LIABILITY = "Indemnity and Liability",
  DURATION_TERMINATION = "Duration and Termination",
  QUALITY_CONTROL = "Quality Control and Approval Rights",
  DISPUTE_RESOLUTION = "Dispute Resolution and Governing Law",
}

export enum ACTIONABLE_OBLIGATION_TYPE {
  // ICA Obligations
  IP_HANDOVER = "IP Transfer Required",
  PAYMENT_DEADLINE = "Payment Deadline",
  CONTRACT_END_DATE = "Contract End Date",
  RENEWAL_NOTICE = "Renewal Notice Required",
  DELIVERABLE_DEADLINE = "Deliverable Deadline",
  TERMINATION_NOTICE = "Termination Notice Period",

  // NDA Obligations
  DISCLOSURE_RESTRICTIONS = "Disclosure Restrictions",
  THIRD_PARTY_CONSENT = "Third Party Consent Required",
  NON_SOLICITATION_END = "Non-Solicitation Period End",
  INFO_RETURN_DESTRUCTION = "Return/Destroy Information",
  CONFIDENTIALITY_EXPIRATION = "Confidentiality Expiration",

  // License Obligations
  REPORTING_OBLIGATION = "Reporting Due",
  ROYALTY_PAYMENT_DUE = "Royalty Payment Due",
  LICENSE_VALIDITY_PERIOD = "License Validity Period",
  USAGE_RESTRICTIONS = "Usage/Territory Restrictions",
  APPROVAL_REQUIRED = "Approval/Quality Check Required",

  // General
  OTHER = "Other Obligation",
}

export enum SUGGESTION_TYPE {
  // ICA Suggestions
  IP_RIGHTS_CLARIFICATION = "IP Rights",
  PAYMENT_TERMS_IMPROVEMENT = "Payment Terms",
  TERMINATION_PROTECTION = "Termination Terms",
  LIABILITY_PROTECTION = "Liability Protection",

  // NDA Suggestions
  DURATION_ADJUSTMENT = "Duration Terms",
  CARVE_OUT_ADDITION = "Exclusion Addition",
  CONFIDENTIALITY_SCOPE = "Confidentiality Scope",

  // License Suggestions
  ROYALTY_STRUCTURE = "Royalty Structure",
  TERRITORY_EXPANSION = "Territory Rights",
  EXCLUSIVITY_CLARIFICATION = "Exclusivity Terms",

  // General
  GENERAL_IMPROVEMENT = "General Improvement",
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

export interface IExtractedClause {
  title: string;
  endIndex: number;
  fullText: string;
  startIndex: number;
  confidenceScore: number;
}

export interface IExtractedRisk {
  title: string;
  endIndex: number;
  startIndex: number;
  description: string;
  riskLevel: RISK_LEVEL;
  confidenceScore: number;
}

export interface IExtractedObligation {
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

export interface IExtractedSuggestion {
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

export interface IExtractionResult {
  clauses: IExtractedClause[];
  risks: IExtractedRisk[];
  obligations: IExtractedObligation[];
  suggestions: IExtractedSuggestion[];
  metadata: {
    totalRisks: number;
    totalClauses: number;
    processingTime: number;
    totalObligations: number;
    totalSuggestions: number;
    overallConfidence: number;
  };
}

export enum SOCKET_EVENTS {
  DOCUMENT_ANALYSIS_FAILED = "document-analysis-failed",

  DOCUMENT_ANALYSIS_STARTED = "document-analysis-started",

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

export interface IStructuredContract {
  html: string;
  metadata: {
    listCount: number;
    headingCount: number;
    paragraphCount: number;
  };
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

export interface IDocumentAnalysisCompletedPayload {
  documentId: string;
}
