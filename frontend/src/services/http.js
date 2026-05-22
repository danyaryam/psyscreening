import axios from "axios";
import { env } from "@/config/env";

const TOKEN_STORAGE_KEY = "psyscreening_access_token";
export const UNAUTHORIZED_EVENT = "psyscreening:unauthorized";
let memoryToken = null;

function getBrowserStorage(storageName) {
  try {
    return window?.[storageName] ?? null;
  } catch {
    return null;
  }
}

function readFromStorage(storage) {
  try {
    return storage?.getItem(TOKEN_STORAGE_KEY) ?? null;
  } catch {
    return null;
  }
}

function writeToStorage(storage, token) {
  if (!storage) {
    return false;
  }

  try {
    storage.setItem(TOKEN_STORAGE_KEY, token);
    return true;
  } catch {
    return false;
  }
}

function removeFromStorage(storage) {
  if (!storage) {
    return;
  }

  try {
    storage.removeItem(TOKEN_STORAGE_KEY);
  } catch {
    // Storage can be unavailable in restricted browser contexts.
  }
}

export const http = axios.create({
  baseURL: env.apiBaseUrl,
  timeout: 15000,
  headers: {
    "Content-Type": "application/json",
  },
});

http.interceptors.request.use((config) => {
  const token = getStoredToken();

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
      requestUrl.includes("/auth/login") ||
      requestUrl.includes("/auth/register") ||
      requestUrl.includes("/auth/google") ||
      requestUrl.includes("/auth/verify-email") ||
      requestUrl.includes("/auth/resend-verification");

    if (status === 401 && getStoredToken() && !isAuthFormRequest) {
      clearStoredToken();
      window.dispatchEvent(new Event(UNAUTHORIZED_EVENT));
    }

    return Promise.reject(new Error(message));
  },
);

export function getStoredToken() {
  return (
    readFromStorage(getBrowserStorage("localStorage")) ??
    readFromStorage(getBrowserStorage("sessionStorage")) ??
    memoryToken
  );
}

export function setStoredToken(token) {
  memoryToken = token;

  if (writeToStorage(getBrowserStorage("localStorage"), token)) {
    return "localStorage";
  }

  if (writeToStorage(getBrowserStorage("sessionStorage"), token)) {
    return "sessionStorage";
  }

  return "memory";
}

export function clearStoredToken() {
  memoryToken = null;
  removeFromStorage(getBrowserStorage("localStorage"));
  removeFromStorage(getBrowserStorage("sessionStorage"));
}
