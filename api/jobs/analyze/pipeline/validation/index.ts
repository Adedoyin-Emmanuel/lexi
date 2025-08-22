import { Result } from "tsfluent";

import { IValidationResult } from "./types";
import { aiMlApi, logger } from "../../../../utils";

export default class DocumentValidator {
  private readonly MAX_CONTENT_LENGTH = 70000;
  public async validate(contract: string) {
    try {
      if (!contract) {
        return Result.fail("Contract is required");
      }

      if (contract.length > this.MAX_CONTENT_LENGTH) {
        return Result.fail("Contract is too long");
      }

      const prompt = this.getValidationPrompt();
      const response = await aiMlApi.chat.completions.create({
        model: "gpt-4o-mini",
        messages: [
          {
            role: "system",
            content: prompt,
          },

          {
            role: "user",
            content: `Please validate this contract: \n\n${contract}`,
          },
        ],
        temperature: 0.1,
        max_tokens: 500,
        response_format: {
          type: "json_object",
        },
      });

      const content = response.choices[0].message?.content;

      if (!content) {
        return Result.fail("No response from validation model");
      }

      let aiMlApiResponse: any;

      try {
        aiMlApiResponse = JSON.parse(content);
      } catch (error) {
        return Result.fail("Failed to validate contract");
      }

      const validationResult: IValidationResult = {
        reason: aiMlApiResponse.reason,
        inScope: aiMlApiResponse.in_scope,
        contractType: aiMlApiResponse.contract_type,
        confidenceScore: aiMlApiResponse.confidence_score,
        isValidContract: aiMlApiResponse.is_valid_contract,
      };

      return this.validateValidationModelResponse(validationResult);
    } catch (error) {
      logger.error(error);
      return Result.fail("Invalid JSON response from validation model");
    }
  }

  private validateValidationModelResponse(result: IValidationResult) {
    const isValidResponse =
      typeof result.isValidContract === "boolean" &&
      typeof result.inScope === "boolean" &&
      typeof result.contractType === "string" &&
      typeof result.confidenceScore === "number" &&
      typeof result.reason === "string" &&
      result.confidenceScore >= 1 &&
      result.confidenceScore <= 100;

    if (!isValidResponse) {
      return Result.fail("Invalid response structure from validation model");
    }

    return Result.ok(result);
  }

  private getValidationPrompt() {
    const prompt = `
        You are a contract validation assistant for Lexi, an AI-powered contract analysis tool for freelancers and creators.


        ## Your Task
        Analyze the provided document and determine:
        1. Is this a valid legal contract?
        2. If valid, is it one of our 3 supported contract types?
        3. Provide confidence score and reasoning

        ## Supported Contract Types

        **NDA (Non-Disclosure Agreement)**
        - Purpose: Protects confidential information sharing
        - Key indicators: Confidentiality clauses, information protection terms, disclosure restrictions

        **ICA (Independent Contractor Agreement)** 
        - Purpose: Freelancer/contractor work arrangement
        - Key indicators: Work scope, payment terms, deliverables, contractor relationship (not employee)

        **License Agreement**
        - Purpose: Intellectual property usage rights
        - Key indicators: Grant of rights, usage permissions, royalty terms, IP licensing

        ## What to REJECT (Out of Scope)
        - Employment agreements (full-time employee relationships)
        - Partnership agreements
        - Lease agreements  
        - Purchase agreements
        - Service agreements (unless clearly contractor/freelance work)
        - Any non-contract documents

        ## Response Format
        Always respond with valid JSON:

        {
        "is_valid_contract": boolean,
        "in_scope": boolean,
        "contract_type": "NDA" | "ICA" | "License Agreement" | "Other",
        "confidence_score": number (1-100),
        "reason": "Brief explanation of classification decision"
        }

        ## Guidelines
        - Be conservative: If unsure between contract types, choose the most likely fit
        - High confidence (80-100) for clear, unambiguous contracts
        - Medium confidence (50-79) for contracts with mixed or unclear language
        - Low confidence (1-49) for ambiguous documents or edge cases
        - Focus on core purpose and key clauses, not just keywords
        - Consider the freelancer/creator context when evaluating contractor vs employment relationships
        `.trim();

    return prompt;
  }
}
