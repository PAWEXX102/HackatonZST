import { create } from "zustand";

interface LoadingStore {
  loading: boolean;
  setLoading: (loading: boolean) => void;
}

export const useLoading = create<LoadingStore>((set) => ({
  loading: false,
  setLoading: (loading: boolean) => set({ loading }),
}));
