export const env = {
  appName: import.meta.env.VITE_APP_NAME ?? "PsyScreening",
  apiBaseUrl:
    import.meta.env.VITE_API_URL ??
    import.meta.env.VITE_API_BASE_URL ??
    "http://localhost:5000/api",
  googleClientId: import.meta.env.VITE_GOOGLE_CLIENT_ID ?? "",
  useMockApi: import.meta.env.VITE_USE_MOCK_API === "true",
};
