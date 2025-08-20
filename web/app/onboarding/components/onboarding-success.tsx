"use client";

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
    <div className="min-h-screen bg-gradient-to-br from-background to-muted/20 flex items-center justify-center p-4 relative overflow-hidden">
      <Confetti
        width={window.innerWidth}
        height={window.innerHeight}
        recycle={false}
        numberOfPieces={200}
        colors={["#3b82f6", "#8b5cf6", "#06b6d4", "#10b981", "#f59e0b"]}
      />

      <div className="w-full max-w-md mx-auto text-center space-y-8 relative z-10">
        <div className="space-y-4">
          <div className="mx-auto w-20 h-20 bg-gradient-to-br from-primary to-primary/60 rounded-full flex items-center justify-center shadow-sm">
            <PartyPopper className="h-10 w-10 text-white" strokeWidth={1.5} />
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

        <Button
          onClick={handleGoToDashboard}
          className="w-full h-12 bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70 cursor-pointer"
        >
          Continue
          <ArrowRight className="h-4 w-4 ml-2" />
        </Button>
      </div>
    </div>
  );
}
