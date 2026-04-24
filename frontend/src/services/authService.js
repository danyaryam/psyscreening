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

  async getMe(token) {
    if (env.useMockApi) {
      return mockApi.getCurrentUser(token);
    }

    const { data } = await http.get("/auth/me");
    return data;
  },
};
