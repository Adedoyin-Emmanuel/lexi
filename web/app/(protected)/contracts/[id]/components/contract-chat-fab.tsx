"use client";

import { useState } from "react";
import { MessageCircle, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

import { Button } from "@/components/ui/button";
import { ContractChat } from "./contract-chat";

interface ContractChatFabProps {
  contractName: string;
  contractId: string;
}

export const ContractChatFab: React.FC<ContractChatFabProps> = ({
  contractName,
  contractId,
}) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <AnimatePresence>
        {!isOpen && (
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
              onClick={() => setIsOpen(true)}
              className="h-14 w-14 cursor-pointer rounded-full shadow-lg hover:shadow-xl transition-all duration-200 hover:scale-105"
            >
              <MessageCircle className="h-6 w-6" strokeWidth={1.5} />
            </Button>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {isOpen && (
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
            className="fixed bottom-6 right-6 z-50 w-96 h-[500px] bg-white rounded-lg shadow-2xl border border-gray-200"
          >
            <div className="flex items-center justify-between p-4 border-b border-gray-200">
              <h3 className="font-semibold text-gray-900">
                Chat with {contractName}
              </h3>
              <Button
                size="sm"
                variant="ghost"
                onClick={() => setIsOpen(false)}
                className="h-8 w-8 p-0"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
            <div className="h-[calc(500px-4rem)]">
              <ContractChat
                contractName={contractName}
                contractId={contractId}
              />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};
