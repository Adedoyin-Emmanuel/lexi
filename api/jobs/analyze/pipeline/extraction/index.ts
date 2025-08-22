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

export default class DocumentDetailsExtractor {
  public async extract(
    contract: string,
    contractType: CONTRACT_TYPE,
    structuredHTML: string
  ) {
    try {
      const startTime = Date.now();

      const systemPrompt = this.getExtractionPrompt(contractType);
      let userPrompt = this.buildUserPrompt(contract, structuredHTML);

      // Add debugging for content length
      const totalContentLength = systemPrompt.length + userPrompt.length;
      logger(`System prompt length: ${systemPrompt.length}`);
      logger(`User prompt length: ${userPrompt.length}`);
      logger(`Total content length: ${totalContentLength}`);

      // Check if content is too large (OpenAI has limits)
      if (totalContentLength > 100000) {
        logger(
          `Content too large (${totalContentLength} chars), truncating user prompt`
        );
        userPrompt = userPrompt.substring(0, 50000); // Truncate to reasonable size
      }

      const aiMlApiResponse = await aiMlApi.chat.completions.create({
        model: "gpt-4o-mini", // Use a more reliable model
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

  private getExtractionPrompt(contractType: CONTRACT_TYPE) {
    const clauseSchema = this.getClauseSchema(contractType);
    const actionableObligations = this.getActionableObligations(contractType);

    const prompt = `
        You are an expert contract extraction AI for Lexi, specializing in ${contractType} analysis for freelancers and creators.

        ## Your Mission
        Perform comprehensive extraction of clauses, risks, obligations, and redline suggestions from the contract with precise indexing and actionable intelligence.

        ## Contract Type: ${contractType}
        Expected clause types for this contract:
        ${clauseSchema}

        ## Actionable Obligations to Identify:
        ${actionableObligations}

        ## Extraction Tasks

        ### 1. CLAUSE EXTRACTION
        For each clause found:
        - Map to standard clause types listed above
        - Extract full verbatim text from contract
        - Provide exact character start/end positions
        - Confidence score (1-100) based on clarity and completeness

        ### 2. RISK IDENTIFICATION
        Identify potential risks across the contract:
        - **High Risk**: Severe penalties, unlimited liability, one-sided terms, unclear obligations
        - **Medium Risk**: Moderate concerns, potentially unfavorable terms, missing protections  
        - **Low Risk**: Minor issues, standard terms that could be improved
        - Focus on freelancer/creator concerns: payment, IP ownership, liability, scope creep

        ### 3. OBLIGATIONS EXTRACTION (Enhanced with Actionable Intelligence)
        Extract actionable items with timelines:
        - Map each obligation to specific actionable types from the list above
        - Include plain English explanations for users
        - Specify which clause the obligation comes from
        - Apply abstain logic for low confidence extractions
        - **Confidence < 70**: Set shouldAbstain = true and add uncertainty language
        - Focus on deadlines, payment terms, deliverables, restrictions

        ### 4. REDLINE SUGGESTIONS (Enhanced with Negotiation Intelligence)
        Generate improvement suggestions based on industry standards:
        - Categorize by suggestion type (payment terms, liability, etc.)
        - Assign priority levels (HIGH/MEDIUM/LOW) 
        - Quote exact current text that needs improvement
        - Provide specific suggested replacement text
        - Explain reasoning tied to best practices and fairness
        - Focus on protecting freelancer/creator interests

        ## Confidence & Abstain Logic
        - Confidence scores 1-100 for all extractions
        - If confidence < 70 for obligations, set shouldAbstain = true
        - Use phrases like "I'm not completely certain about this - please verify" for abstained items
        - Be honest about uncertainty rather than guessing

        ## Response Format
        Return ONLY a JSON object with this exact structure:

        {
        "clauses": [
            {
            "title": "Payment Terms",
            "fullText": "Payment shall be made within 30 days of invoice receipt...",
            "startIndex": 1250,
            "endIndex": 1425,
            "confidenceScore": 92
            }
        ],
        "risks": [
            {
            "title": "Unlimited Liability Risk", 
            "description": "Contract includes unlimited liability clause that could expose freelancer to excessive damages",
            "confidenceScore": 88,
            "riskLevel": "High",
            "startIndex": 2100,
            "endIndex": 2280
            }
        ],
        "obligations": [
            {
            "title": "Invoice Submission",
            "description": "Submit invoices monthly by the 5th of each month",
            "confidenceScore": 95,
            "dueDate": "5th of each month",
            "startIndex": 1800,
            "endIndex": 1950,
            "actionableType": "Payment Deadline",
            "clauseSource": "Payment Terms",
            "shouldAbstain": false,
            "userFriendlyExplanation": "You need to send invoices by the 5th of each month to get paid on time"
            }
        ],
        "suggestions": [
            {
            "title": "Add Payment Timeline Protection",
            "currentStatement": "Payment when convenient",
            "suggestedStatement": "Payment shall be made within 30 days of invoice receipt",
            "reason": "Protects cash flow and sets clear expectations per industry standards",
            "confidenceScore": 90,
            "startIndex": 1200,
            "endIndex": 1250,
            "suggestionType": "Payment Terms",
            "priority": "HIGH"
            }
        ],
        "overallConfidence": 87
        }

        ## Critical Instructions
        - Character positions must be exact for span-linked highlighting
        - Quote text verbatim from the original contract
        - Be thorough but honest about confidence levels
        - Focus on practical freelancer/creator concerns
        - Provide actionable, specific suggestions with clear priorities
        - Use abstain logic - better to say "uncertain" than be wrong
        - Map obligations to actionable types for better UX
        `.trim();

    return prompt;
  }

  private buildUserPrompt(contractText: string, structuredHTML?: string) {
    let prompt = `Extract all clauses, risks, obligations, and suggestions from this contract:\n\n`;

    if (structuredHTML) {
      prompt += `STRUCTURED VERSION (for reference):\n${structuredHTML}\n\n`;
    }

    prompt += `CONTRACT TEXT:\n${contractText}`;

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
            **ICA Actionable Obligations:**
            - Payment Deadline: "Payment due: $X by [date]"
            - Deliverable Deadline: "Draft submission due: [date]" 
            - Contract End Date: "Contract ends on [date]"
            - Renewal Notice Required: "Consider renewal notice before [date]"
            - Termination Notice Period: "Termination notice must be given by [date]"
            - IP Transfer Required: "Deliverable IP transfer due upon project completion"
        `.trim();

      case CONTRACT_TYPE.NDA:
        return `
            **NDA Actionable Obligations:**
            - Confidentiality Expiration: "Confidentiality obligation ends on [date]"
            - Return/Destroy Information: "Return confidential documents within 30 days of termination"
            - Disclosure Restrictions: "Only share info under defined conditions"
            - Third Party Consent Required: "Get consent before sharing with third parties"  
            - Non-Solicitation Period End: "Cannot contact client employees until [date]"
        `.trim();

      case CONTRACT_TYPE.LICENSE_AGREEMENT:
        return `
            **License Agreement Actionable Obligations:**
            - License Validity Period: "License valid from [start date] to [end date]"
            - Royalty Payment Due: "Royalty payment due on [date]"
            - Usage/Territory Restrictions: "Do not distribute outside approved region"
            - Approval/Quality Check Required: "Submit product for approval by [date]"
            - Reporting Due: "Usage report due by [date]"
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
