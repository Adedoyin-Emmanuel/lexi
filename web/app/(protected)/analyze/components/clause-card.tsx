import { useState } from "react";
import { ChevronDown, ChevronUp, Eye, AlertTriangle } from "lucide-react";

import { Clause, Risk } from "../types";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useIsMobile } from "@/hooks/use-mobile";
import { Separator } from "@/components/ui/separator";
import { CircularConfidence } from "../../components/circular-confidence";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface ClauseCardProps {
  clause: Clause;
  risks?: Risk[];
  onViewRisk?: (clauseId: string) => void;
  onViewInDocument?: (clauseId: string) => void;
}

export const ClauseCard: React.FC<ClauseCardProps> = ({
  clause,
  risks = [],
  onViewRisk,
  onViewInDocument,
}) => {
  const isMobile = useIsMobile();
  const confidenceScore = clause.confidence;
  const [isExpanded, setIsExpanded] = useState(false);

  const clauseRisks = risks.filter((risk) => risk.clauseId === clause.id);
  const hasRisks = clauseRisks.length > 0;

  const handleViewInDocument = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (onViewInDocument) {
      onViewInDocument(clause.id);
    }
  };

  const handleViewRisk = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (onViewRisk) {
      onViewRisk(clause.id);
    }
  };

  return (
    <Card
      className={`cursor-pointer transition-all hover:shadow-md ${
        isMobile ? "mx-1" : ""
      }`}
    >
      <CardHeader className={`pb-4 ${isMobile ? "px-4 py-3" : ""}`}>
        <div className="flex items-start justify-between gap-3">
          <CardTitle
            className={`font-bold flex-1 ${isMobile ? "text-base" : "text-lg"}`}
          >
            {clause.title}
          </CardTitle>

          <CircularConfidence
            score={confidenceScore}
            size={isMobile ? 32 : 40}
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

      <CardContent className={`pt-0 space-y-4 ${isMobile ? "px-4 pb-4" : ""}`}>
        <div className="space-y-2">
          <p
            className={`text-slate-700 leading-relaxed ${
              !isExpanded ? "line-clamp-3" : ""
            } ${isMobile ? "text-sm" : "text-sm"}`}
          >
            {clause.content}
          </p>

          {clause.content.length > 200 && (
            <Button
              variant="ghost"
              size="sm"
              className="h-6 px-2 text-xs cursor-pointer"
              onClick={(e) => {
                e.stopPropagation();
                setIsExpanded(!isExpanded);
              }}
            >
              {isExpanded ? (
                <>
                  <ChevronUp className="w-3 h-3 mr-1" strokeWidth={1.5} />
                  Read less
                </>
              ) : (
                <>
                  <ChevronDown className="w-3 h-3 mr-1" strokeWidth={1.5} />
                  Read more
                </>
              )}
            </Button>
          )}
        </div>

        <Separator />

        <div
          className={`flex items-center justify-between pt-2 ${
            isMobile ? "flex-col gap-3 items-start" : ""
          }`}
        >
          <div className="flex items-center gap-1">
            <span
              className={`text-slate-500 ${isMobile ? "text-xs" : "text-xs"}`}
            >
              Position: {clause.position.start}-{clause.position.end}
            </span>
          </div>

          <div
            className={`flex items-center gap-1 ${
              isMobile ? "w-full justify-start" : ""
            }`}
          >
            <Button
              variant="ghost"
              size="sm"
              className={`text-xs cursor-pointer ${
                isMobile ? "h-8 px-2 text-xs" : "h-8 px-2 text-xs"
              }`}
              onClick={handleViewInDocument}
            >
              <Eye className="w-3 h-3 mr-1" strokeWidth={1.5} />
              View in Document
            </Button>

            {hasRisks && (
              <Button
                variant="ghost"
                size="sm"
                className={`text-xs text-red-600 hover:text-red-700 cursor-pointer hover:bg-red-50 ${
                  isMobile ? "h-8 px-2" : "h-8 px-2"
                }`}
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
