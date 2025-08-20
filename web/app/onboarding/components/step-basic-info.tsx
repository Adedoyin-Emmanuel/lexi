"use client";

import React from "react";
import { Sparkles, User } from "lucide-react";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useOnboardingStore } from "@/app/store/onboarding";

export function StepBasicInfo() {
  const { data, updateData, nextStep } = useOnboardingStore();
  const { name } = data;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (name.trim()) {
      nextStep();
    }
  };

  const isFormValid = name.trim();

  return (
    <div className="w-full max-w-md mx-auto text-center space-y-6 md:space-y-8 px-4 md:px-0">
      <div className="space-y-4">
        <div className="flex justify-center">
          <div className="w-16 h-16 bg-gradient-to-br from-primary to-primary/60 rounded-full flex items-center justify-center">
            <Sparkles
              className="h-8 w-8 text-primary-foreground"
              strokeWidth={1}
            />
          </div>
        </div>
        <div>
          <h1 className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent">
            What should we call you?
          </h1>
          <p className="text-muted-foreground mt-2 text-sm md:text-base">
            Your name will be displayed on your profile
          </p>
        </div>
      </div>

      <div className="space-y-6">
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <User className="h-5 w-5 text-muted-foreground" strokeWidth={1.5} />
          </div>
          <Input
            type="text"
            placeholder="Enter your name"
            value={name}
            onChange={(e) => updateData({ name: e.target.value })}
            className="pl-10 h-12 md:text-lg text-center font-medium "
            autoFocus
          />
        </div>

        <Button
          onClick={handleSubmit}
          disabled={!isFormValid}
          className="w-full h-12 text-lg font-medium bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70 cursor-pointer"
        >
          Continue
        </Button>
      </div>
    </div>
  );
}
