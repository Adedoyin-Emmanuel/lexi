import { AlertTriangle, Eye } from "lucide-react";

import { Risk } from "../types";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardTitle } from "@/components/ui/card";
import { useIsMobile } from "@/hooks/use-mobile";

interface RiskCardProps {
  risk: Risk;
  onSelect: () => void;
  onViewInDocument?: (clauseId: string) => void;
}

const getSeverityColor = (severity: Risk["severity"]) => {
  switch (severity) {
    case "high":
      return "bg-red-50 text-red-800 border-red-200";
    case "medium":
      return "bg-yellow-50 text-yellow-800 border-yellow-200";
    case "low":
      return "bg-green-50 text-green-800 border-green-200";
  }
};

const getConfidenceColor = (confidence: number) => {
  if (confidence >= 90) return "text-green-600";
  if (confidence >= 80) return "text-blue-600";
  if (confidence >= 70) return "text-yellow-600";
  return "text-red-600";
};

const shouldAbstain = (confidence: number) => {
  return confidence < 0.6;
};

export const RiskCard: React.FC<RiskCardProps> = ({ risk, onSelect, onViewInDocument }) => {
  const confidenceScore = Math.round(risk.confidence * 100);
  const abstain = shouldAbstain(risk.confidence);
  const isMobile = useIsMobile();

  const handleViewInDocument = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (onViewInDocument) {
      onViewInDocument(risk.clauseId);
    }
  };

  if (abstain) {
    return (
      <Card className="shadow-sm border border-gray-200">
        <CardContent className={`${isMobile ? "p-4" : "p-6"}`}>
          <div className="flex items-start gap-4">
            <div className="flex-shrink-0 pt-1">
              <AlertTriangle
                className="w-6 h-6 text-amber-600"
                strokeWidth={1.5}
              />
            </div>

            <div className="flex-1 min-w-0">
              <CardTitle
                className={`font-semibold text-foreground mb-2 ${
                  isMobile ? "text-sm" : "text-base"
                }`}
              >
                {risk.title}
              </CardTitle>

              <Badge
                variant="outline"
                className="text-xs bg-amber-100 text-amber-800 border-amber-200 mb-3"
              >
                Low Confidence
              </Badge>

              <div className="bg-amber-100/80 p-4 border border-amber-200">
                <div className="flex items-center gap-2 mb-2">
                  <AlertTriangle
                    className="w-4 h-4 text-amber-600"
                    strokeWidth={1.5}
                  />
                  <span
                    className={`font-medium text-amber-800 ${
                      isMobile ? "text-sm" : "text-sm"
                    }`}
                  >
                    Manual Review Required
                  </span>
                </div>
                <p
                  className={`text-amber-700 leading-relaxed ${
                    isMobile ? "text-sm" : "text-sm"
                  }`}
                >
                  AI confidence is too low ({confidenceScore}%) to provide a
                  reliable assessment. Please review this potential risk
                  manually to ensure accuracy.
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card
      className={`cursor-pointer transition-all hover:shadow-md shadow-sm border border-gray-200 ${
        isMobile ? "mx-1" : ""
      }`}
      onClick={onSelect}
    >
      <CardContent className={`${isMobile ? "p-4" : "p-6"}`}>
        <div className="flex items-start gap-4">
          <div className="flex-shrink-0 pt-1">
            <AlertTriangle
              className="w-6 h-6 text-orange-600"
              strokeWidth={1.5}
            />
          </div>

          <div className="flex-1 min-w-0">
            <CardTitle
              className={`font-semibold text-foreground mb-2 ${
                isMobile ? "text-sm" : "text-base"
              }`}
            >
              {risk.title}
            </CardTitle>

            <Badge
              variant="outline"
              className={`text-xs mb-3 ${getSeverityColor(risk.severity)}`}
            >
              {risk.severity} risk
            </Badge>

            <p
              className={`text-muted-foreground leading-relaxed mb-3 ${
                isMobile ? "text-sm" : "text-sm"
              }`}
            >
              {risk.description}
            </p>
          </div>
        </div>

        <div
          className={`flex items-center justify-between pt-3 border-t border-gray-100 ${
            isMobile ? "flex-col gap-3 items-start" : ""
          }`}
        >
          <div className="flex items-center gap-2 text-xs">
            <span className={`font-medium `}>
              AI confidence:{" "}
              <span
                className={`font-bold ${getConfidenceColor(confidenceScore)}`}
              >
                {confidenceScore}%
              </span>
            </span>
          </div>

          <div
            className={`flex items-center gap-2 ${
              isMobile ? "w-full justify-start" : ""
            }`}
          >
            <Button
              variant="ghost"
              size="sm"
              className={`text-xs cursor-pointer ${
                isMobile ? "h-8 px-2" : "h-8 px-2"
              }`}
              onClick={handleViewInDocument}
            >
              <Eye className="w-3 h-3 mr-1" strokeWidth={1.5} />
              View in Document
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
