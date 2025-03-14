import { create } from "zustand";

interface ChangePasswordState {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
}

export const useChangePassword = create<ChangePasswordState>((set) => ({
  isOpen: false,
  setIsOpen: (isOpen) => set({ isOpen }),
}));
