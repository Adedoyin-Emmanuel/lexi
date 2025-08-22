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

      // Much more aggressive truncation for speed
      const content = this.truncateContent(documentContent as string);

      // Skip AI entirely for very small documents and use simple parsing
      if (content.length < 500) {
        return this.simpleStructure(content);
      }

      const prompt = this.getSimplePrompt();

      logger(
        `Sending document to AI for structuring... Content length: ${content.length}`
      );
      const startTime = Date.now();

      // Add timeout to prevent hanging
      const responsePromise = aiMlApi.chat.completions.create({
        model: "gpt-3.5-turbo", // Much faster than gpt-4o-mini
        messages: [
          { role: "system", content: prompt },
          { role: "user", content: content },
        ],
        temperature: 0,
        max_tokens: 4000,
        response_format: { type: "json_object" },
      });

      // Add 30-second timeout
      const timeoutPromise = new Promise((_, reject) =>
        setTimeout(() => reject(new Error("AI request timeout")), 30000)
      );

      const response = (await Promise.race([
        responsePromise,
        timeoutPromise,
      ])) as any;

      const endTime = Date.now();
      logger(`AI response received in ${endTime - startTime}ms`);

      const aiContent = response.choices[0]?.message?.content;

      if (!aiContent) {
        logger("No AI response, falling back to simple structure");
        return this.simpleStructure(content);
      }

      let aiMlApiResponse: any;

      try {
        const cleanContent = this.cleanJsonResponse(aiContent);
        aiMlApiResponse = JSON.parse(cleanContent);
      } catch (error) {
        logger(
          `Failed to parse AI response, falling back to simple structure: ${error}`
        );
        return this.simpleStructure(content);
      }

      // Quick validation
      if (!this.isValidAIResponse(aiMlApiResponse)) {
        logger(
          `Invalid AI response structure, falling back to simple structure`
        );
        return this.simpleStructure(content);
      }

      const structuredContract: IStructuredContract = {
        html: aiMlApiResponse.html,
        tokens: aiMlApiResponse.tokens || [],
        metadata: aiMlApiResponse.metadata || {
          totalTokens: 0,
          headingCount: 0,
          paragraphCount: 0,
          listCount: 0,
        },
      };

      // Very basic validation - just check if we have some content
      if (!structuredContract.html || structuredContract.html.length < 10) {
        logger(`AI returned invalid HTML, falling back to simple structure`);
        return this.simpleStructure(content);
      }

      logger(`Structure validation passed for document ${documentId}`);
      return Result.ok(structuredContract);
    } catch (error) {
      logger(
        `Error in structure method: ${error}, falling back to simple structure`
      );
      const documentContent = await redisService.get(`document:${documentId}`);
      if (documentContent) {
        return this.simpleStructure(
          this.truncateContent(documentContent as string)
        );
      }
      return Result.fail("Failed to structure contract");
    }
  }

  // Fallback method that doesn't use AI
  private simpleStructure(
    content: string
  ): Result<IStructuredContract, string> {
    try {
      const lines = content
        .split("\n")
        .filter((line) => line.trim().length > 0);
      let html = "";
      const tokens: any[] = [];
      let currentPos = 0;
      let elementCounter = 1;

      let headingCount = 0;
      let paragraphCount = 0;
      let listCount = 0;

      for (const line of lines) {
        const trimmedLine = line.trim();
        if (trimmedLine.length === 0) continue;

        let elementType = "p";

        // Simple heading detection
        if (this.isHeading(trimmedLine)) {
          elementType = this.getHeadingLevel(trimmedLine);
          headingCount++;
        } else if (this.isList(trimmedLine)) {
          elementType = "li";
          listCount++;
        } else {
          paragraphCount++;
        }

        const elementId = `element-${elementCounter}`;
        const startPos = content.indexOf(trimmedLine, currentPos);
        const endPos = startPos + trimmedLine.length;

        html += `<${elementType} id="${elementId}" data-start="${startPos}" data-end="${endPos}">${this.escapeHtml(
          trimmedLine
        )}</${elementType}>`;

        tokens.push({
          start: startPos,
          end: endPos,
          text: trimmedLine,
          elementType,
          elementId,
        });

        currentPos = endPos;
        elementCounter++;
      }

      const structuredContract: IStructuredContract = {
        html,
        tokens,
        metadata: {
          totalTokens: tokens.length,
          headingCount,
          paragraphCount,
          listCount,
        },
      };

      logger(`Simple structure created with ${tokens.length} tokens`);
      return Result.ok(structuredContract);
    } catch (error) {
      logger(`Error in simple structure: ${error}`);
      return Result.fail("Failed to create simple structure");
    }
  }

  private isHeading(line: string): boolean {
    const headingPatterns = [
      /^ARTICLE\s+\d+/i,
      /^SECTION\s+[A-Z0-9]+/i,
      /^\d+\.\s*[A-Z]/,
      /^\d+\.\d+/,
      /^\([a-z]\)/,
      /^[A-Z\s]{10,}$/, // All caps lines
    ];

    return headingPatterns.some((pattern) => pattern.test(line));
  }

  private getHeadingLevel(line: string): string {
    if (/^ARTICLE|^SECTION/i.test(line)) return "h1";
    if (/^\d+\.\s*[A-Z]/.test(line)) return "h2";
    if (/^\d+\.\d+/.test(line)) return "h3";
    return "h2";
  }

  private isList(line: string): boolean {
    return /^[-•·]\s/.test(line) || /^\d+\)\s/.test(line);
  }

  private escapeHtml(text: string): string {
    return text
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#39;");
  }

  private truncateContent(content: string): string {
    // Much more aggressive truncation
    const MAX_LENGTH = 5000; // Reduced from 15000
    if (content.length <= MAX_LENGTH) {
      return content;
    }

    logger(
      `Truncating content from ${content.length} to ${MAX_LENGTH} characters`
    );
    // Try to truncate at a sentence boundary
    const truncated = content.substring(0, MAX_LENGTH);
    const lastPeriod = truncated.lastIndexOf(".");

    if (lastPeriod > MAX_LENGTH * 0.8) {
      return truncated.substring(0, lastPeriod + 1);
    }

    return truncated + "...";
  }

  private cleanJsonResponse(response: string): string {
    return response
      .replace(/```json\s*/g, "")
      .replace(/```\s*/g, "")
      .replace(/^\s*[\[\{]/, (match) => match.trim())
      .replace(/[\]\}]\s*$/, (match) => match.trim())
      .trim();
  }

  private isValidAIResponse(response: any): boolean {
    return (
      response &&
      typeof response.html === "string" &&
      response.html.length > 0 &&
      Array.isArray(response.tokens)
    );
  }

  // Much simpler prompt
  private getSimplePrompt() {
    return `
Convert this contract text to structured HTML with tokens.

Return JSON with this structure:
{
  "html": "HTML string with id and data-start/data-end attributes",
  "tokens": [{"start": 0, "end": 10, "text": "text", "elementType": "h1", "elementId": "element-1"}],
  "metadata": {"totalTokens": 1, "headingCount": 1, "paragraphCount": 0, "listCount": 0}
}

Rules:
- Use h1/h2/h3 for headings (ARTICLE, SECTION, numbered items)
- Use p for paragraphs
- Use li for list items
- Add id="element-N" and data-start/data-end to each element
- Keep it simple and fast
`.trim();
  }
}
