"use client";

import { useState } from "react";
import { AlertCircle } from "lucide-react";
import { useQuery } from "@tanstack/react-query";

import {
  Pagination,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationContent,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { Axios } from "@/app/config/axios";
import { Card, CardContent } from "@/components/ui/card";
import { ContractCard, ContractFilters } from "./components";
import { ContractCardSkeleton } from "@/components/loading-skeleton";

interface Contract {
  id: string;
  title: string;
  createdAt: string;
  riskScore: number;
  confidenceScore: number;
}

interface ContractsResponse {
  skip: number;
  take: number;
  total: number;
  contracts: Contract[];
}

interface ContractFilters {
  statusFilter: string;
  sort: string;
  sortOrder: string;
}

const Contracts = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [filters, setFilters] = useState<ContractFilters>({
    statusFilter: "ALL",
    sort: "createdAt",
    sortOrder: "desc",
  });

  const pageSize = 10;
  const skip = (currentPage - 1) * pageSize;

  const {
    data: contractsData,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["contracts", skip, pageSize, filters],
    queryFn: async (): Promise<ContractsResponse> => {
      const params = new URLSearchParams({
        skip: skip.toString(),
        take: pageSize.toString(),
        sort: filters.sort,
        sortOrder: filters.sortOrder,
      });

      if (filters.statusFilter !== "ALL") {
        params.append("statusFilter", filters.statusFilter);
      }

      const response = await Axios.get<{ data: ContractsResponse }>(
        `/contract?${params}`
      );
      return response.data.data;
    },
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
  });

  const contracts = contractsData?.contracts || [];
  const totalContracts = contractsData?.total || 0;
  const totalPages = Math.ceil(totalContracts / pageSize);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handleStatusFilterChange = (status: string) => {
    setFilters((prev) => ({ ...prev, statusFilter: status }));
    setCurrentPage(1);
  };

  const handleSortChange = (sort: string) => {
    setFilters((prev) => ({ ...prev, sort }));
    setCurrentPage(1);
  };

  const handleSortOrderChange = (sortOrder: string) => {
    setFilters((prev) => ({ ...prev, sortOrder }));
    setCurrentPage(1);
  };

  const hasActiveFilters =
    filters.statusFilter !== "ALL" ||
    filters.sort !== "createdAt" ||
    filters.sortOrder !== "desc";

  const clearFilters = () => {
    setFilters({
      statusFilter: "ALL",
      sort: "createdAt",
      sortOrder: "desc",
    });
    setCurrentPage(1);
  };

  const generatePaginationItems = () => {
    const items = [];
    const maxVisiblePages = 5;

    if (totalPages <= maxVisiblePages) {
      for (let i = 1; i <= totalPages; i++) {
        items.push(i);
      }
    } else {
      if (currentPage <= 3) {
        for (let i = 1; i <= 4; i++) {
          items.push(i);
        }
        items.push("...");
        items.push(totalPages);
      } else if (currentPage >= totalPages - 2) {
        items.push(1);
        items.push("...");
        for (let i = totalPages - 3; i <= totalPages; i++) {
          items.push(i);
        }
      } else {
        items.push(1);
        items.push("...");
        for (let i = currentPage - 1; i <= currentPage + 1; i++) {
          items.push(i);
        }
        items.push("...");
        items.push(totalPages);
      }
    }

    return items;
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        <br />
        <ContractFilters
          onStatusChange={handleStatusFilterChange}
          onSortChange={handleSortChange}
          onSortOrderChange={handleSortOrderChange}
          onClearFilters={clearFilters}
          hasActiveFilters={hasActiveFilters}
          currentFilters={filters}
        />

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {Array.from({ length: 6 }).map((_, index) => (
            <ContractCardSkeleton key={index} />
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="space-y-6">
        <br />
        <ContractFilters
          onStatusChange={handleStatusFilterChange}
          onSortChange={handleSortChange}
          onSortOrderChange={handleSortOrderChange}
          onClearFilters={clearFilters}
          hasActiveFilters={hasActiveFilters}
          currentFilters={filters}
        />

        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <AlertCircle className="h-12 w-12 text-red-500 mb-4" />
            <h3 className="text-lg font-semibold mb-2">
              Error Loading Contracts
            </h3>
            <p className="text-muted-foreground text-center max-w-md mb-4">
              Failed to load contracts. Please try again.
            </p>
            <button
              onClick={() => window.location.reload()}
              className="px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors"
            >
              Try Again
            </button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <br />
      <ContractFilters
        onStatusChange={handleStatusFilterChange}
        onSortChange={handleSortChange}
        onSortOrderChange={handleSortOrderChange}
        onClearFilters={clearFilters}
        hasActiveFilters={hasActiveFilters}
        currentFilters={filters}
      />

      {contracts.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <AlertCircle
              className="h-12 w-12 text-muted-foreground mb-4"
              strokeWidth={1.5}
            />
            <h3 className="text-lg font-semibold mb-2">No contracts found</h3>
            <p className="text-muted-foreground text-center max-w-md">
              {hasActiveFilters
                ? "Try adjusting your filters to find more contracts."
                : "You haven't uploaded any contracts yet. Start by uploading a contract for analysis."}
            </p>
          </CardContent>
        </Card>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {contracts.map((contract, index) => (
              <ContractCard
                key={contract.id}
                {...contract}
                delay={index * 0.1}
              />
            ))}
          </div>

          {totalPages > 1 && (
            <div className="flex justify-center pt-6">
              <Pagination>
                <PaginationContent>
                  <PaginationItem>
                    <PaginationPrevious
                      href="#"
                      onClick={(e) => {
                        e.preventDefault();
                        if (currentPage > 1) {
                          handlePageChange(currentPage - 1);
                        }
                      }}
                      className={
                        currentPage === 1
                          ? "pointer-events-none opacity-50"
                          : "cursor-pointer"
                      }
                    />
                  </PaginationItem>

                  {generatePaginationItems().map((item, index) => (
                    <PaginationItem key={index}>
                      {item === "..." ? (
                        <span className="px-3 py-2 text-sm text-muted-foreground">
                          ...
                        </span>
                      ) : (
                        <PaginationLink
                          href="#"
                          onClick={(e) => {
                            e.preventDefault();
                            handlePageChange(item as number);
                          }}
                          isActive={currentPage === item}
                          className="cursor-pointer"
                        >
                          {item}
                        </PaginationLink>
                      )}
                    </PaginationItem>
                  ))}

                  <PaginationItem>
                    <PaginationNext
                      href="#"
                      onClick={(e) => {
                        e.preventDefault();
                        if (currentPage < totalPages) {
                          handlePageChange(currentPage + 1);
                        }
                      }}
                      className={
                        currentPage === totalPages
                          ? "pointer-events-none opacity-50"
                          : "cursor-pointer"
                      }
                    />
                  </PaginationItem>
                </PaginationContent>
              </Pagination>
            </div>
          )}

          {contracts.length > 0 && (
            <div className="text-center text-sm text-muted-foreground pt-4">
              Showing {skip + 1}-
              {Math.min(skip + contracts.length, totalContracts)} of{" "}
              {totalContracts} contracts
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default Contracts;
