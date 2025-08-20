"use client";

import React, { createContext, useContext, useReducer, ReactNode } from "react";

export interface OnboardingData {
  name: string;
  niche: string[];
  role: "freelancer" | "creator" | "";
}

interface OnboardingState {
  currentStep: number;
  data: OnboardingData;
  isComplete: boolean;
}

type OnboardingAction =
  | { type: "NEXT_STEP" }
  | { type: "PREV_STEP" }
  | { type: "GO_TO_STEP"; payload: number }
  | { type: "UPDATE_DATA"; payload: Partial<OnboardingData> }
  | { type: "COMPLETE" }
  | { type: "RESET" };

const initialState: OnboardingState = {
  currentStep: 1,
  data: {
    name: "",
    role: "",
    niche: [],
  },
  isComplete: false,
};

function onboardingReducer(
  state: OnboardingState,
  action: OnboardingAction
): OnboardingState {
  switch (action.type) {
    case "NEXT_STEP":
      return {
        ...state,
        currentStep: Math.min(state.currentStep + 1, 3),
        isComplete: state.currentStep + 1 > 3,
      };
    case "PREV_STEP":
      return {
        ...state,
        currentStep: Math.max(state.currentStep - 1, 1),
      };
    case "GO_TO_STEP":
      return {
        ...state,
        currentStep: action.payload,
      };
    case "UPDATE_DATA":
      return {
        ...state,
        data: { ...state.data, ...action.payload },
      };
    case "COMPLETE":
      return {
        ...state,
        isComplete: true,
      };
    case "RESET":
      return initialState;
    default:
      return state;
  }
}

interface OnboardingContextType {
  state: OnboardingState;
  dispatch: React.Dispatch<OnboardingAction>;
  updateData: (data: Partial<OnboardingData>) => void;
  nextStep: () => void;
  prevStep: () => void;
  goToStep: (step: number) => void;
  complete: () => void;
  reset: () => void;
}

const OnboardingContext = createContext<OnboardingContextType | undefined>(
  undefined
);

export function OnboardingProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(onboardingReducer, initialState);

  const updateData = (data: Partial<OnboardingData>) => {
    dispatch({ type: "UPDATE_DATA", payload: data });
  };

  const nextStep = () => {
    dispatch({ type: "NEXT_STEP" });
  };

  const prevStep = () => {
    dispatch({ type: "PREV_STEP" });
  };

  const goToStep = (step: number) => {
    dispatch({ type: "GO_TO_STEP", payload: step });
  };

  const complete = () => {
    dispatch({ type: "COMPLETE" });
  };

  const reset = () => {
    dispatch({ type: "RESET" });
  };

  const value: OnboardingContextType = {
    state,
    dispatch,
    updateData,
    nextStep,
    prevStep,
    goToStep,
    complete,
    reset,
  };

  return (
    <OnboardingContext.Provider value={value}>
      {children}
    </OnboardingContext.Provider>
  );
}

export function useOnboarding() {
  const context = useContext(OnboardingContext);
  if (context === undefined) {
    throw new Error("useOnboarding must be used within an OnboardingProvider");
  }
  return context;
}
