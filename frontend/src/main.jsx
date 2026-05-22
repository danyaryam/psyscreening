import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { GoogleOAuthProvider } from "@react-oauth/google";
import { Toaster } from "react-hot-toast";
import App from "./App";
import { env } from "./config/env";
import { AuthProvider } from "./contexts/AuthContext";
import { ThemeProvider } from "./contexts/ThemeContext";
import "./index.css";

function GoogleProvider({ children }) {
  if (!env.googleClientId) {
    return children;
  }

  return (
    <GoogleOAuthProvider clientId={env.googleClientId}>
      {children}
    </GoogleOAuthProvider>
  );
}

ReactDOM.createRoot(document.getElementById("root")).render(
  <ThemeProvider>
    <GoogleProvider>
      <BrowserRouter>
        <AuthProvider>
          <App />
          <Toaster
            position="top-right"
            toastOptions={{
              duration: 3500,
              style: {
                borderRadius: "1rem",
                background: "rgba(15, 23, 42, 0.92)",
                color: "#f8fafc",
                border: "1px solid rgba(148, 163, 184, 0.18)",
              },
            }}
          />
        </AuthProvider>
      </BrowserRouter>
    </GoogleProvider>
  </ThemeProvider>,
);
