import PDFDocument from "pdfkit";
import * as cheerio from "cheerio";
import { Document } from "../../models/document";

export class PDFGenerator {
  private doc: any;
  private readonly BRAND_COLORS = {
    primary: "#6366f1",
    base: "#fafafa",
    danger: "#ef4444",
    success: "#10b981",
    text: "#1f2937",
    textSecondary: "#6b7280",
    textMuted: "#9ca3af",
  };

  constructor() {
    this.doc = new PDFDocument({
      size: "A4",
      margin: 40,
      info: {
        Title: "Lexi AI Contract Analysis Report",
        Author: "Lexi AI",
        Subject: "Contract Analysis Report",
        Keywords: "contract, legal, analysis, summary",
        CreationDate: new Date(),
      },
    });
  }

  public generateContractPDF(contract: Document, res: any): void {
    // Set response headers
    res.setHeader("Content-Type", "application/pdf");
    res.setHeader(
      "Content-Disposition",
      `attachment; filename="lexi-contract-summary-${contract._id}.pdf"`
    );

    // Pipe to response
    this.doc.pipe(res);

    // Generate PDF content
    this.addHeader(contract.title);
    this.addContractOverview(contract);
    this.addSummarySection(contract);
    this.addRisksSection(contract);
    this.addObligationsSection(contract);
    this.addSuggestionsSection(contract);
    this.addClausesSection(contract);
    this.addMetadataSection(contract);

    // Finalize
    this.doc.end();
  }

  private addHeader(title: string): void {
    // Header background
    this.doc
      .rect(0, 0, this.doc.page.width, 60)
      .fill(this.BRAND_COLORS.primary);

    // Logo and title
    this.doc
      .fontSize(20)
      .fillColor("white")
      .text("Lexi AI", 40, 15)
      .fontSize(14)
      .text("Contract Analysis Report", 40, 40);

    // Contract title
    this.doc
      .fontSize(18)
      .fillColor(this.BRAND_COLORS.text)
      .text(title, 40, 80)
      .moveDown(0.3);

    // Generation date
    this.doc
      .fontSize(10)
      .fillColor(this.BRAND_COLORS.textSecondary)
      .text(`Generated on ${new Date().toLocaleDateString()}`, 40, 110)
      .moveDown(1);
  }

  private addContractOverview(contract: Document): void {
    this.doc
      .fontSize(16)
      .fillColor(this.BRAND_COLORS.text)
      .text("Contract Overview", 40, this.doc.y + 10)
      .moveDown(0.3);

    const summary = contract.summary;
    if (summary) {
      const overviewData = [
        { label: "Contract Type", value: summary.type || "N/A" },
        { label: "Duration", value: summary.duration || "N/A" },
        { label: "Jurisdiction", value: summary.jurisdiction || "N/A" },
        { label: "Effective Date", value: summary.effectiveDate || "N/A" },
        {
          label: "Parties Involved",
          value: summary.totalPartiesInvolved?.toString() || "N/A",
        },
        {
          label: "Overall Risk Score",
          value: `${summary.overallRiskScore || 0}/100`,
        },
        {
          label: "Confidence Score",
          value: `${summary.overallConfidenceScore || 0}%`,
        },
        { label: "Status", value: contract.status },
      ];

      overviewData.forEach((item, index) => {
        const y = this.doc.y + index * 20;
        this.doc
          .fontSize(11)
          .fillColor(this.BRAND_COLORS.textSecondary)
          .text(item.label + ":", 40, y)
          .fillColor(this.BRAND_COLORS.text)
          .text(item.value, 180, y);
      });

      this.doc.moveDown(0.5);
    }
  }

  private addSummarySection(contract: Document): void {
    const summary = contract.summary;
    if (!summary) return;

    this.addPage();
    this.doc
      .fontSize(16)
      .fillColor(this.BRAND_COLORS.text)
      .text("Executive Summary", 40, 40)
      .moveDown(0.3);

    // Overview Summary
    this.doc
      .fontSize(13)
      .fillColor(this.BRAND_COLORS.textSecondary)
      .text("Overview", 40, this.doc.y + 10)
      .moveDown(0.2);

    this.doc
      .fontSize(11)
      .fillColor(this.BRAND_COLORS.text)
      .text(
        this.stripHtml(summary.overviewSummary || "No overview available"),
        40,
        this.doc.y,
        {
          width: this.doc.page.width - 80,
          align: "justify",
        }
      )
      .moveDown(0.5);

    // Plain English Summary
    this.doc
      .fontSize(13)
      .fillColor(this.BRAND_COLORS.textSecondary)
      .text("Plain English Summary", 40, this.doc.y + 10)
      .moveDown(0.2);

    this.doc
      .fontSize(11)
      .fillColor(this.BRAND_COLORS.text)
      .text(
        this.stripHtml(
          summary.plainEnglishSummary || "No plain English summary available"
        ),
        40,
        this.doc.y,
        {
          width: this.doc.page.width - 80,
          align: "justify",
        }
      )
      .moveDown(0.5);
  }

