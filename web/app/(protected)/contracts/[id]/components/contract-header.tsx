"use client";

import Link from "next/link";
import { ArrowLeft, Download } from "lucide-react";

import { Button } from "@/components/ui/button";

interface ContractHeaderProps {
  contractName: string;
}

export const ContractHeader = ({ contractName }: ContractHeaderProps) => {
  return (
    <div className="space-y-4">
      <div>
        <Link href="/contracts">
          <Button
            variant="ghost"
            size="sm"
            className="text-xs cursor-pointer hover:bg-gray-100 hover:text-gray-800"
          >
            <ArrowLeft className="h-4 w-4 mr-2" strokeWidth={1.5} />
            Back to Contracts
          </Button>
        </Link>
      </div>

      <div className="flex items-center justify-between">
        <div>
          <h1 className="md:text-[23px] text-lg font-bold tracking-tight">
            {contractName}
          </h1>
          <p className="md:text-sm text-xs text-muted-foreground mt-1">
            Contract Details & Analysis
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            className="cursor-pointer border-gray-200"
          >
            <Download className="h-4 w-4 mr-2" strokeWidth={1.5} />
            Download
          </Button>
        </div>
      </div>
    </div>
  );
};
