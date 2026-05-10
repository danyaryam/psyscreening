import { createContext, useEffect, useMemo, useState } from "react";
import toast from "react-hot-toast";
import { authService } from "@/services/authService";
import {
  clearStoredToken,
  getStoredToken,
  setStoredToken,
  UNAUTHORIZED_EVENT,
} from "@/services/http";

export const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;

    async function bootstrap() {
      const token = getStoredToken();

      if (!token) {
        if (mounted) setLoading(false);
        return;
      }

      try {
        const response = await authService.getMe(token);
        if (mounted) {
          setUser(response.user);
        }
      } catch (error) {
        clearStoredToken();
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    }

    bootstrap();

    return () => {
      mounted = false;
    };
  }, []);

  useEffect(() => {
    const onUnauthorized = () => {
      clearStoredToken();
      setUser(null);
      toast.error("Sesi Anda berakhir. Silakan login kembali.");
    };

    window.addEventListener(UNAUTHORIZED_EVENT, onUnauthorized);

    return () => {
      window.removeEventListener(UNAUTHORIZED_EVENT, onUnauthorized);
    };
  }, []);

  const value = useMemo(
    () => ({
      user,
      loading,
      isAuthenticated: Boolean(user),
      async login(payload) {
        const response = await authService.login(payload);
        setStoredToken(response.token);
        setUser(response.user);
        toast.success("Login berhasil.");
        return response.user;
      },
      async register(payload) {
        const response = await authService.register(payload);
        setStoredToken(response.token);
        setUser(response.user);
        toast.success("Akun berhasil dibuat.");
        return response.user;
      },
      logout() {
        clearStoredToken();
        setUser(null);
        toast.success("Anda telah logout.");
      },
      updateSessionUser(nextUser) {
        setUser(nextUser);
      },
    }),
    [loading, user],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
