import { create } from "zustand";

interface ScrollStore {
  scroll: number;
  setScroll: (scroll: number) => void;
}

export const useScroll = create<ScrollStore>((set) => ({
  scroll: 0,
  setScroll: (scroll: number) => set({scroll}),
}));
