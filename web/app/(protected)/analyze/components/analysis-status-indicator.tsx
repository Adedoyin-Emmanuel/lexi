"use client";

import React from "react";
import { cn } from "@/lib/utils";
import { CheckCircle, Loader2 } from "lucide-react";

interface AnalysisStatusIndicatorProps {
  currentStep:
    | "idle"
    | "validating"
    | "structuring"
    | "summarizing"
    | "extracting"
    | "completed"
    | "failed";
  isAnalyzing: boolean;
}

const steps = [
  { key: "validating", label: "Validating" },
  { key: "structuring", label: "Structuring" },
  { key: "summarizing", label: "Summarizing" },
  { key: "extracting", label: "Extracting" },
  { key: "completed", label: "Complete" },
];

export const AnalysisStatusIndicator: React.FC<
  AnalysisStatusIndicatorProps
> = ({ currentStep, isAnalyzing }) => {
  if (!isAnalyzing && currentStep === "idle") {
    return null;
  }

  if (currentStep === "failed") {
    return (
      <div className="w-full px-4 py-3 mb-4">
        <div className="flex items-center gap-3 text-destructive">
          <div className="w-2 h-2 bg-destructive rounded-full"></div>
          <span className="text-sm font-medium">Analysis failed</span>
        </div>
      </div>
    );
  }

  const currentStepIndex = steps.findIndex((step) => step.key === currentStep);

  return (
    <div className="w-full px-4 py-3 mb-4">
      <div className="flex items-center gap-2">
        {steps.map((step, index) => {
          const isActive = index === currentStepIndex;
          const isCompleted = index < currentStepIndex;
          const isPending = index > currentStepIndex;

          return (
            <React.Fragment key={step.key}>
              <div className="flex items-center gap-2">
                <div
                  className={cn(
                    "flex items-center justify-center w-6 h-6 rounded-full text-xs font-medium transition-colors",
                    isCompleted && "bg-primary text-primary-foreground",
                    isActive &&
                      "bg-primary/20 text-primary border border-primary",
                    isPending && "bg-muted text-muted-foreground"
                  )}
                >
                  {isCompleted ? (
                    <CheckCircle className="w-3 h-3" strokeWidth={1.5}/>
                  ) : isActive ? (
                    <Loader2 className="w-3 h-3 animate-spin" strokeWidth={1.5}/>
                  ) : (
                    index + 1
                  )}
                </div>
                <span
                  className={cn(
                    "text-xs font-medium hidden sm:block transition-colors",
                    isCompleted && "text-primary",
                    isActive && "text-primary",
                    isPending && "text-muted-foreground"
                  )}
                >
                  {step.label}
                </span>
              </div>

              {index < steps.length - 1 && (
                <div
                  className={cn(
                    "flex-1 h-px transition-colors",
                    isCompleted ? "bg-primary" : "bg-border"
                  )}
                />
              )}
            </React.Fragment>
          );
        })}
      </div>
    </div>
  );
};
