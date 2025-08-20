"use client";

import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { FileText, TrendingUp, CheckCircle, AlertTriangle } from "lucide-react";
import { CircularConfidence } from "../../dashboard/components/circular-confidence";

interface SummaryCardProps {
  summary: string;
  confidence: number;
}

export const SummaryCard: React.FC<SummaryCardProps> = ({
  summary,
  confidence,
}) => {
  const confidenceScore = Math.round(confidence * 100);
  const getConfidenceColor = (score: number) => {
    if (score >= 80) return "text-green-600";
    if (score >= 60) return "text-yellow-600";
    return "text-red-600";
  };

  return (
    <Card className="border-slate-200 overflow-hidden">
      <CardHeader className="pb-3 bg-gradient-to-r from-slate-50 to-blue-50">
        <div className="flex items-center justify-between">
          <CardTitle className="text-base flex items-center gap-2">
            <FileText className="w-4 h-4 text-blue-600" />
            Contract Summary
          </CardTitle>
          <div className="flex items-center gap-2">
            <CircularConfidence
              score={confidenceScore}
              size={32}
              strokeWidth={3}
              className="animate-in slide-in-from-right duration-500"
            />
            <Badge variant="outline" className="text-xs">
              {confidenceScore}% confident
            </Badge>
          </div>
        </div>
        <Progress value={confidenceScore} className="h-2 bg-slate-100" />
      </CardHeader>
      <CardContent className="pt-4">
        <div className="space-y-4">
          <p className="text-sm text-slate-700 leading-relaxed">{summary}</p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="flex items-center gap-2 p-3 bg-green-50 rounded-lg border border-green-200">
              <CheckCircle className="w-4 h-4 text-green-600" />
              <div>
                <p className="text-xs font-medium text-green-800">
                  Analysis Complete
                </p>
                <p className="text-xs text-green-600">All clauses processed</p>
              </div>
            </div>

            <div className="flex items-center gap-2 p-3 bg-blue-50 rounded-lg border border-blue-200">
              <TrendingUp className="w-4 h-4 text-blue-600" />
              <div>
                <p className="text-xs font-medium text-blue-800">
                  High Confidence
                </p>
                <p className="text-xs text-blue-600">
                  {confidenceScore >= 80
                    ? "Very reliable analysis"
                    : confidenceScore >= 60
                    ? "Moderately reliable"
                    : "Review recommended"}
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-4 pt-4 border-t border-slate-100">
          <div className="flex items-center gap-2 text-xs text-slate-500">
            <TrendingUp className="w-3 h-3" />
            <span>AI-generated summary based on contract analysis</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
