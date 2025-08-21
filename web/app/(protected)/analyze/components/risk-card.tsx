import {
  TrendingUp,
  HelpCircle,
  AlertCircle,
  ExternalLink,
  AlertOctagon,
  AlertTriangle,
} from "lucide-react";

import { Risk } from "../page";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CircularConfidence } from "../../dashboard/components/circular-confidence";

interface RiskCardProps {
  risk: Risk;
  onSelect: () => void;
}

const getSeverityIcon = (severity: Risk["severity"]) => {
  switch (severity) {
    case "high":
      return <AlertOctagon className="w-4 h-4 text-red-600" />;
    case "medium":
      return <AlertTriangle className="w-4 h-4 text-yellow-600" />;
    case "low":
      return <AlertCircle className="w-4 h-4 text-green-600" />;
  }
};

const getSeverityColor = (severity: Risk["severity"]) => {
  switch (severity) {
    case "high":
      return "bg-red-100 text-red-800 border-red-200";
    case "medium":
      return "bg-yellow-100 text-yellow-800 border-yellow-200";
    case "low":
      return "bg-green-100 text-green-800 border-green-200";
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

const shouldAbstain = (confidence: number) => {
  return confidence < 0.6;
};

export const RiskCard: React.FC<RiskCardProps> = ({ risk, onSelect }) => {
  const confidenceInfo = getConfidenceLevel(risk.confidence);
  const confidenceScore = Math.round(risk.confidence * 100);
  const abstain = shouldAbstain(risk.confidence);

  if (abstain) {
    return (
      <Card className="border-slate-200 bg-amber-50 border-amber-200">
        <CardHeader className="pb-3">
          <div className="flex items-start justify-between gap-2">
            <div className="flex items-center gap-2 min-w-0 flex-1">
              <HelpCircle className="w-4 h-4 text-amber-600" />
              <CardTitle className="text-sm font-medium truncate">
                {risk.title}
              </CardTitle>
            </div>
            <Badge
              variant="outline"
              className="text-xs bg-amber-100 text-amber-800 border-amber-200 flex-shrink-0"
            >
              Low Confidence
            </Badge>
          </div>
        </CardHeader>

        <CardContent className="pt-0">
          <div className="bg-amber-100 rounded-lg p-3 border border-amber-200">
            <div className="flex items-center gap-2 mb-2">
              <AlertTriangle className="w-4 h-4 text-amber-600" />
              <span className="text-sm font-medium text-amber-800">
                Manual Review Required
              </span>
            </div>
            <p className="text-sm text-amber-700">
              AI confidence is too low ({confidenceScore}%) to provide a
              reliable assessment. Please review this potential risk manually to
              ensure accuracy.
            </p>
            <div className="flex items-center gap-2 mt-3">
              <CircularConfidence
                score={confidenceScore}
                size={24}
                strokeWidth={2}
              />
              <span className="text-xs text-amber-600">
                {confidenceScore}% confidence - below threshold
              </span>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card
      className="cursor-pointer transition-all hover:shadow-md border-slate-200"
      onClick={onSelect}
    >
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between gap-2">
          <div className="flex items-center gap-2 min-w-0 flex-1">
            {getSeverityIcon(risk.severity)}
            <CardTitle className="text-sm font-medium truncate">
              {risk.title}
            </CardTitle>
          </div>
          <Badge
            variant="outline"
            className={`text-xs flex-shrink-0 ${getSeverityColor(
              risk.severity
            )}`}
          >
            {risk.severity} risk
          </Badge>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 flex-1">
            <Progress
              value={confidenceScore}
              className={`h-1 flex-1 ${
                risk.severity === "high"
                  ? "bg-red-100"
                  : risk.severity === "medium"
                  ? "bg-yellow-100"
                  : "bg-green-100"
              }`}
            />
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
              {risk.description}
            </p>
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
                ? "AI is very confident in this risk assessment"
                : confidenceScore >= 80
                ? "AI is confident in this risk assessment"
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
