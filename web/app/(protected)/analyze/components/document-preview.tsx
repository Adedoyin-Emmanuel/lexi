"use client";

import React, { useState } from "react";
import { FileText, Eye, EyeOff, Search, ZoomIn, ZoomOut } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { ContractDocument, Clause } from "../page";

interface DocumentPreviewProps {
  document: ContractDocument;
  selectedClauseId: string | null;
  onClauseSelect: (clauseId: string) => void;
}

export const DocumentPreview: React.FC<DocumentPreviewProps> = ({
  document,
  selectedClauseId,
  onClauseSelect
}) => {
  const [viewMode, setViewMode] = useState<"text" | "pdf">("text");
  const [zoom, setZoom] = useState(100);
  const [searchTerm, setSearchTerm] = useState("");
  const [showHighlights, setShowHighlights] = useState(true);

  // Mock clauses for highlighting demonstration
  const mockClauses: Clause[] = [
    {
      id: "1",
      title: "Payment Terms",
      content: "Payment shall be made within 60 days of invoice submission",
      importance: "high",
      category: "payment",
      position: { start: 150, end: 200 },
      confidence: 0.95
    },
    {
      id: "2",
      title: "Intellectual Property",
      content: "All work product shall remain the property of the client",
      importance: "high",
      category: "ip",
      position: { start: 300, end: 350 },
      confidence: 0.92
    },
    {
      id: "3",
      title: "Termination Clause",
      content: "Either party may terminate this agreement with 30 days written notice",
      importance: "medium",
      category: "termination",
      position: { start: 450, end: 500 },
      confidence: 0.88
    }
  ];

  const highlightText = (text: string) => {
    if (!showHighlights) return text;

    let highlightedText = text;
    mockClauses.forEach((clause) => {
      const isSelected = selectedClauseId === clause.id;
      const highlightClass = isSelected 
        ? "bg-indigo-200 border-b-2 border-indigo-500" 
        : "bg-yellow-100 hover:bg-yellow-200 cursor-pointer";
      
      const regex = new RegExp(`(${clause.content.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')})`, 'gi');
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

  const handleZoomIn = () => setZoom(prev => Math.min(prev + 10, 200));
  const handleZoomOut = () => setZoom(prev => Math.max(prev - 10, 50));

  return (
    <Card className="h-full flex flex-col">
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <FileText className="w-5 h-5" />
            Document Preview
          </CardTitle>
          
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setViewMode("text")}
                className={viewMode === "text" ? "bg-indigo-100 text-indigo-700" : ""}
              >
                <Eye className="w-4 h-4" />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setViewMode("pdf")}
                className={viewMode === "pdf" ? "bg-indigo-100 text-indigo-700" : ""}
              >
                <FileText className="w-4 h-4" />
              </Button>
            </div>
            
            <div className="flex items-center gap-1">
              <Button variant="ghost" size="sm" onClick={handleZoomOut}>
                <ZoomOut className="w-4 h-4" />
              </Button>
              <Badge variant="outline" className="min-w-[60px] justify-center">
                {zoom}%
              </Badge>
              <Button variant="ghost" size="sm" onClick={handleZoomIn}>
                <ZoomIn className="w-4 h-4" />
              </Button>
            </div>
            
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setShowHighlights(!showHighlights)}
                  >
                    {showHighlights ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  {showHighlights ? "Hide highlights" : "Show highlights"}
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
        </div>
        
        <div className="flex items-center gap-2">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
            <Input
              placeholder="Search in document..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>
      </CardHeader>

      <CardContent className="flex-1 overflow-hidden">
        <div 
          className="h-full overflow-auto bg-white border rounded-lg p-6"
          style={{ fontSize: `${zoom}%` }}
        >
          {viewMode === "text" ? (
            <div 
              className="prose max-w-none"
              dangerouslySetInnerHTML={{ 
                __html: highlightText(document.content || getMockContractText()) 
              }}
              onClick={handleTextClick}
            />
          ) : (
            <div className="flex items-center justify-center h-full text-gray-500">
              <div className="text-center">
                <FileText className="w-16 h-16 mx-auto mb-4 text-gray-300" />
                <p>PDF preview would be displayed here</p>
                <p className="text-sm">Currently showing text mode</p>
              </div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

// Mock contract text for demonstration
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
