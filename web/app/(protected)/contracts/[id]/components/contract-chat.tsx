"use client";

import { motion, AnimatePresence } from "framer-motion";
import { MessageCircle, Send, X, Loader2 } from "lucide-react";
import { useState, useRef, useEffect, useCallback } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

import { useAuth } from "@/hooks/use-auth";
import { Input } from "@/components/ui/input";
import { useSocket } from "@/hooks/use-socket";
import { Button } from "@/components/ui/button";
import { SOCKET_EVENTS } from "@/hooks/types/socket";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Card, CardContent } from "@/components/ui/card";

interface ChatMessage {
  id: number;
  message: string;
  type: "user" | "bot";
}

interface ContractChatProps {
  contractId: string;
  contractName: string;
}

export const ContractChat = ({
  contractName,
  contractId,
}: ContractChatProps) => {
  const [chatMessage, setChatMessage] = useState("");
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [isVisible, setIsVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [chatHistory, setChatHistory] = useState<ChatMessage[]>([
    {
      id: 1,
      type: "bot",
      message: `Hello! I'm here to help you understand the "${contractName}" contract. What would you like to know?`,
    },
  ]);
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const { user } = useAuth();
  const socket = useSocket(user?.id as string);

  useEffect(() => {
    if (isChatOpen) {
      document.body.style.overflow = "hidden";
      setTimeout(() => {
        inputRef.current?.focus();
      }, 300);
    } else {
      document.body.style.overflow = "unset";
    }

    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isChatOpen]);

  useEffect(() => {
    if (!socket) return;

    socket.emit(SOCKET_EVENTS.CHAT_MESSAGE_JOIN_ROOM, contractId);

    const handleAIResponse = (data: { message: string }) => {
      const botResponse: ChatMessage = {
        id: Date.now() + 1,
        type: "bot",
        message: data.message,
      };
      setChatHistory((prev) => [...prev, botResponse]);
      setIsLoading(false);
    };

    socket.on(SOCKET_EVENTS.CHAT_MESSAGE_AI_RESPONSE, handleAIResponse);

    return () => {
      socket.off(SOCKET_EVENTS.CHAT_MESSAGE_AI_RESPONSE, handleAIResponse);
    };
  }, [socket, contractId]);

  useEffect(() => {
    let timeoutId: NodeJS.Timeout;

    const handleScroll = () => {
      if (isChatOpen) return;

      const currentScrollY = window.scrollY;
      const windowHeight = window.innerHeight;
      const documentHeight = document.documentElement.scrollHeight;
      const isNearBottom =
        currentScrollY + windowHeight >= documentHeight - 100;

      if (currentScrollY > lastScrollY && currentScrollY > 100) {
        setIsVisible(false);
      }

      if (
        (currentScrollY < lastScrollY || currentScrollY <= 100) &&
        !isNearBottom
      ) {
        setIsVisible(true);
      }

      if (isNearBottom) {
        setIsVisible(false);
      }

      setLastScrollY(currentScrollY);

      if (timeoutId) {
        clearTimeout(timeoutId);
      }

      timeoutId = setTimeout(() => {
        if (!isNearBottom) {
          setIsVisible(true);
        }
      }, 2000);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });

    return () => {
      window.removeEventListener("scroll", handleScroll);
      if (timeoutId) {
        clearTimeout(timeoutId);
      }
    };
  }, [lastScrollY, isChatOpen]);

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

  const handleSendMessage = useCallback(() => {
    if (!chatMessage.trim() || isLoading || !socket) return;

    const userMessage: ChatMessage = {
      id: Date.now(),
      type: "user",
      message: chatMessage,
    };

    setChatMessage("");
    setChatHistory((prev) => [...prev, userMessage]);
    setIsLoading(true);

    socket.emit(SOCKET_EVENTS.CHAT_MESSAGE_USER_MESSAGE, {
      message: chatMessage,
      contractId: contractId,
    });
  }, [chatMessage, isLoading, socket, contractId]);

  const handleKeyPress = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === "Enter" && !e.shiftKey) {
        e.preventDefault();
        handleSendMessage();
      }
    },
    [handleSendMessage]
  );

  const handleInputChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setChatMessage(e.target.value);
    },
    []
  );

  const ChatInterface = useCallback(
    () => (
      <Card className="h-[600px] max-w-md mx-auto flex flex-col">
        <div className="flex items-center justify-between p-4 pb-3 border-b border-gray-200">
          <div className="flex items-center gap-2">
            <h3 className="text-[17px] font-semibold">Contract Assistant</h3>
          </div>
          <Button
            variant="destructive"
            size="sm"
            onClick={() => setIsChatOpen(false)}
            className="h-6 w-6 p-0 rounded-full cursor-pointer bg-gray-100 text-gray-600 hover:text-white"
          >
            <X className="h-3 w-3" strokeWidth={1.5} />
          </Button>
        </div>
        <CardContent className="flex-1 flex flex-col p-4 min-h-0">
          <ScrollArea
            ref={scrollAreaRef}
            className="flex-1 mb-4 pr-2 min-h-0"
            onWheel={(e) => e.stopPropagation()}
          >
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
                        <p className="leading-relaxed">
                          {message.type === "user" ? (
                            message.message
                          ) : (
                            <ReactMarkdown
                              remarkPlugins={[remarkGfm]}
                              components={{
                                p: ({ ...props }) => (
                                  <p className="leading-relaxed" {...props} />
                                ),
                                a: ({ ...props }) => (
                                  <a
                                    className="text-primary underline"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    {...props}
                                  />
                                ),
                                code: ({ ...props }) => (
                                  <code
                                    className="bg-muted px-1 py-0.5 rounded-sm"
                                    {...props}
                                  />
                                ),
                                pre: ({ ...props }) => (
                                  <pre
                                    className="bg-muted p-3 rounded-md overflow-x-auto"
                                    {...props}
                                  />
                                ),
                              }}
                            >
                              {message.message}
                            </ReactMarkdown>
                          )}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              ))}

              {isLoading && (
                <div className="flex justify-start animate-in fade-in-0 slide-in-from-bottom-2 duration-300">
                  <div className="max-w-[85%] rounded-2xl px-4 py-3 text-sm shadow-sm bg-muted rounded-bl-md">
                    <div className="flex items-center gap-2">
                      <Loader2
                        className="h-4 w-4 animate-spin"
                        strokeWidth={1.5}
                      />
                      <span className="text-muted-foreground">
                        AI is thinking...
                      </span>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </ScrollArea>

          <div className="flex gap-2 pt-2 border-t border-gray-200 flex-shrink-0">
            <Input
              ref={inputRef}
              placeholder="Ask about this contract..."
              value={chatMessage}
              onChange={handleInputChange}
              onKeyPress={handleKeyPress}
              className="flex-1 text-sm min-w-0"
            />
            <Button
              onClick={handleSendMessage}
              size="sm"
              className="px-3 flex-shrink-0"
              disabled={!chatMessage.trim() || isLoading}
            >
              {isLoading ? (
                <Loader2 className="h-4 w-4 animate-spin" strokeWidth={1.5} />
              ) : (
                <Send className="h-4 w-4" strokeWidth={1.5} />
              )}
            </Button>
          </div>
        </CardContent>
      </Card>
    ),
    [
      chatHistory,
      chatMessage,
      isLoading,
      handleSendMessage,
      handleKeyPress,
      handleInputChange,
    ]
  );

  return (
    <>
      <div className="hidden md:block">
        <AnimatePresence>
          {!isChatOpen && (
            <motion.div
              initial={{ opacity: 0, scale: 0.8, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.8, y: 20 }}
              transition={{
                duration: 0.3,
                ease: "easeInOut",
                type: "spring",
                stiffness: 300,
                damping: 25,
              }}
              className="fixed bottom-6 right-6 z-50"
            >
              <Button
                size="lg"
                onClick={() => setIsChatOpen(true)}
                className="h-14 w-14 cursor-pointer rounded-full shadow-lg hover:shadow-xl transition-all duration-200 hover:scale-105"
              >
                <MessageCircle className="h-6 w-6" strokeWidth={1.5} />
              </Button>
            </motion.div>
          )}
        </AnimatePresence>

        <AnimatePresence>
          {isChatOpen && (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{
                duration: 0.3,
                ease: "easeInOut",
              }}
              className="fixed bottom-6 right-6 z-50"
            >
              {ChatInterface()}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <div className="md:hidden">
        <AnimatePresence>
          {isVisible && !isChatOpen && (
            <motion.div
              initial={{ opacity: 0, scale: 0.8, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.8, y: 20 }}
              transition={{
                duration: 0.3,
                ease: "easeInOut",
                type: "spring",
                stiffness: 300,
                damping: 25,
              }}
              className="fixed bottom-6 right-6 z-50"
            >
              <Button
                size="lg"
                onClick={() => setIsChatOpen(true)}
                className="h-14 w-14 cursor-pointer rounded-full shadow-lg hover:shadow-xl transition-all duration-200 hover:scale-105"
              >
                <MessageCircle className="h-6 w-6" strokeWidth={1.5} />
              </Button>
            </motion.div>
          )}
        </AnimatePresence>

        <AnimatePresence>
          {isChatOpen && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm"
              onClick={() => setIsChatOpen(false)}
            >
              <motion.div
                initial={{ opacity: 0, scale: 0.9, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9, y: 20 }}
                transition={{
                  duration: 0.3,
                  ease: "easeInOut",
                }}
                className="absolute bottom-0 left-0 right-0 h-[80vh] max-h-[600px] p-4"
                onClick={(e) => e.stopPropagation()}
              >
                <div className="relative h-full">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setIsChatOpen(false)}
                    className="absolute top-2 right-2 z-10 h-8 w-8 p-0 rounded-full bg-background/80 backdrop-blur-sm"
                  >
                    <X className="h-4 w-4" />
                  </Button>
                  <div className="h-full">{ChatInterface()}</div>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </>
  );
};
