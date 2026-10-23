import { apiClient } from "./apiClient";

export interface DashboardData {
  self: {
    id: number;
    name: string;
    phone: string;
    avatar?: string;
    total_exams?: number;
    total_mcq?: number;
    accuracy?: number;
    points?: number;
    streak_count?: number;
  };
  studentStreakDay: Array<{
    date: string;
    active: boolean;
  }>;
  recent_exams?: any[];
  upcoming_exams?: any[];
  announcements?: any[];
}

export const dashboardService = {
  async getDashboardData(): Promise<DashboardData> {
    const response = await apiClient.get<DashboardData>("/dashboard");
    return response.data;
  },

  async getStreakData(): Promise<any> {
    const response = await apiClient.get("/streak");
    return response.data;
  },
};
