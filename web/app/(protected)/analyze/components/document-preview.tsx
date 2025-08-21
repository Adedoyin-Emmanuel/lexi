"use client";

import { useState } from "react";
import { Eye, Image, ZoomIn, EyeOff, ZoomOut, FileText } from "lucide-react";

import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
  TooltipProvider,
} from "@/components/ui/tooltip";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ContractDocument, Clause } from "../page";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

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
  const [zoom, setZoom] = useState(100);
  const [showHighlights, setShowHighlights] = useState(true);
  const [viewMode, setViewMode] = useState<"preview" | "original">("preview");

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
          <div className="bg-white rounded-lg shadow-sm p-2 mb-6">
            <div className="flex items-center gap-3 mb-6"></div>

            <div className="space-y-6">
              Lorem ipsum dolor sit amet consectetur adipisicing elit. Voluptate
              nisi cum adipisci deleniti voluptates modi rerum, odit ducimus
              ipsa et. Temporibus necessitatibus optio quis, vitae sunt
              provident reiciendis in maiores. Laudantium architecto, dolore
              illo et voluptate perspiciatis ullam eaque consectetur minus illum
              deleniti quam molestias nisi quos repellat similique aut
              explicabo, reprehenderit officiis nesciunt, soluta adipisci. Eum
              nobis quod minima. Molestiae porro unde earum eius labore!
              Nesciunt dignissimos sapiente minima impedit et, nam quaerat
              exercitationem nihil doloremque nobis voluptatibus a asperiores
              at, quisquam, voluptatem molestiae quam totam! At, accusamus
              eveniet. Molestiae dolor est omnis, amet, dicta beatae quidem
              necessitatibus vitae eos libero esse similique in quam! Molestias
              explicabo reiciendis repudiandae saepe. Perferendis, assumenda?
              Minus omnis minima perspiciatis? Recusandae, nemo fugit. Deserunt
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const renderOriginalMode = () => (
    <div className="h-full overflow-auto">
      <div
        className="prose rounded-lg border border-gray-200"
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
      <CardHeader className="pb-4 flex-shrink-0 border border-none">
        <div className="flex items-center justify-between">
          <CardTitle>Document Preview</CardTitle>
          <div className="flex items-center gap-2">
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setViewMode("preview")}
                    className={
                      viewMode === "preview" ? "bg-blue-100 text-primary" : ""
                    }
                  >
                    <Image className="w-4 h-4" strokeWidth={1.5} />
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
                      viewMode === "original" ? "bg-blue-100 text-primary" : ""
                    }
                  >
                    <FileText className="w-4 h-4" strokeWidth={1.5} />
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
                          <ZoomOut className="w-4 h-4" strokeWidth={1.5} />
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
                          <ZoomIn className="w-4 h-4" strokeWidth={1.5} />
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
                          <Eye className="w-4 h-4" strokeWidth={1.5} />
                        ) : (
                          <EyeOff className="w-4 h-4" strokeWidth={1.5} />
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
          </div>
        </div>
      </CardHeader>

      <CardContent className="w-full overflow-hidden p-0">
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
