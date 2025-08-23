import { Types } from "mongoose";
import { logger } from "./../../utils";
import { IIncomingChatPayload } from "./types";
import { Document } from "./../../models/document";
import { getSocket, aiMlApi } from "./../../utils";
import { SOCKET_EVENTS } from "./../../types/socket";
import { redisService } from "./../../services/redis";
import { documentRepository } from "./../../models/repositories";

export default class ChatHandler {
  public static async handleIncomingChat(payload: IIncomingChatPayload) {
    const { message, contractId } = payload;
    const socket = getSocket();

    let contract = await documentRepository.findById(contractId);

    if (!contract) {
      logger(`Contract not found for ID: ${contractId}`);
      socket.to(contractId).emit(SOCKET_EVENTS.CHAT_MESSAGE_AI_RESPONSE, {
        message:
          "Sorry, I couldn't find the contract you're referring to. Please check the contract ID and try again.",
      });
      return;
    }

    if (contract && typeof contract._id === "string") {
      contract._id = new Types.ObjectId(contract._id);
    }

    // Save user message to database first
    await documentRepository.update(new Types.ObjectId(contractId), {
      $push: {
        chats: {
          role: "user",
          content: message,
        },
      },
    } as any);

    const aiResponse = await this.getAIResponse(message, contract as Document);

    socket.to(contractId).emit(SOCKET_EVENTS.CHAT_MESSAGE_AI_RESPONSE, {
      message: aiResponse,
    });

    // Save AI response to database
    await documentRepository.update(new Types.ObjectId(contractId), {
      $push: {
        chats: {
          role: "assistant",
          content: aiResponse,
        },
      },
    } as any);
  }

  private static async getRecentConversationContext(contractId: string) {
    const cacheKey = `chat:context:${contractId}`;

    const cachedContext = await redisService.get<string>(cacheKey);

    if (cachedContext) {
      return cachedContext;
    }

    const recentContext = await documentRepository.findById(contractId);

    const recentChats = recentContext?.chats?.slice(0, 5) || [];

    if (!recentChats.length) {
      return "";
    }

    const context = recentChats
      .reverse()
      .map(
        (chat) =>
          `${chat.role === "user" ? "User" : "Assistant"}: ${chat.content}`
      )
      .join("\n");

    await redisService.set(cacheKey, context, 60 * 5);

    return context;
  }

  static async getAIResponse(prompt: string, contract: Document) {
    const systemPrompt = await this.constructPromptBasedOnContract(contract);

    const aiMlResponse = await aiMlApi.chat.completions.create({
      model: "gpt-4o",
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: prompt },
      ],
      temperature: 0.2,
      max_tokens: 3000,
      response_format: { type: "text" },
    });

    const content = aiMlResponse.choices[0]?.message?.content;

    if (!content) {
      return "No response from AI model";
    }

    return content;
  }

  static async constructPromptBasedOnContract(
    contract: Document
  ): Promise<string> {
    if (!contract) {
      throw new Error(
        "Invalid contract provided to constructPromptBasedOnContract: contract is null or undefined"
      );
    }

    if (!contract._id) {
      throw new Error(
        "Invalid contract provided to constructPromptBasedOnContract: contract._id is missing"
      );
    }

    if (!contract.title) {
      throw new Error(
        "Invalid contract provided to constructPromptBasedOnContract: contract.title is missing"
      );
    }

    const recentContext = await this.getRecentConversationContext(
      contract._id.toString()
    );

    const basePrompt = `
You are a helpful AI assistant specialized in contract analysis. You can answer questions about this specific contract.

CONTRACT INFORMATION:
- Title: ${contract.title}
- Type: ${contract.summary?.type || "Unknown"}
- Status: ${contract.status}
- Overview: ${contract.summary?.overviewSummary || "No summary available"}

CONTRACT DETAILS:
${
  contract.summary?.plainEnglishSummary
    ? `Summary: ${contract.summary.plainEnglishSummary}`
    : ""
}
${contract.summary?.duration ? `Duration: ${contract.summary.duration}` : ""}
${
  contract.summary?.jurisdiction
    ? `Jurisdiction: ${contract.summary.jurisdiction}`
    : ""
}
${
  contract.summary?.effectiveDate
    ? `Effective Date: ${contract.summary.effectiveDate}`
    : ""
}

KEY INSIGHTS:
${contract.risks?.length ? `- ${contract.risks.length} risks identified` : ""}
${
  contract.obligations?.length
    ? `- ${contract.obligations.length} obligations found`
    : ""
}
${
  contract.clauses?.length
    ? `- ${contract.clauses.length} key clauses analyzed`
    : ""
}
${
  contract.suggestions?.length
    ? `- ${contract.suggestions.length} suggestions available`
    : ""
}

${
  contract.risks?.length
    ? `
TOP RISKS:
${contract.risks
  .slice(0, 3)
  .map(
    (risk) => `- ${risk.title}: ${risk.description} (${risk.riskLevel} risk)`
  )
  .join("\n")}
`
    : ""
}

${
  contract.obligations?.length
    ? `
KEY OBLIGATIONS:
${contract.obligations
  .slice(0, 3)
  .map(
    (obligation) =>
      `- ${obligation.title}: ${obligation.userFriendlyExplanation}`
  )
  .join("\n")}
`
    : ""
}

${
  recentContext
    ? `
RECENT CONVERSATION:
${recentContext}
`
    : ""
}

INSTRUCTIONS:
- Answer questions specifically about this contract
- Be helpful, accurate, and concise
- If asked about specific clauses, risks, or obligations, reference the relevant sections
- If you don't have specific information, acknowledge it clearly
- Provide actionable insights when possible
- Use plain English and avoid legal jargon unless specifically requested


IMPORTANT:
If the user asks a question outside the scope of the contract, politely decline to answer.

    `;

    return basePrompt;
  }
}
