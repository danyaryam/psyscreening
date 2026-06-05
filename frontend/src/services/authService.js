import { env } from "@/config/env";
import { http } from "./http";
import { mockApi } from "./mock/mockApi";

export const authService = {
  async register(payload) {
    if (env.useMockApi) {
      return mockApi.register(payload);
    }

    const { data } = await http.post("/auth/register", payload);
    return data;
  },

  async login(payload) {
    if (env.useMockApi) {
      return mockApi.login(payload);
    }

    const { data } = await http.post("/auth/login", payload);
    return data;
  },

  async googleAuth(credential) {
    if (env.useMockApi) {
      throw new Error("Google OAuth tersedia saat frontend terhubung ke API asli.");
    }

    const { data } = await http.post("/auth/google", { credential });
    return data;
  },

  async verifyEmail(token) {
    if (env.useMockApi) {
      return { message: "Email berhasil diverifikasi." };
    }

    const { data } = await http.get("/auth/verify-email", { params: { token } });
    return data;
  },

  async resendVerification(email) {
    if (env.useMockApi) {
      return {
        message:
          "Jika email masih membutuhkan verifikasi, link verifikasi baru akan kami kirimkan.",
      };
    }

    const { data } = await http.post("/auth/resend-verification", { email });
    return data;
  },

  async getMe(token) {
    if (env.useMockApi) {
      return mockApi.getCurrentUser(token);
    }

    const { data } = await http.get("/auth/me");
    return data;
  },
};
