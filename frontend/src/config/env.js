export const env = {
  appName: import.meta.env.VITE_APP_NAME ?? "PsyScreening",
  apiBaseUrl: import.meta.env.VITE_API_BASE_URL ?? "/api",
  useMockApi: import.meta.env.VITE_USE_MOCK_API === "true",
};
