import { env } from "@/config/env";
import { getStoredToken, http } from "./http";
import { mockApi } from "./mock/mockApi";

export const screeningService = {
  async start() {
    const token = getStoredToken();

    if (env.useMockApi) {
      return mockApi.startScreening(token);
    }

    const { data } = await http.post("/screenings/start");
    return data;
  },

  async answer(payload) {
    const token = getStoredToken();

    if (env.useMockApi) {
      return mockApi.answerScreening(token, payload);
    }

    const { data } = await http.post("/screenings/answer", payload);
    return data;
  },

  async submit(payload) {
    const token = getStoredToken();

    if (env.useMockApi) {
      return mockApi.submitScreening(token, payload);
    }

    const { data } = await http.post("/screenings/submit", payload);
    return data;
  },

  async getAll() {
    const token = getStoredToken();

    if (env.useMockApi) {
      return mockApi.getScreenings(token);
    }

    const { data } = await http.get("/screenings");
    return data;
  },

  async getById(screeningId) {
    const token = getStoredToken();

    if (env.useMockApi) {
      return mockApi.getScreeningById(token, screeningId);
    }

    const { data } = await http.get(`/screenings/${screeningId}`);
    return data;
  },
};
