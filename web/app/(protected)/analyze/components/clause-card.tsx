import { useState } from "react";
import { ChevronDown, ChevronUp, Eye, AlertTriangle } from "lucide-react";

import { Clause, Risk } from "../page";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CircularConfidence } from "../../dashboard/components/circular-confidence";

interface ClauseCardProps {
  clause: Clause;
  risks?: Risk[];
  onViewRisk?: (clauseId: string) => void;
}

export const ClauseCard: React.FC<ClauseCardProps> = ({
  clause,
  risks = [],
  onViewRisk,
}) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const confidenceScore = Math.round(clause.confidence * 100);

  const clauseRisks = risks.filter((risk) => risk.clauseId === clause.id);
  const hasRisks = clauseRisks.length > 0;

  const handleViewInDocument = (e: React.MouseEvent) => {
    e.stopPropagation();
    console.log("View clause in document:", clause.id);
  };

  const handleViewRisk = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (onViewRisk) {
      onViewRisk(clause.id);
    }
  };

  return (
    <Card className={`cursor-pointer transition-all hover:shadow-md `}>
      <CardHeader className="pb-4">
        <div className="flex items-start justify-between gap-3">
          <CardTitle className="text-lg font-bold flex-1">
            {clause.title}
          </CardTitle>

          <CircularConfidence
            score={confidenceScore}
            size={40}
            strokeWidth={3}
          />
        </div>

        {hasRisks && (
          <div className="flex items-center gap-2">
            <Badge
              variant="outline"
              className="bg-red-100 text-red-800 border-red-200 text-xs"
            >
              <AlertTriangle className="w-3 h-3 mr-1" />
              Risky
            </Badge>
          </div>
        )}
      </CardHeader>

      <CardContent className="pt-0 space-y-4">
        <div className="space-y-2">
          <p
            className={`text-sm text-slate-700 leading-relaxed ${
              !isExpanded ? "line-clamp-3" : ""
            }`}
          >
            {clause.content}
          </p>

          {clause.content.length > 200 && (
            <Button
              variant="ghost"
              size="sm"
              className="h-6 px-2 text-xs text-blue-600 hover:text-blue-700"
              onClick={(e) => {
                e.stopPropagation();
                setIsExpanded(!isExpanded);
              }}
            >
              {isExpanded ? (
                <>
                  <ChevronUp className="w-3 h-3 mr-1" />
                  Read less
                </>
              ) : (
                <>
                  <ChevronDown className="w-3 h-3 mr-1" />
                  Read more
                </>
              )}
            </Button>
          )}
        </div>

        <Separator />

        <div className="flex items-center justify-between pt-2">
          <div className="flex items-center gap-1">
            <span className="text-xs text-slate-500">
              Position: {clause.position.start}-{clause.position.end}
            </span>
          </div>

          <div className="flex items-center gap-1">
            <Button
              variant="ghost"
              size="sm"
              className="h-8 px-2 text-xs cursor-pointer"
              onClick={handleViewInDocument}
            >
              <Eye className="w-3 h-3 mr-1" strokeWidth={1.5} />
              View in Document
            </Button>

            {hasRisks && (
              <Button
                variant="ghost"
                size="sm"
                className="h-8 px-2 text-xs text-red-600 hover:text-red-700 cursor-pointer hover:bg-red-50"
                onClick={handleViewRisk}
              >
                <AlertTriangle className="w-3 h-3 mr-1" />
                View Risk
              </Button>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
