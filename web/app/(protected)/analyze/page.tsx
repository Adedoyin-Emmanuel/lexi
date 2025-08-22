"use client";

import React, { useState } from "react";

import {
  ResizablePanel,
  ResizableHandle,
  ResizablePanelGroup,
} from "@/components/ui/resizable";
import { Axios } from "@/app/config/axios";
import { useAuth } from "@/hooks/use-auth";
import { useSocket } from "@/hooks/use-socket";
import { useIsMobile } from "@/hooks/use-mobile";
import { getTextFromFile } from "@/lib/file-reader";
import { UploadZone } from "./components/upload-zone";
import { encryptTextWithNewKey } from "@/lib/encryption";
import { InsightsPanel } from "./components/insights-panel";
import { AnalyzeToolbar } from "./components/analyze-toolbar";
import { DocumentPreview } from "./components/document-preview";
import {
  IDocumentAnalysisStartedPayload,
  SOCKET_EVENTS,
} from "@/hooks/types/socket";

export interface ContractDocument {
  id: string;
  name: string;
  content: string;
  uploadedAt: Date;
  type: "pdf" | "text" | "docx";
}

export interface ContractStats {
  contractType:
    | "NDA"
    | "ICA"
    | "License Agreement"
    | "Service Agreement"
    | "Employment Contract"
    | "Other";
  duration: string;
  jurisdiction: string;
  effectiveDate: string;
  partiesInvolved: number;
  hasTerminationClause: boolean;
  riskLevel: "low" | "medium" | "high";
}

export interface AnalysisResult {
  risks: Risk[];
  summary: string;
  confidence: number;
  keyClauses: Clause[];
  obligations: Obligation[];
  negotiationSuggestions: NegotiationSuggestion[];
  stats: ContractStats;
}

export interface Clause {
  id: string;
  title: string;
  content: string;
  category:
    | "termination"
    | "liability"
    | "ip"
    | "payment"
    | "confidentiality"
    | "other";
  confidence: number;
  importance: "high" | "medium" | "low";
  position: { start: number; end: number };
}

export interface Risk {
  id: string;
  title: string;
  clauseId: string;
  description: string;
  confidence: number;
  severity: "low" | "medium" | "high";
}

export interface Obligation {
  id: string;
  title: string;
  deadline?: Date;
  clauseId: string;
  confidence: number;
  description: string;
}

export interface NegotiationSuggestion {
  id: string;
  title: string;
  clauseId: string;
  reasoning: string;
  confidence: number;
  currentText: string;
  suggestedText: string;
}

