import { create } from "zustand";
import { persist } from "zustand/middleware";
import axios from "axios";
import {
  Login,
  forgotPassword as forgotPasswordPath,
  vendorRegistration as vendorRegistrationPath,
} from "../apiPath";

interface LoginPayload {
  email: string;
  password: string;
}

interface ForgotPasswordPayload {
  email: string;
}

interface VendorRegistrationPayload {
  name: string;
  email: string;
  password: string;
  phoneNo: string;
  role: string;
  companyName: string;
  additionalInfo: string;
}

export interface AuthUser {
  name: string;
  email: string;
  role: string;
  token: string;
  isVerified: boolean;
}

interface AuthState {
  loading: boolean;
  user: AuthUser | null;

  setUser: (user: AuthUser | null) => void;
  logout: () => void;

  login: (payload: LoginPayload) => Promise<any>;
  forgotPassword: (payload: ForgotPasswordPayload) => Promise<any>;
  vendorRegistration: (
    payload: VendorRegistrationPayload
  ) => Promise<any>;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      loading: false,

      user: null,

      setUser: (user) => set({ user }),

      logout: () => {
        set({ user: null });
      },

      login: async (payload) => {
        try {
          set({ loading: true });

          const response = await axios.post(
            Login,
            payload
          );

          const user =
            response.data.serviceResult;

          set({
            loading: false,
            user,
          });

          return response.data;
        } catch (error) {
          set({ loading: false });
          throw error;
        }
      },

      forgotPassword: async (payload) => {
        try {
          set({ loading: true });

          const response = await axios.post(
            forgotPasswordPath,
            payload
          );

          set({ loading: false });

          return response.data;
        } catch (error) {
          set({ loading: false });
          throw error;
        }
      },

      vendorRegistration: async (payload) => {
        try {
          set({ loading: true });

          const response = await axios.post(
            vendorRegistrationPath,
            payload
          );

          set({ loading: false });

          return response.data;
        } catch (error) {
          set({ loading: false });
          throw error;
        }
      },
    }),
    {
      name: "vendorbridge-auth",
      partialize: (state) => ({
        user: state.user,
      }),
    }
  )
);