"use client";

import dayjs from "dayjs";
import Link from "next/link";
import { motion } from "framer-motion";
import { Calendar, FileText } from "lucide-react";
import relativeTime from "dayjs/plugin/relativeTime";

import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Card, CardContent } from "@/components/ui/card";
import { CircularConfidence } from "../../components/circular-confidence";

dayjs.extend(relativeTime);

interface ContractCardProps {
  id: string;
  title: string;
  delay?: number;
  createdAt: string;
  riskScore: number;
  confidenceScore: number;
  status?: string;
}

export const ContractCard = ({
  id,
  title,
  delay = 0,
  createdAt,
  riskScore,
  confidenceScore,
  status,
}: ContractCardProps) => {
  const name = title;
  const uploadedAt = dayjs(createdAt).fromNow();

  const getDisplayStatus = ():
    | "Safe"
    | "Risky"
    | "Processing"
    | "Needs Review"
    | "Failed" => {
    if (status === "failed") return "Failed";

    if (confidenceScore === 0) return "Processing";

    if (riskScore >= 65) return "Risky";
    if (riskScore >= 40) return "Needs Review";
    return "Safe";
  };

  const displayStatus = getDisplayStatus();

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Safe":
        return "bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400";
      case "Risky":
        return "bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400";
      case "Processing":
        return "bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400";
      case "Needs Review":
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400";
      case "Failed":
        return "bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400";
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400";
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay }}
    >
      <Link href={`/contracts/${id}`}>
        <Card className="h-28 relative group hover:shadow-md transition-all duration-200 cursor-pointer">
          <CardContent className="p-5 h-full flex items-center justify-between">
            <div className="flex-1 min-w-0 pr-4">
              <div className="flex items-center gap-2 mb-2">
                <FileText className="h-3 w-3 text-muted-foreground" />
                <h3 className="font-semibold text-sm truncate group-hover:text-primary transition-colors">
                  {name}
                </h3>
              </div>

              <div className="flex items-center gap-2 mb-3">
                <Calendar className="h-3 w-3 text-muted-foreground" />
                <p className="text-xs text-muted-foreground">{uploadedAt}</p>
              </div>

              <span
                className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(
                  displayStatus
                )}`}
              >
                {displayStatus}
              </span>
            </div>

            <div className="flex items-center">
              <Tooltip>
                <TooltipTrigger asChild>
                  <div className="cursor-help">
                    <CircularConfidence score={confidenceScore} />
                  </div>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Confidence Score: {confidenceScore}%</p>
                </TooltipContent>
              </Tooltip>
            </div>
          </CardContent>
        </Card>
      </Link>
    </motion.div>
  );
};
