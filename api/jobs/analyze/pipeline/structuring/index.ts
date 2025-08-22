import { Types } from "mongoose";
import { Result } from "tsfluent";

import { IStructuredContract } from "./types";
import { aiMlApi, logger } from "../../../../utils";
import { redisService } from "../../../../services/redis";

export default class DocumentStructurer {
  public async structure(documentId: Types.ObjectId) {
    try {
      const documentContent = await redisService.get(`document:${documentId}`);
      if (!documentContent) {
        return Result.fail("Document content not found");
      }

      const content = documentContent as string;
      const prompt = this.getStructurePrompt();

      logger(
        `Sending document to AI for structuring... Content length: ${content.length}`
      );
      const startTime = Date.now();

      const response = await aiMlApi.chat.completions.create({
        model: "gpt-4o-mini",
        messages: [
          { role: "system", content: prompt },
          { role: "user", content: content },
        ],
        temperature: 0.1,
        max_tokens: 8000,
        response_format: { type: "json_object" },
      });

      const endTime = Date.now();

      logger(`AI response received in ${endTime - startTime}ms`);

      const aiContent = response.choices[0]?.message?.content;

      if (!aiContent) {
        return Result.fail("No response from structuring model");
      }

      logger(`AI Response received: ${aiContent.substring(0, 200)}...`);

      let aiMlApiResponse: any;

      try {
        const cleanContent = this.cleanJsonResponse(aiContent);
        aiMlApiResponse = JSON.parse(cleanContent);
        logger(`Successfully parsed AI response`);
      } catch (error) {
        logger(`Failed to parse AI response: ${error}`);
        logger(`Raw content: ${aiContent}`);
        return Result.fail("Failed to parse response from structuring model");
      }

      if (!this.isValidAIResponse(aiMlApiResponse)) {
        logger(`Invalid AI response structure`);
        return Result.fail("Invalid response structure from AI");
      }

      const structuredContract: IStructuredContract = {
        html: aiMlApiResponse.html,
        tokens: aiMlApiResponse.tokens,
        metadata: aiMlApiResponse.metadata,
      };

      logger(`Created structured contract object`);
      logger(`HTML length: ${structuredContract.html?.length || 0}`);
      logger(`Tokens count: ${structuredContract.tokens?.length || 0}`);
      logger(`Metadata: ${JSON.stringify(structuredContract.metadata)}`);

      const isValidStructure = this.validateStructure(structuredContract);

      if (!isValidStructure) {
        logger(`Structure validation failed for document ${documentId}`);
        this.logValidationDetails(structuredContract);
        return Result.fail("Invalid structure from structuring model");
      }

      logger(`Structure validation passed for document ${documentId}`);
      return Result.ok(structuredContract);
    } catch (error) {
      logger(`Error in structure method: ${error}`);
      return Result.fail("Failed to structure contract");
    }
  }

  private cleanJsonResponse(response: string): string {
    return response
      .replace(/```json\s*/g, "")
      .replace(/```\s*/g, "")
      .trim();
  }

  private isValidAIResponse(response: any): boolean {
    return (
      response &&
      typeof response.html === "string" &&
      Array.isArray(response.tokens) &&
      response.metadata &&
      typeof response.metadata === "object"
    );
  }

  private logValidationDetails(result: IStructuredContract): void {
    logger(`=== VALIDATION DETAILS ===`);
    logger(`HTML present: ${!!result.html}`);
    logger(`HTML length: ${result.html?.length || 0}`);
    logger(`Tokens array: ${Array.isArray(result.tokens)}`);
    logger(`Tokens count: ${result.tokens?.length || 0}`);
    logger(`Metadata present: ${!!result.metadata}`);

    if (result.tokens && result.tokens.length > 0) {
      const firstToken = result.tokens[0];
      logger(`First token structure: ${JSON.stringify(firstToken)}`);

      const invalidTokens = result.tokens.filter(
        (token) =>
          typeof token.start !== "number" ||
          typeof token.end !== "number" ||
          typeof token.text !== "string" ||
          typeof token.elementId !== "string" ||
          !["p", "h1", "h2", "h3", "li", "span", "ul", "ol"].includes(
            token.elementType
          )
      );

      if (invalidTokens.length > 0) {
        logger(`Invalid tokens found: ${invalidTokens.length}`);
        logger(`First invalid token: ${JSON.stringify(invalidTokens[0])}`);
      }
    }
  }

