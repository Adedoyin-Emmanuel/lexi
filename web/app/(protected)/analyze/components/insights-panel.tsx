"use client";

import React, { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import { AnalysisResult } from "../page";
import { SummaryCard } from "./summary-card";
import { ClauseCard } from "./clause-card";
import { RiskCard } from "./risk-card";
import { ObligationCard } from "./obligation-card";
import { NegotiationCard } from "./negotiation-card";
import { LoadingSkeleton } from "./loading-skeleton";

interface InsightsPanelProps {
  analysis: AnalysisResult | null;
  isAnalyzing: boolean;
  selectedClauseId: string | null;
  onClauseSelect: (clauseId: string) => void;
}

export const InsightsPanel: React.FC<InsightsPanelProps> = ({
  analysis,
  isAnalyzing,
  selectedClauseId,
  onClauseSelect,
}) => {
  const [activeTab, setActiveTab] = useState("summary");

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
      <div className="p-4 border-b border-slate-200">
        <h2 className="text-lg font-semibold text-slate-900">AI Analysis</h2>
        <div className="flex items-center gap-2 mt-1">
          <div className="w-2 h-2 bg-green-500 rounded-full"></div>
          <span className="text-sm text-slate-600">
            {Math.round(analysis.confidence * 100)}% confidence
          </span>
        </div>
      </div>

      <Tabs
        value={activeTab}
        onValueChange={setActiveTab}
        className="flex-1 flex flex-col"
      >
        <TabsList className="grid w-full grid-cols-5 mx-4 mt-4 h-auto p-1">
          <TabsTrigger value="summary" className="text-xs py-2">
            Summary
          </TabsTrigger>
          <TabsTrigger value="clauses" className="text-xs py-2">
            Clauses
          </TabsTrigger>
          <TabsTrigger value="risks" className="text-xs py-2">
            Risks
          </TabsTrigger>
          <TabsTrigger value="obligations" className="text-xs py-2">
            Obligations
          </TabsTrigger>
          <TabsTrigger value="negotiation" className="text-xs py-2">
            Redlines
          </TabsTrigger>
        </TabsList>

        <ScrollArea className="flex-1 px-4 pb-4">
          <TabsContent value="summary" className="mt-4 space-y-4">
            <SummaryCard
              summary={analysis.summary}
              confidence={analysis.confidence}
              stats={analysis.stats}
            />
          </TabsContent>

          <TabsContent value="clauses" className="mt-4 space-y-3">
            {analysis.keyClauses.map((clause) => (
              <ClauseCard
                key={clause.id}
                clause={clause}
                isSelected={selectedClauseId === clause.id}
                onSelect={() => onClauseSelect(clause.id)}
              />
            ))}
          </TabsContent>

          <TabsContent value="risks" className="mt-4 space-y-3">
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

          <TabsContent value="obligations" className="mt-4 space-y-3">
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

          <TabsContent value="negotiation" className="mt-4 space-y-3">
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
