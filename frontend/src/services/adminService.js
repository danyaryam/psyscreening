import { env } from "@/config/env";
import { getStoredToken, http } from "./http";
import { mockApi } from "./mock/mockApi";

export const adminService = {
  async getStats() {
    const token = getStoredToken();

    if (env.useMockApi) {
      return mockApi.getAdminStats(token);
    }

    const { data } = await http.get("/admin/stats");
    return data;
  },

  async getUsers() {
    const token = getStoredToken();

    if (env.useMockApi) {
      return mockApi.getAdminUsers(token);
    }

    const { data } = await http.get("/admin/users");
    return data;
  },

  async getUserById(userId) {
    const token = getStoredToken();

    if (env.useMockApi) {
      return mockApi.getAdminUserById(token, userId);
    }

    const { data } = await http.get(`/admin/users/${userId}`);
    return data;
  },

  async getScreenings() {
    const token = getStoredToken();

    if (env.useMockApi) {
      return mockApi.getAdminScreenings(token);
    }

    const { data } = await http.get("/admin/screenings");
    return data;
  },

  async getQuestions() {
    const token = getStoredToken();

    if (env.useMockApi) {
      return mockApi.getAdminQuestions(token);
    }

    const { data } = await http.get("/admin/questions");
    return data;
  },

  async createQuestion(payload) {
    const token = getStoredToken();

    if (env.useMockApi) {
      return mockApi.createQuestion(token, payload);
    }

    const { data } = await http.post("/admin/questions", payload);
    return data;
  },

  async updateQuestion(questionId, payload) {
    const token = getStoredToken();

    if (env.useMockApi) {
      return mockApi.updateQuestion(token, questionId, payload);
    }

    const { data } = await http.put(`/admin/questions/${questionId}`, payload);
    return data;
  },

  async deleteQuestion(questionId) {
    const token = getStoredToken();

    if (env.useMockApi) {
      return mockApi.deleteQuestion(token, questionId);
    }

    const { data } = await http.delete(`/admin/questions/${questionId}`);
    return data;
  },
};
