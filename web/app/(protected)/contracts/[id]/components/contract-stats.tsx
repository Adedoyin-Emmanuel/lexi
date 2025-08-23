"use client";

import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { CircularConfidence } from "./../../../components/circular-confidence";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface ContractStatsProps {
  contract: {
    status: string;
    riskType: string;
    confidenceScore: number;
  };
}

export const ContractStats = ({ contract }: ContractStatsProps) => {
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
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400";
    }
  };

  const getRiskTypeColor = (riskType: string) => {
    switch (riskType) {
      case "Low":
        return "bg-emerald-100 text-emerald-800 dark:bg-emerald-900/20 dark:text-emerald-400";
      case "Medium":
        return "bg-amber-100 text-amber-800 dark:bg-amber-900/20 dark:text-amber-400";
      case "High":
        return "bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400";
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400";
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Contract Stats</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center justify-between">
          <span className="text-sm font-medium">Confidence Score</span>
          <CircularConfidence score={contract.confidenceScore} size={48} />
        </div>

        <Separator />

        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-sm text-muted-foreground">Status</span>
            <Badge className={getStatusColor(contract.status)}>
              {contract.status}
            </Badge>
          </div>

          <div className="flex items-center justify-between">
            <span className="text-sm text-muted-foreground">Risk Level</span>
            <Badge className={getRiskTypeColor(contract.riskType)}>
              {contract.riskType}
            </Badge>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