const Analyze = () => {
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [document, setDocument] = useState<ContractDocument | null>(null);
  const [analysis, setAnalysis] = useState<AnalysisResult | null>(null);
  const [selectedClauseId, setSelectedClauseId] = useState<string | null>(null);
  const [activeView, setActiveView] = useState<"document" | "insights">(
    "document"
  );
  const isMobile = useIsMobile();

  const { user } = useAuth();
  const socket = useSocket(user?.id as string);

  socket?.on(
    SOCKET_EVENTS.DOCUMENT_ANALYSIS_STARTED,
    (data: IDocumentAnalysisStartedPayload) => {
      console.log("Document analysis started", data);
    }
  );

  const handleDocumentUpload = async (file: File) => {
    try {
      const fileContent = await getTextFromFile(file);

      const { encryptedData, keyBase64 } = await encryptTextWithNewKey(
        fileContent
      );

      const newDocument: ContractDocument = {
        name: file.name,
        uploadedAt: new Date(),
        id: Date.now().toString(),
        content: fileContent,
        type:
          file.type === "application/pdf"
            ? "pdf"
            : file.type.includes("word")
            ? "docx"
            : "text",
      };

      setDocument(newDocument);

      const dataToSend = {
        key: keyBase64,
        type:
          file.type === "application/pdf"
            ? "pdf"
            : file.type.includes("word")
            ? "docx"
            : "text",
        content: encryptedData,
        name: file.name,
      };

      const response = await Axios.post("/analyze", dataToSend);

      console.log(response);

      await analyzeDocument();
    } catch (error) {
      console.error("Error processing file:", error);
    }
  };

  const analyzeDocument = async () => {
    setIsAnalyzing(true);

    await new Promise((resolve) => setTimeout(resolve, 2000));

    const mockAnalysis: AnalysisResult = {
      summary:
        "This is a standard freelance contract with typical terms for content creation services. The contract includes standard payment terms, intellectual property clauses, and termination conditions.",
      keyClauses: [
        {
          id: "1",
          title: "Payment Terms",
          content: "Payment shall be made within 60 days of invoice submission",
          importance: "high",
          category: "payment",
          position: { start: 150, end: 200 },
          confidence: 0.95,
        },
        {
          id: "2",
          title: "Intellectual Property",
          content: "All work product shall remain the property of the client",
          importance: "high",
          category: "ip",
          position: { start: 300, end: 350 },
          confidence: 0.92,
        },
        {
          id: "3",
          title: "Termination Clause",
          content:
            "Either party may terminate this agreement with 30 days written notice",
          importance: "medium",
          category: "termination",
          position: { start: 450, end: 500 },
          confidence: 0.88,
        },
      ],
      risks: [
        {
          id: "1",
          title: "Long Payment Window",
          description: "60-day payment terms are longer than industry standard",
          severity: "medium",
          clauseId: "1",
          confidence: 0.85,
        },
        {
          id: "2",
          title: "IP Assignment",
          description:
            "Complete IP transfer may limit future work opportunities",
          severity: "high",
          clauseId: "2",
          confidence: 0.9,
        },
      ],
      obligations: [
        {
          id: "1",
          title: "Invoice Submission",
          description: "Submit invoices within 5 days of project completion",
          deadline: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000),
          clauseId: "1",
          confidence: 0.87,
        },
      ],
      negotiationSuggestions: [
        {
          id: "1",
          title: "Reduce Payment Window",
          currentText: "Payment shall be made within 60 days",
          suggestedText: "Payment shall be made within 30 days",
          reasoning:
            "Industry standard is 30 days, faster payment improves cash flow",
          clauseId: "1",
          confidence: 0.82,
        },
        {
          id: "2",
          title: "Modify IP Terms",
          currentText:
            "All work product shall remain the property of the client",
          suggestedText:
            "Client receives license to use work product, creator retains portfolio rights",
          reasoning:
            "Allows you to showcase work while giving client usage rights",
          clauseId: "2",
          confidence: 0.78,
        },
      ],
      stats: {
        contractType: "Service Agreement",
        partiesInvolved: 2,
        jurisdiction: "California, USA",
        duration: "12 months",
        effectiveDate: "2024-01-15",
        hasTerminationClause: true,
        riskLevel: "medium",
      },
      confidence: 0.89,
    };

    setAnalysis(mockAnalysis);
    setIsAnalyzing(false);
  };

  const handleClauseSelect = (clauseId: string) => {
    setSelectedClauseId(clauseId);
  };

  const handleReanalyze = () => {
    if (document) {
      analyzeDocument();
    }
  };

  const handleExport = (format: "pdf" | "word" | "markdown") => {
    console.log(`Exporting as ${format}`);
  };

  if (!document) {
    return (
      <div className="w-full flex flex-col overflow-hidden">
        <div className="w-full max-w-4xl mx-auto px-4">
          <UploadZone onUpload={handleDocumentUpload} />
        </div>
      </div>
    );
  }

  if (isMobile) {
    return (
      <div className="w-full flex flex-col overflow-hidden">
        <AnalyzeToolbar
          document={document}
          onExport={handleExport}
          isAnalyzing={isAnalyzing}
          onReanalyze={handleReanalyze}
        />

        <div className="flex border-b border-gray-200 bg-white">
          <button
            onClick={() => setActiveView("document")}
            className={`flex-1 py-3 px-4 text-sm font-medium transition-colors ${
              activeView === "document"
                ? "text-blue-600 border-b-2 border-blue-600 bg-blue-50"
                : "text-gray-600 hover:text-gray-900"
            }`}
          >
            Document
          </button>
          <button
            onClick={() => setActiveView("insights")}
            className={`flex-1 py-3 px-4 text-sm font-medium transition-colors ${
              activeView === "insights"
                ? "text-blue-600 border-b-2 border-blue-600 bg-blue-50"
                : "text-gray-600 hover:text-gray-900"
            }`}
          >
            Analysis
          </button>
        </div>

        <div className="flex-1 overflow-hidden">
          {activeView === "document" ? (
            <div className="h-full">
              <DocumentPreview
                document={document}
                selectedClauseId={selectedClauseId}
                onClauseSelect={handleClauseSelect}
              />
            </div>
          ) : (
            <div className="h-full">
              <InsightsPanel
                analysis={analysis}
                isAnalyzing={isAnalyzing}
                selectedClauseId={selectedClauseId}
                onClauseSelect={handleClauseSelect}
              />
            </div>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="w-full flex flex-col overflow-hidden">
      <AnalyzeToolbar
        document={document}
        onExport={handleExport}
        isAnalyzing={isAnalyzing}
        onReanalyze={handleReanalyze}
      />

      <div className="w-full overflow-hidden">
        <ResizablePanelGroup direction="horizontal" className="h-full">
          <ResizablePanel defaultSize={40} minSize={30}>
            <div className="h-full overflow-hidden">
              <DocumentPreview
                document={document}
                selectedClauseId={selectedClauseId}
                onClauseSelect={handleClauseSelect}
              />
            </div>
          </ResizablePanel>

          <ResizableHandle withHandle />

          <ResizablePanel defaultSize={60} minSize={25}>
            <InsightsPanel
              analysis={analysis}
              isAnalyzing={isAnalyzing}
              selectedClauseId={selectedClauseId}
              onClauseSelect={handleClauseSelect}
            />
          </ResizablePanel>
        </ResizablePanelGroup>
      </div>
    </div>
  );
};

export default Analyze;
