"use client";

import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { 
  AlertTriangle, 
  AlertCircle, 
  AlertOctagon,
  ExternalLink,
  TrendingUp
} from "lucide-react";
import { Risk } from "../page";

interface RiskCardProps {
  risk: Risk;
  onSelect: () => void;
}

const getSeverityIcon = (severity: Risk["severity"]) => {
  switch (severity) {
    case "high":
      return <AlertOctagon className="w-4 h-4 text-red-600" />;
    case "medium":
      return <AlertTriangle className="w-4 h-4 text-yellow-600" />;
    case "low":
      return <AlertCircle className="w-4 h-4 text-green-600" />;
  }
};

const getSeverityColor = (severity: Risk["severity"]) => {
  switch (severity) {
    case "high":
      return "bg-red-100 text-red-800 border-red-200";
    case "medium":
      return "bg-yellow-100 text-yellow-800 border-yellow-200";
    case "low":
      return "bg-green-100 text-green-800 border-green-200";
  }
};

export const RiskCard: React.FC<RiskCardProps> = ({ risk, onSelect }) => {
  return (
    <Card className="cursor-pointer transition-all hover:shadow-md" onClick={onSelect}>
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-2">
            {getSeverityIcon(risk.severity)}
            <CardTitle className="text-sm font-medium">{risk.title}</CardTitle>
          </div>
          <Badge 
            variant="outline" 
            className={`text-xs ${getSeverityColor(risk.severity)}`}
          >
            {risk.severity} risk
          </Badge>
        </div>
        
        <div className="flex items-center gap-2">
          <Progress 
            value={risk.confidence * 100} 
            className={`h-1 flex-1 ${
              risk.severity === "high" ? "bg-red-100" : 
              risk.severity === "medium" ? "bg-yellow-100" : "bg-green-100"
            }`}
          />
          <span className="text-xs text-gray-500">
            {Math.round(risk.confidence * 100)}%
          </span>
        </div>
      </CardHeader>
      
      <CardContent className="pt-0">
        <p className="text-sm text-gray-700 mb-3 leading-relaxed">
          {risk.description}
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
