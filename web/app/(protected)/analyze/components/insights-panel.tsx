"use client";

import React, { useState } from "react";

import { RiskCard } from "./risk-card";
import { AnalysisResult } from "../page";
import { ClauseCard } from "./clause-card";
import { SummaryCard } from "./summary-card";
import { useIsMobile } from "@/hooks/use-mobile";
import { ObligationCard } from "./obligation-card";
import { LoadingSkeleton } from "./loading-skeleton";
import { NegotiationCard } from "./negotiation-card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface InsightsPanelProps {
  isAnalyzing: boolean;
  selectedClauseId: string | null;
  analysis: AnalysisResult | null;
  onClauseSelect: (clauseId: string) => void;
}

export const InsightsPanel: React.FC<InsightsPanelProps> = ({
  analysis,
  isAnalyzing,
  onClauseSelect,
}) => {
  const [activeTab, setActiveTab] = useState("summary");
  const isMobile = useIsMobile();

  if (isAnalyzing) {
    return <LoadingSkeleton />;
  }

  if (!analysis) {
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
            {Math.round(analysis.confidence * 100)}% confidence
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
                  {analysis.keyClauses.length}
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
                  {analysis.risks.length}
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
                  className={`px-1.5 py-0.5 bg-yellow-100 text-yellow-700 text-xs rounded-full font-medium min-w-[20px] h-5 flex items-center justify-center ${
                    isMobile ? "ml-1" : "ml-1.5"
                  }`}
                >
                  {analysis.obligations.length}
                </span>
              </TabsTrigger>
              <TabsTrigger
                value="negotiation"
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
                  {analysis.negotiationSuggestions.length}
                </span>
              </TabsTrigger>
            </TabsList>
          </div>
        </div>

        <ScrollArea className={`flex-1 ${isMobile ? "px-3" : "px-4"} pb-4`}>
          <TabsContent
            value="summary"
            className={`space-y-4 ${isMobile ? "mt-3" : "mt-4"}`}
          >
            <SummaryCard
              summary={analysis.summary}
              confidence={analysis.confidence}
              stats={analysis.stats}
            />
          </TabsContent>

          <TabsContent
            value="clauses"
            className={`space-y-3 ${isMobile ? "mt-3" : "mt-4"}`}
          >
            {analysis.keyClauses.map((clause) => (
              <ClauseCard
                key={clause.id}
                clause={clause}
                risks={analysis.risks}
                onViewRisk={(clauseId: string) => {
                  setActiveTab("risks");
                  onClauseSelect(clauseId);
                }}
              />
            ))}
          </TabsContent>

          <TabsContent
            value="risks"
            className={`space-y-3 ${isMobile ? "mt-3" : "mt-4"}`}
          >
            {analysis.risks.length === 0 ? (
              <div className="text-center py-8 text-slate-500">
                <p className="font-medium">No significant risks detected</p>
                <p className="text-sm mt-1">Your contract looks good!</p>
              </div>
            ) : (
              analysis.risks.map((risk) => (
                <RiskCard
                  key={risk.id}
                  risk={risk}
                  onSelect={() => onClauseSelect(risk.clauseId)}
                />
              ))
            )}
          </TabsContent>

          <TabsContent
            value="obligations"
            className={`space-y-3 ${isMobile ? "mt-3" : "mt-4"}`}
          >
            {analysis.obligations.length === 0 ? (
              <div className="text-center py-8 text-slate-500">
                <p className="font-medium">No specific obligations found</p>
                <p className="text-sm mt-1">
                  Check the contract terms for deadlines
                </p>
              </div>
            ) : (
              analysis.obligations.map((obligation) => (
                <ObligationCard
                  key={obligation.id}
                  obligation={obligation}
                  onSelect={() => onClauseSelect(obligation.clauseId)}
                />
              ))
            )}
          </TabsContent>

          <TabsContent
            value="negotiation"
            className={`space-y-3 ${isMobile ? "mt-3" : "mt-4"}`}
          >
            {analysis.negotiationSuggestions.length === 0 ? (
              <div className="text-center py-8 text-slate-500">
                <p className="font-medium">No negotiation suggestions</p>
                <p className="text-sm mt-1">
                  Your contract terms are well-balanced
                </p>
              </div>
            ) : (
              analysis.negotiationSuggestions.map((suggestion) => (
                <NegotiationCard
                  key={suggestion.id}
                  suggestion={suggestion}
                  onSelect={() => onClauseSelect(suggestion.clauseId)}
                />
              ))
            )}
          </TabsContent>
        </ScrollArea>
      </Tabs>
    </div>
  );
};
