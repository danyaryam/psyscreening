import { env } from "@/config/env";
import { getStoredToken, http } from "./http";
import { mockApi } from "./mock/mockApi";

export const userService = {
  async getProfile() {
    const token = getStoredToken();
    if (env.useMockApi) {
      return mockApi.getProfile(token);
    }

    const { data } = await http.get("/users/profile");
    return data;
  },

  async updateProfile(payload) {
    const token = getStoredToken();
    if (env.useMockApi) {
      return mockApi.updateProfile(token, payload);
    }

    const { data } = await http.put("/users/profile", payload);
    return data;
  },

  async getHistory() {
    const token = getStoredToken();
    if (env.useMockApi) {
      return mockApi.getUserHistory(token);
    }

    const { data } = await http.get("/users/history");
    return data;
  },
};
