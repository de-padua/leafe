import { User } from "@/types";
import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

type UserStore = {
  currentUser: User | null;
  isNotFound: boolean;
  isLoading: boolean;
  isLoadingError: Error | null;
  set: (user: User) => void;
  setNotFound: () => void;
  setNull: () => void;
  setLoading: (state: boolean) => void;
  setLoadingError: (error: Error) => void;
  remove: () => void;
};

export const useUserStore = create<UserStore>()((set) => ({
  currentUser: null,
  isNotFound: false,
  isLoading: false,
  isLoadingError: null,
  set: (user) => set({ currentUser: user, isNotFound: false }),
  setNotFound: () => set({ currentUser: null, isNotFound: true }),
  setNull: () => set({ currentUser: null, isNotFound: false }),
  setLoading: (state) => set({ isLoading: state }),
  setLoadingError: (state) => set({ isLoadingError: state }),
  remove: () => set({ currentUser: null, isNotFound: false }),
}));
 