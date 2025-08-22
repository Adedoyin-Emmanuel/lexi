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
        max_tokens: 3000,
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
        plainEnglishSummary:
          summaryData.plainEnglishSummary ||
          summaryData.plain_english_summary ||
          "",
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
            Analyze the contract and provide both a comprehensive technical summary AND a plain English translation that anyone can understand.

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
            - **Raw Summary**: Technical/legal summary with precise terms and conditions
            - **Plain English Summary**: Convert ALL legal jargon into everyday language that a non-lawyer can easily understand. Explain what each clause actually means in practical terms. Use analogies and simple examples where helpful.
            - **Overview Summary**: Concise 2-3 sentence executive summary for quick understanding
            - Focus on what matters to freelancers/creators: payment terms, IP rights, liability, termination
            - Flag unusual or concerning provisions

            ### Plain English Translation Rules
            - Replace legal terms with everyday words (e.g., "indemnify" becomes "protect from lawsuits")
            - Explain obligations in terms of real-world actions
            - Use "you" and "they" instead of "party of the first part"
            - Break down complex clauses into simple cause-and-effect statements
            - Highlight potential consequences in plain terms
            - Format as clean, readable HTML with proper structure

            ## Response Format
            Return ONLY a JSON object with this exact structure:

            {
            "duration": "5 years",
            "rawSummary": "Technical summary with legal terminology and precise contract terms...",
            "plainEnglishSummary": "<div class='space-y-3'><div class='mb-4'><h3 class='text-xl font-bold text-gray-900 mb-3'>What This Contract Means</h3><p class='text-gray-700 mb-4'>Here's what this contract means in plain English:</p></div><div class='mb-6'><h4 class='text-lg font-semibold text-gray-800 mb-3'>Key Terms</h4><ul class='space-y-2 list-disc list-inside text-gray-700'><li><span class='font-medium'>What you're agreeing to:</span> [Explanation in simple terms]</li><li><span class='font-medium'>What they're agreeing to:</span> [Explanation in simple terms]</li></ul></div><div class='mb-6'><h4 class='text-lg font-semibold text-gray-800 mb-3'>Important Details</h4><p class='text-gray-700'>[Detailed explanation using everyday language]</p></div><div class='mb-6'><h4 class='text-lg font-semibold text-gray-800 mb-3'>Things to Watch Out For</h4><div class='bg-yellow-50 border-l-4 border-yellow-400 p-4'><p class='text-yellow-800'>[Any concerning clauses explained simply]</p></div></div><div><h4 class='text-lg font-semibold text-gray-800 mb-3'>Bottom Line</h4><p class='text-gray-700 font-medium'>[Summary of what this means for you practically]</p></div></div>",
            "jurisdiction": "New York, USA", 
            "effectiveDate": "January 1, 2024",
            "overviewSummary": "Brief 3-5 sentence executive summary highlighting the core purpose and key terms.",
            "overallRiskScore": 65,
            "totalPartiesInvolved": 2,
            "overallConfidenceScore": 87,
            "terminationClasePresent": true
            }

            ## Important Notes
            - The plain English summary should be formatted as clean, semantic HTML with Tailwind CSS utility classes
            - Use Tailwind classes for styling: spacing (space-y-4, mb-3), typography (text-xl, font-bold), colors (text-gray-700, bg-yellow-50), layout (border-l-4, p-4)
            - Structure content with proper hierarchy: h3 for main heading, h4 for sections
            - Use warning styling for concerning clauses: 'bg-red-50 border-red-400 p-4' with 'text-red-600'
            - Make the HTML content significantly longer and more detailed than the raw summary
            - Use conversational tone in plain English version ("This means..." "In other words..." "Simply put...")
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
    let prompt = `Analyze this ${contractType} contract and provide both a technical summary and a plain English translation:\n\n`;

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
      typeof summary.plainEnglishSummary === "string" &&
      summary.plainEnglishSummary.length > 100 && // Ensure substantial plain English content
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
