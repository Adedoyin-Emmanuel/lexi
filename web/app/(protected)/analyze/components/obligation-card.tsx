"use client";

import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import {
  Calendar,
  Clock,
  CheckCircle,
  ExternalLink,
  TrendingUp,
} from "lucide-react";
import { Obligation } from "../page";
import { CircularConfidence } from "../../dashboard/components/circular-confidence";

interface ObligationCardProps {
  obligation: Obligation;
  onSelect: () => void;
}

const formatDeadline = (deadline: Date) => {
  const now = new Date();
  const diffTime = deadline.getTime() - now.getTime();
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

  if (diffDays < 0) {
    return { text: "Overdue", color: "bg-red-100 text-red-800 border-red-200" };
  } else if (diffDays === 0) {
    return {
      text: "Due today",
      color: "bg-orange-100 text-orange-800 border-orange-200",
    };
  } else if (diffDays <= 7) {
    return {
      text: `Due in ${diffDays} days`,
      color: "bg-yellow-100 text-yellow-800 border-yellow-200",
    };
  } else {
    return {
      text: `Due in ${diffDays} days`,
      color: "bg-green-100 text-green-800 border-green-200",
    };
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

export const ObligationCard: React.FC<ObligationCardProps> = ({
  obligation,
  onSelect,
}) => {
  const deadlineInfo = obligation.deadline
    ? formatDeadline(obligation.deadline)
    : null;
  const confidenceInfo = getConfidenceLevel(obligation.confidence);
  const confidenceScore = Math.round(obligation.confidence * 100);

  return (
    <Card
      className="cursor-pointer transition-all hover:shadow-md border-slate-200"
      onClick={onSelect}
    >
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between gap-2">
          <div className="flex items-center gap-2 min-w-0 flex-1">
            <Calendar className="w-4 h-4 text-blue-600" />
            <CardTitle className="text-sm font-medium truncate">
              {obligation.title}
            </CardTitle>
          </div>
          {deadlineInfo && (
            <Badge
              variant="outline"
              className={`text-xs flex-shrink-0 ${deadlineInfo.color}`}
            >
              {deadlineInfo.text}
            </Badge>
          )}
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
              {obligation.description}
            </p>
          </div>

          {obligation.deadline && (
            <div className="bg-blue-50 rounded-lg p-3 border border-blue-200">
              <div className="flex items-center gap-2 mb-2">
                <Clock className="w-4 h-4 text-blue-600" />
                <span className="text-sm font-medium text-blue-800">
                  Deadline
                </span>
              </div>
              <p className="text-sm text-blue-700">
                {obligation.deadline.toLocaleDateString()} at{" "}
                {obligation.deadline.toLocaleTimeString([], {
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </p>
            </div>
          )}

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
                ? "AI is very confident in this obligation identification"
                : confidenceScore >= 80
                ? "AI is confident in this obligation identification"
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
