"use client";

import React, { useState } from "react";
import { AnalyzeToolbar } from "./components/analyze-toolbar";
import { DocumentPreview } from "./components/document-preview";
import { InsightsPanel } from "./components/insights-panel";
import { UploadZone } from "./components/upload-zone";
import {
  ResizablePanelGroup,
  ResizablePanel,
  ResizableHandle,
} from "@/components/ui/resizable";

export interface ContractDocument {
  id: string;
  name: string;
  content: string;
  type: "pdf" | "text";
  uploadedAt: Date;
}

export interface AnalysisResult {
  summary: string;
  keyClauses: Clause[];
  risks: Risk[];
  obligations: Obligation[];
  negotiationSuggestions: NegotiationSuggestion[];
  confidence: number;
}

export interface Clause {
  id: string;
  title: string;
  content: string;
  importance: "high" | "medium" | "low";
  category:
    | "termination"
    | "liability"
    | "ip"
    | "payment"
    | "confidentiality"
    | "other";
  position: { start: number; end: number };
  confidence: number;
}

export interface Risk {
  id: string;
  title: string;
  description: string;
  severity: "low" | "medium" | "high";
  clauseId: string;
  confidence: number;
}

export interface Obligation {
  id: string;
  title: string;
  description: string;
  deadline?: Date;
  clauseId: string;
  confidence: number;
}

export interface NegotiationSuggestion {
  id: string;
  title: string;
  currentText: string;
  suggestedText: string;
  reasoning: string;
  clauseId: string;
  confidence: number;
}

const Analyze = () => {
  const [document, setDocument] = useState<ContractDocument | null>(null);
  const [analysis, setAnalysis] = useState<AnalysisResult | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [selectedClauseId, setSelectedClauseId] = useState<string | null>(null);

  const handleDocumentUpload = async (file: File) => {
    const newDocument: ContractDocument = {
      id: Date.now().toString(),
      name: file.name,
      content: await file.text(),
      type: file.type === "application/pdf" ? "pdf" : "text",
      uploadedAt: new Date(),
    };

    setDocument(newDocument);
    await analyzeDocument();
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

  const handleShare = () => {
    console.log("Sharing analysis");
  };

  if (!document) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col overflow-hidden">
        <div className="flex-1 flex items-center justify-start p-8">
          <div className="w-full max-w-4xl">
            <UploadZone onUpload={handleDocumentUpload} />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col overflow-hidden">
      <AnalyzeToolbar
        document={document}
        onReanalyze={handleReanalyze}
        onExport={handleExport}
        onShare={handleShare}
        isAnalyzing={isAnalyzing}
      />

      <div className="flex-1 h-[calc(100vh-80px)] overflow-hidden">
        <ResizablePanelGroup direction="horizontal" className="h-full">
          <ResizablePanel defaultSize={60} minSize={30}>
            <div className="h-full p-6 overflow-hidden">
              <DocumentPreview
                document={document}
                selectedClauseId={selectedClauseId}
                onClauseSelect={handleClauseSelect}
              />
            </div>
          </ResizablePanel>

          <ResizableHandle withHandle />

          <ResizablePanel defaultSize={40} minSize={25}>
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
