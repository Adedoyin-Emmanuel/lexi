"use client";

import React, { useState, useEffect } from "react";

import {
  ISummary,
  CONTRACT_TYPE,
  SOCKET_EVENTS,
  IExtractionResult,
  IStructuredContract,
  IDocumentAnalysisFailedPayload,
  IDocumentAnalysisStartedPayload,
  IDocumentAnalysisCompletedPayload,
  IDocumentAnalysisValidatedPayload,
  IDocumentAnalysisStructuredPayload,
  IDocumentAnalysisSummarizedPayload,
  IDocumentAnalysisDetailsExtractedPayload,
} from "@/hooks/types/socket";

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
import { AnalysisStatusIndicator } from "./components/analysis-status-indicator";
import { AnalysisFailureDialog } from "./components/analysis-failure-dialog";

export interface ContractDocument {
  id: string;
  name: string;
  content: string;
  uploadedAt: Date;
  type: "pdf" | "text" | "docx";
}

export interface AnalysisState {
  isAnalyzing: boolean;
  currentStep:
    | "idle"
    | "validating"
    | "structuring"
    | "summarizing"
    | "extracting"
    | "completed"
    | "failed";
  documentId: string | null;
  validation: {
    reason: string;
    inScope: boolean;
    confidenceScore: number;
    isValidContract: boolean;
    contractType: CONTRACT_TYPE | null;
  } | null;
  error: string | null;
  summary: ISummary | null;
  selectedClauseId: string | null;
  extraction: IExtractionResult | null;
  structuredContract: IStructuredContract | null;
}

