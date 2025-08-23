"use client";

import { X, Shield, ArrowUpDown, Calendar, TrendingUp } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Select,
  SelectItem,
  SelectValue,
  SelectTrigger,
  SelectContent,
} from "@/components/ui/select";

interface ContractFiltersProps {
  hasActiveFilters: boolean;
  onClearFilters: () => void;
  onStatusChange: (value: string) => void;
  onSortChange: (value: string) => void;
  onSortOrderChange: (value: string) => void;
  currentFilters: {
    statusFilter: string;
    sort: string;
    sortOrder: string;
  };
}

export const ContractFilters = ({
  onClearFilters,
  onStatusChange,
  onSortChange,
  onSortOrderChange,
  hasActiveFilters,
  currentFilters,
}: ContractFiltersProps) => {
  return (
    <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <Select
            onValueChange={onStatusChange}
            value={currentFilters.statusFilter}
          >
            <SelectTrigger className="w-full cursor-pointer">
              <div className="flex items-center gap-2">
                <Shield className="h-4 w-4" strokeWidth={1.5} />
                <SelectValue placeholder="Status" />
              </div>
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="ALL" className="cursor-pointer">
                All Status
              </SelectItem>
              <SelectItem value="completed" className="cursor-pointer">
                Completed
              </SelectItem>
              <SelectItem value="processing" className="cursor-pointer">
                Processing
              </SelectItem>
              <SelectItem value="pending" className="cursor-pointer">
                Pending
              </SelectItem>
              <SelectItem value="failed" className="cursor-pointer">
                Failed
              </SelectItem>
            </SelectContent>
          </Select>

          <Select onValueChange={onSortChange} value={currentFilters.sort}>
            <SelectTrigger className="w-full cursor-pointer">
              <div className="flex items-center gap-2">
                <ArrowUpDown className="h-4 w-4" strokeWidth={1.5} />
                <SelectValue placeholder="Sort By" />
              </div>
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="createdAt" className="cursor-pointer">
                <div className="flex items-center gap-2">
                  <Calendar className="h-3 w-3" strokeWidth={1.5} />
                  Date Created
                </div>
              </SelectItem>
              <SelectItem value="updatedAt" className="cursor-pointer">
                <div className="flex items-center gap-2">
                  <Calendar className="h-3 w-3" strokeWidth={1.5} />
                  Date Updated
                </div>
              </SelectItem>
              <SelectItem value="riskScore" className="cursor-pointer">
                <div className="flex items-center gap-2">
                  <TrendingUp className="h-3 w-3" strokeWidth={1.5} />
                  Risk Score
                </div>
              </SelectItem>
              <SelectItem value="confidenceScore" className="cursor-pointer">
                <div className="flex items-center gap-2">
                  <TrendingUp className="h-3 w-3" strokeWidth={1.5} />
                  Confidence Score
                </div>
              </SelectItem>
            </SelectContent>
          </Select>

          <Select
            onValueChange={onSortOrderChange}
            value={currentFilters.sortOrder}
          >
            <SelectTrigger className="w-full cursor-pointer">
              <div className="flex items-center gap-2">
                <ArrowUpDown className="h-4 w-4" strokeWidth={1.5} />
                <SelectValue placeholder="Order" />
              </div>
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="desc" className="cursor-pointer">
                Descending
              </SelectItem>
              <SelectItem value="asc" className="cursor-pointer">
                Ascending
              </SelectItem>
            </SelectContent>
          </Select>
        </div>

        {hasActiveFilters && (
          <Button
            variant="outline"
            size="sm"
            onClick={onClearFilters}
            className="flex items-center gap-2 w-full sm:w-auto justify-center"
          >
            <X className="h-3 w-3" strokeWidth={1.5} />
            Clear Filters
          </Button>
        )}
      </div>
    </div>
  );
};
