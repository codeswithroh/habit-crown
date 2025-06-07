import { useQuery } from "@tanstack/react-query";
import analyticsService from "../services/analytics.service";

export const useAnalytics = () => {
  const dailyStatsQuery = useQuery({
    queryKey: ["analytics", "daily"],
    queryFn: () => analyticsService.getDailyStats(30),
    staleTime: 30 * 1000,
  });

  const weeklyStatsQuery = useQuery({
    queryKey: ["analytics", "weekly"],
    queryFn: () => analyticsService.getWeeklyStats(8),
    staleTime: 30 * 1000,
  });

  const streakQuery = useQuery({
    queryKey: ["analytics", "streak"],
    queryFn: analyticsService.getStreakData,
    staleTime: 30 * 1000,
  });

  const rewardOverviewQuery = useQuery({
    queryKey: ["analytics", "rewards"],
    queryFn: analyticsService.getRewardOverview,
    staleTime: 30 * 1000,
  });

  return {
    dailyStats: dailyStatsQuery.data ?? [],
    weeklyStats: weeklyStatsQuery.data ?? [],
    streakData: streakQuery.data ?? {
      currentStreak: 0,
      longestStreak: 0,
      lastCompletionDate: null,
    },
    rewardOverview: rewardOverviewQuery.data ?? {
      totalRewards: 0,
      activeRewards: 0,
      completedRewards: 0,
      claimedRewards: 0,
      totalPointsEarned: 0,
      totalTargetPoints: 0,
    },
    isLoading:
      dailyStatsQuery.isLoading ||
      weeklyStatsQuery.isLoading ||
      streakQuery.isLoading ||
      rewardOverviewQuery.isLoading,
    error:
      dailyStatsQuery.error ||
      weeklyStatsQuery.error ||
      streakQuery.error ||
      rewardOverviewQuery.error,
  };
};
