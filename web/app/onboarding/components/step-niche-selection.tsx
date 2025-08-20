"use client";

import React from "react";
import { ArrowLeft, ArrowRight, Target } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useOnboardingStore } from "@/app/store/onboarding";

const nicheOptions = [
  "Art",
  "Design",
  "Music",
  "Fitness",
  "Finance",
  "Fashion",
  "Travel",
  "Gaming",
  "Sports",
  "Writing",
  "Marketing",
  "Education",
  "Consulting",
  "Photography",
  "E-commerce",
  "Technology",
  "Healthcare",
  "Real Estate",
  "Food & Beverage",
  "Video Production",
];

export function StepNicheSelection() {
  const { data, updateData, nextStep, prevStep } = useOnboardingStore();
  const { niche } = data;

  const handleNicheToggle = (selectedNiche: string) => {
    const updatedNiche = niche.includes(selectedNiche)
      ? niche.filter((n) => n !== selectedNiche)
      : [...niche, selectedNiche];

    updateData({ niche: updatedNiche });
  };

  const handleContinue = () => {
    if (niche.length > 0) {
      nextStep();
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto text-center space-y-8">
      <div className="space-y-4">
        <div className="flex justify-center">
          <div className="w-16 h-16 bg-gradient-to-br from-primary to-primary/60 rounded-full flex items-center justify-center">
            <Target className="h-8 w-8 text-primary-foreground" />
          </div>
        </div>
        <div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent">
            What are your specialties?
          </h1>
          <p className="text-muted-foreground text-lg">
            Select all the areas that apply to your work
          </p>
        </div>
      </div>

      <div className="space-y-6">
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-3 max-w-3xl mx-auto">
          {nicheOptions.map((option) => (
            <Button
              key={option}
              variant={niche.includes(option) ? "default" : "outline"}
              size="sm"
              className={`h-auto py-4 px-4 text-sm font-medium transition-all duration-200 ${
                niche.includes(option)
                  ? "bg-primary text-primary-foreground shadow-lg scale-105"
                  : "hover:border-primary/50 hover:bg-muted/50"
              }`}
              onClick={() => handleNicheToggle(option)}
            >
              {option}
            </Button>
          ))}
        </div>

        {niche.length > 0 && (
          <div className="space-y-3 max-w-2xl mx-auto">
            <p className="text-sm font-medium text-muted-foreground">
              You selected {niche.length}{" "}
              {niche.length === 1 ? "niche" : "niches"}:
            </p>
            <div className="flex flex-wrap justify-center gap-2">
              {niche.map((selected) => (
                <Badge
                  key={selected}
                  variant="secondary"
                  className="px-3 py-1 text-sm bg-primary/10 text-primary border-primary/20"
                >
                  {selected}
                </Badge>
              ))}
            </div>
          </div>
        )}
      </div>

      <div className="flex justify-between items-center pt-8">
        <Button
          variant="ghost"
          onClick={prevStep}
          className="flex items-center gap-2 hover:bg-muted"
        >
          <ArrowLeft className="h-4 w-4" />
          Back
        </Button>

        <Button
          onClick={handleContinue}
          disabled={niche.length === 0}
          className="flex items-center gap-2 bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70"
        >
          Continue
          <ArrowRight className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}
