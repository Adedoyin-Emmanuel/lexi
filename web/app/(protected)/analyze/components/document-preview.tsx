"use client";

import { useState, useMemo, useCallback } from "react";
import { Eye, Image, EyeOff, FileText } from "lucide-react";

import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
  TooltipProvider,
} from "@/components/ui/tooltip";
import { ContractDocument } from "../page";
import { Button } from "@/components/ui/button";
import { useIsMobile } from "@/hooks/use-mobile";
import { IStructuredContract } from "@/hooks/types/socket";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface DocumentPreviewProps {
  document: ContractDocument;
  selectedClauseId?: string | null;
  plainEnglishSummary?: string | null;
  onClauseSelect: (clauseId: string) => void;
  structuredContract?: IStructuredContract | null;
}

export const DocumentPreview: React.FC<DocumentPreviewProps> = ({
  document,
  onClauseSelect,
  structuredContract,
  plainEnglishSummary,
  selectedClauseId,
}) => {
  const isMobile = useIsMobile();
  const [showHighlights, setShowHighlights] = useState(true);
  const [viewMode, setViewMode] = useState<"preview" | "original">("preview");

  const documentContent = useMemo(() => {
    if (structuredContract?.html) {
      return structuredContract.html;
    }
    return document.content;
  }, [document.content, structuredContract]);

  const plainEnglishContent = useMemo(() => {
    if (plainEnglishSummary) {
      return plainEnglishSummary;
    }
    return null;
  }, [plainEnglishSummary]);

  const highlightedText = useMemo(() => {
    if (!showHighlights || viewMode !== "original") return documentContent;

    if (selectedClauseId && structuredContract?.tokens) {
      const selectedToken = structuredContract.tokens.find(
        (token) => token.elementId === selectedClauseId
      );

      if (selectedToken) {
        let highlightedHtml = documentContent;
        const startTag = `<${selectedToken.elementType} id="${selectedToken.elementId}">`;

        highlightedHtml = highlightedHtml.replace(
          startTag,
          `${startTag.replace(
            ">",
            ' class="bg-yellow-200 border-l-4 border-yellow-500 pl-2">'
          )}`
        );

        return highlightedHtml;
      }
    }

    return documentContent;
  }, [
    documentContent,
    showHighlights,
    viewMode,
    structuredContract,
    selectedClauseId,
  ]);

  const handleTextClick = useCallback(
    (event: React.MouseEvent) => {
      const target = event.target as HTMLElement;
      if (target.dataset.clauseId) {
        onClauseSelect(target.dataset.clauseId);
      }
    },
    [onClauseSelect]
  );

  const handleViewModeChange = useCallback((mode: "preview" | "original") => {
    setViewMode(mode);
  }, []);

  const handleToggleHighlights = useCallback(() => {
    setShowHighlights((prev) => !prev);
  }, []);

  const renderPreviewMode = () => (
    <div className={`h-full overflow-auto ${isMobile ? "p-3" : "p-6"}`}>
      <div className={`${isMobile ? "w-full" : "max-w-4xl mx-auto"}`}>
        <div
          className={`bg-white rounded-lg shadow-sm ${
            isMobile ? "p-4" : "p-6"
          }`}
        >
          <h1
            className={`font-bold mb-6 text-center text-gray-900 ${
              isMobile ? "text-xl" : "text-2xl"
            }`}
          >
            Plain English Contract
          </h1>
          <div className="text-gray-700 leading-relaxed space-y-4">
            {plainEnglishContent ? (
              <div
                className="prose prose-sm max-w-none"
                dangerouslySetInnerHTML={{ __html: plainEnglishContent }}
              />
            ) : (
              <div className="text-center py-8">
                <p className="text-gray-500">
                  Plain English summary will be available after analysis is
                  complete.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );

  const renderOriginalMode = () => (
    <div className={`h-full overflow-auto ${isMobile ? "p-3" : "p-6"}`}>
      <div className={`${isMobile ? "w-full" : "max-w-4xl mx-auto"}`}>
        <div
          className={`bg-white rounded-lg shadow-sm border border-gray-200 ${
            isMobile ? "p-4" : "p-6"
          }`}
        >
          {structuredContract?.html ? (
            <div
              className={`text-gray-900 leading-relaxed ${
                isMobile ? "text-sm" : ""
              }`}
              dangerouslySetInnerHTML={{
                __html: highlightedText,
              }}
              onClick={handleTextClick}
            />
          ) : (
            <div className="text-center py-8">
              <p className="text-gray-500">
                Structured document will be available after analysis is
                complete.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );

  return (
    <Card className="h-full flex flex-col overflow-hidden">
      <CardHeader
        className={`pb-4 flex-shrink-0 border-b ${isMobile ? "px-3 py-3" : ""}`}
      >
        <div className="flex items-center justify-between">
          <CardTitle className={isMobile ? "text-base" : ""}>
            {viewMode === "preview"
              ? "Plain English Summary"
              : "Structured Document"}
          </CardTitle>
          <div className={`flex items-center gap-2 ${isMobile ? "gap-1" : ""}`}>
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="ghost"
                    size={isMobile ? "sm" : "sm"}
                    onClick={() => handleViewModeChange("preview")}
                    className={`${isMobile ? "h-8 w-8 p-0" : ""} ${
                      viewMode === "preview" ? "bg-blue-100 text-primary" : ""
                    }`}
                  >
                    <Image
                      className={`${isMobile ? "w-3 h-3" : "w-4 h-4"}`}
                      strokeWidth={1.5}
                    />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Plain English</p>
                </TooltipContent>
              </Tooltip>

              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="ghost"
                    size="sm"
                    className={`h-8 px-2 text-xs ${
                      viewMode === "original" ? "bg-blue-100 text-primary" : ""
                    }`}
                    onClick={() => setViewMode("original")}
                  >
                    <FileText
                      className={`${isMobile ? "w-3 h-3" : "w-4 h-4"}`}
                      strokeWidth={1.5}
                    />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Structured document</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>

            {viewMode === "original" && (
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant="ghost"
                      size={isMobile ? "sm" : "sm"}
                      onClick={handleToggleHighlights}
                      className={isMobile ? "h-8 w-8 p-0" : ""}
                    >
                      {showHighlights ? (
                        <Eye
                          className={`${isMobile ? "w-3 h-3" : "w-4 h-4"}`}
                          strokeWidth={1.5}
                        />
                      ) : (
                        <EyeOff
                          className={`${isMobile ? "w-3 h-3" : "w-4 h-4"}`}
                          strokeWidth={1.5}
                        />
                      )}
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>
                      {showHighlights ? "Hide highlights" : "Show highlights"}
                    </p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            )}
          </div>
        </div>
      </CardHeader>

      <CardContent className="flex-1 overflow-hidden p-0">
        {viewMode === "preview" ? renderPreviewMode() : renderOriginalMode()}
      </CardContent>
    </Card>
  );
};
