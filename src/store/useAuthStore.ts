import { create } from "zustand";

import { login, logout, me } from "../mock/api";
import { User } from "../types";

type AuthState = {
  user: User | null;
  token: string | null;
  hydrate: () => Promise<void>;
  signIn: (mobileNumber: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
};

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  token: null,
  hydrate: async () => {
    const user = await me();
    if (user) set({ user, token: "mock" });
  },
  signIn: async (mobileNumber, password) => {
    try {
      const { token, user } = await login(mobileNumber, password);
      set({ token, user });
    } catch (error) {
      console.error("Login failed:", error.message);
      throw error; // Re-throw the error to handle it in the UI
    }
  },
  signOut: async () => {
    await logout();
    set({ user: null, token: null });
  },
}));
