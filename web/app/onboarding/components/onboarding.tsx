"use client";

import { gsap } from "gsap";
import React, { useEffect, useRef } from "react";

import { StepBasicInfo } from "./step-basic-info";
import { OnboardingProgressBar } from "./progress-bar";
import { OnboardingSuccess } from "./onboarding-success";
import { StepRoleSelection } from "./step-role-selection";
import { StepNicheSelection } from "./step-niche-selection";
import { useOnboardingStore } from "@/app/store/onboarding";

const stepComponents = [StepBasicInfo, StepRoleSelection, StepNicheSelection];

export function Onboarding() {
  const { currentStep, isComplete } = useOnboardingStore();
  const stepRefs = useRef<(HTMLDivElement | null)[]>([]);
  const containerRef = useRef<HTMLDivElement>(null);

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

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-muted/20">
      <div className="container mx-auto px-4 py-4 md:py-8">
        <OnboardingProgressBar />

        <div
          ref={containerRef}
          className="flex justify-center items-start min-h-[60vh] py-8 md:py-12"
        >
          <div className="w-full max-w-4xl px-4 md:px-0">
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
