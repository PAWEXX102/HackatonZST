import { create } from "zustand";

interface DeviceStore {
  isMobile: boolean;
  setIsMobile: (isMobile: boolean) => void;
}

export const useDeviceStore = create<DeviceStore>((set) => ({
  isMobile: false,
  setIsMobile: (isMobile: boolean) => set({ isMobile }),
}));
