"use client";

import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { 
  DollarSign, 
  Shield, 
  FileText, 
  Clock, 
  Lock, 
  AlertTriangle,
  ExternalLink,
  TrendingUp
} from "lucide-react";
import { Clause } from "../page";

interface ClauseCardProps {
  clause: Clause;
  isSelected: boolean;
  onSelect: () => void;
}

const getCategoryIcon = (category: Clause["category"]) => {
  switch (category) {
    case "payment":
      return <DollarSign className="w-4 h-4" />;
    case "liability":
      return <Shield className="w-4 h-4" />;
    case "ip":
      return <FileText className="w-4 h-4" />;
    case "termination":
      return <Clock className="w-4 h-4" />;
    case "confidentiality":
      return <Lock className="w-4 h-4" />;
    default:
      return <AlertTriangle className="w-4 h-4" />;
  }
};

const getCategoryColor = (category: Clause["category"]) => {
  switch (category) {
    case "payment":
      return "bg-green-100 text-green-800 border-green-200";
    case "liability":
      return "bg-red-100 text-red-800 border-red-200";
    case "ip":
      return "bg-blue-100 text-blue-800 border-blue-200";
    case "termination":
      return "bg-orange-100 text-orange-800 border-orange-200";
    case "confidentiality":
      return "bg-purple-100 text-purple-800 border-purple-200";
    default:
      return "bg-gray-100 text-gray-800 border-gray-200";
  }
};

const getImportanceColor = (importance: Clause["importance"]) => {
  switch (importance) {
    case "high":
      return "bg-red-100 text-red-800";
    case "medium":
      return "bg-yellow-100 text-yellow-800";
    case "low":
      return "bg-green-100 text-green-800";
  }
};

export const ClauseCard: React.FC<ClauseCardProps> = ({ 
  clause, 
  isSelected, 
  onSelect 
}) => {
  return (
    <Card 
      className={`cursor-pointer transition-all hover:shadow-md ${
        isSelected ? "ring-2 ring-indigo-500 bg-indigo-50" : ""
      }`}
      onClick={onSelect}
    >
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-2">
            {getCategoryIcon(clause.category)}
            <CardTitle className="text-sm font-medium">{clause.title}</CardTitle>
          </div>
          <div className="flex items-center gap-1">
            <Badge 
              variant="outline" 
              className={`text-xs ${getCategoryColor(clause.category)}`}
            >
              {clause.category}
            </Badge>
            <Badge 
              variant="outline" 
              className={`text-xs ${getImportanceColor(clause.importance)}`}
            >
              {clause.importance}
            </Badge>
          </div>
        </div>
        
        <div className="flex items-center gap-2">
          <Progress value={clause.confidence * 100} className="h-1 flex-1" />
          <span className="text-xs text-gray-500">
            {Math.round(clause.confidence * 100)}%
          </span>
        </div>
      </CardHeader>
      
      <CardContent className="pt-0">
        <p className="text-sm text-gray-700 mb-3 leading-relaxed">
          "{clause.content}"
        </p>
        
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-xs text-gray-500">
            <TrendingUp className="w-3 h-3" />
            <span>AI confidence level</span>
          </div>
          
          <Button 
            variant="ghost" 
            size="sm" 
            className="h-6 px-2 text-xs"
            onClick={(e) => {
              e.stopPropagation();
              // Handle view in document
            }}
          >
            <ExternalLink className="w-3 h-3 mr-1" />
            View
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};
