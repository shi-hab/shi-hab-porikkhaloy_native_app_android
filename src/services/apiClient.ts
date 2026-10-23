import axios, { AxiosError, InternalAxiosRequestConfig } from "axios";
import { Storage } from "./storage";

export const API_BASE_URL =
  process.env.EXPO_PUBLIC_API_BASE_URL || "https://api.porikkhaloy.com/api";

export const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 15000,
  headers: {
    Accept: "application/json",
    "Content-Type": "application/json",
  },
});

// Request interceptor: Attach JWT token
apiClient.interceptors.request.use(
  async (config: InternalAxiosRequestConfig) => {
    const token = await Storage.getToken();
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor: Global error formatting & 401 auto logout hook
let onUnauthorizedCallback: (() => void) | null = null;

export const setOnUnauthorizedCallback = (callback: () => void) => {
  onUnauthorizedCallback = callback;
};

apiClient.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    if (error.response?.status === 401) {
      await Storage.clearAll();
      if (onUnauthorizedCallback) {
        onUnauthorizedCallback();
      }
    }

    let friendlyMessage = "একটি সমস্যা হয়েছে। অনুগ্রহ করে আবার চেষ্টা করুন।";

    if (!error.response) {
      if (error.code === "ECONNABORTED") {
        friendlyMessage = "অনুরোধের সময় শেষ হয়ে গেছে। ইন্টারনেট সংযোগ পরীক্ষা করুন।";
      } else {
        friendlyMessage = "ইন্টারনেট সংযোগ নেই অথবা সার্ভার বন্ধ রয়েছে।";
      }
    } else if (error.response.status >= 500) {
      friendlyMessage = "সার্ভারে সাময়িক ত্রুটি দেখা দিয়েছে। কিছুক্ষণ পর চেষ্টা করুন।";
    } else if (error.response.data && typeof error.response.data === "object") {
      const data = error.response.data as any;
      if (data.message) {
        friendlyMessage = data.message;
      }
    }

    const enhancedError = new Error(friendlyMessage);
    (enhancedError as any).originalError = error;
    (enhancedError as any).status = error.response?.status;
    (enhancedError as any).data = error.response?.data;
    return Promise.reject(enhancedError);
  }
);
