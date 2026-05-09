import type { UserPublic } from "@/backend";
import { create } from "zustand";

interface UserStore {
  currentUser: UserPublic | null;
  isLoading: boolean;
  setCurrentUser: (user: UserPublic | null) => void;
  setIsLoading: (loading: boolean) => void;
  clearCurrentUser: () => void;
}

export const useUserStore = create<UserStore>((set) => ({
  currentUser: null,
  isLoading: false,
  setCurrentUser: (user) => set({ currentUser: user }),
  setIsLoading: (isLoading) => set({ isLoading }),
  clearCurrentUser: () => set({ currentUser: null }),
}));
