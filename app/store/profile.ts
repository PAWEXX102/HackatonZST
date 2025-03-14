import { create } from "zustand";

interface ProfileStore {
  profileOpen: boolean;
  setProfileOpen: (profileOpen: boolean) => void;
}

export const useProfileStore = create<ProfileStore>((set) => ({
  profileOpen: false,
  setProfileOpen: (profileOpen: boolean) => set({ profileOpen }),
}));
