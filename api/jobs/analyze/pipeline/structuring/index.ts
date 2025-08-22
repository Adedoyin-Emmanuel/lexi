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

      const prompt = this.getSimplePrompt();

      logger(
        `Sending document to AI for structuring... Content length: ${content.length}`
      );
      const startTime = Date.now();

      const responsePromise = aiMlApi.chat.completions.create({
        model: "gpt-3.5-turbo",
        messages: [
          { role: "system", content: prompt },
          { role: "user", content: content },
        ],
        temperature: 0,
        max_tokens: 4000,
        response_format: { type: "json_object" },
      });

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
        logger("No AI response received");
        return Result.fail("No AI response received");
      }

      let aiMlApiResponse: any;

      try {
        aiMlApiResponse = JSON.parse(aiContent);
      } catch (error) {
        logger(`Failed to parse AI response: ${error}`);
        return Result.fail("Failed to parse AI response");
      }

      const structuredContract: IStructuredContract = {
        html: aiMlApiResponse.html,
        metadata: aiMlApiResponse.metadata || {
          headingCount: 0,
          paragraphCount: 0,
          listCount: 0,
        },
      };

      if (!structuredContract.html || structuredContract.html.length < 10) {
        logger(`AI returned invalid HTML`);
        return Result.fail("AI returned invalid HTML");
      }

      logger(`Structure validation passed for document ${documentId}`);
      return Result.ok(structuredContract);
    } catch (error) {
      logger(`Error in structure method: ${error}`);
      return Result.fail("Failed to structure contract");
    }
  }

  private getSimplePrompt() {
    return `
Convert this contract text to structured HTML with Tailwind CSS classes.

Return JSON with this structure:
{
  "html": "HTML string with Tailwind CSS classes",
  "metadata": {"headingCount": 1, "paragraphCount": 0, "listCount": 0}
}

Rules:
- Use h1/h2/h3 for headings (ARTICLE, SECTION, numbered items) with Tailwind classes like "text-2xl font-bold text-gray-900 mb-4"
- Use p for paragraphs with Tailwind classes like "text-gray-700 mb-3 leading-relaxed"
- Use li for list items with Tailwind classes like "text-gray-700 mb-1 ml-4"
- Use appropriate Tailwind CSS classes for styling:
  * Headings: text-xl/text-2xl/text-3xl, font-bold, text-gray-900, mb-4
  * Paragraphs: text-gray-700, mb-3, leading-relaxed
  * Lists: text-gray-700, mb-1, ml-4
  * Containers: p-6, bg-white, rounded-lg, shadow-sm
- Keep it simple and fast
`.trim();
  }
}