const Analyze = () => {
  const [document, setDocument] = useState<ContractDocument | null>(null);
  const [activeView, setActiveView] = useState<"document" | "insights">(
    "document"
  );
  const [analysisState, setAnalysisState] = useState<AnalysisState>({
    error: null,
    summary: null,
    documentId: null,
    extraction: null,
    validation: null,
    isAnalyzing: false,
    currentStep: "idle",
    selectedClauseId: null,
    structuredContract: null,
  });

  const isMobile = useIsMobile();
  const { user } = useAuth();
  const socket = useSocket(user?.id as string);

  useEffect(() => {
    if (!socket) return;

    const handleAnalysisStarted = (data: IDocumentAnalysisStartedPayload) => {
      console.log("Document analysis started", data);
      setAnalysisState((prev) => ({
        ...prev,
        isAnalyzing: true,
        currentStep: "validating",
        documentId: data.documentId,
        error: null,
      }));
    };

    const handleAnalysisValidated = (
      data: IDocumentAnalysisValidatedPayload
    ) => {
      console.log("Document validated", data);
      setAnalysisState((prev) => ({
        ...prev,
        currentStep: "structuring",
        validation: {
          isValidContract: data.isValidContract,
          contractType: data.contractType,
          confidenceScore: data.confidenceScore,
          reason: data.reason,
          inScope: data.inScope,
        },
      }));
    };

    const handleAnalysisStructured = (
      data: IDocumentAnalysisStructuredPayload
    ) => {
      console.log("Document structured", data);
      setAnalysisState((prev) => ({
        ...prev,
        currentStep: "summarizing",
        structuredContract: data.structuredContract,
      }));
    };

    const handleAnalysisSummarized = (
      data: IDocumentAnalysisSummarizedPayload
    ) => {
      console.log("Document summarized", data);
      setAnalysisState((prev) => ({
        ...prev,
        currentStep: "extracting",
        summary: data.summary,
      }));
    };

    const handleAnalysisDetailsExtracted = (
      data: IDocumentAnalysisDetailsExtractedPayload
    ) => {
      console.log("Document details extracted", data);
      setAnalysisState((prev) => ({
        ...prev,
        currentStep: "completed",
        extraction: data.extractionDetails,
      }));
    };

    const handleAnalysisCompleted = (
      data: IDocumentAnalysisCompletedPayload
    ) => {
      console.log("Document analysis completed", data);
      setAnalysisState((prev) => ({
        ...prev,
        isAnalyzing: false,
        currentStep: "completed",
      }));
    };

    const handleAnalysisFailed = (data: IDocumentAnalysisFailedPayload) => {
      console.log("Document analysis failed", data);
      setAnalysisState((prev) => ({
        ...prev,
        isAnalyzing: false,
        currentStep: "failed",
        error: data.failureReason,
      }));
    };

    socket.on(SOCKET_EVENTS.DOCUMENT_ANALYSIS_STARTED, handleAnalysisStarted);
    socket.on(
      SOCKET_EVENTS.DOCUMENT_ANALYSIS_VALIDATED,
      handleAnalysisValidated
    );
    socket.on(
      SOCKET_EVENTS.DOCUMENT_ANALYSIS_STRUCTURED,
      handleAnalysisStructured
    );
    socket.on(
      SOCKET_EVENTS.DOCUMENT_ANALYSIS_SUMMARIZED,
      handleAnalysisSummarized
    );
    socket.on(
      SOCKET_EVENTS.DOCUMENT_ANALYSIS_DETAILS_EXTRACTED,
      handleAnalysisDetailsExtracted
    );
    socket.on(
      SOCKET_EVENTS.DOCUMENT_ANALYSIS_COMPLETED,
      handleAnalysisCompleted
    );
    socket.on(SOCKET_EVENTS.DOCUMENT_ANALYSIS_FAILED, handleAnalysisFailed);

    return () => {
      socket.off(
        SOCKET_EVENTS.DOCUMENT_ANALYSIS_STARTED,
        handleAnalysisStarted
      );
      socket.off(
        SOCKET_EVENTS.DOCUMENT_ANALYSIS_VALIDATED,
        handleAnalysisValidated
      );
      socket.off(
        SOCKET_EVENTS.DOCUMENT_ANALYSIS_STRUCTURED,
        handleAnalysisStructured
      );
      socket.off(
        SOCKET_EVENTS.DOCUMENT_ANALYSIS_SUMMARIZED,
        handleAnalysisSummarized
      );
      socket.off(
        SOCKET_EVENTS.DOCUMENT_ANALYSIS_DETAILS_EXTRACTED,
        handleAnalysisDetailsExtracted
      );
      socket.off(
        SOCKET_EVENTS.DOCUMENT_ANALYSIS_COMPLETED,
        handleAnalysisCompleted
      );
      socket.off(SOCKET_EVENTS.DOCUMENT_ANALYSIS_FAILED, handleAnalysisFailed);
    };
  }, [socket]);

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
      console.log("Analysis request sent:", response.data);
    } catch (error) {
      console.error("Error processing file:", error);
      setAnalysisState((prev) => ({
        ...prev,
        error: "Failed to upload document. Please try again.",
      }));
    }
  };

  const handleClauseSelect = (clauseId: string) => {
    console.log("Clause selected:", clauseId);
    setAnalysisState((prev) => ({
      ...prev,
      selectedClauseId: clauseId,
    }));
    setActiveView("document");
  };

  const handleReanalyze = () => {
    if (document) {
      setAnalysisState({
        isAnalyzing: false,
        currentStep: "idle",
        documentId: null,
        validation: null,
        structuredContract: null,
        summary: null,
        extraction: null,
        error: null,
        selectedClauseId: null,
      });
      setDocument(null);
    }
  };

  const handleRetryAnalysis = () => {
    setAnalysisState({
      isAnalyzing: false,
      currentStep: "idle",
      documentId: null,
      validation: null,
      structuredContract: null,
      summary: null,
      extraction: null,
      error: null,
      selectedClauseId: null,
    });

    if (document) {
      handleDocumentUpload(
        new File([document.content], document.name, {
          type:
            document.type === "pdf"
              ? "application/pdf"
              : document.type === "docx"
              ? "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
              : "text/plain",
        })
      );
    }
  };

  const handleCancelAnalysis = () => {
    setAnalysisState({
      isAnalyzing: false,
      currentStep: "idle",
      documentId: null,
      validation: null,
      structuredContract: null,
      summary: null,
      extraction: null,
      error: null,
      selectedClauseId: null,
    });
    setDocument(null);
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
          isAnalyzing={analysisState.isAnalyzing}
          onReanalyze={handleReanalyze}
        />

        <AnalysisStatusIndicator
          currentStep={analysisState.currentStep}
          isAnalyzing={analysisState.isAnalyzing}
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
                onClauseSelect={handleClauseSelect}
                structuredContract={analysisState.structuredContract}
                plainEnglishSummary={analysisState.summary?.plainEnglishSummary}
                selectedClauseId={analysisState.selectedClauseId}
              />
            </div>
          ) : (
            <div className="h-full">
              <InsightsPanel
                analysisState={analysisState}
                onClauseSelect={handleClauseSelect}
                onViewInDocument={handleClauseSelect}
              />
            </div>
          )}
        </div>

        <AnalysisFailureDialog
          isOpen={analysisState.currentStep === "failed"}
          onClose={handleCancelAnalysis}
          onRetry={handleRetryAnalysis}
          failureReason={analysisState.error || "Unknown error occurred"}
        />
      </div>
    );
  }

  return (
    <div className="w-full flex flex-col overflow-hidden">
      <AnalyzeToolbar
        document={document}
        onExport={handleExport}
        isAnalyzing={analysisState.isAnalyzing}
        onReanalyze={handleReanalyze}
      />

      <AnalysisStatusIndicator
        currentStep={analysisState.currentStep}
        isAnalyzing={analysisState.isAnalyzing}
      />

      <div className="w-full overflow-hidden">
        <ResizablePanelGroup direction="horizontal" className="h-full">
          <ResizablePanel defaultSize={40} minSize={30}>
            <div className="h-full overflow-hidden">
              <DocumentPreview
                document={document}
                onClauseSelect={handleClauseSelect}
                structuredContract={analysisState.structuredContract}
                plainEnglishSummary={analysisState.summary?.plainEnglishSummary}
                selectedClauseId={analysisState.selectedClauseId}
              />
            </div>
          </ResizablePanel>

          <ResizableHandle withHandle />

          <ResizablePanel defaultSize={60} minSize={25}>
            <InsightsPanel
              analysisState={analysisState}
              onClauseSelect={handleClauseSelect}
              onViewInDocument={handleClauseSelect}
            />
          </ResizablePanel>
        </ResizablePanelGroup>
      </div>

      <AnalysisFailureDialog
        isOpen={analysisState.currentStep === "failed"}
        onClose={handleCancelAnalysis}
        onRetry={handleRetryAnalysis}
        failureReason={analysisState.error || "Unknown error occurred"}
      />
    </div>
  );
};

export default Analyze;
