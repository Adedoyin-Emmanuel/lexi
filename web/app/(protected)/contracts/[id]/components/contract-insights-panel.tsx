"use client";

import React, { useState } from "react";

import { useIsMobile } from "@/hooks/use-mobile";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { LoadingSkeleton } from "@/components/ui/loading-skeleton";

// Import the card components from analyze page
import { SummaryCard } from "../../../analyze/components/summary-card";
import { ClauseCard } from "../../../analyze/components/clause-card";
import { RiskCard } from "../../../analyze/components/risk-card";
import { ObligationCard } from "../../../analyze/components/obligation-card";
import { NegotiationCard } from "../../../analyze/components/negotiation-card";

interface ContractData {
  id: string;
  title: string;
  status: string;
  summary: Record<string, unknown>;
  risks: Record<string, unknown>[];
  obligations: Record<string, unknown>[];
  suggestions: Record<string, unknown>[];
  clauses: Record<string, unknown>[];
  chats: Record<string, unknown>[];
  isFlagged: boolean;
  hasAbstainWarnings: boolean;
  failureReason?: string;
  structuredContract: Record<string, unknown>;
  validationMetadata: Record<string, unknown>;
  extractionMetadata: Record<string, unknown>;
}

interface ContractInsightsPanelProps {
  contract: ContractData;
  isLoading: boolean;
  onClauseSelect?: (clauseId: string) => void;
  onViewInDocument?: (clauseId: string) => void;
}

