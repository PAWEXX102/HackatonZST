import { create } from "zustand";

interface FocusStore {
  focus: boolean;
  setFocus: (focus: boolean) => void;
}

export const useFocus = create<FocusStore>((set) => ({
  focus: false,
  setFocus: (focus: boolean) => set({ focus }),
}));
