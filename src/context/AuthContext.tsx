import React, { createContext, useContext, useEffect, useState } from "react";
import { Student } from "../types/auth";
import { authService } from "../services/authService";
import { Storage } from "../services/storage";
import { setOnUnauthorizedCallback } from "../services/apiClient";

interface AuthContextType {
  student: Student | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (phone: string, password?: string) => Promise<void>;
  register: (payload: any) => Promise<void>;
  logout: () => Promise<void>;
  updateStudentData: (updated: Partial<Student>) => void;
  refreshProfile: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({} as AuthContextType);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [student, setStudent] = useState<Student | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Register auto-logout on 401
    setOnUnauthorizedCallback(() => {
      setToken(null);
      setStudent(null);
    });

    const bootstrapAuth = async () => {
      try {
        const storedToken = await Storage.getToken();
        const storedUser = await Storage.getUserData();

        if (storedToken) {
          setToken(storedToken);
          if (storedUser) {
            setStudent(storedUser);
          }
          // Fetch fresh profile in background
          authService
            .getProfile()
            .then((fresh) => setStudent(fresh))
            .catch(() => {});
        }
      } catch {
        // ignore
      } finally {
        setIsLoading(false);
      }
    };

    bootstrapAuth();
  }, []);

  const login = async (phone: string, password?: string) => {
    const res = await authService.login(phone, password);
    setToken(res.token);
    setStudent(res.student);
  };

  const register = async (payload: any) => {
    const res = await authService.register(payload);
    setToken(res.token);
    setStudent(res.student);
  };

  const logout = async () => {
    await authService.logout();
    setToken(null);
    setStudent(null);
  };

  const updateStudentData = (updated: Partial<Student>) => {
    if (student) {
      const merged = { ...student, ...updated };
      setStudent(merged);
      Storage.saveUserData(merged);
    }
  };

  const refreshProfile = async () => {
    try {
      const fresh = await authService.getProfile();
      setStudent(fresh);
    } catch {
      // ignore
    }
  };

  return (
    <AuthContext.Provider
      value={{
        student,
        token,
        isAuthenticated: Boolean(token),
        isLoading,
        login,
        register,
        logout,
        updateStudentData,
        refreshProfile,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
