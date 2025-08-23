import { Result } from "tsfluent";

import {
  RISK_LEVEL,
  CONTRACT_TYPE,
  IExtractedRisk,
  SUGGESTION_TYPE,
  IExtractedClause,
  NDA_CLAUSE_TYPES,
  ICA_CLAUSE_TYPES,
  IExtractionResult,
  IExtractedObligation,
  LICENSE_CLAUSE_TYPES,
  IExtractedSuggestion,
  ACTIONABLE_OBLIGATION_TYPE,
} from "./types";

import { aiMlApi, logger } from "./../../../../utils";
import { IUserInfo } from "../../../../models/user";

export default class DocumentDetailsExtractor {
  public async extract(
    contract: string,
    contractType: CONTRACT_TYPE,
    structuredHTML: string,
    userInfo?: IUserInfo
  ) {
    try {
      const startTime = Date.now();

      const systemPrompt = this.getExtractionPrompt(contractType, userInfo);
      let userPrompt = this.buildUserPrompt(contract, structuredHTML, userInfo);

      const totalContentLength = systemPrompt.length + userPrompt.length;
      logger(`System prompt length: ${systemPrompt.length}`);
      logger(`User prompt length: ${userPrompt.length}`);
      logger(`Total content length: ${totalContentLength}`);

      if (totalContentLength > 100000) {
        logger(
          `Content too large (${totalContentLength} chars), truncating user prompt`
        );
        userPrompt = userPrompt.substring(0, 50000);
      }

      const aiMlApiResponse = await aiMlApi.chat.completions.create({
        model: "openai/gpt-5-chat-latest",
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: userPrompt },
        ],
        temperature: 0.1,
        max_tokens: 8000,
        response_format: { type: "json_object" },
      });

      const content = aiMlApiResponse.choices[0]?.message?.content;

      if (!content) {
        return Result.fail("No content returned from AI ML API");
      }

      let extractionData: any;
      try {
        extractionData = JSON.parse(content);
      } catch (parseError) {
        return Result.fail("Invalid JSON response from extraction model");
      }

      const extractionResult: IExtractionResult = {
        clauses: this.processClauseArray(extractionData.clauses || []),
        risks: this.processRiskArray(extractionData.risks || []),
        obligations: this.processObligationArray(
          extractionData.obligations || []
        ),
        suggestions: this.processSuggestionArray(
          extractionData.suggestions || []
        ),
        metadata: {
          totalClauses: extractionData.clauses?.length || 0,
          totalRisks: extractionData.risks?.length || 0,
          totalObligations: extractionData.obligations?.length || 0,
          totalSuggestions: extractionData.suggestions?.length || 0,
          overallConfidence: extractionData.overallConfidence || 85,
          processingTime: Date.now() - startTime,
        },
      };

      if (!this.validateExtraction(extractionResult)) {
        return Result.fail("Invalid extraction structure returned by model");
      }

