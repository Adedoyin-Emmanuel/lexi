"use client";

import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { 
  Calendar, 
  Clock, 
  CheckCircle,
  ExternalLink,
  TrendingUp
} from "lucide-react";
import { Obligation } from "../page";

interface ObligationCardProps {
  obligation: Obligation;
  onSelect: () => void;
}

const formatDeadline = (deadline: Date) => {
  const now = new Date();
  const diffTime = deadline.getTime() - now.getTime();
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  
  if (diffDays < 0) {
    return { text: "Overdue", color: "bg-red-100 text-red-800 border-red-200" };
  } else if (diffDays === 0) {
    return { text: "Due today", color: "bg-orange-100 text-orange-800 border-orange-200" };
  } else if (diffDays <= 7) {
    return { text: `Due in ${diffDays} days`, color: "bg-yellow-100 text-yellow-800 border-yellow-200" };
  } else {
    return { text: `Due in ${diffDays} days`, color: "bg-green-100 text-green-800 border-green-200" };
  }
};

export const ObligationCard: React.FC<ObligationCardProps> = ({ 
  obligation, 
  onSelect 
}) => {
  const deadlineInfo = obligation.deadline ? formatDeadline(obligation.deadline) : null;

  return (
    <Card className="cursor-pointer transition-all hover:shadow-md" onClick={onSelect}>
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-2">
            <Calendar className="w-4 h-4 text-blue-600" />
            <CardTitle className="text-sm font-medium">{obligation.title}</CardTitle>
          </div>
          {deadlineInfo && (
            <Badge 
              variant="outline" 
              className={`text-xs ${deadlineInfo.color}`}
            >
              {deadlineInfo.text}
            </Badge>
          )}
        </div>
        
        <div className="flex items-center gap-2">
          <Progress value={obligation.confidence * 100} className="h-1 flex-1" />
          <span className="text-xs text-gray-500">
            {Math.round(obligation.confidence * 100)}%
          </span>
        </div>
      </CardHeader>
      
      <CardContent className="pt-0">
        <p className="text-sm text-gray-700 mb-3 leading-relaxed">
          {obligation.description}
        </p>
        
        {obligation.deadline && (
          <div className="flex items-center gap-2 mb-3 text-xs text-gray-600">
            <Clock className="w-3 h-3" />
            <span>
              Deadline: {obligation.deadline.toLocaleDateString()} at{" "}
              {obligation.deadline.toLocaleTimeString([], { 
                hour: "2-digit", 
                minute: "2-digit" 
              })}
            </span>
          </div>
        )}
        
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
