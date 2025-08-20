"use client";

import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { FileText, TrendingUp } from "lucide-react";

interface SummaryCardProps {
  summary: string;
  confidence: number;
}

export const SummaryCard: React.FC<SummaryCardProps> = ({ summary, confidence }) => {
  return (
    <Card>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-base flex items-center gap-2">
            <FileText className="w-4 h-4" />
            Contract Summary
          </CardTitle>
          <Badge variant="outline" className="text-xs">
            {Math.round(confidence * 100)}% confident
          </Badge>
        </div>
        <Progress value={confidence * 100} className="h-2" />
      </CardHeader>
      <CardContent>
        <p className="text-sm text-gray-700 leading-relaxed">{summary}</p>
        
        <div className="mt-4 pt-4 border-t border-gray-100">
          <div className="flex items-center gap-2 text-xs text-gray-500">
            <TrendingUp className="w-3 h-3" />
            <span>AI-generated summary based on contract analysis</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
