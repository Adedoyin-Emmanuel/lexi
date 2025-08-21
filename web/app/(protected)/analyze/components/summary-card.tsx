"use client";

import { FileText } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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

  return (
    <Card>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-base flex items-center gap-2">
            <FileText className="w-4 h-4" />
            Summary
          </CardTitle>
          <div className="flex items-center gap-2">
            <CircularConfidence
              score={confidenceScore}
              size={28}
              strokeWidth={3}
            />
            <Badge variant="outline" className="text-xs">
              {confidenceScore}% confident
            </Badge>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <p className="text-sm leading-relaxed">{summary}</p>
      </CardContent>
    </Card>
  );
};
