import { Result } from "tsfluent";

import {
  ISummary,
  CONTRACT_TYPE,
} from "../../../../models/document/interfaces";
import { aiMlApi, logger } from "../../../../utils";
import { IUserInfo } from "../../../../models/user";

export default class DocumentSummarizer {
  public async summarize(
    contract: string,
    contractType: CONTRACT_TYPE,
    structuredHTML: string,
    userInfo: IUserInfo
  ) {
    try {
      if (!contract) {
        return Result.fail("Contract is required");
      }

      const systemPrompt = this.getSummarizePrompt();
      const userPrompt = this.buildUserPrompt(
        contract,
        contractType,
        structuredHTML,
        userInfo
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
        overallRiskScore:
          summaryData.overallRiskScore || summaryData.overall_risk_score,
        totalPartiesInvolved:
          summaryData.totalPartiesInvolved ||
          summaryData.total_parties_involved ||
          2,
        overallConfidenceScore:
          summaryData.overallConfidenceScore ||
          summaryData.overall_confidence_score,

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

  private buildUserContext(userInfo: IUserInfo): string {
    const specialitiesText =
      userInfo.specialities.length > 0
        ? `specializing in ${userInfo.specialities.join(", ")}`
        : "";

    return `
## User Profile
You are providing this analysis for ${userInfo.name}, a ${
      userInfo.profession
    } ${specialitiesText}.

## Personalization Focus
- Tailor your analysis to the specific needs and concerns of a ${
      userInfo.profession
    }
- Use examples and analogies relevant to ${
      userInfo.specialities.length > 0
        ? userInfo.specialities.join(" and ")
        : "their field"
    }
- Highlight contract terms that specifically impact ${userInfo.profession}s
- Address common risks and opportunities in ${
      userInfo.specialities.length > 0
        ? "their specialty areas"
        : "their profession"
    }
    `;
  }

  private getSummarizePrompt(userInfo?: IUserInfo) {
    const userContext = userInfo
      ? this.buildUserContext(userInfo)
      : "You are analyzing this contract for a freelancer/creator.";

    const prompt = `
             You are a legal contract analysis expert for Lexi, specializing in contract summaries for freelancers and creators.

            ${userContext}

            ## Your Task
            Analyze the contract and provide both a comprehensive technical summary AND a personalized plain English translation tailored specifically to the user's profession and expertise areas.

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
            - **Plain English Summary**: Convert ALL legal jargon into everyday language specifically tailored to the user's profession and expertise. Use industry-specific examples and analogies relevant to their work. Address concerns specific to their field.
            - **Overview Summary**: Concise 2-3 sentence executive summary for quick understanding
            - Focus on what matters to this specific user based on their profession and specialties
            - Flag provisions that could impact their particular type of work
            - Use personalized language and examples from their field

            ### Personalization Rules
            ${
              userInfo
                ? this.getPersonalizationRules(userInfo)
                : "- Provide general freelancer/creator focused advice"
            }

            ### Plain English Translation Rules
            - Replace legal terms with everyday words (e.g., "indemnify" becomes "protect from lawsuits")
            - Explain obligations in terms of real-world actions relevant to the user's work
            - Use "you" and "they" instead of "party of the first part"
            - Break down complex clauses into simple cause-and-effect statements
            - Highlight potential consequences specific to the user's profession
            - Use industry-specific examples and analogies
            - Format as clean, readable HTML with proper structure

            ## Response Format
            **CRITICAL**: You MUST analyze the ACTUAL contract provided and extract REAL values. Do NOT use placeholder or example values.

            Return ONLY a JSON object with this exact structure using ACTUAL values from the contract:

            {
              "duration": "[Extract the ACTUAL duration from the contract - could be specific dates, number of years, 'ongoing', 'indefinite', 'upon completion', etc.]",
              "rawSummary": "[Write an ACTUAL technical summary based on the real contract content with legal terminology and precise contract terms]",
              "plainEnglishSummary": "[Create ACTUAL personalized HTML content based on the real contract, formatted as shown in the template but with real content specific to this user and contract]",
              "jurisdiction": "[Extract the ACTUAL governing law/jurisdiction from the contract]", 
              "effectiveDate": "[Extract the ACTUAL effective date from the contract]",
              "overviewSummary": "[Write an ACTUAL brief executive summary highlighting the real contract's core purpose and key terms relevant to the user's work]",
              "overallRiskScore": [Assign an ACTUAL numeric score 1-100 based on your analysis of the real contract],
              "totalPartiesInvolved": [Count the ACTUAL number of parties in the real contract],
              "overallConfidenceScore": [Assign an ACTUAL confidence score 1-100 based on contract clarity and your analysis certainty],
              "terminationClasePresent": [true/false - based on whether termination clauses actually exist in this contract]
            }

            ## Plain English Summary Template Structure
            Use this HTML structure but fill with ACTUAL content from the contract:

            <div class='space-y-3'>
              <div class='mb-4'>
                <h3 class='text-xl font-bold text-gray-900 mb-3'>What This Contract Means for You</h3>
                <p class='text-gray-700 mb-4'>[Actual personalized introduction based on user's profession and the real contract]</p>
              </div>
              <div class='mb-6'>
                <h4 class='text-lg font-semibold text-gray-800 mb-3'>Key Terms for Your Work</h4>
                <ul class='space-y-2 list-disc list-inside text-gray-700'>
                  <li><span class='font-medium'>What you're agreeing to:</span> [Real obligations from the contract]</li>
                  <li><span class='font-medium'>What they're agreeing to:</span> [Real obligations from the contract]</li>
                </ul>
              </div>
              <div class='mb-6'>
                <h4 class='text-lg font-semibold text-gray-800 mb-3'>How This Affects Your [User's Specialty] Work</h4>
                <p class='text-gray-700'>[Real analysis of contract impact on user's specific work]</p>
              </div>
              <div class='mb-6'>
                <h4 class='text-lg font-semibold text-gray-800 mb-3'>Red Flags for [User's Profession]s</h4>
                <div class='bg-red-50 border-red-400 p-4'>
                  <p class='text-red-600'>[Real concerning clauses from the actual contract]</p>
                </div>
              </div>
              <div>
                <h4 class='text-lg font-semibold text-gray-800 mb-3'>Bottom Line for You</h4>
                <p class='text-gray-700 font-medium'>[Real personalized summary of actual contract implications]</p>
              </div>
            </div>

            ## Important Reminders
            - READ and ANALYZE the actual contract document provided
            - Extract REAL values, dates, terms, and conditions from the contract text
            - DO NOT use example values like "5 years", "New York, USA", "January 1, 2024"
            - If information is not present in the contract, use "Not specified" or "Not found"
            - Tailor all explanations to the user's specific profession and expertise areas
            - Use industry terminology they would understand while keeping explanations clear
            - Highlight risks and benefits most relevant to their type of work
            - Provide actionable advice specific to their field
            - The plain English summary should be significantly longer and more detailed than the raw summary
            - Use conversational, personalized tone ("As a [profession]..." "In your line of work..." "For someone with your expertise...")
            - Focus on profession-specific concerns: IP ownership, work scope, client relationships, payment terms, etc.
        `.trim();

    return prompt;
  }

  private getPersonalizationRules(userInfo: IUserInfo): string {
    const rules = [
      `- Address ${userInfo.name} directly in the plain English summary`,
      `- Focus on risks and benefits specific to ${userInfo.profession}s`,
    ];

    if (userInfo.specialities.length > 0) {
      rules.push(
        `- Use examples and terminology relevant to ${userInfo.specialities.join(
          ", "
        )}`
      );
      rules.push(
        `- Highlight how contract terms affect work in ${userInfo.specialities.join(
          " and "
        )}`
      );
    }

    if (userInfo.profession === "freelancer") {
      rules.push(
        "- Emphasize payment terms, scope creep protection, and client relationship clauses"
      );
      rules.push(
        "- Focus on work delivery obligations and timeline flexibility"
      );
    } else if (userInfo.profession === "creator") {
      rules.push(
        "- Emphasize intellectual property rights, content usage, and creative control"
      );
      rules.push(
        "- Focus on attribution, licensing terms, and creative freedom limitations"
      );
    }

    return rules.join("\n            ");
  }

  private buildUserPrompt(
    contractText: string,
    contractType: CONTRACT_TYPE,
    structuredHTML: string,
    userInfo?: IUserInfo
  ) {
    let prompt = `Analyze this ${contractType} contract`;

    logger(userInfo);

    if (userInfo) {
      const specialitiesText =
        userInfo.specialities.length > 0
          ? ` specializing in ${userInfo.specialities.join(", ")}`
          : "";
      prompt += ` for ${userInfo.name}, a ${userInfo.profession}${specialitiesText}`;
    }

    prompt += ` and provide both a technical summary and a personalized plain English translation:\n\n`;

    if (structuredHTML) {
      prompt += `STRUCTURED VERSION (for reference):\n${structuredHTML}\n\n`;
    }

    prompt += `CONTRACT TEXT:\n${contractText}`;

    return prompt;
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
