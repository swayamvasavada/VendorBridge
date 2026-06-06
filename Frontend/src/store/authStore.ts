import { create } from "zustand";
import axios from "axios";
import { Login } from "../apiPath";

interface LoginPayload {
  email: string;
  password: string;
}

interface AuthState {
  loading: boolean;
  login: (payload: LoginPayload) => Promise<any>;
}

export const useAuthStore = create<AuthState>((set) => ({
  loading: false,

  login: async (payload) => {
    try {
      set({ loading: true });

      console.log("========== LOGIN REQUEST ==========");
      console.log("URL:", Login);
      console.log("Payload:", payload);

      const response = await axios.post(Login, payload);

      console.log("========== LOGIN RESPONSE ==========");
      console.log("Status:", response.status);
      console.log("Data:", response.data);

      set({ loading: false });

      return response.data;
    } catch (error: any) {
      set({ loading: false });

      console.log("========== LOGIN ERROR ==========");
      console.log("Message:", error.message);
      console.log("Response:", error.response?.data);
      console.log("Status:", error.response?.status);

      throw error;
    }
  },
}));