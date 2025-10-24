import type { BadgeLevel } from '../types/leaderboard.ts';

// Data passed as props to the root component
export const mockRootProps = {
  userId: "user123",
  userName: "John Doe"
};

// Mock data for leaderboard and gamification
export const mockQuery = {
  userStats: {
    userId: "user123",
    userName: "John Doe",
    rank: 5,
    totalPoints: 2450,
    tasksCompleted: 87,
    completionSpeed: 4.2,
    challengeSuccessRate: 85,
    currentStreak: 12,
    longestStreak: 18,
    badge: "silver" as BadgeLevel,
    speedScore: 92,
    productivityScore: 88
  },
  leaderboard: [
    {
      rank: 1,
      userId: "user456",
      userName: "Sarah Johnson",
      tasksCompleted: 156,
      completionSpeed: 6.8,
      challengeSuccessRate: 95,
      totalPoints: 4820,
      badge: "platinum" as BadgeLevel
    },
    {
      rank: 2,
      userId: "user789",
      userName: "Mike Chen",
      tasksCompleted: 142,
      completionSpeed: 6.2,
      challengeSuccessRate: 92,
      totalPoints: 4350,
      badge: "gold" as BadgeLevel
    },
    {
      rank: 3,
      userId: "user101",
      userName: "Emily Rodriguez",
      tasksCompleted: 128,
      completionSpeed: 5.5,
      challengeSuccessRate: 88,
      totalPoints: 3890,
      badge: "gold" as BadgeLevel
    },
    {
      rank: 4,
      userId: "user202",
      userName: "David Kim",
      tasksCompleted: 98,
      completionSpeed: 4.8,
      challengeSuccessRate: 86,
      totalPoints: 2980,
      badge: "silver" as BadgeLevel
    },
    {
      rank: 5,
      userId: "user123",
      userName: "John Doe",
      tasksCompleted: 87,
      completionSpeed: 4.2,
      challengeSuccessRate: 85,
      totalPoints: 2450,
      badge: "silver" as BadgeLevel
    }
  ],
  pointsBreakdown: {
    completionPoints: 1740,
    speedBonusPoints: 450,
    challengePoints: 260,
    streakBonusPoints: 0
  },
  badgeProgress: {
    currentBadge: "silver" as BadgeLevel,
    nextBadge: "gold" as BadgeLevel,
    currentStreak: 12,
    streakNeeded: 30,
    tasksUntilNextBadge: 18
  }
};