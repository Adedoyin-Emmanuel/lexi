"use client";

import { ContractTabs } from "./components/contract-tabs";
import { ContractChat } from "./components/contract-chat";
import { ContractStats } from "./components/contract-stats";
import { ContractHeader } from "./components/contract-header";
import { ContractOverview } from "./components/contract-overview";

const mockContract = {
  id: "1",
  name: "Employment Agreement - John Smith",
  uploadedAt: "2024-01-15",
  confidenceScore: 85,
  status: "Safe" as const,
  riskType: "Low" as const,
  contractType: "Employment",
  parties: ["John Smith", "TechCorp Inc"],
  startDate: "2024-01-15",
  endDate: "2025-01-15",
  value: "$75,000",
  summary:
    "This employment agreement outlines the terms and conditions for John Smith's employment as a Senior Software Engineer at TechCorp Inc. The contract includes standard employment terms, benefits, and termination clauses.",
  keyTerms: [
    "Position: Senior Software Engineer",
    "Salary: $75,000 annually",
    "Benefits: Health insurance, 401k, PTO",
    "Term: 1 year with renewal option",
    "Termination: 30 days notice required",
  ],
  risks: [
    "Non-compete clause may be overly restrictive",
    "Intellectual property assignment is standard",
    "Termination clause is reasonable",
  ],
  obligations: [
    "Employee must maintain confidentiality",
    "Company must provide benefits as outlined",
    "Both parties must give 30 days notice for termination",
  ],
};

const ContractDetail = () => {
  return (
    <div className="space-y-8">
      <ContractHeader contractName={mockContract.name} />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          <ContractOverview contract={mockContract} />
          <ContractTabs contract={mockContract} />
        </div>

        <div className="space-y-6">
          <ContractStats contract={mockContract} />
          <ContractChat contractName={mockContract.name} />
        </div>
      </div>
    </div>
  );
};

export default ContractDetail;
