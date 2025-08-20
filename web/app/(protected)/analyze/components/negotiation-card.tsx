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
  Check
} from "lucide-react";
import { NegotiationSuggestion } from "../page";

interface NegotiationCardProps {
  suggestion: NegotiationSuggestion;
  onSelect: () => void;
}

export const NegotiationCard: React.FC<NegotiationCardProps> = ({ 
  suggestion, 
  onSelect 
}) => {
  const [copied, setCopied] = useState(false);

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
    <Card className="cursor-pointer transition-all hover:shadow-md" onClick={onSelect}>
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-2">
            <Edit3 className="w-4 h-4 text-purple-600" />
            <CardTitle className="text-sm font-medium">{suggestion.title}</CardTitle>
          </div>
          <Badge variant="outline" className="text-xs bg-purple-100 text-purple-800 border-purple-200">
            Suggestion
          </Badge>
        </div>
        
        <div className="flex items-center gap-2">
          <Progress value={suggestion.confidence * 100} className="h-1 flex-1" />
          <span className="text-xs text-gray-500">
            {Math.round(suggestion.confidence * 100)}%
          </span>
        </div>
      </CardHeader>
      
      <CardContent className="pt-0 space-y-3">
        <div>
          <div className="flex items-center justify-between mb-1">
            <span className="text-xs font-medium text-gray-600">Current</span>
            <Button
              variant="ghost"
              size="sm"
              className="h-5 px-2 text-xs"
              onClick={(e) => {
                e.stopPropagation();
                handleCopy(suggestion.currentText);
              }}
            >
              {copied ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
            </Button>
          </div>
          <div className="p-2 bg-gray-50 rounded text-sm text-gray-700 border-l-4 border-gray-300">
            {suggestion.currentText}
          </div>
        </div>

        <div className="flex justify-center">
          <ArrowRight className="w-4 h-4 text-gray-400" />
        </div>

        <div>
          <div className="flex items-center justify-between mb-1">
            <span className="text-xs font-medium text-gray-600">Suggested</span>
            <Button
              variant="ghost"
              size="sm"
              className="h-5 px-2 text-xs"
              onClick={(e) => {
                e.stopPropagation();
                handleCopy(suggestion.suggestedText);
              }}
            >
              {copied ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
            </Button>
          </div>
          <div className="p-2 bg-green-50 rounded text-sm text-gray-700 border-l-4 border-green-500">
            {suggestion.suggestedText}
          </div>
        </div>

        <div className="pt-2 border-t border-gray-100">
          <p className="text-xs text-gray-600 mb-2">
            <strong>Reasoning:</strong> {suggestion.reasoning}
          </p>
        </div>
        
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-xs text-gray-500">
            <TrendingUp className="w-3 h-3" />
            <span>AI confidence level</span>
          </div>
          
          <Button 
            variant="ghost" 
            size="sm" 
            className="h-6 px-2 text-xs"
            onClick={(e) => {
              e.stopPropagation();
              // Handle view in document
            }}
          >
            <ExternalLink className="w-3 h-3 mr-1" />
            View
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};
