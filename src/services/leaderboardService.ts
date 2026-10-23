import { apiClient } from "./apiClient";
import { LeaderboardUser, MyLeaderboardStatus } from "../types/leaderboard";

export const leaderboardService = {
  async getLeaderboard(params?: {
    myClass?: boolean;
    page?: number;
    perPage?: number;
  }): Promise<{ data: LeaderboardUser[]; total: number }> {
    const response = await apiClient.get("/leaderboard", {
      params: {
        my_class: params?.myClass ? 1 : 0,
        page: params?.page || 1,
        per_page: params?.perPage || 50,
      },
    });
    return response.data;
  },

  async getMyStatus(): Promise<MyLeaderboardStatus> {
    const response = await apiClient.get("/leaderboard/me");
    return response.data;
  },
};
