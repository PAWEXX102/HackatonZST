import { create } from "zustand";

interface DarkBackgroundStore {
  darkBackground: boolean;
  setDarkBackground: (darkBackground: boolean) => void;
}

export const useDarkBackgroundStore = create<DarkBackgroundStore>((set) => ({
  darkBackground: false,
  setDarkBackground: (darkBackground: boolean) => set({ darkBackground }),
}));
