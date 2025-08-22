"use client";

import { Calendar, Eye } from "lucide-react";

import { Obligation } from "../types";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardTitle } from "@/components/ui/card";
import { CircularConfidence } from "../../components/circular-confidence";

interface ObligationCardProps {
  obligation: Obligation;
  onSelect: () => void;
  onViewInDocument?: (clauseId: string) => void;
}

const formatDeadline = (deadline: Date) => {
  const now = new Date();
  const diffTime = deadline.getTime() - now.getTime();
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

  if (diffDays < 0) {
    return { text: "Overdue", color: "bg-red-50 text-red-800 border-red-200" };
  } else if (diffDays === 0) {
    return {
      text: "Due today",
      color: "bg-orange-50 text-orange-800 border-orange-200",
    };
  } else if (diffDays <= 7) {
    return {
      text: `Due in ${diffDays} days`,
      color: "bg-yellow-50 text-yellow-800 border-yellow-200",
    };
  } else {
    return {
      text: `Due in ${diffDays} days`,
      color: "bg-green-50 text-green-800 border-green-200",
    };
  }
};

const getConfidenceColor = (confidence: number) => {
  if (confidence >= 90) return "text-green-600";
  if (confidence >= 80) return "text-blue-600";
  if (confidence >= 70) return "text-yellow-600";
  return "text-red-600";
};

export const ObligationCard: React.FC<ObligationCardProps> = ({
  obligation,
  onSelect,
  onViewInDocument,
}) => {
  const deadlineInfo = obligation.deadline
    ? formatDeadline(obligation.deadline)
    : null;
  const confidenceScore = Math.round(obligation.confidence * 100);

  const handleViewInDocument = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (onViewInDocument) {
      onViewInDocument(obligation.clauseId);
    }
  };

  return (
    <Card
      className="cursor-pointer transition-all hover:shadow-md shadow-sm border border-gray-200"
      onClick={onSelect}
    >
      <CardContent className="p-4 sm:p-6">
        <div className="flex items-start gap-3 sm:gap-4">
          <div className="flex-shrink-0 pt-1">
            <Calendar
              className="w-5 h-5 sm:w-6 sm:h-6 text-gray-600"
              strokeWidth={1.5}
            />
          </div>

          <div className="flex-1 min-w-0">
            <CardTitle className="text-sm sm:text-base font-semibold text-foreground mb-2">
              {obligation.title}
            </CardTitle>

            {deadlineInfo && (
              <Badge
                variant="outline"
                className={`text-xs mb-3 ${deadlineInfo.color}`}
              >
                {deadlineInfo.text}
              </Badge>
            )}

            <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed mb-4">
              {obligation.description}
            </p>

            {obligation.deadline && (
              <div className="flex items-center gap-2 mb-3">
                <span className="text-xs sm:text-sm text-gray-700">
                  {obligation.deadline.toLocaleDateString()} at{" "}
                  {obligation.deadline.toLocaleTimeString([], {
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </span>
              </div>
            )}
          </div>
        </div>

        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 pt-3 border-t border-gray-100">
          <div className="flex items-center gap-2 text-xs">
            <CircularConfidence score={confidenceScore} />
            <span className="font-medium">
              AI confidence:{" "}
              <span
                className={`font-bold ${getConfidenceColor(confidenceScore)}`}
              >
                {confidenceScore}%
              </span>
            </span>
          </div>

          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="sm"
              className="h-8 px-2 text-xs cursor-pointer flex-1 sm:flex-none"
              onClick={handleViewInDocument}
            >
              <Eye className="w-3 h-3 mr-1" strokeWidth={1.5} />
              <span className="hidden sm:inline">View in Document</span>
              <span className="sm:hidden">Document</span>
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