  private getStructurePrompt() {
    const prompt = `
      You are a contract lexical formatting specialist. Convert contract text into structured HTML with token indexing.

      ## CRITICAL REQUIREMENTS
      1. Return ONLY valid JSON - no extra text, markdown, or explanations
      2. All character positions must be accurate
      3. Preserve ALL original text content
      4. Use simple, clean HTML structure

      ## HTML Elements Allowed
      - <h1>, <h2>, <h3> for headings
      - <p> for paragraphs
      - <ul>, <ol> for lists
      - <li> for list items

      ## Token Structure
      Each token must have:
      - "start": number (character position)
      - "end": number (character position) 
      - "text": string (exact text content)
      - "elementType": string (h1, h2, h3, p, li, ul, ol)
      - "elementId": string (element-N format)

      ## Pattern Recognition
      - HEADINGS: "ARTICLE 1", "SECTION A", numbered items like "1.", "1.1", "(a)"
      - LISTS: Multiple items with bullets, dashes, or numbers
      - PARAGRAPHS: Regular contract text blocks

      ## Response Format (EXACT JSON):
      {
        "html": "<h1 id=\"element-1\" data-start=\"0\" data-end=\"25\">Contract Title</h1><p id=\"element-2\" data-start=\"26\" data-end=\"100\">Contract text...</p>",
        "tokens": [
          {
            "start": 0,
            "end": 25,
            "text": "Contract Title",
            "elementType": "h1",
            "elementId": "element-1"
          }
        ],
        "metadata": {
          "totalTokens": 1,
          "headingCount": 1,
          "paragraphCount": 0,
          "listCount": 0
        }
      }

      Convert the contract text following these rules. Return ONLY the JSON object.
`.trim();
    return prompt;
  }

  private validateStructure(result: IStructuredContract): boolean {
    if (!result.html || !Array.isArray(result.tokens) || !result.metadata) {
      logger("Basic structure validation failed - missing required fields");
      return false;
    }

    if (result.tokens.length === 0) {
      logger("No tokens found in response");
      return false;
    }

    const tokensToCheck = Math.min(result.tokens.length, 10);
    for (let i = 0; i < tokensToCheck; i++) {
      const token = result.tokens[i];
      if (
        typeof token.start !== "number" ||
        typeof token.end !== "number" ||
        typeof token.text !== "string" ||
        typeof token.elementId !== "string" ||
        !["p", "h1", "h2", "h3", "li", "span", "ul", "ol"].includes(
          token.elementType
        )
      ) {
        logger(
          `Token validation failed for token ${i}: ${JSON.stringify(token)}`
        );
        return false;
      }

      if (token.start < 0 || token.end < token.start) {
        logger(
          `Invalid token positions for token ${i}: start=${token.start}, end=${token.end}`
        );
        return false;
      }
    }

    const actualTotalTokens = result.tokens.length;
    const metadataTotalTokens = result.metadata.totalTokens;

    const totalDiff = Math.abs(metadataTotalTokens - actualTotalTokens);

    if (totalDiff > actualTotalTokens * 0.5) {
      logger(
        `Token count mismatch too large: expected ${metadataTotalTokens}, got ${actualTotalTokens}`
      );
      return false;
    }

    logger(
      `Validation passed - Total tokens: ${actualTotalTokens}, Metadata: ${metadataTotalTokens}`
    );
    return true;
  }
}
