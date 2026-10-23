export interface LeaderboardUser {
  rank: number;
  student_id: number;
  name: string;
  avatar?: string;
  institution?: string;
  score: number;
  streak_count?: number;
  tier?: "diamond" | "platinum" | "gold" | "silver" | "bronze";
}

export interface MyLeaderboardStatus {
  rank: number;
  score: number;
  streak_count: number;
  tier: string;
  next_tier_points_needed: number;
}
