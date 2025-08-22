"use client";

import { useState, useMemo, useCallback } from "react";
import { Image, FileText } from "lucide-react";

import { cn } from "@/lib/utils";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
  TooltipProvider,
} from "@/components/ui/tooltip";

import { Button } from "@/components/ui/button";
import { useIsMobile } from "@/hooks/use-mobile";
import { IStructuredContract } from "@/hooks/types/socket";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ContractDocument } from "../page";

interface DocumentPreviewProps {
  document: ContractDocument;
  plainEnglishSummary?: string | null;
  structuredContract?: IStructuredContract | null;
}

export const DocumentPreview: React.FC<DocumentPreviewProps> = ({
  document, // Required by interface but not used in this component
  structuredContract,
  plainEnglishSummary,
}) => {
  const isMobile = useIsMobile();
  const [viewMode, setViewMode] = useState<"preview" | "original">("preview");

  const documentContent = useMemo(() => {
    if (structuredContract?.html) {
      return structuredContract.html;
    }
    // Fallback to original document content if structured contract is not available
    return document.content;
  }, [structuredContract, document.content]);

  const plainEnglishContent = useMemo(() => {
    if (plainEnglishSummary) {
      return plainEnglishSummary;
    }
    return null;
  }, [plainEnglishSummary]);

  const handleViewModeChange = useCallback((mode: "preview" | "original") => {
    setViewMode(mode);
  }, []);

  const renderPreviewMode = () => (
    <div className={`h-full overflow-auto ${isMobile ? "p-3" : "p-6"}`}>
      <div className={`${isMobile ? "w-full" : "max-w-4xl mx-auto"}`}>
        <div className={`bg-white rounded-lg shadow-sm`}>
          <div className="text-gray-700 leading-relaxed space-y-1">
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
        <div className={`bg-white rounded-lg shadow-sm`}>
          <div className="text-gray-700 leading-relaxed space-y-1">
            {documentContent ? (
              <div
                className="text-gray-900 prose prose-sm max-w-none"
                dangerouslySetInnerHTML={{
                  __html: documentContent,
                }}
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
    </div>
  );

  return (
    <Card className="h-full flex flex-col overflow-hidden ">
      <CardHeader
        className={`pb-4 flex-shrink-0 border-b border-gray-200 ${
          isMobile ? "px-3 py-3" : ""
        }`}
      >
        <div className="flex items-center justify-between">
          <CardTitle className={cn(isMobile ? "text-base" : "")}>
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
                    className={cn(
                      `${isMobile ? "h-8 w-8 p-0" : ""} ${
                        viewMode === "preview" ? "bg-blue-100 text-primary" : ""
                      }`,
                      "cursor-pointer"
                    )}
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
                    className={cn(
                      `h-8 px-2 text-xs ${
                        viewMode === "original"
                          ? "bg-blue-100 text-primary"
                          : ""
                      }`,
                      "cursor-pointer"
                    )}
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
          </div>
        </div>
      </CardHeader>

      <CardContent className="flex-1 overflow-hidden p-0">
        {viewMode === "preview" ? renderPreviewMode() : renderOriginalMode()}
      </CardContent>
    </Card>
  );
};
