import { create } from "zustand";

import {
  login,
  logout,
  me,
  registerWithOtp,
  requestOtp,
  verifyOtp,
} from "../mock/api";
import { User } from "../types";
import { getToken } from "../mock/storage";

type AuthState = {
  user: User | null;
  token: string | null;
  hydrate: () => Promise<void>;
  signIn: (mobileNumber: string, password: string) => Promise<void>;
  requestOtp: (
    mobileNumber: string,
  ) => Promise<{ expiresIn?: number; message?: string }>;
  verifyOtp: (
    mobileNumber: string,
    otp: string,
  ) => Promise<{ verified: boolean; otpToken?: string; message?: string }>;
  signUp: (
    name: string,
    mobileNumber: string,
    pin: string,
    otp: string,
    otpToken?: string,
  ) => Promise<void>;
  signOut: () => Promise<void>;
};

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  token: null,
  hydrate: async () => {
    const user = await me();
    const token = await getToken();
    if (user && token) set({ user, token });
  },
  signIn: async (mobileNumber, password) => {
    try {
      const { token, user } = await login(mobileNumber, password);
      set({ token, user });
    } catch (error) {
      console.error(
        "Login failed:",
        error instanceof Error ? error.message : error,
      );
      throw error; // Re-throw the error to handle it in the UI
    }
  },
  requestOtp: async (mobileNumber) => {
    return requestOtp(mobileNumber);
  },
  verifyOtp: async (mobileNumber, otp) => {
    return verifyOtp(mobileNumber, otp);
  },
  signUp: async (name, mobileNumber, pin, otp, otpToken) => {
    try {
      const { token, user } = await registerWithOtp(
        name,
        mobileNumber,
        pin,
        otp,
        otpToken,
      );
      set({ token, user });
    } catch (error) {
      console.error(
        "Registration failed:",
        error instanceof Error ? error.message : error,
      );
      throw error;
    }
  },
  signOut: async () => {
    await logout();
    set({ user: null, token: null });
  },
}));
