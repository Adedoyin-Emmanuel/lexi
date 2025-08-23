"use client";

import React, { useState } from "react";

import {
  ISummary,
  IExtractedRisk,
  IExtractedClause,
  IExtractedSuggestion,
  IExtractedObligation,
} from "@/hooks/types/socket";
import { RiskCard } from "./risk-card";
import { AnalysisState } from "../page";
import { ClauseCard } from "./clause-card";
import { SummaryCard } from "./summary-card";
import { useIsMobile } from "@/hooks/use-mobile";
import { ObligationCard } from "./obligation-card";
import { LoadingSkeleton } from "./loading-skeleton";
import { NegotiationCard } from "./negotiation-card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface InsightsPanelProps {
  analysisState: AnalysisState;
  onClauseSelect?: (clauseId: string) => void;
  onViewInDocument?: (clauseId: string) => void;
}

export const InsightsPanel: React.FC<InsightsPanelProps> = ({
  analysisState,
  onClauseSelect,
  onViewInDocument,
}) => {
  const [activeTab, setActiveTab] = useState("summary");
  const isMobile = useIsMobile();

  const { isAnalyzing, validation, summary, extraction, error } = analysisState;

  if (isAnalyzing) {
    return <LoadingSkeleton />;
  }

  if (error) {
    return (
      <div className="h-full flex items-center justify-center text-red-500 bg-white">
        <div className="text-center p-6">
          <p className="text-lg font-medium">Analysis Failed</p>
          <p className="text-sm mt-2">{error}</p>
        </div>
      </div>
    );
  }

  if (validation && !validation.isValidContract) {
    return (
      <div className="h-full flex items-center justify-center text-orange-500 bg-white">
        <div className="text-center p-6">
          <p className="text-lg font-medium">Invalid Contract</p>
          <p className="text-sm mt-2">
            {validation?.reason || "This document is not a valid contract."}
          </p>
        </div>
      </div>
    );
  }

  if (!summary || !extraction) {
    return (
      <div className="h-full flex items-center justify-center text-slate-500 bg-white">
        <div className="text-center p-6">
          <p className="text-lg font-medium">
            Upload a contract to see AI insights
          </p>
          <p className="text-sm mt-2">
            Lexi will analyze your document and provide detailed insights
          </p>
        </div>
      </div>
    );
  }

  const convertClauseToFrontend = (clause: IExtractedClause) => ({
    id: clause.title,
    title: clause.title,
    content: clause.fullText,
    importance: "high" as const,
    category: "other" as const,
    position: { start: clause.startIndex, end: clause.endIndex },
    confidence: clause.confidenceScore,
  });

  const convertRiskToFrontend = (risk: IExtractedRisk) => ({
    id: risk.title,
    title: risk.title,
    description: risk.description,
    severity: risk.riskLevel.toLowerCase() as "low" | "medium" | "high",
    clauseId: risk.title,
    confidence: risk.confidenceScore,
  });

  const convertObligationToFrontend = (obligation: IExtractedObligation) => ({
    id: obligation.title,
    title: obligation.title,
    description: obligation.description,
    deadline: obligation.dueDate ? new Date(obligation.dueDate) : undefined,
    clauseId: obligation.title,
    confidence: obligation.confidenceScore,
  });

  const convertSuggestionToFrontend = (suggestion: IExtractedSuggestion) => ({
    id: suggestion.title,
    title: suggestion.title,
    reasoning: suggestion.reason,
    confidence: suggestion.confidenceScore,
    currentText: suggestion.currentStatement,
    suggestedText: suggestion.suggestedStatement,
    clauseId: suggestion.title,
  });

  const convertSummaryToFrontend = (summary: ISummary) => ({
    summary: summary.overviewSummary,
    confidence: summary.overallConfidenceScore,
    stats: {
      contractType: summary.type,
      duration: summary.duration,
      jurisdiction: summary.jurisdiction,
      effectiveDate: summary.effectiveDate,
      partiesInvolved: summary.totalPartiesInvolved,
      hasTerminationClause: summary.terminationClasePresent,
      overallRiskScore: summary.overallRiskScore,
      riskLevel: (summary.overallRiskScore > 65
        ? "high"
        : summary.overallRiskScore > 50
        ? "medium"
        : "low") as "low" | "medium" | "high",
    },
  });

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
            {validation?.confidenceScore}% confidence
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
                  {extraction.clauses.length}
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
                  {extraction.risks.length}
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
                  {extraction.obligations.length}
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
                  {extraction.suggestions.length}
                </span>
              </TabsTrigger>
            </TabsList>
          </div>
        </div>

        <ScrollArea className="flex-1">
          <div className={`${isMobile ? "p-3" : "p-4"}`}>
            <TabsContent value="summary" className="mt-0">
              <SummaryCard {...convertSummaryToFrontend(summary)} />
            </TabsContent>

            <TabsContent value="clauses" className="mt-0">
              <div className="space-y-4">
                {extraction.clauses.map((clause, index) => (
                  <ClauseCard
                    key={`${clause.title}-${index}`}
                    clause={convertClauseToFrontend(clause)}
                    onViewRisk={() => onClauseSelect?.(clause.title)}
                    onViewInDocument={onViewInDocument}
                  />
                ))}
              </div>
            </TabsContent>

            <TabsContent value="risks" className="mt-0">
              <div className="space-y-4">
                {extraction.risks.map((risk, index) => (
                  <RiskCard
                    key={`${risk.title}-${index}`}
                    risk={convertRiskToFrontend(risk)}
                    onSelect={() => onClauseSelect?.(risk.title)}
                    onViewInDocument={onViewInDocument}
                  />
                ))}
              </div>
            </TabsContent>

            <TabsContent value="obligations" className="mt-0">
              <div className="space-y-4">
                {extraction.obligations.map((obligation, index) => (
                  <ObligationCard
                    key={`${obligation.title}-${index}`}
                    obligation={convertObligationToFrontend(obligation)}
                    onSelect={() => onClauseSelect?.(obligation.title)}
                    onViewInDocument={onViewInDocument}
                  />
                ))}
              </div>
            </TabsContent>

            <TabsContent value="suggestions" className="mt-0">
              <div className="space-y-4">
                {extraction.suggestions.map((suggestion, index) => (
                  <NegotiationCard
                    key={`${suggestion.title}-${index}`}
                    suggestion={convertSuggestionToFrontend(suggestion)}
                    onSelect={() => onClauseSelect?.(suggestion.title)}
                    onViewInDocument={onViewInDocument}
                  />
                ))}
              </div>
            </TabsContent>
          </div>
        </ScrollArea>
      </Tabs>
    </div>
  );
};