export const ContractInsightsPanel: React.FC<ContractInsightsPanelProps> = ({
  contract,
  isLoading,
  onClauseSelect,
  onViewInDocument,
}) => {
  const [activeTab, setActiveTab] = useState("summary");
  const isMobile = useIsMobile();

  if (isLoading) {
    return <LoadingSkeleton />;
  }

  if (!contract) {
    return (
      <div className="h-full flex items-center justify-center text-slate-500 bg-white">
        <div className="text-center p-6">
          <p className="text-lg font-medium">No contract data available</p>
          <p className="text-sm mt-2">Contract details could not be loaded</p>
        </div>
      </div>
    );
  }

  // Convert contract data to match analyze page format
  const convertClauseToFrontend = (clause: Record<string, unknown>) => ({
    id: clause.title as string,
    title: clause.title as string,
    content: (clause.fullText as string) || (clause.content as string),
    importance: "high" as const,
    category: "other" as const,
    position: { start: 0, end: 0 },
    confidence: (clause.confidenceScore as number) || 85,
  });

  const convertRiskToFrontend = (risk: Record<string, unknown>) => ({
    id: risk.title as string,
    title: risk.title as string,
    description: risk.description as string,
    severity:
      ((risk.riskLevel as string)?.toLowerCase() as
        | "low"
        | "medium"
        | "high") || "medium",
    clauseId: risk.title as string,
    confidence: (risk.confidenceScore as number) || 85,
  });

  const convertObligationToFrontend = (
    obligation: Record<string, unknown>
  ) => ({
    id: obligation.title as string,
    title: obligation.title as string,
    description:
      (obligation.description as string) ||
      (obligation.userFriendlyExplanation as string),
    deadline: obligation.dueDate
      ? new Date(obligation.dueDate as string)
      : undefined,
    clauseId: obligation.title as string,
    confidence: (obligation.confidenceScore as number) || 85,
  });

  const convertSuggestionToFrontend = (
    suggestion: Record<string, unknown>
  ) => ({
    id: suggestion.title as string,
    title: suggestion.title as string,
    reasoning: suggestion.reason as string,
    confidence: (suggestion.confidenceScore as number) || 85,
    currentText: (suggestion.currentStatement as string) || "",
    suggestedText: (suggestion.suggestedStatement as string) || "",
    clauseId: suggestion.title as string,
  });

  const convertSummaryToFrontend = (summary: Record<string, unknown>) => ({
    summary:
      (summary.overviewSummary as string) ||
      (summary.plainEnglishSummary as string) ||
      "",
    confidence: (summary.confidenceScore as number) || 85,
    stats: {
      contractType: (summary.type as string) || "Contract",
      duration: (summary.duration as string) || "",
      jurisdiction: (summary.jurisdiction as string) || "",
      effectiveDate: (summary.effectiveDate as string) || "",
      partiesInvolved: (summary.totalPartiesInvolved as number) || 0,
      hasTerminationClause:
        (summary.terminationClasePresent as boolean) || false,
      overallRiskScore: (summary.overallRiskScore as number) || 50,
      riskLevel: ((summary.overallRiskScore as number) > 65
        ? "high"
        : (summary.overallRiskScore as number) > 50
        ? "medium"
        : "low") as "low" | "medium" | "high",
    },
  });

  const clauses = contract.clauses || [];
  const risks = contract.risks || [];
  const obligations = contract.obligations || [];
  const suggestions = contract.suggestions || [];

  return (
    <div className="h-full flex flex-col bg-white">
      <div className={`border-b border-slate-200 ${isMobile ? "p-3" : "p-4"}`}>
        <h2
          className={`font-semibold text-slate-900 ${
            isMobile ? "text-base" : "text-lg"
          }`}
        >
          AI Analysis
        </h2>
        <div className="flex items-center gap-2 mt-1">
          <div className="w-2 h-2 bg-green-500 rounded-full"></div>
          <span
            className={`text-slate-600 ${isMobile ? "text-xs" : "text-sm"}`}
          >
            {(contract.summary?.confidenceScore as number) || 85}% confidence
          </span>
        </div>
      </div>

      <Tabs
        value={activeTab}
        onValueChange={setActiveTab}
        className="flex-1 flex flex-col"
      >
        <div className={`${isMobile ? "px-3" : "px-4"} mt-4`}>
          <div className="w-full overflow-x-auto">
            <TabsList
              className={`h-auto p-1 ${
                isMobile ? "w-max" : "w-full grid grid-cols-5"
              }`}
            >
              <TabsTrigger
                value="summary"
                className={`py-2 cursor-pointer ${
                  isMobile ? "text-xs px-3 whitespace-nowrap" : "text-xs"
                }`}
              >
                Summary
              </TabsTrigger>
              <TabsTrigger
                value="clauses"
                className={`py-2 cursor-pointer ${
                  isMobile ? "text-xs px-3 whitespace-nowrap" : "text-xs"
                }`}
              >
                <span>Clauses</span>
                <span
                  className={`px-1.5 py-0.5 bg-blue-100 text-blue-700 text-xs rounded-full font-medium min-w-[20px] h-5 flex items-center justify-center ${
                    isMobile ? "ml-1" : "ml-1.5"
                  }`}
                >
                  {clauses.length}
                </span>
              </TabsTrigger>
              <TabsTrigger
                value="risks"
                className={`py-2 cursor-pointer ${
                  isMobile ? "text-xs px-3 whitespace-nowrap" : "text-xs"
                }`}
              >
                <span>Risks</span>
                <span
                  className={`px-1.5 py-0.5 bg-red-100 text-red-700 text-xs rounded-full font-medium min-w-[20px] h-5 flex items-center justify-center ${
                    isMobile ? "ml-1" : "ml-1.5"
                  }`}
                >
                  {risks.length}
                </span>
              </TabsTrigger>
              <TabsTrigger
                value="obligations"
                className={`py-2 cursor-pointer ${
                  isMobile ? "text-xs px-3 whitespace-nowrap" : "text-xs"
                }`}
              >
                <span>Obligations</span>
                <span
                  className={`px-1.5 py-0.5 bg-orange-100 text-orange-700 text-xs rounded-full font-medium min-w-[20px] h-5 flex items-center justify-center ${
                    isMobile ? "ml-1" : "ml-1.5"
                  }`}
                >
                  {obligations.length}
                </span>
              </TabsTrigger>
              <TabsTrigger
                value="suggestions"
                className={`py-2 cursor-pointer ${
                  isMobile ? "text-xs px-3 whitespace-nowrap" : "text-xs"
                }`}
              >
                <span>Suggestions</span>
                <span
                  className={`px-1.5 py-0.5 bg-green-100 text-green-700 text-xs rounded-full font-medium min-w-[20px] h-5 flex items-center justify-center ${
                    isMobile ? "ml-1" : "ml-1.5"
                  }`}
                >
                  {suggestions.length}
                </span>
              </TabsTrigger>
            </TabsList>
          </div>
        </div>

        <ScrollArea className="flex-1">
          <div className={`${isMobile ? "p-3" : "p-4"}`}>
            <TabsContent value="summary" className="mt-0">
              <SummaryCard {...convertSummaryToFrontend(contract.summary)} />
            </TabsContent>

            <TabsContent value="clauses" className="mt-0">
              <div className="space-y-4">
                {clauses.length > 0 ? (
                  clauses.map((clause, index) => (
                    <ClauseCard
                      key={`${clause.title}-${index}`}
                      clause={convertClauseToFrontend(clause)}
                      onViewRisk={() =>
                        onClauseSelect?.(clause.title as string)
                      }
                      onViewInDocument={onViewInDocument}
                    />
                  ))
                ) : (
                  <div className="text-center py-8 text-slate-500">
                    <p>No clauses found</p>
                  </div>
                )}
              </div>
            </TabsContent>

            <TabsContent value="risks" className="mt-0">
              <div className="space-y-4">
                {risks.length > 0 ? (
                  risks.map((risk, index) => (
                    <RiskCard
                      key={`${risk.title}-${index}`}
                      risk={convertRiskToFrontend(risk)}
                      onSelect={() => onClauseSelect?.(risk.title as string)}
                      onViewInDocument={onViewInDocument}
                    />
                  ))
                ) : (
                  <div className="text-center py-8 text-slate-500">
                    <p>No risks identified</p>
                  </div>
                )}
              </div>
            </TabsContent>

            <TabsContent value="obligations" className="mt-0">
              <div className="space-y-4">
                {obligations.length > 0 ? (
                  obligations.map((obligation, index) => (
                    <ObligationCard
                      key={`${obligation.title}-${index}`}
                      obligation={convertObligationToFrontend(obligation)}
                      onSelect={() =>
                        onClauseSelect?.(obligation.title as string)
                      }
                      onViewInDocument={onViewInDocument}
                    />
                  ))
                ) : (
                  <div className="text-center py-8 text-slate-500">
                    <p>No obligations found</p>
                  </div>
                )}
              </div>
            </TabsContent>

            <TabsContent value="suggestions" className="mt-0">
              <div className="space-y-4">
                {suggestions.length > 0 ? (
                  suggestions.map((suggestion, index) => (
                    <NegotiationCard
                      key={`${suggestion.title}-${index}`}
                      suggestion={convertSuggestionToFrontend(suggestion)}
                      onSelect={() =>
                        onClauseSelect?.(suggestion.title as string)
                      }
                      onViewInDocument={onViewInDocument}
                    />
                  ))
                ) : (
                  <div className="text-center py-8 text-slate-500">
                    <p>No suggestions available</p>
                  </div>
                )}
              </div>
            </TabsContent>
          </div>
        </ScrollArea>
      </Tabs>
    </div>
  );
};
