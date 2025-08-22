import { Result } from "tsfluent";

import {
  ISummary,
  CONTRACT_TYPE,
} from "../../../../models/document/interfaces";
import { aiMlApi, logger } from "../../../../utils";

export default class DocumentSummarizer {
  public async summarize(
    contract: string,
    contractType: CONTRACT_TYPE,
    structuredHTML: string
  ) {
    try {
      if (!contract) {
        return Result.fail("Contract is required");
      }

      const systemPrompt = this.getSummarizePrompt();
      const userPrompt = this.buildUserPrompt(
        contract,
        contractType,
        structuredHTML
      );

      const response = await aiMlApi.chat.completions.create({
        model: "gpt-4o",
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: userPrompt },
        ],
        temperature: 0.2,
        max_tokens: 2000,
        response_format: { type: "json_object" },
      });

      const content = response.choices[0]?.message?.content;

      if (!content) {
        return Result.fail("No response from summarization model");
      }

      let summaryData: any;

      try {
        summaryData = JSON.parse(content);
      } catch (error) {
        return Result.fail("Failed to parse response from summarization model");
      }

      const summary: ISummary = {
        duration: summaryData.duration || "Not specified",
        type: contractType,
        rawSummary: summaryData.rawSummary || summaryData.raw_summary || "",
        jurisdiction: summaryData.jurisdiction || "Not specified",
        effectiveDate:
          summaryData.effectiveDate ||
          summaryData.effective_date ||
          "Not specified",
        overviewSummary:
          summaryData.overviewSummary || summaryData.overview_summary || "",
        overallRiskScore: this.validateScore(
          summaryData.overallRiskScore || summaryData.overall_risk_score,
          50
        ),
        totalPartiesInvolved:
          summaryData.totalPartiesInvolved ||
          summaryData.total_parties_involved ||
          2,
        overallConfidenceScore: this.validateScore(
          summaryData.overallConfidenceScore ||
            summaryData.overall_confidence_score,
          80
        ),
        terminationClasePresent:
          summaryData.terminationClasePresent ||
          summaryData.termination_clause_present ||
          false,
      };

      if (!this.validateSummary(summary)) {
        return Result.fail("Invalid summary structure returned by model");
      }

      return Result.ok(summary);
    } catch (error) {
      logger(error);
      return Result.fail("Failed to summarize document");
    }
  }

  private getSummarizePrompt() {
    const prompt = `
             You are a legal contract analysis expert for Lexi, specializing in contract summaries for freelancers and creators.

            ## Your Task
            Analyze the contract and provide a comprehensive summary with risk assessment and key metadata.

            ## Contract Types Context
            - **NDA**: Protects confidential information sharing
            - **ICA**: Independent contractor/freelancer work arrangements  
            - **License Agreement**: Intellectual property usage rights

            ## Analysis Requirements

            ### Risk Assessment (1-100 scale)
            Evaluate overall contract risk considering:
            - **High Risk (80-100)**: Severe penalties, unlimited liability, unclear terms, heavily one-sided
            - **Medium Risk (40-79)**: Some concerning clauses, moderate penalties, unclear sections
            - **Low Risk (1-39)**: Balanced terms, clear language, reasonable obligations

            ### Key Information to Extract
            1. **Duration**: Contract term length (e.g., "5 years", "Indefinite", "Project completion")
            2. **Jurisdiction**: Governing law/legal jurisdiction 
            3. **Effective Date**: When contract starts
            4. **Parties**: Count total parties involved
            5. **Termination**: Whether termination clauses exist
            6. **Confidence**: Your confidence in the analysis (1-100)

            ### Summary Guidelines
            - **Raw Summary**: Detailed paragraph covering all key terms, obligations, and conditions
            - **Overview Summary**: Concise 2-3 sentence executive summary for quick understanding
            - Focus on what matters to freelancers/creators: payment terms, IP rights, liability, termination
            - Flag unusual or concerning provisions

            ## Response Format
            Return ONLY a JSON object with this exact structure:

            {
            "duration": "5 years",
            "rawSummary": "Detailed comprehensive summary paragraph covering all key contract terms, obligations, payment details, liability provisions, and other critical elements...",
            "jurisdiction": "New York, USA", 
            "effectiveDate": "January 1, 2024",
            "overviewSummary": "Brief 2-3 sentence executive summary highlighting the core purpose and key terms.",
            "overallRiskScore": 65,
            "totalPartiesInvolved": 2,
            "overallConfidenceScore": 87,
            "terminationClasePresent": true
            }

            ## Important Notes
            - Provide realistic risk scores based on actual contract terms
            - Be specific about dates, durations, and jurisdictions when available
            - If information is unclear or missing, note it in summaries
            - Focus on freelancer/creator concerns: payment, IP ownership, scope creep, liability
            - Confidence score should reflect how clear and complete the contract analysis is
        `.trim();

    return prompt;
  }

  private buildUserPrompt(
    contractText: string,
    contractType: CONTRACT_TYPE,
    structuredHTML: string
  ) {
    let prompt = `Analyze this ${contractType} contract and provide a comprehensive summary:\n\n`;

    if (structuredHTML) {
      prompt += `STRUCTURED VERSION (for reference):\n${structuredHTML}\n\n`;
    }

    prompt += `CONTRACT TEXT:\n${contractText}`;

    return prompt;
  }

  private validateScore(score: any, defaultValue: number): number {
    const numScore = typeof score === "number" ? score : parseInt(score);
    return isNaN(numScore) || numScore < 1 || numScore > 100
      ? defaultValue
      : numScore;
  }

  private validateSummary(summary: ISummary): boolean {
    return (
      typeof summary.duration === "string" &&
      Object.values(CONTRACT_TYPE).includes(summary.type) &&
      typeof summary.rawSummary === "string" &&
      summary.rawSummary.length > 50 &&
      typeof summary.jurisdiction === "string" &&
      typeof summary.effectiveDate === "string" &&
      typeof summary.overviewSummary === "string" &&
      summary.overviewSummary.length > 20 &&
      typeof summary.overallRiskScore === "number" &&
      summary.overallRiskScore >= 1 &&
      summary.overallRiskScore <= 100 &&
      typeof summary.totalPartiesInvolved === "number" &&
      summary.totalPartiesInvolved >= 1 &&
      typeof summary.overallConfidenceScore === "number" &&
      summary.overallConfidenceScore >= 1 &&
      summary.overallConfidenceScore <= 100 &&
      typeof summary.terminationClasePresent === "boolean"
    );
  }
}
