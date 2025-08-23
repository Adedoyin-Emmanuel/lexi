"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Calendar, FileText, ArrowRight } from "lucide-react";

import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { CircularConfidence } from "../../components/circular-confidence";

interface ContractCardProps {
  id: string;
  name: string;
  delay?: number;
  uploadedAt: string;
  contractType: string;
  confidenceScore: number;
  riskType: "Low" | "Medium" | "High";
  status: "Safe" | "Risky" | "Processing" | "Needs Review";
}

export const ContractCard = ({
  id,
  name,
  status,
  riskType,
  contractType,
  delay = 0,
  uploadedAt,
  confidenceScore,
}: ContractCardProps) => {
  const getStatusColor = (status: string) => {
    switch (status) {
      case "Safe":
        return "bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400 border-green-200 dark:border-green-800";
      case "Risky":
        return "bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400 border-red-200 dark:border-red-800";
      case "Processing":
        return "bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400 border-blue-200 dark:border-blue-800";
      case "Needs Review":
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400 border-yellow-200 dark:border-yellow-800";
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400 border-gray-200 dark:border-gray-800";
    }
  };

  const getRiskTypeColor = (riskType: string) => {
    switch (riskType) {
      case "Low":
        return "bg-emerald-100 text-emerald-800 dark:bg-emerald-900/20 dark:text-emerald-400 border-emerald-200 dark:border-emerald-800";
      case "Medium":
        return "bg-amber-100 text-amber-800 dark:bg-amber-900/20 dark:text-amber-400 border-amber-200 dark:border-amber-800";
      case "High":
        return "bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400 border-red-200 dark:border-red-800";
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400 border-gray-200 dark:border-gray-800";
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay }}
    >
      <Link href={`/contracts/${id}`}>
        <Card className="group hover:shadow-md transition-all duration-200 cursor-pointer border-gray-200 dark:border-gray-800 hover:border-gray-300 dark:hover:border-gray-700">
          <CardContent className="p-6">
            <div className="flex items-start justify-between">
              <div className="flex-1 min-w-0 pr-4">
                <div className="flex items-center gap-2 mb-3">
                  <FileText className="h-4 w-4 text-muted-foreground" />
                  <h3 className="font-semibold text-base truncate group-hover:text-primary transition-colors">
                    {name}
                  </h3>
                </div>

                <div className="flex items-center gap-2 mb-3">
                  <Calendar className="h-3 w-3 text-muted-foreground" />
                  <span className="text-sm text-muted-foreground">
                    {uploadedAt}
                  </span>
                </div>

                <div className="flex items-center gap-2 mb-4">
                  <Badge
                    variant="outline"
                    className={`text-xs ${getStatusColor(status)}`}
                  >
                    {status}
                  </Badge>
                  <Badge
                    variant="outline"
                    className={`text-xs ${getRiskTypeColor(riskType)}`}
                  >
                    {riskType} Risk
                  </Badge>
                  <Badge variant="secondary" className="text-xs">
                    {contractType}
                  </Badge>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <Tooltip>
                  <TooltipTrigger asChild>
                    <div className="cursor-help">
                      <CircularConfidence score={confidenceScore} size={48} />
                    </div>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Confidence Score: {confidenceScore}%</p>
                  </TooltipContent>
                </Tooltip>

                <ArrowRight className="h-4 w-4 text-muted-foreground group-hover:text-primary group-hover:translate-x-1 transition-all duration-200" />
              </div>
            </div>
          </CardContent>
        </Card>
      </Link>
    </motion.div>
  );
};