  private addRisksSection(contract: Document): void {
    if (!contract.risks || contract.risks.length === 0) return;

    this.addPage();
    this.doc
      .fontSize(16)
      .fillColor(this.BRAND_COLORS.text)
      .text("Risk Analysis", 40, 40)
      .moveDown(0.3);

    contract.risks.forEach((risk, index) => {
      if (index > 0) this.doc.moveDown(0.3);

      // Risk header with color coding
      const riskColor = this.getRiskColor(risk.riskLevel);

      this.doc
        .fontSize(13)
        .fillColor(riskColor)
        .text(`${risk.title} (${risk.riskLevel})`, 40, this.doc.y + 10)
        .moveDown(0.2);

      this.doc
        .fontSize(11)
        .fillColor(this.BRAND_COLORS.text)
        .text(this.stripHtml(risk.description), 40, this.doc.y, {
          width: this.doc.page.width - 80,
          align: "justify",
        })
        .moveDown(0.2);

      this.doc
        .fontSize(10)
        .fillColor(this.BRAND_COLORS.textMuted)
        .text(`Confidence: ${risk.confidenceScore}%`, 40, this.doc.y);

      if (this.doc.y > this.doc.page.height - 80) {
        this.addPage();
      }
    });
  }

  private addObligationsSection(contract: Document): void {
    if (!contract.obligations || contract.obligations.length === 0) return;

    this.addPage();
    this.doc
      .fontSize(16)
      .fillColor(this.BRAND_COLORS.text)
      .text("Key Obligations", 40, 40)
      .moveDown(0.3);

    contract.obligations.forEach((obligation, index) => {
      if (index > 0) this.doc.moveDown(0.3);

      this.doc
        .fontSize(13)
        .fillColor(this.BRAND_COLORS.text)
        .text(obligation.title, 40, this.doc.y + 10)
        .moveDown(0.2);

      this.doc
        .fontSize(11)
        .fillColor(this.BRAND_COLORS.textSecondary)
        .text(this.stripHtml(obligation.description), 40, this.doc.y, {
          width: this.doc.page.width - 80,
          align: "justify",
        })
        .moveDown(0.2);

      if (obligation.dueDate) {
        this.doc
          .fontSize(10)
          .fillColor(this.BRAND_COLORS.success)
          .text(`Due Date: ${obligation.dueDate}`, 40, this.doc.y);
      }

      this.doc
        .fontSize(10)
        .fillColor(this.BRAND_COLORS.textMuted)
        .text(
          `Confidence: ${obligation.confidenceScore}% | Type: ${obligation.actionableType}`,
          40,
          this.doc.y + 10
        );

      if (this.doc.y > this.doc.page.height - 80) {
        this.addPage();
      }
    });
  }

  private addSuggestionsSection(contract: Document): void {
    if (!contract.suggestions || contract.suggestions.length === 0) return;

    this.addPage();
    this.doc
      .fontSize(16)
      .fillColor(this.BRAND_COLORS.text)
      .text("Improvement Suggestions", 40, 40)
      .moveDown(0.3);

    contract.suggestions.forEach((suggestion, index) => {
      if (index > 0) this.doc.moveDown(0.3);

      const priorityColor = this.getPriorityColor(suggestion.priority);

      this.doc
        .fontSize(13)
        .fillColor(priorityColor)
        .text(
          `${suggestion.title} (${suggestion.priority})`,
          40,
          this.doc.y + 10
        )
        .moveDown(0.2);

      this.doc
        .fontSize(11)
        .fillColor(this.BRAND_COLORS.textSecondary)
        .text(`Reason: ${this.stripHtml(suggestion.reason)}`, 40, this.doc.y, {
          width: this.doc.page.width - 80,
          align: "justify",
        })
        .moveDown(0.2);

      this.doc
        .fontSize(10)
        .fillColor(this.BRAND_COLORS.text)
        .text(
          `Current: ${this.stripHtml(suggestion.currentStatement)}`,
          40,
          this.doc.y
        )
        .moveDown(0.1);

      this.doc
        .fontSize(10)
        .fillColor(this.BRAND_COLORS.success)
        .text(
          `Suggested: ${this.stripHtml(suggestion.suggestedStatement)}`,
          40,
          this.doc.y
        );

      if (this.doc.y > this.doc.page.height - 80) {
        this.addPage();
      }
    });
  }

  private addClausesSection(contract: Document): void {
    if (!contract.clauses || contract.clauses.length === 0) return;

    this.addPage();
    this.doc
      .fontSize(16)
      .fillColor(this.BRAND_COLORS.text)
      .text("Key Clauses", 40, 40)
      .moveDown(0.3);

    contract.clauses.forEach((clause, index) => {
      if (index > 0) this.doc.moveDown(0.3);

      this.doc
        .fontSize(13)
        .fillColor(this.BRAND_COLORS.text)
        .text(clause.title, 40, this.doc.y + 10)
        .moveDown(0.2);

      this.doc
        .fontSize(11)
        .fillColor(this.BRAND_COLORS.textSecondary)
        .text(this.stripHtml(clause.fullText), 40, this.doc.y, {
          width: this.doc.page.width - 80,
          align: "justify",
        })
        .moveDown(0.2);

      this.doc
        .fontSize(10)
        .fillColor(this.BRAND_COLORS.textMuted)
        .text(`Confidence: ${clause.confidenceScore}%`, 40, this.doc.y);

      if (this.doc.y > this.doc.page.height - 80) {
        this.addPage();
      }
    });
  }

