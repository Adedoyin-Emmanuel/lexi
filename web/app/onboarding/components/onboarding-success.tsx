"use client";

import React from "react";
import { CheckCircle, ArrowRight, Sparkles } from "lucide-react";

import { Button } from "@/components/ui/button";
import { useOnboarding } from "./onboarding-context";

export function OnboardingSuccess() {
  const { state, reset } = useOnboarding();
  const { data } = state;

  const handleGoToDashboard = () => {
    console.log("Redirecting to dashboard...");
  };

  const handleStartOver = () => {
    reset();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-muted/20 flex items-center justify-center p-4">
      <div className="w-full max-w-md mx-auto text-center space-y-8">
        <div className="space-y-4">
          <div className="mx-auto w-20 h-20 bg-gradient-to-br from-green-500 to-green-600 rounded-full flex items-center justify-center shadow-lg">
            <CheckCircle className="h-10 w-10 text-white" />
          </div>
          <div className="space-y-2">
            <h1 className="text-3xl font-bold bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent">
              You&apos;re all set!
            </h1>
            <p className="text-muted-foreground text-lg">
              Welcome to the community, {data.name}! 🎉
            </p>
          </div>
        </div>

        <div className="bg-muted/50 rounded-2xl p-6 space-y-4">
          <div className="flex items-center gap-2 justify-center">
            <Sparkles className="h-5 w-5 text-primary" />
            <h3 className="font-semibold">Your Profile</h3>
          </div>
          <div className="space-y-3 text-left">
            <div className="flex justify-between items-center">
              <span className="text-muted-foreground">Name:</span>
              <span className="font-medium">{data.name}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-muted-foreground">Role:</span>
              <span className="font-medium capitalize">{data.role}</span>
            </div>
            <div className="flex justify-between items-start">
              <span className="text-muted-foreground">Specialties:</span>
              <div className="text-right">
                {data.niche.map((niche) => (
                  <div key={niche} className="text-sm font-medium">
                    {niche}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className="flex gap-3">
          <Button
            variant="outline"
            onClick={handleStartOver}
            className="flex-1 h-12"
          >
            Start Over
          </Button>
          <Button
            onClick={handleGoToDashboard}
            className="flex-1 h-12 bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70"
          >
            Get Started
            <ArrowRight className="h-4 w-4 ml-2" />
          </Button>
        </div>
      </div>
    </div>
  );
}
