"use client";

import { Image, FileText } from "lucide-react";
import { useState, useMemo, useCallback, useEffect } from "react";

import { cn } from "@/lib/utils";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
  TooltipProvider,
} from "@/components/ui/tooltip";

import { ContractDocument } from "../page";
import { Button } from "@/components/ui/button";
import { useIsMobile } from "@/hooks/use-mobile";
import { Skeleton } from "@/components/ui/skeleton";
import { IStructuredContract } from "@/hooks/types/socket";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface DocumentPreviewProps {
  document: ContractDocument;
  plainEnglishSummary?: string | null;
  structuredContract?: IStructuredContract | null;
  preferredViewMode?: "preview" | "original";
  onViewModeChange?: (mode: "preview" | "original") => void;
}

export const DocumentPreview: React.FC<DocumentPreviewProps> = ({
  document,
  structuredContract,
  plainEnglishSummary,
  preferredViewMode,
  onViewModeChange,
}) => {
  const isMobile = useIsMobile();
  const [viewMode, setViewMode] = useState<"preview" | "original">("preview");

  useEffect(() => {
    if (preferredViewMode && preferredViewMode !== viewMode) {
      setViewMode(preferredViewMode);
    }
  }, [preferredViewMode, viewMode]);

  const documentContent = useMemo(() => {
    if (structuredContract?.html) {
      return structuredContract.html;
    }

    return document.content;
  }, [structuredContract, document.content]);

  const plainEnglishContent = useMemo(() => {
    if (plainEnglishSummary) {
      return plainEnglishSummary;
    }
    return null;
  }, [plainEnglishSummary]);

  const handleViewModeChange = useCallback(
    (mode: "preview" | "original") => {
      setViewMode(mode);
      onViewModeChange?.(mode);
    },
    [onViewModeChange]
  );

  const PlainEnglishSkeleton = () => (
    <div className="space-y-2">
      <div className="space-y-3">
        <Skeleton className="h-6 w-3/4" />
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-5/6" />
      </div>

      <div className="space-y-6">
        {[1, 2, 3].map((section) => (
          <div key={section} className="space-y-3">
            <Skeleton className="h-5 w-1/2" />
            <div className="space-y-2">
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-4/5" />
            </div>
          </div>
        ))}
      </div>

      <div className="space-y-3">
        <Skeleton className="h-5 w-1/3" />
        <div className="space-y-2">
          {[1, 2, 3, 4].map((point) => (
            <div key={point} className="flex items-start gap-2">
              <Skeleton className="h-2 w-2 rounded-full mt-2 flex-shrink-0" />
              <Skeleton className="h-4 w-full" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  const StructuredDocumentSkeleton = () => (
    <div className="space-y-2">
      <div className="space-y-3 border-b border-gray-200 pb-4">
        <Skeleton className="h-8 w-2/3" />
        <Skeleton className="h-4 w-1/2" />
        <Skeleton className="h-4 w-3/4" />
      </div>

      {[1, 2, 3, 4, 5].map((section) => (
        <div key={section} className="space-y-3">
          <Skeleton className="h-6 w-1/3" />
          <div className="space-y-2 pl-4">
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-5/6" />
            {section % 2 === 0 && (
              <>
                <Skeleton className="h-4 w-4/5" />
                <Skeleton className="h-4 w-full" />
              </>
            )}
          </div>
        </div>
      ))}

      <div className="space-y-3 border-t border-gray-200 pt-4">
        <Skeleton className="h-5 w-1/4" />
        <Skeleton className="h-4 w-1/2" />
      </div>
    </div>
  );

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
              <div className="p-6">
                <PlainEnglishSkeleton />
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );

  const renderOriginalMode = () => (
    <div className={`h-full overflow-auto ${isMobile ? "p-1" : "p-2"}`}>
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
              <div className="p-6">
                <StructuredDocumentSkeleton />
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
                    onClick={() => handleViewModeChange("original")}
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
