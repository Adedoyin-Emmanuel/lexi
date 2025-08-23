"use client";

import { useState, useMemo } from "react";
import { FileText, AlertCircle } from "lucide-react";

import { ContractCard, ContractFilters } from "./components";
import { Card, CardContent } from "@/components/ui/card";

// Mock data - replace with actual API call
const mockContracts = [
  {
    id: "1",
    name: "Employment Agreement - John Smith",
    uploadedAt: "2024-01-15",
    confidenceScore: 85,
    status: "Safe" as const,
    riskType: "Low" as const,
    contractType: "Employment",
  },
  {
    id: "2",
    name: "Service Contract - TechCorp Inc",
    uploadedAt: "2024-01-14",
    confidenceScore: 72,
    status: "Needs Review" as const,
    riskType: "Medium" as const,
    contractType: "Service",
  },
  {
    id: "3",
    name: "NDA Agreement - StartupXYZ",
    uploadedAt: "2024-01-13",
    confidenceScore: 45,
    status: "Risky" as const,
    riskType: "High" as const,
    contractType: "NDA",
  },
  {
    id: "4",
    name: "Lease Agreement - Office Space",
    uploadedAt: "2024-01-12",
    confidenceScore: 91,
    status: "Safe" as const,
    riskType: "Low" as const,
    contractType: "Lease",
  },
  {
    id: "5",
    name: "Partnership Agreement - Joint Venture",
    uploadedAt: "2024-01-11",
    confidenceScore: 68,
    status: "Processing" as const,
    riskType: "Medium" as const,
    contractType: "Partnership",
  },
  {
    id: "6",
    name: "Purchase Agreement - Equipment",
    uploadedAt: "2024-01-10",
    confidenceScore: 78,
    status: "Safe" as const,
    riskType: "Low" as const,
    contractType: "Purchase",
  },
];

const Contracts = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [riskTypeFilter, setRiskTypeFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [confidenceFilter, setConfidenceFilter] = useState("all");

  const filteredContracts = useMemo(() => {
    return mockContracts.filter((contract) => {
      const matchesSearch = contract.name
        .toLowerCase()
        .includes(searchTerm.toLowerCase());

      const matchesRiskType =
        riskTypeFilter === "all" || contract.riskType === riskTypeFilter;

      const matchesStatus =
        statusFilter === "all" || contract.status === statusFilter;

      const matchesConfidence =
        confidenceFilter === "all" ||
        (confidenceFilter === "high" && contract.confidenceScore >= 80) ||
        (confidenceFilter === "medium" &&
          contract.confidenceScore >= 60 &&
          contract.confidenceScore < 80) ||
        (confidenceFilter === "low" && contract.confidenceScore < 60);

      return (
        matchesSearch && matchesRiskType && matchesStatus && matchesConfidence
      );
    });
  }, [searchTerm, riskTypeFilter, statusFilter, confidenceFilter]);

  const hasActiveFilters = Boolean(
    searchTerm ||
      riskTypeFilter !== "all" ||
      statusFilter !== "all" ||
      confidenceFilter !== "all"
  );

  const clearFilters = () => {
    setSearchTerm("");
    setRiskTypeFilter("all");
    setStatusFilter("all");
    setConfidenceFilter("all");
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Contracts</h1>
          <p className="text-muted-foreground">
            Manage and review your contract analysis results
          </p>
        </div>
        <div className="flex items-center gap-2">
          <FileText className="h-5 w-5 text-muted-foreground" />
          <span className="text-sm text-muted-foreground">
            {filteredContracts.length} of {mockContracts.length} contracts
          </span>
        </div>
      </div>

      <ContractFilters
        onSearchChange={setSearchTerm}
        onRiskTypeChange={setRiskTypeFilter}
        onStatusChange={setStatusFilter}
        onConfidenceChange={setConfidenceFilter}
        onClearFilters={clearFilters}
        hasActiveFilters={hasActiveFilters}
      />

      {filteredContracts.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <AlertCircle className="h-12 w-12 text-muted-foreground mb-4" />
            <h3 className="text-lg font-semibold mb-2">No contracts found</h3>
            <p className="text-muted-foreground text-center max-w-md">
              {hasActiveFilters
                ? "Try adjusting your filters or search terms to find more contracts."
                : "You haven't uploaded any contracts yet. Start by uploading a contract for analysis."}
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredContracts.map((contract, index) => (
            <ContractCard key={contract.id} {...contract} delay={index * 0.1} />
          ))}
        </div>
      )}
    </div>
  );
};

export default Contracts;
