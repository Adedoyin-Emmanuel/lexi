"use client";

import React from "react";
import { Briefcase, User, ArrowLeft, ArrowRight } from "lucide-react";

import { Button } from "@/components/ui/button";
import { useOnboardingStore } from "@/app/store/onboarding";

export function StepRoleSelection() {
  const { data, updateData, nextStep, prevStep } = useOnboardingStore();
  const { role } = data;

  const handleRoleSelect = (selectedRole: "freelancer" | "creator") => {
    updateData({ role: selectedRole });
  };

  const handleContinue = () => {
    if (role) {
      nextStep();
    }
  };

  return (
    <div className="w-full max-w-2xl mx-auto text-center space-y-6 md:space-y-8 px-4 md:px-0">
      <div className="space-y-4">
        <h1 className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent">
          What do you do?
        </h1>
        <p className="text-muted-foreground text-base md:text-lg">
          Choose the option that best describes your work
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6 max-w-lg mx-auto">
        <div
          className={`relative p-6 md:p-8 rounded-2xl border border-neutral-300 transition-all duration-300 cursor-pointer group ${
            role === "freelancer"
              ? "border-primary bg-primary/5 shadow-lg"
              : "border-border hover:border-primary/50 hover:bg-muted/50"
          }`}
          onClick={() => handleRoleSelect("freelancer")}
        >
          <div className="space-y-4">
            <div
              className={`w-16 h-16 mx-auto rounded-full flex items-center justify-center transition-all ${
                role === "freelancer"
                  ? "bg-primary text-primary-foreground"
                  : "bg-neutral-50 border border-neutral-200 text-muted-foreground group-hover:bg-primary/10"
              }`}
            >
              <Briefcase className="h-8 w-8" strokeWidth={1} />
            </div>
            <div>
              <h3 className="text-xl font-semibold mb-2">Freelancer</h3>
              <p className="text-muted-foreground text-sm md:text-base">
                I provide services to clients and work on projects
              </p>
            </div>
          </div>
        </div>

        <div
          className={`relative p-6 md:p-8 rounded-2xl border border-neutral-300 transition-all duration-300 cursor-pointer group ${
            role === "creator"
              ? "border-primary bg-primary/5 shadow-lg"
              : "border-border hover:border-primary/50 hover:bg-muted/50"
          }`}
          onClick={() => handleRoleSelect("creator")}
        >
          <div className="space-y-4">
            <div
              className={`w-16 h-16 mx-auto rounded-full flex items-center justify-center transition-all ${
                role === "creator"
                  ? "bg-primary text-primary-foreground"
                  : "bg-neutral-50 border border-neutral-200 text-muted-foreground group-hover:bg-primary/10"
              }`}
            >
              <User className="h-8 w-8" strokeWidth={1} />
            </div>
            <div>
              <h3 className="text-xl font-semibold mb-2">Creator</h3>
              <p className="text-muted-foreground text-sm md:text-base">
                I create content and build an audience
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="flex justify-between items-center pt-6 md:pt-8">
        <Button
          variant="ghost"
          onClick={prevStep}
          className="flex items-center gap-2 hover:bg-muted hover:text-black cursor-pointer"
        >
          <ArrowLeft className="h-4 w-4" />
          Back
        </Button>

        <Button
          onClick={handleContinue}
          disabled={!role}
          className="flex items-center gap-2 bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70 cursor-pointer"
        >
          Continue
          <ArrowRight className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}
