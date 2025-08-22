// Frontend types for components - these map from backend types
export interface ContractStats {
  contractType: string;
  duration: string;
  jurisdiction: string;
  effectiveDate: string;
  partiesInvolved: number;
  hasTerminationClause: boolean;
  riskLevel: "low" | "medium" | "high";
}

export interface Clause {
  id: string;
  title: string;
  content: string;
  category:
    | "termination"
    | "liability"
    | "ip"
    | "payment"
    | "confidentiality"
    | "other";
  confidence: number;
  importance: "high" | "medium" | "low";
  position: { start: number; end: number };
}

export interface Risk {
  id: string;
  title: string;
  clauseId: string;
  description: string;
  confidence: number;
  severity: "low" | "medium" | "high";
}

export interface Obligation {
  id: string;
  title: string;
  deadline?: Date;
  clauseId: string;
  confidence: number;
  description: string;
}

export interface NegotiationSuggestion {
  id: string;
  title: string;
  clauseId: string;
  reasoning: string;
  confidence: number;
  currentText: string;
  suggestedText: string;
}
