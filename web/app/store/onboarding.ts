import { create } from "zustand";

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

interface OnboardingActions {
  updateData: (data: Partial<OnboardingData>) => void;
  nextStep: () => void;
  prevStep: () => void;
  goToStep: (step: number) => void;
  complete: () => void;
  reset: () => void;
}

type OnboardingStore = OnboardingState & OnboardingActions;

const initialState: OnboardingState = {
  currentStep: 1,
  data: {
    name: "",
    role: "",
    niche: [],
  },
  isComplete: false,
};

export const useOnboardingStore = create<OnboardingStore>((set) => ({
  ...initialState,

  updateData: (data: Partial<OnboardingData>) => {
    set((state) => ({
      data: { ...state.data, ...data },
    }));
  },

  nextStep: () => {
    set((state) => ({
      currentStep: Math.min(state.currentStep + 1, 3),
      isComplete: state.currentStep + 1 > 3,
    }));
  },

  prevStep: () => {
    set((state) => ({
      currentStep: Math.max(state.currentStep - 1, 1),
    }));
  },

  goToStep: (step: number) => {
    set({ currentStep: step });
  },

  complete: () => {
    set({ isComplete: true });
  },

  reset: () => {
    set(initialState);
  },
}));
