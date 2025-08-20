"use client";

import React from "react";
import { FileText, RefreshCw, Download, Share2, MoreVertical } from "lucide-react";
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import { ContractDocument } from "../page";

interface AnalyzeToolbarProps {
  document: ContractDocument;
  onReanalyze: () => void;
  onExport: (format: "pdf" | "word" | "markdown") => void;
  onShare: () => void;
  isAnalyzing: boolean;
}

export const AnalyzeToolbar: React.FC<AnalyzeToolbarProps> = ({
  document,
  onReanalyze,
  onExport,
  onShare,
  isAnalyzing
}) => {
  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
  };

  return (
    <div className="bg-white border-b border-gray-200 px-6 py-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-indigo-100 rounded-lg flex items-center justify-center">
              <FileText className="w-5 h-5 text-indigo-600" />
            </div>
            <div>
              <h1 className="text-lg font-semibold text-gray-900">{document.name}</h1>
              <div className="flex items-center gap-2 text-sm text-gray-500">
                <span>{document.type.toUpperCase()}</span>
                <span>•</span>
                <span>{formatFileSize(document.content.length)}</span>
                <span>•</span>
                <span>Uploaded {document.uploadedAt.toLocaleDateString()}</span>
              </div>
            </div>
          </div>
          
          {isAnalyzing && (
            <Badge variant="secondary" className="bg-yellow-100 text-yellow-800">
              <RefreshCw className="w-3 h-3 mr-1 animate-spin" />
              Analyzing...
            </Badge>
          )}
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={onReanalyze}
            disabled={isAnalyzing}
          >
            <RefreshCw className={`w-4 h-4 mr-2 ${isAnalyzing ? "animate-spin" : ""}`} />
            Re-analyze
          </Button>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm">
                <Download className="w-4 h-4 mr-2" />
                Export
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => onExport("pdf")}>
                Export as PDF
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => onExport("word")}>
                Export as Word
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => onExport("markdown")}>
                Export as Markdown
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          <Button variant="outline" size="sm" onClick={onShare}>
            <Share2 className="w-4 h-4 mr-2" />
            Share
          </Button>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="sm">
                <MoreVertical className="w-4 h-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem>View original file</DropdownMenuItem>
              <DropdownMenuItem>Download original</DropdownMenuItem>
              <DropdownMenuItem>Delete analysis</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </div>
  );
};
