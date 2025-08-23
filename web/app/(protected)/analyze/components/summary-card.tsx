import {
  Users,
  Scale,
  Clock,
  Shield,
  XCircle,
  Calendar,
  FileText,
  CheckCircle,
  AlertTriangle,
  ThumbsUp,
  ThumbsDown,
} from "lucide-react";

import { ContractStats } from "../types";
import { Badge } from "@/components/ui/badge";
import { useIsMobile } from "@/hooks/use-mobile";
import { CircularConfidence } from "../../components/circular-confidence";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface SummaryCardProps {
  summary: string;
  confidence: number;
  stats: ContractStats;
}

const getRiskLevelColor = (riskLevel: "low" | "medium" | "high") => {
  switch (riskLevel) {
    case "low":
      return "bg-green-100 text-green-800 border-green-200";
    case "medium":
      return "bg-yellow-100 text-yellow-800 border-yellow-200";
    case "high":
      return "bg-red-100 text-red-800 border-red-200";
    default:
      return "bg-muted text-muted-foreground border-gray-200";
  }
};

const getRiskLevelIcon = (riskLevel: "low" | "medium" | "high") => {
  switch (riskLevel) {
    case "low":
      return (
        <CheckCircle className="w-5 h-5 text-green-600" strokeWidth={1.5} />
      );
    case "medium":
      return (
        <AlertTriangle className="w-5 h-5 text-yellow-600" strokeWidth={1.5} />
      );
    case "high":
      return <Shield className="w-5 h-5 text-red-600" strokeWidth={1.5} />;
    default:
      return (
        <AlertTriangle
          className="w-5 h-5 text-muted-foreground"
          strokeWidth={1.5}
        />
      );
  }
};

const formatJurisdiction = (jurisdiction: string) => {
  if (jurisdiction.includes(",")) {
    const [state, country] = jurisdiction.split(",").map((s) => s.trim());
    return `${state}, ${country}`;
  }
  return jurisdiction;
};

const formatDate = (date: string) => {
  const dateObj = new Date(date);
  return dateObj.toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
};

const getRecommendation = (riskScore: number) => {
  if (riskScore <= 30) {
    return {
      action: "PROCEED",
      message:
        "This contract appears to have low risk factors. Consider proceeding with standard due diligence.",
      icon: <ThumbsUp className="w-5 h-5 text-green-600" strokeWidth={1.5} />,
      color: "bg-green-50 border-green-200 text-green-800",
    };
  } else if (riskScore <= 60) {
    return {
      action: "PROCEED WITH CAUTION",
      message:
        "This contract has moderate risk factors. Review carefully and consider seeking legal counsel.",
      icon: (
        <AlertTriangle className="w-5 h-5 text-yellow-600" strokeWidth={1.5} />
      ),
      color: "bg-yellow-50 border-yellow-200 text-yellow-800",
    };
  } else {
    return {
      action: "ABSTAIN",
      message:
        "This contract has high risk factors. Strongly consider abstaining or seeking extensive legal review.",
      icon: <ThumbsDown className="w-5 h-5 text-red-600" strokeWidth={1.5} />,
      color: "bg-red-50 border-red-200 text-red-800",
    };
  }
};

