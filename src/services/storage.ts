import AsyncStorage from "@react-native-async-storage/async-storage";
import * as SecureStore from "expo-secure-store";
import { Platform } from "react-native";

const TOKEN_KEY = "porikkhaloy_auth_token";
const USER_KEY = "porikkhaloy_user_data";

export const Storage = {
  async saveToken(token: string): Promise<void> {
    try {
      if (Platform.OS === "web") {
        await AsyncStorage.setItem(TOKEN_KEY, token);
      } else {
        await SecureStore.setItemAsync(TOKEN_KEY, token);
      }
    } catch {
      await AsyncStorage.setItem(TOKEN_KEY, token);
    }
  },

  async getToken(): Promise<string | null> {
    try {
      if (Platform.OS === "web") {
        return await AsyncStorage.getItem(TOKEN_KEY);
      }
      return await SecureStore.getItemAsync(TOKEN_KEY);
    } catch {
      return await AsyncStorage.getItem(TOKEN_KEY);
    }
  },

  async removeToken(): Promise<void> {
    try {
      if (Platform.OS !== "web") {
        await SecureStore.deleteItemAsync(TOKEN_KEY);
      }
    } catch {
      // ignore
    }
    await AsyncStorage.removeItem(TOKEN_KEY);
  },

  async saveUserData(user: any): Promise<void> {
    await AsyncStorage.setItem(USER_KEY, JSON.stringify(user));
  },

  async getUserData(): Promise<any | null> {
    const raw = await AsyncStorage.getItem(USER_KEY);
    if (!raw) return null;
    try {
      return JSON.parse(raw);
    } catch {
      return null;
    }
  },

  async clearAll(): Promise<void> {
    await this.removeToken();
    await AsyncStorage.removeItem(USER_KEY);
  },
};