  private addMetadataSection(contract: Document): void {
    this.addPage();
    this.doc
      .fontSize(16)
      .fillColor(this.BRAND_COLORS.text)
      .text("Analysis Metadata", 40, 40)
      .moveDown(0.3);

    const extractionMeta = contract.extractionMetadata;
    if (extractionMeta) {
      const metadata = [
        {
          label: "Total Risks Identified",
          value: extractionMeta.totalRisks?.toString() || "0",
        },
        {
          label: "Total Clauses Extracted",
          value: extractionMeta.totalClauses?.toString() || "0",
        },
        {
          label: "Total Obligations Found",
          value: extractionMeta.totalObligations?.toString() || "0",
        },
        {
          label: "Total Suggestions Generated",
          value: extractionMeta.totalSuggestions?.toString() || "0",
        },
        {
          label: "Processing Time",
          value: `${extractionMeta.processingTime || 0}ms`,
        },
        {
          label: "Overall Confidence",
          value: `${extractionMeta.overallConfidence || 0}%`,
        },
      ];

      metadata.forEach((item, index) => {
        const y = this.doc.y + index * 18;
        this.doc
          .fontSize(11)
          .fillColor(this.BRAND_COLORS.textSecondary)
          .text(item.label + ":", 40, y)
          .fillColor(this.BRAND_COLORS.text)
          .text(item.value, 220, y);
      });
    }

    // Add validation metadata
    const validationMeta = contract.validationMetadata;
    if (validationMeta) {
      this.doc.moveDown(0.5);
      this.doc
        .fontSize(13)
        .fillColor(this.BRAND_COLORS.textSecondary)
        .text("Validation Results", 40, this.doc.y + 10)
        .moveDown(0.2);

      const validationData = [
        {
          label: "Valid Contract",
          value: validationMeta.isValidContract ? "Yes" : "No",
        },
        { label: "In Scope", value: validationMeta.inScope ? "Yes" : "No" },
        { label: "Contract Type", value: validationMeta.contractType || "N/A" },
        {
          label: "Validation Confidence",
          value: `${validationMeta.confidenceScore || 0}%`,
        },
      ];

      validationData.forEach((item, index) => {
        const y = this.doc.y + index * 18;
        this.doc
          .fontSize(11)
          .fillColor(this.BRAND_COLORS.textSecondary)
          .text(item.label + ":", 40, y)
          .fillColor(this.BRAND_COLORS.text)
          .text(item.value, 220, y);
      });

      if (validationMeta.reason) {
        this.doc.moveDown(0.3);
        this.doc
          .fontSize(11)
          .fillColor(this.BRAND_COLORS.textSecondary)
          .text("Reason:", 40, this.doc.y + 10)
          .moveDown(0.2);

        this.doc
          .fontSize(11)
          .fillColor(this.BRAND_COLORS.text)
          .text(this.stripHtml(validationMeta.reason), 40, this.doc.y, {
            width: this.doc.page.width - 80,
            align: "justify",
          });
      }
    }

    // Add footer
    this.doc
      .fontSize(10)
      .fillColor(this.BRAND_COLORS.textMuted)
      .text(
        "Generated by Lexi AI - Intelligent Contract Analysis",
        40,
        this.doc.page.height - 40,
        {
          align: "center",
        }
      );
  }

  private addPage(): void {
    this.doc.addPage();
  }

  private stripHtml(html: string): string {
    if (!html) return "";

    try {
      // Use cheerio to properly parse and extract text from HTML
      const $ = cheerio.load(html);

      // Remove script and style elements
      $("script, style").remove();

      // Get text content and clean it up
      let text = $.text();

      // Clean up extra whitespace
      text = text.replace(/\s+/g, " ").trim();

      return text;
    } catch (error) {
      // Fallback to simple regex if cheerio fails
      return html.replace(/<[^>]*>/g, "");
    }
  }

  private getRiskColor(riskLevel: string): string {
    switch (riskLevel?.toLowerCase()) {
      case "high":
        return this.BRAND_COLORS.danger;
      case "medium":
        return "#f59e0b"; // Warning color (keeping this for medium risk)
      case "low":
        return this.BRAND_COLORS.success;
      default:
        return this.BRAND_COLORS.text;
    }
  }

  private getPriorityColor(priority: string): string {
    switch (priority?.toLowerCase()) {
      case "high":
        return this.BRAND_COLORS.danger;
      case "medium":
        return "#f59e0b"; // Warning color (keeping this for medium priority)
      case "low":
        return this.BRAND_COLORS.success;
      default:
        return this.BRAND_COLORS.text;
    }
  }
}
