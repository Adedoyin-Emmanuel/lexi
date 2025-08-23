"use client";

import { FileText } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface ContractOverviewProps {
  contract: {
    value: string;
    endDate: string;
    parties: string[];
    startDate: string;
    uploadedAt: string;
    contractType: string;
  };
}

export const ContractOverview = ({ contract }: ContractOverviewProps) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <FileText className="h-5 w-5" strokeWidth={1.5} />
          Contract Overview
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="text-sm font-medium text-muted-foreground">
              Parties
            </label>
            <p className="text-sm">{contract.parties.join(" & ")}</p>
          </div>
          <div>
            <label className="text-sm font-medium text-muted-foreground">
              Contract Type
            </label>
            <p className="text-sm">{contract.contractType}</p>
          </div>
          <div>
            <label className="text-sm font-medium text-muted-foreground">
              Start Date
            </label>
            <p className="text-sm">{contract.startDate}</p>
          </div>
          <div>
            <label className="text-sm font-medium text-muted-foreground">
              End Date
            </label>
            <p className="text-sm">{contract.endDate}</p>
          </div>
          <div>
            <label className="text-sm font-medium text-muted-foreground">
              Contract Value
            </label>
            <p className="text-sm">{contract.value}</p>
          </div>
          <div>
            <label className="text-sm font-medium text-muted-foreground">
              Uploaded
            </label>
            <p className="text-sm">{contract.uploadedAt}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
