"use client";

import { ContractChat } from "./contract-chat";

interface ChatMessage {
  role: "assistant" | "user";
  content: string;
}

interface ContractChatFabProps {
  contractId: string;
  contractName: string;
  chats?: ChatMessage[];
}

export const ContractChatFab: React.FC<ContractChatFabProps> = ({
  contractName,
  contractId,
  chats,
}) => {
  return (
    <div className="fixed bottom-6 right-6 z-50">
      <ContractChat
        contractName={contractName}
        contractId={contractId}
        chats={chats}
      />
    </div>
  );
};