      return Result.ok(extractionResult);
    } catch (error) {
      logger(`Extraction error details: ${JSON.stringify(error, null, 2)}`);
      if (error.status === 400) {
        logger(`400 error - likely content too large or malformed`);
        return Result.fail("Content too large or malformed for AI processing");
      }
      return Result.fail("An error occured during extraction process");
    }
  }

  private getExtractionPrompt(
    contractType: CONTRACT_TYPE,
    userInfo?: IUserInfo
  ) {
    const clauseSchema = this.getClauseSchema(contractType);
    const actionableObligations = this.getActionableObligations(contractType);
    const userContext = userInfo ? this.buildUserContext(userInfo) : "";

    const prompt = `
        You are an expert contract extraction AI for Lexi, specializing in ${contractType} analysis for freelancers and creators.

        ${userContext}

        ## Your Mission
        Perform comprehensive extraction of clauses, risks, obligations, and redline suggestions from the contract with precise indexing and actionable intelligence tailored specifically to the user's profession and expertise areas.

        ## Contract Type: ${contractType}
        Expected clause types for this contract:
        ${clauseSchema}

        ## Actionable Obligations to Identify:
        ${actionableObligations}

        ## Personalization Rules
        ${
          userInfo
            ? this.getPersonalizationRules(userInfo)
            : "- Provide general freelancer/creator focused advice"
        }

        ## Extraction Tasks

        ### 1. CLAUSE EXTRACTION
        For each clause found:
        - Map to standard clause types listed above
        - Extract full verbatim text from contract
        - Provide exact character start/end positions
        - Confidence score (1-100) based on clarity and completeness
        - Include user-friendly description explaining what this clause means for their specific profession and work

        ### 2. RISK IDENTIFICATION
        Identify potential risks across the contract:
        - **High Risk**: Severe penalties, unlimited liability, one-sided terms, unclear obligations
        - **Medium Risk**: Moderate concerns, potentially unfavorable terms, missing protections  
        - **Low Risk**: Minor issues, standard terms that could be improved
        - Focus on concerns specific to the user's profession: payment, IP ownership, liability, scope creep, work control, client relationships
        - Consider industry-specific risks relevant to their specialty areas
        - Provide user-friendly explanations that explain the real-world impact on their business and work

        ### 3. OBLIGATIONS EXTRACTION (Enhanced with Actionable Intelligence)
        Extract actionable items with timelines:
        - Map each obligation to specific actionable types from the list above
        - Include plain English explanations tailored to the user's profession and expertise
        - Specify which clause the obligation comes from
        - Apply abstain logic for low confidence extractions
        - **Confidence < 70**: Set shouldAbstain = true and add uncertainty language
        - Focus on deadlines, payment terms, deliverables, restrictions relevant to their work
        - Use terminology and examples familiar to their profession

        ### 4. REDLINE SUGGESTIONS (Enhanced with Negotiation Intelligence)
        Generate improvement suggestions based on industry standards:
        - Categorize by suggestion type (payment terms, liability, etc.)
        - Assign priority levels (HIGH/MEDIUM/LOW) 
        - Quote exact current text that needs improvement
        - Provide specific suggested replacement text
        - Explain reasoning tied to best practices and fairness for their profession
        - Focus on protecting the user's interests as a ${
          userInfo?.profession || "freelancer/creator"
        }
        - Consider industry-specific best practices for their specialty areas
        - Include user-friendly explanations that help them understand why this change matters for their business

        ## Confidence & Abstain Logic
        - Confidence scores 1-100 for all extractions
        - If confidence < 70 for obligations, set shouldAbstain = true
        - Use phrases like "I'm not completely certain about this - please verify" for abstained items
        - Be honest about uncertainty rather than guessing

        ## CRITICAL: Use ACTUAL Contract Data Only
        **WARNING**: You MUST extract information from the ACTUAL contract provided. DO NOT use example or placeholder values.

        - Extract REAL text snippets from the contract
        - Use ACTUAL character positions from the contract text
        - Find REAL dates, names, amounts, and terms from the document
        - If information doesn't exist in the contract, omit it or mark as "Not specified"
        - DO NOT use generic examples like "Payment Terms", "30 days", "$X", etc.

        ## Response Format
        Return ONLY a JSON object with ACTUAL extracted data from the contract:

        {
        "clauses": [
            {
            "title": "[ACTUAL clause title from contract]",
            "fullText": "[ACTUAL verbatim text from the contract - not examples]",
            "startIndex": [ACTUAL character position where this text starts],
            "endIndex": [ACTUAL character position where this text ends],
            "confidenceScore": [ACTUAL confidence score 1-100],
            "userFriendlyDescription": "[ACTUAL description based on real contract content]"
            }
        ],
        "risks": [
            {
            "title": "[ACTUAL risk identified in the real contract]", 
            "description": "[ACTUAL description of risk found in contract]",
            "confidenceScore": [ACTUAL confidence score 1-100],
            "riskLevel": "[High/Medium/Low based on actual contract content]",
            "startIndex": [ACTUAL character position],
            "endIndex": [ACTUAL character position],
            "userFriendlyExplanation": "[ACTUAL explanation of real risk impact]"
            }
        ],
        "obligations": [
            {
            "title": "[ACTUAL obligation title from contract]",
            "description": "[ACTUAL obligation description from contract]",
            "confidenceScore": [ACTUAL confidence score 1-100],
            "dueDate": "[ACTUAL due date from contract or null if not specified]",
            "startIndex": [ACTUAL character position],
            "endIndex": [ACTUAL character position],
            "actionableType": "[ACTUAL type from predefined list]",
            "clauseSource": "[ACTUAL source clause from contract]",
            "shouldAbstain": [true/false based on actual confidence],
            "userFriendlyExplanation": "[ACTUAL explanation based on real contract content]"
            }
        ],
        "suggestions": [
            {
            "title": "[ACTUAL suggestion title for real contract issue]",
            "currentStatement": "[ACTUAL text from contract that needs improvement]",
            "suggestedStatement": "[ACTUAL suggested replacement text]",
            "reason": "[ACTUAL reasoning based on real contract analysis]",
            "confidenceScore": [ACTUAL confidence score 1-100],
            "startIndex": [ACTUAL character position],
            "endIndex": [ACTUAL character position],
            "suggestionType": "[ACTUAL type from predefined list]",
            "priority": "[HIGH/MEDIUM/LOW based on actual impact]",
            "userFriendlyExplanation": "[ACTUAL explanation of why this matters for real contract]"
            }
        ],
        "overallConfidence": [ACTUAL overall confidence score 1-100]
        }

        ## Critical Instructions
        - READ the entire contract text carefully before extracting
        - Character positions must be EXACT for span-linked highlighting
        - Quote text VERBATIM from the original contract - no paraphrasing
        - Be thorough but honest about confidence levels
        - Focus on practical concerns specific to the user's profession and expertise
        - Provide actionable, specific suggestions with clear priorities relevant to their work
        - Use abstain logic - better to say "uncertain" than be wrong
        - Map obligations to actionable types for better UX
        - Tailor all explanations and suggestions to their professional context
        - Use language and examples that resonate with their industry and specialty areas
        - Address the user directly using "you" and "your" in explanations
        - Reference their specific profession and specialties when relevant
        - Explain the real-world business impact of each clause, risk, obligation, and suggestion
        - NEVER use placeholder or example data - everything must come from the actual contract
        `.trim();

    return prompt;
  }

  private getPersonalizationRules(userInfo: IUserInfo): string {
    const rules = [
      `- Address ${userInfo.name} directly in explanations and suggestions`,
      `- Focus on risks and benefits specific to ${userInfo.profession}s`,
      `- Personalize clause descriptions to explain relevance to ${userInfo.profession} work`,
      `- Frame risk explanations in terms of impact on ${userInfo.profession} business`,
      `- Make obligation explanations actionable for ${userInfo.profession} workflow`,
      `- Tailor suggestion reasoning to ${userInfo.profession} industry standards`,
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
      rules.push(
        `- Reference ${userInfo.specialities.join(
          " and "
        )} best practices in explanations`
      );
    }

    if (userInfo.profession === "freelancer") {
      rules.push(
        "- Emphasize payment terms, scope creep protection, and client relationship clauses"
      );
      rules.push(
        "- Focus on work delivery obligations and timeline flexibility"
      );
      rules.push(
        "- Explain how clauses impact freelance business operations and cash flow"
      );
    } else if (userInfo.profession === "creator") {
      rules.push(
        "- Emphasize intellectual property rights, content usage, and creative control"
      );
      rules.push(
        "- Focus on attribution, licensing terms, and creative freedom limitations"
      );
      rules.push(
        "- Explain how clauses impact creative work, content ownership, and brand building"
      );
    }

    return rules.join("\n");
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
- Use examples and terminology relevant to ${
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

  private buildUserPrompt(
    contractText: string,
    structuredHTML?: string,
    userInfo?: IUserInfo
  ) {
    let prompt = `**CRITICAL**: Extract information from the ACTUAL contract below. Do NOT use example values.

Extract all clauses, risks, obligations, and suggestions from this contract`;

    if (userInfo) {
      const specialitiesText =
        userInfo.specialities.length > 0
          ? ` specializing in ${userInfo.specialities.join(", ")}`
          : "";
      prompt += ` for ${userInfo.name}, a ${userInfo.profession}${specialitiesText}`;
    }

    prompt += `:\n\n`;

    if (structuredHTML) {
      prompt += `STRUCTURED VERSION (for reference):\n${structuredHTML}\n\n`;
    }

    prompt += `ACTUAL CONTRACT TEXT TO ANALYZE:\n${contractText}\n\n`;
    prompt += `**REMINDER**: All extracted data must come from the above contract text. Use exact character positions and verbatim quotes.`;

    return prompt;
  }

  private getClauseSchema(contractType: CONTRACT_TYPE) {
    switch (contractType) {
      case CONTRACT_TYPE.ICA:
        return Object.values(ICA_CLAUSE_TYPES)
          .map((clause, i) => `${i + 1}. ${clause}`)
          .join("\n");
      case CONTRACT_TYPE.NDA:
        return Object.values(NDA_CLAUSE_TYPES)
          .map((clause, i) => `${i + 1}. ${clause}`)
          .join("\n");
      case CONTRACT_TYPE.LICENSE_AGREEMENT:
        return Object.values(LICENSE_CLAUSE_TYPES)
          .map((clause, i) => `${i + 1}. ${clause}`)
          .join("\n");
      default:
        return "";
    }
  }

  private getActionableObligations(contractType: CONTRACT_TYPE) {
    switch (contractType) {
      case CONTRACT_TYPE.ICA:
        return `
            **ICA Actionable Obligation Types to Look For:**
            - Payment Deadline: When payments are due
            - Deliverable Deadline: When work must be completed
            - Contract End Date: When the contract expires
            - Renewal Notice Required: Deadline for renewal decisions
            - Termination Notice Period: Required notice for termination
            - IP Transfer Required: When intellectual property must be transferred

            **Important**: Map actual obligations found in the contract to these types.
        `.trim();

      case CONTRACT_TYPE.NDA:
        return `
            **NDA Actionable Obligation Types to Look For:**
            - Confidentiality Expiration: When confidentiality obligations end
            - Return/Destroy Information: When confidential materials must be returned
            - Disclosure Restrictions: Rules about sharing information
            - Third Party Consent Required: When consent is needed for sharing
            - Non-Solicitation Period End: When non-solicitation restrictions end

            **Important**: Map actual obligations found in the contract to these types.
        `.trim();

      case CONTRACT_TYPE.LICENSE_AGREEMENT:
        return `
            **License Agreement Actionable Obligation Types to Look For:**
            - License Validity Period: When license starts and ends
            - Royalty Payment Due: When royalty payments are required
            - Usage/Territory Restrictions: Limitations on usage or geography
            - Approval/Quality Check Required: When approvals are needed
            - Reporting Due: When usage reports must be submitted

            **Important**: Map actual obligations found in the contract to these types.
        `.trim();
    }
  }

  private processClauseArray(clauses: any[]): IExtractedClause[] {
    return clauses.map((clause) => ({
      title: clause.title || "",
      fullText: clause.fullText || clause.full_text || "",
      startIndex: clause.startIndex || clause.start_index || 0,
      endIndex: clause.endIndex || clause.end_index || 0,
      confidenceScore: this.validateScore(
        clause.confidenceScore || clause.confidence_score
      ),
    }));
  }

  private processRiskArray(risks: any[]): IExtractedRisk[] {
    return risks.map((risk) => ({
      title: risk.title || "",
      description: risk.description || "",
      confidenceScore: this.validateScore(
        risk.confidenceScore || risk.confidence_score
      ),
      riskLevel: this.validateRiskLevel(risk.riskLevel || risk.risk_level),
      startIndex: risk.startIndex || risk.start_index || 0,
      endIndex: risk.endIndex || risk.end_index || 0,
    }));
  }

  private processObligationArray(obligations: any[]): IExtractedObligation[] {
    return obligations.map((obligation) => ({
      title: obligation.title || "",
      description: obligation.description || "",
      confidenceScore: this.validateScore(
        obligation.confidenceScore || obligation.confidence_score
      ),
      dueDate: obligation.dueDate || obligation.due_date,
      startIndex: obligation.startIndex || obligation.start_index || 0,
      endIndex: obligation.endIndex || obligation.end_index || 0,
      actionableType: this.validateActionableType(
        obligation.actionableType || obligation.actionable_type
      ),
      clauseSource:
        obligation.clauseSource || obligation.clause_source || "Unknown",
      shouldAbstain:
        obligation.shouldAbstain || obligation.should_abstain || false,
      userFriendlyExplanation:
        obligation.userFriendlyExplanation ||
        obligation.user_friendly_explanation ||
        "",
    }));
  }

  private processSuggestionArray(suggestions: any[]): IExtractedSuggestion[] {
    return suggestions.map((suggestion) => ({
      title: suggestion.title || "",
      currentStatement:
        suggestion.currentStatement || suggestion.current_statement || "",
      suggestedStatement:
        suggestion.suggestedStatement || suggestion.suggested_statement || "",
      reason: suggestion.reason || "",
      confidenceScore: this.validateScore(
        suggestion.confidenceScore || suggestion.confidence_score
      ),
      startIndex: suggestion.startIndex || suggestion.start_index || 0,
      endIndex: suggestion.endIndex || suggestion.end_index || 0,
      suggestionType: this.validateSuggestionType(
        suggestion.suggestionType || suggestion.suggestion_type
      ),
      priority: this.validatePriority(suggestion.priority),
    }));
  }

  private validateScore(score: any): number {
    const numScore = typeof score === "number" ? score : parseInt(score);
    return isNaN(numScore) || numScore < 1 || numScore > 100 ? 80 : numScore;
  }

  private validateRiskLevel(level: any): RISK_LEVEL {
    return Object.values(RISK_LEVEL).includes(level)
      ? level
      : RISK_LEVEL.MEDIUM;
  }

  private validateActionableType(type: any): ACTIONABLE_OBLIGATION_TYPE {
    return Object.values(ACTIONABLE_OBLIGATION_TYPE).includes(type)
      ? type
      : ACTIONABLE_OBLIGATION_TYPE.OTHER;
  }

  private validateSuggestionType(type: any): SUGGESTION_TYPE {
    return Object.values(SUGGESTION_TYPE).includes(type)
      ? type
      : SUGGESTION_TYPE.GENERAL_IMPROVEMENT;
  }

  private validatePriority(priority: any): "HIGH" | "MEDIUM" | "LOW" {
    return ["HIGH", "MEDIUM", "LOW"].includes(priority) ? priority : "MEDIUM";
  }

  private validateExtraction(result: IExtractionResult): boolean {
    return (
      Array.isArray(result.clauses) &&
      Array.isArray(result.risks) &&
      Array.isArray(result.obligations) &&
      Array.isArray(result.suggestions) &&
      result.metadata &&
      typeof result.metadata.overallConfidence === "number"
    );
  }
}
