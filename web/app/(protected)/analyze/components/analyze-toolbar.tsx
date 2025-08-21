"use client";

import { Download, RefreshCw } from "lucide-react";

import {
  DropdownMenu,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuContent,
} from "@/components/ui/dropdown-menu";
import { ContractDocument } from "../page";
import { Button } from "@/components/ui/button";
import { useIsMobile } from "@/hooks/use-mobile";

interface AnalyzeToolbarProps {
  isAnalyzing: boolean;
  onReanalyze: () => void;
  document: ContractDocument;
  onExport: (format: "pdf" | "word" | "markdown") => void;
}

export const AnalyzeToolbar: React.FC<AnalyzeToolbarProps> = ({
  document,
  onExport,
  onReanalyze,
  isAnalyzing,
}) => {
  const isMobile = useIsMobile();

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
  };

  return (
    <div className="w-full py-4 md:px-4">
      <div
        className={`flex items-center justify-between ${
          isMobile ? "flex-col gap-4" : ""
        }`}
      >
        <div className={`flex items-center gap-4 ${isMobile ? "w-full" : ""}`}>
          <div
            className={`flex items-center gap-3 ${isMobile ? "w-full" : ""}`}
          >
            <div className={isMobile ? "w-full" : ""}>
              <h1
                className={`font-semibold text-gray-900 ${
                  isMobile ? "text-base" : "text-lg"
                }`}
              >
                {document.name}
              </h1>
              <div
                className={`flex items-center gap-2 text-sm text-gray-500 ${
                  isMobile ? "flex-wrap" : ""
                }`}
              >
                <span>{document.type.toUpperCase()}</span>
                <span>•</span>
                <span>{formatFileSize(document.content.length)}</span>
                <span>•</span>
                <span className={isMobile ? "text-xs" : ""}>
                  {isMobile
                    ? "Uploaded " + document.uploadedAt.toLocaleDateString()
                    : "Uploaded " + document.uploadedAt.toLocaleDateString()}
                </span>
              </div>
            </div>
          </div>
        </div>

        <div
          className={`flex items-center gap-2 md:mb-0 mb-4 ${
            isMobile ? "w-full justify-start" : "justify-end"
          }`}
        >
          <Button
            size="sm"
            variant="outline"
            onClick={onReanalyze}
            disabled={isAnalyzing}
            className="cursor-pointer border !border-gray-300 text-gray-800"
          >
            <RefreshCw
              className={`w-4 h-4 mr-2  ${isAnalyzing ? "animate-spin" : ""}`}
              strokeWidth={1.5}
            />
            {isMobile ? "Re-analyze" : "Re-analyze"}
          </Button>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="outline"
                size="sm"
                className="cursor-pointer  border !border-gray-300 text-gray-800"
              >
                <Download className="w-4 h-4 mr-2" strokeWidth={1.5} />
                Export
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem
                onClick={() => onExport("pdf")}
                className="cursor-pointer"
              >
                Export as PDF
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => onExport("word")}
                className="cursor-pointer"
              >
                Export as Word
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => onExport("markdown")}
                className="cursor-pointer"
              >
                Export as Markdown
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </div>
  );
};
