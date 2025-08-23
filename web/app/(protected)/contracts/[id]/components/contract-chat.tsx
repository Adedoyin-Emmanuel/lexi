"use client";

import { MessageCircle, Send } from "lucide-react";
import { useState, useRef, useEffect } from "react";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface ChatMessage {
  id: number;
  message: string;
  type: "user" | "bot";
}

interface ContractChatProps {
  contractName: string;
}

export const ContractChat = ({ contractName }: ContractChatProps) => {
  const [chatMessage, setChatMessage] = useState("");
  const [chatHistory, setChatHistory] = useState<ChatMessage[]>([
    {
      id: 1,
      type: "bot",
      message: `Hello! I'm here to help you understand the "${contractName}" contract. What would you like to know?`,
    },
  ]);
  const scrollAreaRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollAreaRef.current) {
      const scrollElement = scrollAreaRef.current.querySelector(
        "[data-radix-scroll-area-viewport]"
      );
      if (scrollElement) {
        scrollElement.scrollTop = scrollElement.scrollHeight;
      }
    }
  }, [chatHistory]);

  const handleSendMessage = () => {
    if (!chatMessage.trim()) return;

    const userMessage: ChatMessage = {
      id: Date.now(),
      type: "user",
      message: chatMessage,
    };

    setChatHistory((prev) => [...prev, userMessage]);
    setChatMessage("");

    setTimeout(() => {
      const botResponse: ChatMessage = {
        id: Date.now() + 1,
        type: "bot",
        message:
          "I understand you're asking about this contract. Let me analyze the relevant sections and provide you with a detailed explanation...",
      };
      setChatHistory((prev) => [...prev, botResponse]);
    }, 1000);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <Card className="h-[500px] max-w-md mx-auto flex flex-col">
      <CardHeader className="pb-3 flex-shrink-0">
        <CardTitle className="flex items-center gap-2 text-lg">
          <MessageCircle className="h-5 w-5" strokeWidth={1.5} />
          Contract Assistant
        </CardTitle>
      </CardHeader>
      <CardContent className="flex-1 flex flex-col p-4 min-h-0">
        <ScrollArea ref={scrollAreaRef} className="flex-1 mb-4 pr-2 min-h-0">
          <div className="space-y-3">
            {chatHistory.map((message) => (
              <div
                key={message.id}
                className={`flex ${
                  message.type === "user" ? "justify-end" : "justify-start"
                } animate-in fade-in-0 slide-in-from-bottom-2 duration-300`}
              >
                <div
                  className={`max-w-[85%] rounded-2xl px-4 py-3 text-sm shadow-sm ${
                    message.type === "user"
                      ? "bg-primary text-primary-foreground rounded-br-md"
                      : "bg-muted rounded-bl-md"
                  }`}
                >
                  <div className="flex items-start gap-2">
                    <div className="flex-1">
                      <p className="leading-relaxed">{message.message}</p>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </ScrollArea>

        <div className="flex gap-2 pt-2 border-t border-gray-200 flex-shrink-0">
          <Input
            placeholder="Ask about this contract..."
            value={chatMessage}
            onChange={(e) => setChatMessage(e.target.value)}
            onKeyPress={handleKeyPress}
            className="flex-1 text-sm min-w-0"
          />
          <Button
            onClick={handleSendMessage}
            size="sm"
            className="px-3 flex-shrink-0"
            disabled={!chatMessage.trim()}
          >
            <Send className="h-4 w-4" strokeWidth={1.5} />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};
