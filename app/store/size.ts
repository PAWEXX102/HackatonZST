import { create } from "zustand";

interface SizeStore {
  isSmall: boolean;
  setIsSmall: (isSmall: boolean) => void;
}

export const useSizeStore = create<SizeStore>((set) => ({
  isSmall: false,
  setIsSmall: (isSmall: boolean) => set({ isSmall }),
}));