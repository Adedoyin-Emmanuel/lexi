"use client";

import { ArrowLeft, Download, Share2 } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

interface ContractHeaderProps {
  contractName: string;
}

export const ContractHeader = ({ contractName }: ContractHeaderProps) => {
  return (
    <div className="space-y-4">
      {/* Back Button */}
      <div>
        <Link href="/contracts">
          <Button variant="ghost" size="sm">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Contracts
          </Button>
        </Link>
      </div>

      {/* Title Section */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">{contractName}</h1>
          <p className="text-muted-foreground mt-1">
            Contract Details & Analysis
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm">
            <Download className="h-4 w-4 mr-2" />
            Download
          </Button>
          <Button variant="outline" size="sm">
            <Share2 className="h-4 w-4 mr-2" />
            Share
          </Button>
        </div>
      </div>
    </div>
  );
};