export const SummaryCard: React.FC<SummaryCardProps> = ({
  summary,
  confidence,
  stats,
}) => {
  const isMobile = useIsMobile();
  const confidenceScore = confidence;
  const recommendation = getRecommendation(stats.overallRiskScore);

  const statItems = [
    {
      icon: <FileText className="w-5 h-5" strokeWidth={1.5} />,
      title: "Contract Type",
      value: stats.contractType,
      highlight: true,
    },
    {
      icon: <Users className="w-5 h-5" strokeWidth={1.5} />,
      title: "Parties Involved",
      value: `${stats.partiesInvolved} part${
        stats.partiesInvolved > 1 ? "ies" : "y"
      }`,
    },
    {
      icon: <Scale className="w-5 h-5" strokeWidth={1.5} />,
      title: "Jurisdiction",
      value: formatJurisdiction(stats.jurisdiction),
    },
    {
      icon: <Calendar className="w-5 h-5" strokeWidth={1.5} />,
      title: "Duration",
      value: stats.duration,
    },
    {
      icon: <Clock className="w-5 h-5" strokeWidth={1.5} />,
      title: "Effective Date",
      value: formatDate(stats.effectiveDate),
    },
    {
      icon: <Shield className="w-5 h-5" strokeWidth={1.5} />,
      title: "Termination Clause",
      value: stats.hasTerminationClause ? "Present" : "Not Found",
      status: stats.hasTerminationClause ? "success" : "warning",
    },
  ];

  return (
    <Card className="border border-gray-200 shadow-none">
      <CardHeader className={`pb-6 ${isMobile ? "px-3 py-3" : ""}`}>
        <div className="flex items-center justify-between">
          <CardTitle
            className={`font-semibold flex items-center gap-3 text-foreground ${
              isMobile ? "text-sm" : "text-lg"
            }`}
          >
            Contract Summary
          </CardTitle>
          <CircularConfidence
            score={confidenceScore}
            size={isMobile ? 36 : 48}
            strokeWidth={4}
          />
        </div>
      </CardHeader>

      <CardContent
        className={`space-y-4 ${isMobile ? "px-3 pb-3" : "space-y-6"}`}
      >
        <div
          className={`grid gap-3 ${
            isMobile
              ? "grid-cols-1"
              : "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3"
          }`}
        >
          {statItems.map((item, index) => (
            <div
              key={index}
              className={`${
                isMobile ? "p-3" : "p-4"
              } rounded-lg border border-gray-200 bg-card flex items-start gap-3`}
            >
              <div
                className={`flex-shrink-0 ${
                  isMobile ? "w-6 h-6" : "w-8 h-8"
                } flex items-center justify-center`}
              >
                <span className="text-muted-foreground">{item.icon}</span>
              </div>
              <div className="flex-1 min-w-0">
                <p
                  className={`font-medium text-muted-foreground uppercase tracking-wide mb-1 ${
                    isMobile ? "text-xs" : "text-xs"
                  }`}
                >
                  {item.title}
                </p>
                <div className="flex items-center gap-2">
                  <p
                    className={`font-semibold text-foreground truncate ${
                      item.highlight ? "text-base" : "text-sm"
                    } ${isMobile ? "text-sm" : ""}`}
                  >
                    {item.value}
                  </p>
                  {item.status === "success" && (
                    <CheckCircle
                      className={`${
                        isMobile ? "w-3 h-3" : "w-4 h-4"
                      } text-green-600 flex-shrink-0`}
                      strokeWidth={1.5}
                    />
                  )}
                  {item.status === "warning" && (
                    <XCircle
                      className={`${
                        isMobile ? "w-3 h-3" : "w-4 h-4"
                      } text-amber-600 flex-shrink-0`}
                      strokeWidth={1.5}
                    />
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>

        <div
          className={`${
            isMobile ? "p-3" : "p-4"
          } rounded-lg border border-gray-200`}
        >
          <div
            className={`flex ${
              isMobile ? "flex-col gap-3" : "items-center justify-between"
            }`}
          >
            <div className="flex items-center gap-3">
              <div
                className={`flex items-center justify-center ${
                  isMobile ? "w-6 h-6" : "w-10 h-10"
                }`}
              >
                {getRiskLevelIcon(stats.riskLevel)}
              </div>
              <div>
                <p
                  className={`font-semibold text-foreground ${
                    isMobile ? "text-sm" : "text-sm"
                  }`}
                >
                  AI Risk Assessment
                </p>
                <p
                  className={`text-muted-foreground ${
                    isMobile ? "text-xs" : "text-xs"
                  }`}
                >
                  Overall contract risk level
                </p>
              </div>
            </div>
            <Badge
              variant="outline"
              className={`font-regular ${
                isMobile ? "px-2 py-1 text-xs self-start" : "px-3 py-1"
              } ${getRiskLevelColor(stats.riskLevel)}`}
            >
              {stats.riskLevel.charAt(0).toUpperCase() +
                stats.riskLevel.slice(1)}{" "}
              Risk
            </Badge>
          </div>
        </div>

        <div
          className={`${
            isMobile ? "p-3" : "p-4"
          } rounded-lg border border-gray-200 bg-gray-50/50`}
        >
          <div className="flex items-start gap-3">
            <div className={`flex-shrink-0 ${isMobile ? "mt-0" : "mt-0.5"}`}>
              {recommendation.icon}
            </div>
            <div className="flex-1">
              <div
                className={`flex ${
                  isMobile ? "flex-col gap-2" : "items-center gap-2"
                } mb-2`}
              >
                <h4
                  className={`font-semibold text-foreground ${
                    isMobile ? "text-sm" : ""
                  }`}
                >
                  Recommendation
                </h4>
                <Badge
                  variant="outline"
                  className={`font-medium ${
                    isMobile
                      ? "px-2 py-0.5 text-xs self-start"
                      : "px-2 py-0.5 text-xs"
                  } ${
                    recommendation.action === "PROCEED"
                      ? "bg-green-50 text-green-700 border-green-200"
                      : recommendation.action === "PROCEED WITH CAUTION"
                      ? "bg-amber-50 text-amber-700 border-amber-200"
                      : "bg-red-50 text-red-700 border-red-200"
                  }`}
                >
                  {recommendation.action}
                </Badge>
              </div>
              <p
                className={`leading-relaxed text-muted-foreground ${
                  isMobile ? "text-xs" : "text-sm"
                }`}
              >
                {recommendation.message}
              </p>
            </div>
          </div>
        </div>

        <div
          className={`rounded-lg bg-muted/20 border border-gray-200 ${
            isMobile ? "p-3" : "p-4"
          }`}
        >
          <p
            className={`leading-relaxed text-foreground ${
              isMobile ? "text-xs" : "text-sm"
            }`}
          >
            {summary}
          </p>
        </div>
      </CardContent>
    </Card>
  );
};
