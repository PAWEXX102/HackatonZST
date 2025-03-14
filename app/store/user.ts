import { create } from "zustand";

interface UserState {
  email: string;
  displayName: string;
  uid: string;
  role: string;
  isLoading: boolean;
}
export const useUser = create((set) => ({
  user: null,
  setUser: (user: UserState) => set({ user }),
}));
