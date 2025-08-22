"use client";

import { useState } from "react";
import { Copy, Check, ArrowDown, TrendingUp, ExternalLink } from "lucide-react";

import { NegotiationSuggestion } from "../types";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Card, CardContent, CardTitle } from "@/components/ui/card";
import { CircularConfidence } from "../../dashboard/components/circular-confidence";

interface NegotiationCardProps {
  onSelect: () => void;
  suggestion: NegotiationSuggestion;
  onViewInDocument?: (clauseId: string) => void;
}

export const NegotiationCard: React.FC<NegotiationCardProps> = ({
  suggestion,
  onSelect,
  onViewInDocument,
}) => {
  const [copied, setCopied] = useState(false);
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

  const handleViewInDocument = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (onViewInDocument) {
      onViewInDocument(suggestion.clauseId);
    }
  };

  return (
    <Card
      className="cursor-pointer transition-all hover:shadow-md shadow-sm border border-gray-200"
      onClick={onSelect}
    >
      <CardContent className="p-6">
        <div className="flex items-start justify-between mb-6">
          <div className="flex items-start gap-3 flex-1">
            <div className="flex-1 min-w-0">
              <CardTitle className="text-base font-semibold text-foreground mb-1">
                {suggestion.title}
              </CardTitle>
            </div>
          </div>
          <div className="flex-shrink-0 ml-4">
            <CircularConfidence
              score={confidenceScore}
              size={48}
              strokeWidth={3}
            />
          </div>
        </div>

        <div className="space-y-4">
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium">Current Statement</span>
              <Button
                variant="ghost"
                size="sm"
                className="h-6 px-2 text-xs opacity-60 hover:opacity-100"
                onClick={(e) => {
                  e.stopPropagation();
                  handleCopy(suggestion.currentText);
                }}
              >
                {copied ? (
                  <Check className="w-3 h-3" strokeWidth={1.5} />
                ) : (
                  <Copy className="w-3 h-3" strokeWidth={1.5} />
                )}
              </Button>
            </div>
            <div className="p-3 bg-red-50 border-l-4 border-red-200 rounded-r-md">
              <p className="text-sm text-slate-700 leading-relaxed">
                {suggestion.currentText}
              </p>
            </div>
          </div>

          <div className="flex justify-center py-2">
            <ArrowDown className="w-4 h-4  animate-bounce" strokeWidth={1.5} />
          </div>

          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium">Suggested Statement</span>
              <Button
                variant="ghost"
                size="sm"
                className="h-6 px-2 text-xs opacity-60 hover:opacity-100"
                onClick={(e) => {
                  e.stopPropagation();
                  handleCopy(suggestion.suggestedText);
                }}
              >
                {copied ? (
                  <Check className="w-3 h-3" strokeWidth={1.5} />
                ) : (
                  <Copy className="w-3 h-3" strokeWidth={1.5} />
                )}
              </Button>
            </div>
            <div className="p-3 bg-green-50 border-l-4 border-green-200 rounded-r-md">
              <p className="text-sm text-slate-700 leading-relaxed font-medium">
                {suggestion.suggestedText}
              </p>
            </div>
          </div>

          {/* Reasoning */}
          <div className="pt-2">
            <div className="flex items-center gap-2 mb-2">
              <TrendingUp
                className="w-3 h-3 text-slate-400"
                strokeWidth={1.5}
              />
              <span className="text-sm text-slate-500">Reasoning</span>
            </div>
            <p className="text-sm text-slate-600 leading-relaxed italic">
              {suggestion.reasoning}
            </p>
          </div>
        </div>

        <Separator className="my-4" />

        {/* Footer */}
        <div className="flex items-center justify-end pt-2">
          <Button
            variant="ghost"
            size="sm"
            className="h-8 px-2 text-xs cursor-pointer"
            onClick={handleViewInDocument}
          >
            <ExternalLink className="w-3 h-3 mr-1" strokeWidth={1.5} />
            View in Document
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};
