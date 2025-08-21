import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CircularConfidence } from "../../dashboard/components/circular-confidence";
import { Clause } from "../page";

interface ClauseCardProps {
  clause: Clause;
  onSelect?: () => void;
}

const getCategoryColor = (category: Clause["category"]) => {
  switch (category) {
    case "termination":
      return "bg-red-100 text-red-800 border-red-200";
    case "liability":
      return "bg-orange-100 text-orange-800 border-orange-200";
    case "ip":
      return "bg-purple-100 text-purple-800 border-purple-200";
    case "payment":
      return "bg-green-100 text-green-800 border-green-200";
    case "confidentiality":
      return "bg-blue-100 text-blue-800 border-blue-200";
    case "other":
      return "bg-slate-100 text-slate-800 border-slate-200";
  }
};

const getCategoryLabel = (category: Clause["category"]) => {
  switch (category) {
    case "termination":
      return "Termination";
    case "liability":
      return "Liability";
    case "ip":
      return "IP Rights";
    case "payment":
      return "Payment";
    case "confidentiality":
      return "Confidentiality";
    case "other":
      return "Other";
  }
};

const getConfidenceColor = (confidence: number) => {
  const score = Math.round(confidence * 100);
  if (score >= 80) return "text-green-600";
  if (score >= 60) return "text-yellow-600";
  return "text-red-600";
};

export const ClauseCard: React.FC<ClauseCardProps> = ({ clause, onSelect }) => {
  const confidenceScore = Math.round(clause.confidence * 100);
  const confidenceColor = getConfidenceColor(clause.confidence);

  // Truncate content to ~200 characters for summary
  const summary =
    clause.content.length > 200
      ? `${clause.content.substring(0, 200)}...`
      : clause.content;

  return (
    <Card
      className={`cursor-pointer transition-all hover:shadow-md border-slate-200 ${
        onSelect ? "hover:border-slate-300" : ""
      }`}
      onClick={onSelect}
    >
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between gap-3">
          <CardTitle className="text-sm font-medium text-slate-900 leading-tight flex-1">
            {clause.title}
          </CardTitle>
          <Badge
            variant="outline"
            className={`text-xs flex-shrink-0 ${getCategoryColor(
              clause.category
            )}`}
          >
            {getCategoryLabel(clause.category)}
          </Badge>
        </div>
      </CardHeader>

      <CardContent className="pt-0">
        <div className="space-y-4">
          {/* Clause Summary */}
          <div className="bg-slate-50 rounded-lg p-3 border border-slate-200">
            <p
              className="text-sm text-slate-700 leading-relaxed overflow-hidden"
              style={{
                display: "-webkit-box",
                WebkitLineClamp: 3,
                WebkitBoxOrient: "vertical",
              }}
            >
              {summary}
            </p>
          </div>

          {/* Confidence Section */}
          <div className="flex flex-col items-center gap-2">
            <CircularConfidence
              score={confidenceScore}
              size={48}
              strokeWidth={3}
              className="flex-shrink-0"
            />
            <div className="text-center">
              <span className={`text-xs font-medium ${confidenceColor}`}>
                Confidence
              </span>
              <div className="text-xs text-slate-500 mt-1">
                {confidenceScore}%
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
