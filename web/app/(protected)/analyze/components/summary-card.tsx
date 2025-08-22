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
} from "lucide-react";

import { ContractStats } from "../types";
import { Badge } from "@/components/ui/badge";
import { useIsMobile } from "@/hooks/use-mobile";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CircularConfidence } from "../../dashboard/components/circular-confidence";

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

export const SummaryCard: React.FC<SummaryCardProps> = ({
  summary,
  confidence,
  stats,
}) => {
  const confidenceScore = Math.round(confidence * 100);
  const isMobile = useIsMobile();

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
      <CardHeader className={`pb-6 ${isMobile ? "px-4 py-4" : ""}`}>
        <div className="flex items-center justify-between">
          <CardTitle
            className={`font-semibold flex items-center gap-3 text-foreground ${
              isMobile ? "text-base" : "text-lg"
            }`}
          >
            Contract Summary
          </CardTitle>
          <CircularConfidence
            score={confidenceScore}
            size={isMobile ? 40 : 48}
            strokeWidth={4}
          />
        </div>
      </CardHeader>

      <CardContent className={`space-y-6 ${isMobile ? "px-4 pb-4" : ""}`}>
        <div
          className={`grid gap-4 ${
            isMobile
              ? "grid-cols-1"
              : "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3"
          }`}
        >
          {statItems.map((item, index) => (
            <div
              key={index}
              className={`p-4 rounded-lg border border-gray-200 bg-card flex items-start gap-3`}
            >
              <div className="flex-shrink-0 w-8 h-8 flex items-center justify-center">
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
                      className="w-4 h-4 text-green-600 flex-shrink-0"
                      strokeWidth={1.5}
                    />
                  )}
                  {item.status === "warning" && (
                    <XCircle
                      className="w-4 h-4 text-amber-600 flex-shrink-0"
                      strokeWidth={1.5}
                    />
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>

        <div
          className={`p-4 rounded-lg border border-gray-200 ${
            isMobile ? "p-3" : ""
          }`}
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div
                className={`flex items-center justify-center ${
                  isMobile ? "w-8 h-8" : "w-10 h-10"
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
              className={`font-regular px-3 py-1 ${getRiskLevelColor(
                stats.riskLevel
              )} ${isMobile ? "text-xs" : "text-xs"}`}
            >
              {stats.riskLevel.charAt(0).toUpperCase() +
                stats.riskLevel.slice(1)}{" "}
              Risk
            </Badge>
          </div>
        </div>

        <div
          className={`rounded-lg bg-muted/20 border border-gray-200 ${
            isMobile ? "p-3" : "p-4"
          }`}
        >
          <p
            className={`leading-relaxed text-foreground ${
              isMobile ? "text-sm" : "text-sm"
            }`}
          >
            {summary}
          </p>
        </div>
      </CardContent>
    </Card>
  );
};
