import axios from "axios";
import { env } from "@/config/env";

const TOKEN_STORAGE_KEY = "psyscreening_access_token";
export const UNAUTHORIZED_EVENT = "psyscreening:unauthorized";

export const http = axios.create({
  baseURL: env.apiBaseUrl,
  timeout: 15000,
  headers: {
    "Content-Type": "application/json",
  },
});

http.interceptors.request.use((config) => {
  const token = window.localStorage.getItem(TOKEN_STORAGE_KEY);

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

http.interceptors.response.use(
  (response) => response,
  (error) => {
    const status = error.response?.status;
    const requestUrl = error.config?.url ?? "";
    const message =
      error.response?.data?.message ||
      error.message ||
      "Terjadi kesalahan pada request.";

    const isAuthFormRequest =
      requestUrl.includes("/auth/login") || requestUrl.includes("/auth/register");

    if (status === 401 && getStoredToken() && !isAuthFormRequest) {
      clearStoredToken();
      window.dispatchEvent(new Event(UNAUTHORIZED_EVENT));
    }

    return Promise.reject(new Error(message));
  },
);

export function getStoredToken() {
  return window.localStorage.getItem(TOKEN_STORAGE_KEY);
}

export function setStoredToken(token) {
  window.localStorage.setItem(TOKEN_STORAGE_KEY, token);
}

export function clearStoredToken() {
  window.localStorage.removeItem(TOKEN_STORAGE_KEY);
}
