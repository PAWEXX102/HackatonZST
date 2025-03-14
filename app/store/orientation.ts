import { create } from "zustand";

type Orientation = "portrait" | "landscape";

export const useOrientation = create<{
  orientation: Orientation;
}>((set) => ({
  orientation: "portrait",
  setOrientation: (orientation: Orientation) => set({ orientation }),
}));
