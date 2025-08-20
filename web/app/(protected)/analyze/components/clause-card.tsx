"use client";

import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import {
  DollarSign,
  Shield,
  FileText,
  Clock,
  Lock,
  AlertTriangle,
  ExternalLink,
  TrendingUp,
  MapPin,
} from "lucide-react";
import { Clause } from "../page";
import { CircularConfidence } from "../../dashboard/components/circular-confidence";

interface ClauseCardProps {
  clause: Clause;
  isSelected: boolean;
  onSelect: () => void;
}

const getCategoryIcon = (category: Clause["category"]) => {
  switch (category) {
    case "payment":
      return <DollarSign className="w-4 h-4" />;
    case "liability":
      return <Shield className="w-4 h-4" />;
    case "ip":
      return <FileText className="w-4 h-4" />;
    case "termination":
      return <Clock className="w-4 h-4" />;
    case "confidentiality":
      return <Lock className="w-4 h-4" />;
    default:
      return <AlertTriangle className="w-4 h-4" />;
  }
};

const getCategoryColor = (category: Clause["category"]) => {
  switch (category) {
    case "payment":
      return "bg-green-100 text-green-800 border-green-200";
    case "liability":
      return "bg-red-100 text-red-800 border-red-200";
    case "ip":
      return "bg-blue-100 text-blue-800 border-blue-200";
    case "termination":
      return "bg-orange-100 text-orange-800 border-orange-200";
    case "confidentiality":
      return "bg-purple-100 text-purple-800 border-purple-200";
    default:
      return "bg-slate-100 text-slate-800 border-slate-200";
  }
};

const getImportanceColor = (importance: Clause["importance"]) => {
  switch (importance) {
    case "high":
      return "bg-red-100 text-red-800";
    case "medium":
      return "bg-yellow-100 text-yellow-800";
    case "low":
      return "bg-green-100 text-green-800";
  }
};

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

export const ClauseCard: React.FC<ClauseCardProps> = ({
  clause,
  isSelected,
  onSelect,
}) => {
  const confidenceInfo = getConfidenceLevel(clause.confidence);
  const confidenceScore = Math.round(clause.confidence * 100);

  return (
    <Card
      className={`cursor-pointer transition-all hover:shadow-md border-slate-200 ${
        isSelected ? "ring-2 ring-blue-500 bg-blue-50" : ""
      }`}
      onClick={onSelect}
    >
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between gap-2">
          <div className="flex items-center gap-2 min-w-0 flex-1">
            {getCategoryIcon(clause.category)}
            <CardTitle className="text-sm font-medium truncate">
              {clause.title}
            </CardTitle>
          </div>
          <div className="flex items-center gap-1 flex-shrink-0">
            <Badge
              variant="outline"
              className={`text-xs ${getCategoryColor(clause.category)}`}
            >
              {clause.category}
            </Badge>
            <Badge
              variant="outline"
              className={`text-xs ${getImportanceColor(clause.importance)}`}
            >
              {clause.importance}
            </Badge>
          </div>
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

      <CardContent className="pt-0">
        <div className="space-y-3">
          <div className="bg-slate-50 rounded-lg p-3 border border-slate-200">
            <p className="text-sm text-slate-700 leading-relaxed">
              "{clause.content}"
            </p>
            <div className="flex items-center gap-1 mt-2 text-xs text-slate-500">
              <MapPin className="w-3 h-3" />
              <span>
                Position: {clause.position.start}-{clause.position.end}
              </span>
            </div>
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
                ? "AI is very confident in this analysis"
                : confidenceScore >= 80
                ? "AI is confident in this analysis"
                : confidenceScore >= 70
                ? "AI is moderately confident - review recommended"
                : "AI has low confidence - manual verification advised"}
            </p>
          </div>
        </div>

        <div className="flex items-center justify-between mt-4">
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
