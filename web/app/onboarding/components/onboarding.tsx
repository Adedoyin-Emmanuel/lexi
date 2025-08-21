"use client";

import { gsap } from "gsap";
import React, { useEffect, useRef } from "react";

import { useAuth } from "@/hooks/use-auth";
import { StepBasicInfo } from "./step-basic-info";
import { OnboardingProgressBar } from "./progress-bar";
import { OnboardingSuccess } from "./onboarding-success";
import { StepRoleSelection } from "./step-role-selection";
import { StepNicheSelection } from "./step-niche-selection";
import { useOnboardingStore } from "@/app/store/onboarding";
import { Loader2 } from "lucide-react";

const stepComponents = [StepBasicInfo, StepRoleSelection, StepNicheSelection];

export function Onboarding() {
  const { hasOnboarded, isLoading } = useAuth();
  const containerRef = useRef<HTMLDivElement>(null);
  const stepRefs = useRef<(HTMLDivElement | null)[]>([]);
  const { currentStep, isComplete } = useOnboardingStore();

  useEffect(() => {
    if (stepRefs.current.length !== stepComponents.length) {
      stepRefs.current = new Array(stepComponents.length).fill(null);
    }
  }, []);

  useEffect(() => {
    const currentStepIndex = currentStep - 1;
    const currentStepElement = stepRefs.current[currentStepIndex];
    const container = containerRef.current;

    if (!currentStepElement || !container) return;

    gsap.fromTo(
      currentStepElement,
      {
        opacity: 0,
        y: 20,
        scale: 0.95,
      },
      {
        opacity: 1,
        y: 0,
        scale: 1,
        duration: 0.5,
        ease: "power2.out",
      }
    );

    gsap.to(".progress-bar", {
      scaleX: currentStep / stepComponents.length,
      duration: 0.6,
      ease: "power2.out",
    });
  }, [currentStep]);

  if (isComplete) {
    return <OnboardingSuccess />;
  }

  if (isLoading) {
    return (
      <div className="min-h-screen w-full flex flex-col justify-center items-center space-y-4">
        <Loader2 className="animate-spin text-primary" />
        <p className="text-muted-foreground">Loading...</p>
      </div>
    );
  }

  if (hasOnboarded) {
    return <OnboardingSuccess isExistingUser />;
  }

  return (
    <div className="w-full ">
      <div className="w-full py-4 md:py-8">
        <OnboardingProgressBar />

        <div
          ref={containerRef}
          className="flex justify-center items-center min-h-[calc(100vh-200px)] py-4 md:py-12"
        >
          <div className="w-full max-w-4xl  md:px-0">
            {stepComponents.map((StepComponent, index) => {
              const stepNumber = index + 1;
              return (
                <div
                  key={stepNumber}
                  ref={(el) => {
                    stepRefs.current[index] = el;
                  }}
                  className={`${
                    stepNumber === currentStep ? "block" : "hidden"
                  }`}
                >
                  <StepComponent />
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
