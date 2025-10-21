// Badge levels enum
export enum BadgeLevel {
  BRONZE = "bronze",
  SILVER = "silver",
  GOLD = "gold",
  PLATINUM = "platinum"
}

// Ranking metric types
export enum RankingMetric {
  TASKS_COMPLETED = "tasks_completed",
  COMPLETION_SPEED = "completion_speed",
  CHALLENGE_SUCCESS = "challenge_success",
  TOTAL_POINTS = "total_points"
}

// Props types (data passed to components)
export interface LeaderboardProps {
  userId: string;
  userName: string;
}

export interface UserStats {
  userId: string;
  userName: string;
  rank: number;
  totalPoints: number;
  tasksCompleted: number;
  completionSpeed: number;
  challengeSuccessRate: number;
  currentStreak: number;
  longestStreak: number;
  badge: BadgeLevel;
  speedScore: number;
  productivityScore: number;
}

export interface LeaderboardEntry {
  rank: number;
  userId: string;
  userName: string;
  tasksCompleted: number;
  completionSpeed: number;
  challengeSuccessRate: number;
  totalPoints: number;
  badge: BadgeLevel;
}

export interface PointsBreakdown {
  completionPoints: number;
  speedBonusPoints: number;
  challengePoints: number;
  streakBonusPoints: number;
}

export interface BadgeProgress {
  currentBadge: BadgeLevel;
  nextBadge: BadgeLevel | null;
  currentStreak: number;
  streakNeeded: number;
  tasksUntilNextBadge: number;
}

// Query types (API response data)
export interface LeaderboardQueryData {
  userStats: UserStats;
  leaderboard: LeaderboardEntry[];
  pointsBreakdown: PointsBreakdown;
  badgeProgress: BadgeProgress;
}