"use client";

import React from "react";
import { Progress } from "@/components/ui/progress";
import { useOnboarding } from "./onboarding-context";

const steps = [
  { id: 1, title: "Name" },
  { id: 2, title: "Role" },
  { id: 3, title: "Niche" },
];

export function OnboardingProgressBar() {
  const { state } = useOnboarding();
  const { currentStep } = state;

  const progressPercentage = (currentStep / steps.length) * 100;

  return (
    <div className="w-full max-w-2xl mx-auto px-4 py-6">
      <div className="space-y-4">
        <div className="relative">
          <Progress value={progressPercentage} className="h-2" />
        </div>

        <div className="text-center">
          <p className="text-sm text-muted-foreground">
            Step {currentStep} of {steps.length}
          </p>
        </div>
      </div>
    </div>
  );
}
