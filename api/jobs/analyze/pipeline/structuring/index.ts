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

      const prompt = this.getStructurePrompt();
      const response = await aiMlApi.chat.completions.create({
        model: "gpt-4o-mini",
        messages: [
          { role: "system", content: prompt },
          { role: "user", content: documentContent as string },
        ],
        temperature: 0.1,
        max_tokens: 6000,
        response_format: { type: "json_object" },
      });

      const content = response.choices[0]?.message?.content;

      if (!content) {
        return Result.fail("No response from structuring model");
      }

      let aiMlApiResponse: any;

      try {
        aiMlApiResponse = JSON.parse(content);
      } catch (error) {
        return Result.fail("Failed to parse response from structuring model");
      }

      const structuredContract: IStructuredContract = {
        html: aiMlApiResponse.html,
        tokens: aiMlApiResponse.tokens,
        metadata: aiMlApiResponse.metadata,
      };

      const isValidStructure = this.validateStructure(structuredContract);

      if (!isValidStructure) {
        return Result.fail("Invalid structure from structuring model");
      }

      return Result.ok(structuredContract);
    } catch (error) {
      logger.error(error);
      return Result.fail("Failed to structure contract");
    }
  }

  private getStructurePrompt() {
    const prompt = `
        You are a contract lexical formatting specialist for Lexi. Your job is to convert contract text into structured HTML with precise token indexing for highlighting.

        ## Task
        Convert the contract text into structured HTML format with exact token positions for frontend highlighting.

        ## HTML Structure Rules
        1. **Headings**: 
        - <h1> for main contract title
        - <h2> for major articles/sections (e.g., "ARTICLE 1", "SECTION A")
        - <h3> for subsections (e.g., "1.1", "2.3", "a)")

        2. **Paragraphs**: 
        - <p> for regular contract text paragraphs

        3. **Lists**: 
        - <ul><li> for bulleted items, obligations, definitions
        - Use when you see patterns like "- Item", "• Item", or multiple related clauses

        ## Token Indexing Requirements
        - Each HTML element must have:
        - Unique id="element-N" (N = sequential number)
        - data-start="X" (character position where element starts in original text)
        - data-end="Y" (character position where element ends in original text)
        - Token positions must be accurate for highlighting functionality

        ## Pattern Recognition
        Identify these patterns as headings:
        - "ARTICLE 1", "SECTION A", "CLAUSE 1"
        - "1.", "2.", "3." (when followed by title-like text)
        - "1.1", "2.3", "3.4" (subsections)
        - "(a)", "(b)", "(c)" (sub-subsections)
        - ALL CAPS titles that are clearly section headers

        Identify these as lists:
        - Multiple items starting with "-", "•", or "→"
        - Numbered obligations like "1)", "2)", "3)"
        - Multiple "shall" or "must" clauses in sequence

        ## Response Format
        Return ONLY a JSON object with this exact structure:

        {
        "html": "Complete HTML string with all elements",
        "tokens": [
            {
            "start": 0,
            "end": 25,
            "text": "MUTUAL NON-DISCLOSURE AGREEMENT",
            "elementType": "h1",
            "elementId": "element-1"
            }
        ],
        "metadata": {
            "totalTokens": 15,
            "headingCount": 4,
            "paragraphCount": 8,
            "listCount": 3
        }
        }

        ## Important Notes
        - Preserve ALL original text content
        - Character positions must be exact (use original text indexing)
        - Don't add extra whitespace or formatting
        - Each token represents one HTML element
        - HTML should be clean and valid
        - Focus on legal document structure patterns

        Convert the provided contract text following these rules exactly.

        `.trim();
    return prompt;
  }

  private validateStructure(result: IStructuredContract): boolean {
    if (!result.html || !Array.isArray(result.tokens) || !result.metadata) {
      return false;
    }

    for (const token of result.tokens) {
      if (
        typeof token.start !== "number" ||
        typeof token.end !== "number" ||
        typeof token.text !== "string" ||
        typeof token.elementId !== "string" ||
        !["p", "h1", "h2", "h3", "li", "span"].includes(token.elementType)
      ) {
        return false;
      }
    }

    const actualHeadings = result.tokens.filter((t) =>
      t.elementType.startsWith("h")
    ).length;
    const actualParagraphs = result.tokens.filter(
      (t) => t.elementType === "p"
    ).length;
    const actualLists = result.tokens.filter(
      (t) => t.elementType === "li"
    ).length;

    return (
      result.metadata.headingCount === actualHeadings &&
      result.metadata.paragraphCount === actualParagraphs &&
      result.metadata.listCount === actualLists &&
      result.metadata.totalTokens === result.tokens.length
    );
  }
}
