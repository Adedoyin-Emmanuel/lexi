"use client";

import Link from "next/link";
import { ArrowLeft, Download } from "lucide-react";

import { Button } from "@/components/ui/button";
import { downloadContract } from "@/lib/download-contract";

interface ContractHeaderProps {
  contractId: string;
  contractName: string;
}

export const ContractHeader = ({
  contractName,
  contractId,
}: ContractHeaderProps) => {
  return (
    <div className="space-y-3 sm:space-y-4">
      <div>
        <Link href="/contracts">
          <Button
            variant="ghost"
            size="sm"
            className="text-xs cursor-pointer hover:bg-gray-100 hover:text-gray-800"
          >
            <ArrowLeft className="h-4 w-4 mr-2" strokeWidth={1.5} />
            <span className="hidden sm:inline">Back to Contracts</span>
            <span className="sm:hidden">Back</span>
          </Button>
        </Link>
      </div>

      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-0">
        <div className="flex-1 min-w-0">
          <h1 className="text-base sm:text-lg md:text-[23px] font-bold tracking-tight break-words">
            {contractName}
          </h1>
          <br />
        </div>
        <div className="flex items-center gap-2 self-start sm:self-auto">
          <Button
            variant="outline"
            size="sm"
            className="cursor-pointer border-gray-200"
            onClick={() => downloadContract(contractId)}
          >
            <Download className="h-4 w-4 mr-2" strokeWidth={1.5} />
            <span className="hidden sm:inline">Download</span>
            <span className="sm:hidden">Download</span>
          </Button>
        </div>
      </div>
    </div>
  );
};
