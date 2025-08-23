import PDFDocument from "pdfkit";
import * as cheerio from "cheerio";
import { Document } from "../../models/document";

export class PDFGenerator {
  private doc: any;
  private readonly BRAND_COLORS = {
    base: "#fafafa",
    text: "#1f2937",
    danger: "#ef4444",
    primary: "#6366f1",
    success: "#10b981",
    textMuted: "#9ca3af",
    textSecondary: "#6b7280",
  };

  constructor() {
    this.doc = new PDFDocument({
      size: "A4",
      margin: 30,
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
    res.setHeader("Content-Type", "application/pdf");
    res.setHeader(
      "Content-Disposition",
      `attachment; filename="lexi-contract-summary-${contract._id}.pdf"`
    );

    this.doc.pipe(res);

    this.addHeader(contract.title);
    this.addContractOverview(contract);
    this.addSummarySection(contract);
    this.addRisksSection(contract);
    this.addObligationsSection(contract);
    this.addSuggestionsSection(contract);
    this.addClausesSection(contract);
    this.addMetadataSection(contract);

    this.doc.end();
  }

  private addHeader(title: string): void {
    this.doc
      .rect(0, 0, this.doc.page.width, 50)
      .fill(this.BRAND_COLORS.primary);

    this.doc
      .fontSize(18)
      .fillColor("white")
      .text("Lexi AI", 30, 12)
      .fontSize(12)
      .text("Contract Analysis Report", 30, 30);

    this.doc
      .fontSize(16)
      .fillColor(this.BRAND_COLORS.text)
      .text(title, 30, 70)
      .moveDown(0.2);

    this.doc
      .fontSize(9)
      .fillColor(this.BRAND_COLORS.textSecondary)
      .text(`Generated on ${new Date().toLocaleDateString()}`, 30, 90)
      .moveDown(0.5);
  }

  private addContractOverview(contract: Document): void {
    this.doc
      .fontSize(14)
      .fillColor(this.BRAND_COLORS.text)
      .text("Contract Overview", 30, this.doc.y + 5)
      .moveDown(0.2);

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
        const y = this.doc.y + index * 15;
        this.doc
          .fontSize(10)
          .fillColor(this.BRAND_COLORS.textSecondary)
          .text(item.label + ":", 30, y)
          .fillColor(this.BRAND_COLORS.text)
          .text(item.value, 160, y);
      });

      this.doc.moveDown(0.3);
    }
  }

  private addSummarySection(contract: Document): void {
    const summary = contract.summary;
    if (!summary) return;

    this.doc
      .fontSize(14)
      .fillColor(this.BRAND_COLORS.text)
      .text("Executive Summary", 30, this.doc.y + 10)
      .moveDown(0.2);

    this.doc
      .fontSize(12)
      .fillColor(this.BRAND_COLORS.textSecondary)
      .text("Overview", 30, this.doc.y + 5)
      .moveDown(0.1);

    this.doc
      .fontSize(10)
      .fillColor(this.BRAND_COLORS.text)
      .text(
        this.stripHtml(summary.overviewSummary || "No overview available"),
        30,
        this.doc.y,
        {
          width: this.doc.page.width - 60,
          align: "justify",
        }
      )
      .moveDown(0.3);

    this.doc
      .fontSize(12)
      .fillColor(this.BRAND_COLORS.textSecondary)
      .text("Plain English Summary", 30, this.doc.y + 5)
      .moveDown(0.1);

    this.doc
      .fontSize(10)
      .fillColor(this.BRAND_COLORS.text)
      .text(
        this.stripHtml(
          summary.plainEnglishSummary || "No plain English summary available"
        ),
        30,
        this.doc.y,
        {
          width: this.doc.page.width - 60,
          align: "justify",
        }
      )
      .moveDown(0.3);
  }

  private addRisksSection(contract: Document): void {
    if (!contract.risks || contract.risks.length === 0) return;

    this.doc
      .fontSize(14)
      .fillColor(this.BRAND_COLORS.text)
      .text("Risk Analysis", 30, this.doc.y + 10)
      .moveDown(0.2);

    contract.risks.forEach((risk, index) => {
      if (index > 0) this.doc.moveDown(0.2);

      const riskColor = this.getRiskColor(risk.riskLevel);

      this.doc
        .fontSize(12)
        .fillColor(riskColor)
        .text(`${risk.title} (${risk.riskLevel})`, 30, this.doc.y + 5)
        .moveDown(0.1);

      this.doc
        .fontSize(10)
        .fillColor(this.BRAND_COLORS.text)
        .text(this.stripHtml(risk.description), 30, this.doc.y, {
          width: this.doc.page.width - 60,
          align: "justify",
        })
        .moveDown(0.1);

      this.doc
        .fontSize(9)
        .fillColor(this.BRAND_COLORS.textMuted)
        .text(`Confidence: ${risk.confidenceScore}%`, 30, this.doc.y);

      if (this.doc.y > this.doc.page.height - 60) {
        this.addPage();
      }
    });
  }

  private addObligationsSection(contract: Document): void {
    if (!contract.obligations || contract.obligations.length === 0) return;

    this.doc
      .fontSize(14)
      .fillColor(this.BRAND_COLORS.text)
      .text("Key Obligations", 30, this.doc.y + 10)
      .moveDown(0.2);

    contract.obligations.forEach((obligation, index) => {
      if (index > 0) this.doc.moveDown(0.2);

      this.doc
        .fontSize(12)
        .fillColor(this.BRAND_COLORS.text)
        .text(obligation.title, 30, this.doc.y + 5)
        .moveDown(0.1);

      this.doc
        .fontSize(10)
        .fillColor(this.BRAND_COLORS.textSecondary)
        .text(this.stripHtml(obligation.description), 30, this.doc.y, {
          width: this.doc.page.width - 60,
          align: "justify",
        })
        .moveDown(0.1);

      if (obligation.dueDate) {
        this.doc
          .fontSize(9)
          .fillColor(this.BRAND_COLORS.success)
          .text(`Due Date: ${obligation.dueDate}`, 30, this.doc.y);
      }

      this.doc
        .fontSize(9)
        .fillColor(this.BRAND_COLORS.textMuted)
        .text(
          `Confidence: ${obligation.confidenceScore}% | Type: ${obligation.actionableType}`,
          30,
          this.doc.y + 5
        );

      if (this.doc.y > this.doc.page.height - 60) {
        this.addPage();
      }
    });
  }

  private addSuggestionsSection(contract: Document): void {
    if (!contract.suggestions || contract.suggestions.length === 0) return;

    this.doc
      .fontSize(14)
      .fillColor(this.BRAND_COLORS.text)
      .text("Improvement Suggestions", 30, this.doc.y + 10)
      .moveDown(0.2);

    contract.suggestions.forEach((suggestion, index) => {
      if (index > 0) this.doc.moveDown(0.2);

      const priorityColor = this.getPriorityColor(suggestion.priority);

      this.doc
        .fontSize(12)
        .fillColor(priorityColor)
        .text(
          `${suggestion.title} (${suggestion.priority})`,
          30,
          this.doc.y + 5
        )
        .moveDown(0.1);

      this.doc
        .fontSize(10)
        .fillColor(this.BRAND_COLORS.textSecondary)
        .text(`Reason: ${this.stripHtml(suggestion.reason)}`, 30, this.doc.y, {
          width: this.doc.page.width - 60,
          align: "justify",
        })
        .moveDown(0.1);

      this.doc
        .fontSize(9)
        .fillColor(this.BRAND_COLORS.text)
        .text(
          `Current: ${this.stripHtml(suggestion.currentStatement)}`,
          30,
          this.doc.y
        )
        .moveDown(0.1);

      this.doc
        .fontSize(9)
        .fillColor(this.BRAND_COLORS.success)
        .text(
          `Suggested: ${this.stripHtml(suggestion.suggestedStatement)}`,
          30,
          this.doc.y
        );

      if (this.doc.y > this.doc.page.height - 60) {
        this.addPage();
      }
    });
  }

  private addClausesSection(contract: Document): void {
    if (!contract.clauses || contract.clauses.length === 0) return;

    this.doc
      .fontSize(14)
      .fillColor(this.BRAND_COLORS.text)
      .text("Key Clauses", 30, this.doc.y + 10)
      .moveDown(0.2);

    contract.clauses.forEach((clause, index) => {
      if (index > 0) this.doc.moveDown(0.2);

      this.doc
        .fontSize(12)
        .fillColor(this.BRAND_COLORS.text)
        .text(clause.title, 30, this.doc.y + 5)
        .moveDown(0.1);

      this.doc
        .fontSize(10)
        .fillColor(this.BRAND_COLORS.textSecondary)
        .text(this.stripHtml(clause.fullText), 30, this.doc.y, {
          width: this.doc.page.width - 60,
          align: "justify",
        })
        .moveDown(0.1);

      this.doc
        .fontSize(9)
        .fillColor(this.BRAND_COLORS.textMuted)
        .text(`Confidence: ${clause.confidenceScore}%`, 30, this.doc.y);

      if (this.doc.y > this.doc.page.height - 60) {
        this.addPage();
      }
    });
  }

  private addMetadataSection(contract: Document): void {
    this.doc
      .fontSize(14)
      .fillColor(this.BRAND_COLORS.text)
      .text("Analysis Metadata", 30, this.doc.y + 10)
      .moveDown(0.2);

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
        const y = this.doc.y + index * 14;
        this.doc
          .fontSize(10)
          .fillColor(this.BRAND_COLORS.textSecondary)
          .text(item.label + ":", 30, y)
          .fillColor(this.BRAND_COLORS.text)
          .text(item.value, 200, y);
      });
    }

    const validationMeta = contract.validationMetadata;
    if (validationMeta) {
      this.doc.moveDown(0.3);
      this.doc
        .fontSize(12)
        .fillColor(this.BRAND_COLORS.textSecondary)
        .text("Validation Results", 30, this.doc.y + 5)
        .moveDown(0.1);

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
        const y = this.doc.y + index * 14;
        this.doc
          .fontSize(10)
          .fillColor(this.BRAND_COLORS.textSecondary)
          .text(item.label + ":", 30, y)
          .fillColor(this.BRAND_COLORS.text)
          .text(item.value, 200, y);
      });

      if (validationMeta.reason) {
        this.doc.moveDown(0.2);
        this.doc
          .fontSize(10)
          .fillColor(this.BRAND_COLORS.textSecondary)
          .text("Reason:", 30, this.doc.y + 5)
          .moveDown(0.1);

        this.doc
          .fontSize(10)
          .fillColor(this.BRAND_COLORS.text)
          .text(this.stripHtml(validationMeta.reason), 30, this.doc.y, {
            width: this.doc.page.width - 60,
            align: "justify",
          });
      }
    }

    this.doc
      .fontSize(9)
      .fillColor(this.BRAND_COLORS.textMuted)
      .text(
        "Generated by Lexi AI - Intelligent Contract Analysis",
        30,
        this.doc.page.height - 30,
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
      const $ = cheerio.load(html);

      $("script, style").remove();

      let text = $.text();

      text = text.replace(/\s+/g, " ").trim();

      return text;
    } catch (error) {
      return html.replace(/<[^>]*>/g, "");
    }
  }

  private getRiskColor(riskLevel: string): string {
    switch (riskLevel?.toLowerCase()) {
      case "high":
        return this.BRAND_COLORS.danger;
      case "medium":
        return "#f59e0b";
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
        return "#f59e0b";
      case "low":
        return this.BRAND_COLORS.success;
      default:
        return this.BRAND_COLORS.text;
    }
  }
}
