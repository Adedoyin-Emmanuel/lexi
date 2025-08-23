"use client";

import { useState } from "react";
import { Search, X, AlertTriangle, Shield, Target } from "lucide-react";

import { Input } from "@/components/ui/input";
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
  onSearchChange: (value: string) => void;
  onRiskTypeChange: (value: string) => void;
  onConfidenceChange: (value: string) => void;
}

export const ContractFilters = ({
  onSearchChange,
  onClearFilters,
  onStatusChange,
  hasActiveFilters,
  onRiskTypeChange,
  onConfidenceChange,
}: ContractFiltersProps) => {
  const [searchValue, setSearchValue] = useState("");

  const handleSearchChange = (value: string) => {
    setSearchValue(value);
    onSearchChange(value);
  };

  return (
    <div className="flex items-center justify-between gap-4 flex-wrap">
      <div className="relative flex-1 min-w-64 max-w-md">
        <Search
          className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground"
          strokeWidth={1.5}
        />
        <Input
          placeholder="Search contracts..."
          value={searchValue}
          onChange={(e) => handleSearchChange(e.target.value)}
          className="pl-10"
        />
      </div>

      <div className="flex items-center gap-3">
        <Select onValueChange={onRiskTypeChange}>
          <SelectTrigger className="w-40 cursor-pointer">
            <div className="flex items-center gap-2">
              <AlertTriangle className="h-4 w-4" strokeWidth={1.5} />
              <SelectValue placeholder="Risk Type" />
            </div>
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all" className="cursor-pointer">
              All
            </SelectItem>
            <SelectItem value="Low" className="cursor-pointer">
              Low
            </SelectItem>
            <SelectItem value="Medium" className="cursor-pointer">
              Medium
            </SelectItem>
            <SelectItem value="High" className="cursor-pointer">
              High
            </SelectItem>
          </SelectContent>
        </Select>

        <Select onValueChange={onStatusChange}>
          <SelectTrigger className="w-40 cursor-pointer">
            <div className="flex items-center gap-2">
              <Shield className="h-4 w-4" strokeWidth={1.5} />
              <SelectValue placeholder="Status" />
            </div>
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all" className="cursor-pointer">
              All
            </SelectItem>
            <SelectItem value="Safe" className="cursor-pointer">
              Safe
            </SelectItem>
            <SelectItem value="Risky" className="cursor-pointer">
              Risky
            </SelectItem>
            <SelectItem value="Processing" className="cursor-pointer">
              Processing
            </SelectItem>
            <SelectItem value="Needs Review" className="cursor-pointer">
              Needs Review
            </SelectItem>
          </SelectContent>
        </Select>

        <Select onValueChange={onConfidenceChange}>
          <SelectTrigger className="w-40 cursor-pointer">
            <div className="flex items-center gap-2">
              <Target className="h-4 w-4" strokeWidth={1.5} />
              <SelectValue placeholder="Confidence" />
            </div>
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all" className="cursor-pointer">
              All
            </SelectItem>
            <SelectItem value="high" className="cursor-pointer">
              High (80%+)
            </SelectItem>
            <SelectItem value="medium" className="cursor-pointer">
              Medium (60-79%)
            </SelectItem>
            <SelectItem value="low" className="cursor-pointer">
              Low (&lt;60%)
            </SelectItem>
          </SelectContent>
        </Select>

        {hasActiveFilters && (
          <Button
            variant="outline"
            size="sm"
            onClick={onClearFilters}
            className="flex items-center gap-2"
          >
            <X className="h-3 w-3" strokeWidth={1.5} />
            Clear Filters
          </Button>
        )}
      </div>
    </div>
  );
};
