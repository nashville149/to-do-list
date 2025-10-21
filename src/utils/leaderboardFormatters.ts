import type { BadgeLevel } from '../types/leaderboard';

// Format points with commas
export const formatPoints = (points: number): string => {
  return points.toLocaleString();
};

// Format completion speed (tasks per day)
export const formatCompletionSpeed = (speed: number): string => {
  return `${speed.toFixed(1)} tasks/day`;
};

// Format success rate percentage
export const formatSuccessRate = (rate: number): string => {
  return `${Math.round(rate)}%`;
};

// Get badge display name with emoji
export const getBadgeDisplay = (badge: BadgeLevel): string => {
  const badgeMap = {
    bronze: "🥉 Bronze",
    silver: "🥈 Silver",
    gold: "🥇 Gold",
    platinum: "💎 Platinum"
  };
  return badgeMap[badge] || "🥉 Bronze";
};

// Calculate tasks needed for next badge
export const getTasksForNextBadge = (currentStreak: number, currentBadge: BadgeLevel): number => {
  const thresholds = {
    bronze: 7,
    silver: 14,
    gold: 30,
    platinum: Infinity
  };
  
  const nextBadge = getNextBadge(currentBadge);
  if (!nextBadge) return 0;
  
  return thresholds[nextBadge] - currentStreak;
};

// Get next badge level
export const getNextBadge = (currentBadge: BadgeLevel): BadgeLevel | null => {
  const progression: Record<BadgeLevel, BadgeLevel | null> = {
    bronze: "silver" as BadgeLevel,
    silver: "gold" as BadgeLevel,
    gold: "platinum" as BadgeLevel,
    platinum: null
  };
  return progression[currentBadge];
};

// Determine badge based on streak
export const getBadgeFromStreak = (streak: number): BadgeLevel => {
  if (streak >= 30) return "platinum" as BadgeLevel;
  if (streak >= 14) return "gold" as BadgeLevel;
  if (streak >= 7) return "silver" as BadgeLevel;
  return "bronze" as BadgeLevel;
};