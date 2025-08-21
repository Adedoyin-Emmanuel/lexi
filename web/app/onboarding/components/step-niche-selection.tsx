"use client";

import toast from "react-hot-toast";
import React, { useState } from "react";
import { ArrowLeft, ArrowRight, Target, Loader2 } from "lucide-react";

import { Axios } from "@/app/config/axios";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useOnboardingStore } from "@/app/store/onboarding";

const nicheOptions = [
  "SEO",
  "Coaching",
  "Youtuber",
  "Animation",
  "E-commerce",
  "Podcasting",
  "Logo Design",
  "UI/UX Design",
  "Photography",
  "Copywriting",
  "Blog Writing",
  "Illustration",
  "Voice Acting",
  "Video Editing",
  "Graphic Design",
  "Brand Identity",
  "Market Research",
  "Content Writing",
  "Email Marketing",
  "Web Development",
  "Game Development",
  "Video Production",
  "Content Creation",
  "Digital Marketing",
  "Project Management",
  "Business Consulting",
  "AI & Machine Learning",
  "Fullstack Development",
  "Mobile App Development",
  "Blockchain Development",
  "Social Media Management",
];

export function StepNicheSelection() {
  const [isLoading, setIsLoading] = useState(false);
  const { data, updateData, nextStep, prevStep } = useOnboardingStore();
  const { niche } = data;

  const handleNicheToggle = (selectedNiche: string) => {
    const updatedNiche = niche.includes(selectedNiche)
      ? niche.filter((n) => n !== selectedNiche)
      : niche.length < 5
      ? [...niche, selectedNiche]
      : niche;

    updateData({ niche: updatedNiche });
  };

  const handleContinue = () => {
    if (niche.length > 0) {
      nextStep();
    }
  };

  const handleUpdateOnboardingDetails = async () => {
    try {
      setIsLoading(true);

      const dataToSend = {
        specialities: niche,
        userType: data.role,
        displayName: data.name,
      };

      await Axios.post("/user/onboard", dataToSend);

      handleContinue();
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      const errorMessage = error?.response?.data?.message;

      toast.error(errorMessage || "Something went wrong");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto text-center space-y-6 md:space-y-8 px-4 md:px-0">
      <div className="space-y-4">
        <div className="flex justify-center">
          <div className="w-16 h-16 bg-gradient-to-br from-primary to-primary/60 rounded-full flex items-center justify-center">
            <Target className="h-8 w-8 text-primary-foreground" />
          </div>
        </div>
        <div>
          <h1 className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent">
            What are your specialties?
          </h1>
          <p className="text-muted-foreground text-base md:text-lg">
            Select all the areas that apply to your work
          </p>
        </div>
      </div>

      <div className="space-y-6">
        <div className="max-w-3xl mx-auto">
          <ScrollArea className="h-[400px] w-full rounded-lg border border-border p-4">
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-2 md:gap-3">
              {nicheOptions.map((option) => (
                <Button
                  key={option}
                  variant={niche.includes(option) ? "default" : "outline"}
                  size="sm"
                  className={`h-auto py-3 md:py-4 px-3 md:px-4 text-xs md:text-sm font-medium transition-all duration-200 min-w-0 flex-1 ${
                    niche.includes(option)
                      ? "bg-primary text-primary-foreground shadow-lg scale-105 cursor-pointer"
                      : niche.length >= 5 && !niche.includes(option)
                      ? "opacity-50 cursor-not-allowed"
                      : "hover:border-primary/50 hover:bg-muted/50 hover:text-black cursor-pointer"
                  }`}
                  onClick={() => handleNicheToggle(option)}
                  disabled={niche.length >= 5 && !niche.includes(option)}
                >
                  <span className="truncate">{option}</span>
                </Button>
              ))}
            </div>
          </ScrollArea>
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
          onClick={handleUpdateOnboardingDetails}
          disabled={niche.length === 0 || isLoading}
          className="flex items-center gap-2 bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70 cursor-pointer"
        >
          {isLoading ? (
            <>
              <Loader2 className="animate-spin text-white" strokeWidth={1.5} />
              <span className="text-sm font-medium">Loading...</span>
            </>
          ) : (
            "Continue"
          )}
          <ArrowRight className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}
