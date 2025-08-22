"use client";

import { useState, useMemo, useCallback } from "react";
import { Eye, Image, EyeOff, FileText } from "lucide-react";

import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
  TooltipProvider,
} from "@/components/ui/tooltip";
import { Button } from "@/components/ui/button";
import { useIsMobile } from "@/hooks/use-mobile";
import { ContractDocument } from "../page";
import { IStructuredContract } from "@/hooks/types/socket";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface DocumentPreviewProps {
  document: ContractDocument;
  onClauseSelect: (clauseId: string) => void;
  structuredContract?: IStructuredContract | null;
  plainEnglishSummary?: string | null;
}

export const DocumentPreview: React.FC<DocumentPreviewProps> = ({
  document,
  onClauseSelect,
  structuredContract,
  plainEnglishSummary,
}) => {
  const [showHighlights, setShowHighlights] = useState(true);
  const [viewMode, setViewMode] = useState<"preview" | "original">("preview");
  const isMobile = useIsMobile();

  const documentContent = useMemo(() => {
    // Use structured HTML if available, otherwise fall back to original content
    if (structuredContract?.html) {
      return structuredContract.html;
    }
    return document.content || getMockContractText();
  }, [document.content, structuredContract]);

  const plainEnglishContent = useMemo(() => {
    // Use the plain English summary from the backend if available
    if (plainEnglishSummary) {
      return plainEnglishSummary;
    }
    // Fallback to dummy text only if no summary is available
    return getPlainEnglishContract();
  }, [plainEnglishSummary]);

  const highlightedText = useMemo(() => {
    if (!showHighlights || viewMode !== "original") return documentContent;

    // For now, we'll use the original highlighting logic
    // In the future, we can enhance this to work with structured HTML
    const result = documentContent;

    // If we have structured contract with tokens, we can use those for highlighting
    if (structuredContract?.tokens) {
      // TODO: Implement token-based highlighting
    }

    return result;
  }, [documentContent, showHighlights, viewMode, structuredContract]);

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
            {plainEnglishContent.split("\n\n").map((paragraph, index) => (
              <p
                key={index}
                className={`leading-7 ${isMobile ? "text-sm" : "text-base"}`}
              >
                {paragraph}
              </p>
            ))}
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
          <div
            className={`text-gray-900 leading-relaxed whitespace-pre-wrap break-words ${
              isMobile ? "text-sm" : ""
            }`}
            dangerouslySetInnerHTML={{
              __html: highlightedText.replace(/\n/g, "<br>"),
            }}
            onClick={handleTextClick}
          />
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
            Document Preview
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
                    className="h-8 px-2 text-xs"
                    onClick={() => setViewMode("original")}
                  >
                    <FileText
                      className={`${isMobile ? "w-3 h-3" : "w-4 h-4"}`}
                      strokeWidth={1.5}
                    />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Original document</p>
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

const getPlainEnglishContract =
  () => `This is a contract between you (the client) and a freelancer who will create content for you.

What the freelancer will do: They will write blog posts, social media content, and marketing materials as described in your project brief.

When you need to pay: You have 60 days to pay after they send you an invoice. They must send the invoice within 5 days of finishing the work.

Who owns the work: Once you pay in full, you own all the work they created. However, they can still use it in their portfolio to show other potential clients.

How to end the contract: Either of you can cancel this agreement by giving 30 days written notice. If you cancel, you still need to pay for any work they've already completed.

Keeping things private: The freelancer promises to keep your business information and secrets confidential.

Working relationship: The freelancer is not your employee. They work for themselves and are responsible for their own taxes and benefits.

Limits on responsibility: Neither of you can sue each other for indirect damages that might happen because of this contract.

What law applies: This contract follows the laws of your state or country.

Both parties sign below to agree to these terms.`;

const getMockContractText = () => `FREELANCE CONTRACT AGREEMENT

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
[Date]                               [Date]`;
