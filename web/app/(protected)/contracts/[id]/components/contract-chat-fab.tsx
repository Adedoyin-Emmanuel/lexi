"use client";

import { ContractChat } from "./contract-chat";

interface ContractChatFabProps {
  contractId: string;
  contractName: string;
}

export const ContractChatFab: React.FC<ContractChatFabProps> = ({
  contractName,
  contractId,
}) => {
  return (
    <div className="fixed bottom-6 right-6 z-50">
      <ContractChat contractName={contractName} contractId={contractId} />
    </div>
  );
};
