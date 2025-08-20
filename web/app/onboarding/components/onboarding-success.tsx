"use client";

import React from "react";
import Confetti from "react-confetti";
import { ArrowRight, PartyPopper } from "lucide-react";

import { Button } from "@/components/ui/button";
import { useOnboardingStore } from "@/app/store/onboarding";

export function OnboardingSuccess() {
  const { data } = useOnboardingStore();

  const handleGoToDashboard = () => {
    console.log("Redirecting to dashboard...");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-muted/20 flex items-center justify-center relative overflow-hidden">
      <Confetti
        width={window.innerWidth}
        height={window.innerHeight}
        recycle={false}
        numberOfPieces={200}
  
        colors={["#3b82f6", "#8b5cf6", "#06b6d4", "#10b981", "#f59e0b"]}
      />

      <div className="w-full max-w-md mx-auto text-center space-y-6 md:space-y-8 relative z-10 px-2 md:px-0">
        <div className="space-y-4">
          <div className="mx-auto w-20 h-20 bg-gradient-to-br from-primary to-primary/60 rounded-full flex items-center justify-center shadow-sm">
            <PartyPopper className="h-10 w-10 text-white" strokeWidth={1.5} />
          </div>
          <div className="space-y-2">
            <h1 className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent">
              You&apos;re all set!
            </h1>
            <p className="text-muted-foreground text-base md:text-lg">
              Welcome to the community, {data.name}! 🎉
            </p>
          </div>
        </div>

        <div className="bg-muted/50 rounded-2xl p-4 md:p-6 space-y-4">
          <div className="space-y-3 text-left">
            <div className="flex justify-between items-center">
              <span className="text-muted-foreground text-sm md:text-base">
                Name:
              </span>
              <span className="font-medium text-sm md:text-base">
                {data.name}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-muted-foreground text-sm md:text-base">
                Role:
              </span>
              <span className="font-medium capitalize text-sm md:text-base">
                {data.role}
              </span>
            </div>
            <div className="flex justify-between items-start">
              <span className="text-muted-foreground text-sm md:text-base">
                Specialties:
              </span>
              <div className="text-right">
                {data.niche.map((niche) => (
                  <div key={niche} className="text-xs md:text-sm font-medium">
                    {niche}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        <Button
          onClick={handleGoToDashboard}
          className="w-full h-12 bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70"
        >
          Continue
          <ArrowRight className="h-4 w-4 ml-2" />
        </Button>
      </div>
    </div>
  );
}
