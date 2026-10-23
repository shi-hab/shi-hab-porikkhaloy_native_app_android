import { apiClient } from "./apiClient";
import { Storage } from "./storage";
import { LoginResponse, RegisterPayload, Student } from "../types/auth";

export const authService = {
  async login(phone: string, password?: string): Promise<{ token: string; student: Student }> {
    const response = await apiClient.post<LoginResponse>("/login", {
      phone,
      password,
    });
    const { token, student } = response.data.data;
    await Storage.saveToken(token);
    await Storage.saveUserData(student);
    return { token, student };
  },

  async register(payload: RegisterPayload): Promise<{ token: string; student: Student }> {
    const response = await apiClient.post<LoginResponse>("/register", payload);
    const { token, student } = response.data.data;
    if (token) {
      await Storage.saveToken(token);
      await Storage.saveUserData(student);
    }
    return { token, student };
  },

  async checkAccount(phone: string): Promise<any> {
    const response = await apiClient.post("/check-account", { phone });
    return response.data;
  },

  async getProfile(): Promise<Student> {
    const response = await apiClient.get<{ data: Student }>("/profile");
    const student = response.data.data;
    await Storage.saveUserData(student);
    return student;
  },

  async updateProfile(data: Partial<Student>): Promise<Student> {
    const response = await apiClient.post<{ data: Student }>("/profile", data);
    const student = response.data.data;
    await Storage.saveUserData(student);
    return student;
  },

  async logout(): Promise<void> {
    try {
      await apiClient.post("/logout");
    } catch {
      // ignore
    } finally {
      await Storage.clearAll();
    }
  },

  async deleteAccount(): Promise<void> {
    await apiClient.post("/delete-account");
    await Storage.clearAll();
  },
};
