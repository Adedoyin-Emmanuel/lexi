"use client";

import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import {
  Edit3,
  ArrowRight,
  ExternalLink,
  TrendingUp,
  Copy,
  Check,
} from "lucide-react";
import { NegotiationSuggestion } from "../page";
import { CircularConfidence } from "../../dashboard/components/circular-confidence";

interface NegotiationCardProps {
  suggestion: NegotiationSuggestion;
  onSelect: () => void;
}

const getConfidenceLevel = (confidence: number) => {
  const score = Math.round(confidence * 100);
  if (score >= 90)
    return { level: "Very High", color: "text-green-600", bg: "bg-green-50" };
  if (score >= 80)
    return { level: "High", color: "text-blue-600", bg: "bg-blue-50" };
  if (score >= 70)
    return { level: "Moderate", color: "text-yellow-600", bg: "bg-yellow-50" };
  return { level: "Low", color: "text-red-600", bg: "bg-red-50" };
};

export const NegotiationCard: React.FC<NegotiationCardProps> = ({
  suggestion,
  onSelect,
}) => {
  const [copied, setCopied] = useState(false);
  const confidenceInfo = getConfidenceLevel(suggestion.confidence);
  const confidenceScore = Math.round(suggestion.confidence * 100);

  const handleCopy = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy text: ", err);
    }
  };

  return (
    <Card
      className="cursor-pointer transition-all hover:shadow-md border-slate-200"
      onClick={onSelect}
    >
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between gap-2">
          <div className="flex items-center gap-2 min-w-0 flex-1">
            <Edit3 className="w-4 h-4 text-purple-600" />
            <CardTitle className="text-sm font-medium truncate">
              {suggestion.title}
            </CardTitle>
          </div>
          <Badge
            variant="outline"
            className="text-xs bg-purple-100 text-purple-800 border-purple-200 flex-shrink-0"
          >
            Suggestion
          </Badge>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 flex-1">
            <Progress value={confidenceScore} className="h-1 flex-1" />
            <CircularConfidence
              score={confidenceScore}
              size={20}
              strokeWidth={2}
              className="flex-shrink-0"
            />
          </div>
          <span className="text-xs text-slate-500 flex-shrink-0">
            {confidenceScore}%
          </span>
        </div>
      </CardHeader>

      <CardContent className="pt-0 space-y-3">
        <div>
          <div className="flex items-center justify-between mb-1">
            <span className="text-xs font-medium text-slate-600">Current</span>
            <Button
              variant="ghost"
              size="sm"
              className="h-5 px-2 text-xs"
              onClick={(e) => {
                e.stopPropagation();
                handleCopy(suggestion.currentText);
              }}
            >
              {copied ? (
                <Check className="w-3 h-3" />
              ) : (
                <Copy className="w-3 h-3" />
              )}
            </Button>
          </div>
          <div className="p-2 bg-slate-50 rounded text-sm text-slate-700 border-l-4 border-slate-300">
            {suggestion.currentText}
          </div>
        </div>

        <div className="flex justify-center">
          <ArrowRight className="w-4 h-4 text-slate-400" />
        </div>

        <div>
          <div className="flex items-center justify-between mb-1">
            <span className="text-xs font-medium text-slate-600">
              Suggested
            </span>
            <Button
              variant="ghost"
              size="sm"
              className="h-5 px-2 text-xs"
              onClick={(e) => {
                e.stopPropagation();
                handleCopy(suggestion.suggestedText);
              }}
            >
              {copied ? (
                <Check className="w-3 h-3" />
              ) : (
                <Copy className="w-3 h-3" />
              )}
            </Button>
          </div>
          <div className="p-2 bg-green-50 rounded text-sm text-slate-700 border-l-4 border-green-500">
            {suggestion.suggestedText}
          </div>
        </div>

        <div className="bg-blue-50 rounded-lg p-3 border border-blue-200">
          <div className="flex items-center gap-2 mb-2">
            <TrendingUp className="w-4 h-4 text-blue-600" />
            <span className="text-sm font-medium text-blue-800">Reasoning</span>
          </div>
          <p className="text-sm text-blue-700">{suggestion.reasoning}</p>
        </div>

        <div className={`p-2 rounded-lg border ${confidenceInfo.bg}`}>
          <div className="flex items-center gap-2">
            <div
              className={`w-2 h-2 rounded-full ${confidenceInfo.color.replace(
                "text-",
                "bg-"
              )}`}
            ></div>
            <span className={`text-xs font-medium ${confidenceInfo.color}`}>
              {confidenceInfo.level} Confidence
            </span>
          </div>
          <p className="text-xs text-slate-600 mt-1">
            {confidenceScore >= 90
              ? "AI is very confident in this suggestion"
              : confidenceScore >= 80
              ? "AI is confident in this suggestion"
              : confidenceScore >= 70
              ? "AI is moderately confident - review recommended"
              : "AI has low confidence - manual verification advised"}
          </p>
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-xs text-slate-500">
            <TrendingUp className="w-3 h-3" />
            <span>AI confidence level</span>
          </div>

          <Button
            variant="ghost"
            size="sm"
            className="h-6 px-2 text-xs"
            onClick={(e) => {
              e.stopPropagation();
            }}
          >
            <ExternalLink className="w-3 h-3 mr-1" />
            View in Document
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};
