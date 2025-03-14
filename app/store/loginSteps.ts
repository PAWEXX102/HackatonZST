import { create } from "zustand";

interface LoginStepsState {
  step: number;
  setStep: (step: number) => void;
}

export const useLoginSteps = create<LoginStepsState>((set) => ({
  step: 1,
  setStep: (step) => set({ step }),
}));
