"use client";

import React, { useState } from "react";
import {
  FileText,
  Eye,
  EyeOff,
  Search,
  ZoomIn,
  ZoomOut,
  Download,
  Share2,
  File,
  Image,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { ContractDocument, Clause } from "../page";

interface DocumentPreviewProps {
  document: ContractDocument;
  selectedClauseId: string | null;
  onClauseSelect: (clauseId: string) => void;
}

export const DocumentPreview: React.FC<DocumentPreviewProps> = ({
  document,
  selectedClauseId,
  onClauseSelect,
}) => {
  const [viewMode, setViewMode] = useState<"preview" | "original">("preview");
  const [zoom, setZoom] = useState(100);
  const [searchTerm, setSearchTerm] = useState("");
  const [showHighlights, setShowHighlights] = useState(true);

  const mockClauses: Clause[] = [
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
  ];

  const highlightText = (text: string) => {
    if (!showHighlights) return text;

    let highlightedText = text;
    mockClauses.forEach((clause) => {
      const isSelected = selectedClauseId === clause.id;
      const highlightClass = isSelected
        ? "bg-blue-200 border-b-2 border-blue-500"
        : "bg-yellow-100 hover:bg-yellow-200 cursor-pointer";

      const regex = new RegExp(
        `(${clause.content.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")})`,
        "gi"
      );
      highlightedText = highlightedText.replace(regex, (match) => {
        return `<span class="${highlightClass} px-1 rounded" data-clause-id="${clause.id}">${match}</span>`;
      });
    });

    return highlightedText;
  };

  const handleTextClick = (event: React.MouseEvent) => {
    const target = event.target as HTMLElement;
    if (target.dataset.clauseId) {
      onClauseSelect(target.dataset.clauseId);
    }
  };

  const handleZoomIn = () => setZoom((prev) => Math.min(prev + 10, 200));
  const handleZoomOut = () => setZoom((prev) => Math.max(prev - 10, 50));

  const formatDocumentContent = (content: string) => {
    if (!content) return getMockContractText();

    return content
      .replace(/\n/g, "<br>")
      .replace(/\t/g, "&nbsp;&nbsp;&nbsp;&nbsp;")
      .replace(/\s{2,}/g, (match) => "&nbsp;".repeat(match.length));
  };

  const renderPreviewMode = () => (
    <div className="h-full flex flex-col">
      <div className="flex-1 overflow-auto">
        <div className="max-w-4xl mx-auto">
          <div className="bg-white rounded-lg shadow-sm border p-8 mb-6">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                <File className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-slate-900">
                  {document.name}
                </h3>
                <p className="text-sm text-slate-500">
                  Uploaded {document.uploadedAt.toLocaleDateString()}
                </p>
              </div>
            </div>

            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-slate-50 rounded-lg p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                    <span className="text-sm font-medium text-slate-700">
                      Document Type
                    </span>
                  </div>
                  <p className="text-lg font-semibold text-slate-900">
                    {document.type.toUpperCase()}
                  </p>
                </div>

                <div className="bg-slate-50 rounded-lg p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
                    <span className="text-sm font-medium text-slate-700">
                      Analysis Status
                    </span>
                  </div>
                  <p className="text-lg font-semibold text-green-600">
                    Complete
                  </p>
                </div>

                <div className="bg-slate-50 rounded-lg p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <div className="w-2 h-2 bg-purple-500 rounded-full animate-pulse"></div>
                    <span className="text-sm font-medium text-slate-700">
                      Key Findings
                    </span>
                  </div>
                  <p className="text-lg font-semibold text-slate-900">
                    3 Clauses
                  </p>
                </div>
              </div>

              <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg p-6 border border-blue-200">
                <h4 className="text-lg font-semibold text-slate-900 mb-3">
                  Document Overview
                </h4>
                <div className="prose prose-sm max-w-none text-slate-700">
                  <p>
                    This contract has been analyzed and contains key clauses
                    related to payment terms, intellectual property, and
                    termination conditions. The AI has identified potential
                    risks and provided negotiation suggestions to help you
                    understand and improve the terms.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const renderOriginalMode = () => (
    <div className="h-full overflow-auto">
      <div
        className="prose max-w-none p-6 bg-white rounded-lg border"
        style={{ fontSize: `${zoom}%` }}
      >
        <div
          className="whitespace-pre-wrap break-words"
          dangerouslySetInnerHTML={{
            __html: highlightText(formatDocumentContent(document.content)),
          }}
          onClick={handleTextClick}
        />
      </div>
    </div>
  );

  return (
    <Card className="h-full flex flex-col overflow-hidden">
      <CardHeader className="pb-4 flex-shrink-0">
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <FileText className="w-5 h-5" />
            Document Preview
          </CardTitle>

          <div className="flex items-center gap-2">
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setViewMode("preview")}
                    className={
                      viewMode === "preview" ? "bg-blue-100 text-blue-700" : ""
                    }
                  >
                    <Image className="w-4 h-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Preview mode</p>
                </TooltipContent>
              </Tooltip>

              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setViewMode("original")}
                    className={
                      viewMode === "original" ? "bg-blue-100 text-blue-700" : ""
                    }
                  >
                    <FileText className="w-4 h-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Original document</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>

            {viewMode === "original" && (
              <>
                <div className="flex items-center gap-1">
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={handleZoomOut}
                        >
                          <ZoomOut className="w-4 h-4" />
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>Zoom out</p>
                      </TooltipContent>
                    </Tooltip>

                    <Badge
                      variant="outline"
                      className="min-w-[60px] justify-center"
                    >
                      {zoom}%
                    </Badge>

                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={handleZoomIn}
                        >
                          <ZoomIn className="w-4 h-4" />
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>Zoom in</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </div>

                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setShowHighlights(!showHighlights)}
                      >
                        {showHighlights ? (
                          <Eye className="w-4 h-4" />
                        ) : (
                          <EyeOff className="w-4 h-4" />
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
              </>
            )}

            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button variant="ghost" size="sm">
                    <Download className="w-4 h-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Download document</p>
                </TooltipContent>
              </Tooltip>

              <Tooltip>
                <TooltipTrigger asChild>
                  <Button variant="ghost" size="sm">
                    <Share2 className="w-4 h-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Share document</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-400" />
            <Input
              placeholder="Search in document..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>
      </CardHeader>

      <CardContent className="flex-1 overflow-hidden p-0">
        {viewMode === "preview" ? renderPreviewMode() : renderOriginalMode()}
      </CardContent>
    </Card>
  );
};

const getMockContractText = () => `
FREELANCE CONTRACT AGREEMENT

This Freelance Contract Agreement (the "Agreement") is entered into as of [Date] by and between [Client Name] ("Client") and [Freelancer Name] ("Freelancer").

1. SERVICES
Freelancer agrees to provide content creation services including but not limited to blog posts, social media content, and marketing copy as outlined in the project brief.

2. PAYMENT TERMS
Payment shall be made within 60 days of invoice submission. All invoices must be submitted within 5 days of project completion.

3. INTELLECTUAL PROPERTY
All work product shall remain the property of the client upon full payment. Freelancer retains the right to include work in their portfolio.

4. TERMINATION
Either party may terminate this agreement with 30 days written notice. Client shall pay for all work completed up to the termination date.

5. CONFIDENTIALITY
Freelancer agrees to maintain confidentiality of all client information and trade secrets disclosed during the course of this agreement.

6. INDEPENDENT CONTRACTOR
Freelancer is an independent contractor and not an employee of Client. Freelancer is responsible for their own taxes and benefits.

7. LIMITATION OF LIABILITY
Neither party shall be liable for any indirect, incidental, or consequential damages arising from this agreement.

8. GOVERNING LAW
This agreement shall be governed by the laws of [State/Country].

IN WITNESS WHEREOF, the parties have executed this agreement as of the date first written above.

[Client Signature]                    [Freelancer Signature]
[Client Name]                        [Freelancer Name]
[Date]                               [Date]
`;
