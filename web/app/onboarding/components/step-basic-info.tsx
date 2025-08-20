"use client";

import React from "react";
import { Sparkles, User } from "lucide-react";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useOnboarding } from "./onboarding-context";

export function StepBasicInfo() {
  const { state, updateData, nextStep } = useOnboarding();
  const { name } = state.data;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (name.trim()) {
      nextStep();
    }
  };

  const isFormValid = name.trim();

  return (
    <div className="w-full max-w-md mx-auto text-center space-y-8">
      <div className="space-y-4">
        <div className="flex justify-center">
          <div className="w-16 h-16 bg-gradient-to-br from-primary to-primary/60 rounded-full flex items-center justify-center">
            <Sparkles className="h-8 w-8 text-primary-foreground" />
          </div>
        </div>
        <div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent">
            What should we call you?
          </h1>
          <p className="text-muted-foreground mt-2">
            Your name will be displayed on your profile
          </p>
        </div>
      </div>

      <div className="space-y-6">
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <User className="h-5 w-5 text-muted-foreground" />
          </div>
          <Input
            type="text"
            placeholder="Enter your name"
            value={name}
            onChange={(e) => updateData({ name: e.target.value })}
            className="pl-10 h-12 text-lg text-center font-medium border-2 focus:border-primary"
            autoFocus
          />
        </div>

        <Button
          onClick={handleSubmit}
          disabled={!isFormValid}
          className="w-full h-12 text-lg font-semibold bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70"
        >
          Continue
        </Button>
      </div>
    </div>
  );
}
