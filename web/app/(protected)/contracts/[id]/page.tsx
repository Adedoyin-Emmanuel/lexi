"use client";

import React, { useState } from "react";
import { AlertCircle } from "lucide-react";
import { useParams } from "next/navigation";
import { useQuery } from "@tanstack/react-query";

import {
  ContractHeader,
  ContractChatFab,
  ContractInsightsPanel,
  ContractDocumentPreview,
} from "./components";
import {
  ResizablePanel,
  ResizableHandle,
  ResizablePanelGroup,
} from "@/components/ui/resizable";
import { Axios } from "@/app/config/axios";
import { Button } from "@/components/ui/button";
import { useIsMobile } from "@/hooks/use-mobile";
import { Card, CardContent } from "@/components/ui/card";
import { ContractDetailSkeleton } from "@/components/loading-skeleton";

interface ChatMessage {
  role: "assistant" | "user";
  content: string;
}

interface ContractData {
  id: string;
  title?: string;
  status?: string;
  isFlagged?: boolean;
  failureReason?: string;
  hasAbstainWarnings?: boolean;
  summary?: Record<string, unknown>;
  risks?: Record<string, unknown>[];
  chats?: ChatMessage[];
  clauses?: Record<string, unknown>[];
  obligations?: Record<string, unknown>[];
  suggestions?: Record<string, unknown>[];
  structuredContract?: Record<string, unknown>;
  validationMetadata?: Record<string, unknown>;
  extractionMetadata?: Record<string, unknown>;
}

const ContractDetail = () => {
  const params = useParams();
  const contractId = params.id as string;
  const isMobile = useIsMobile();
  const [activeView, setActiveView] = useState<"document" | "insights">(
    "document"
  );

  const {
    data: contract,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["contract", contractId],
    queryFn: async (): Promise<ContractData> => {
      const response = await Axios.get<{ data: ContractData }>(
        `/contract/${contractId}`
      );
      return response.data.data;
    },
    enabled: !!contractId,
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
  });

  if (isLoading) {
    return <ContractDetailSkeleton />;
  }

  if (error || !contract) {
    return (
      <div className="space-y-8">
        <ContractHeader
          contractName="Contract Details"
          contractId={contractId}
        />

        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <AlertCircle className="h-12 w-12 text-red-500 mb-4" />
            <h3 className="text-lg font-semibold mb-2">
              Error Loading Contract
            </h3>
            <p className="text-muted-foreground text-center max-w-md mb-4">
              Failed to load contract details. Please try again.
            </p>
            <Button onClick={() => window.location.reload()}>Try Again</Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  const contractDocumentData = {
    title: contract.title || "Untitled Contract",
    summary: contract.summary || {},
    structuredContract: contract.structuredContract || {},
    status: contract.status || "Unknown",
  };

  const contractTitle = contract.title || "Untitled Contract";

  const safeContractData = {
    id: contract.id,
    title: contractTitle,
    status: contract.status || "Unknown",
    isFlagged: contract.isFlagged || false,
    failureReason: contract.failureReason,
    hasAbstainWarnings: contract.hasAbstainWarnings || false,
    summary: contract.summary || {},
    risks: contract.risks || [],
    chats: contract.chats || [],
    clauses: contract.clauses || [],
    obligations: contract.obligations || [],
    suggestions: contract.suggestions || [],
    structuredContract: contract.structuredContract || {},
    validationMetadata: contract.validationMetadata || {},
    extractionMetadata: contract.extractionMetadata || {},
  };

  if (isMobile) {
    return (
      <div className="w-full flex flex-col overflow-hidden">
        <ContractHeader contractName={contractTitle} contractId={contractId} />

        <div className="flex border-b border-border bg-background">
          <button
            onClick={() => setActiveView("document")}
            className={`flex-1 py-3 px-4 text-sm font-medium transition-colors ${
              activeView === "document"
                ? "text-primary border-b-2 border-primary bg-primary/10"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            Document
          </button>
          <button
            onClick={() => setActiveView("insights")}
            className={`flex-1 py-3 px-4 text-sm font-medium transition-colors ${
              activeView === "insights"
                ? "text-primary border-b-2 border-primary bg-primary/10"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            Analysis
          </button>
        </div>

        <div className="flex-1 overflow-hidden">
          {activeView === "document" ? (
            <div className="h-full p-0 space-y-6">
              <ContractDocumentPreview contract={contractDocumentData} />
            </div>
          ) : (
            <div className="h-full">
              <ContractInsightsPanel
                contract={safeContractData}
                isLoading={isLoading}
              />
            </div>
          )}
        </div>

        <div className="border-t border-gray-200">
          <ContractChatFab
            contractName={contractTitle}
            contractId={contractId}
            chats={contract.chats || []}
          />
        </div>
      </div>
    );
  }

  return (
    <div className="w-full flex flex-col overflow-hidden">
      <ContractHeader contractName={contractTitle} contractId={contractId} />

      <div className="w-full overflow-hidden">
        <ResizablePanelGroup direction="horizontal" className="h-full">
          <ResizablePanel defaultSize={40} minSize={30}>
            <div className="h-full overflow-hidden p-0 space-y-6">
              <ContractDocumentPreview contract={contractDocumentData} />
            </div>
          </ResizablePanel>

          <ResizableHandle withHandle />

          <ResizablePanel defaultSize={60} minSize={25}>
            <div className="h-full overflow-hidden">
              <ContractInsightsPanel
                contract={safeContractData}
                isLoading={isLoading}
              />
            </div>
          </ResizablePanel>
        </ResizablePanelGroup>
      </div>

      <ContractChatFab
        contractName={contractTitle}
        contractId={contractId}
        chats={contract.chats || []}
      />
    </div>
  );
};

export default ContractDetail;
