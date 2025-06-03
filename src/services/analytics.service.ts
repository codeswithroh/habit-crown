import { supabase } from "./supabase";

export interface DailyStats {
  date: string;
  completions: number;
  pointsEarned: number;
  totalHabits: number;
  completionRate: number;
}

export interface WeeklyStats {
  week: string;
  completions: number;
  pointsEarned: number;
  averageCompletionRate: number;
}

export interface StreakData {
  currentStreak: number;
  longestStreak: number;
  lastCompletionDate: string | null;
}

export interface RewardOverview {
  totalRewards: number;
  activeRewards: number;
  completedRewards: number;
  claimedRewards: number;
  totalPointsEarned: number;
  totalTargetPoints: number;
}

const analyticsService = {
  async getDailyStats(days: number = 30): Promise<DailyStats[]> {
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();
    if (authError || !user) throw new Error("User not authenticated");

    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);

    const { data: completions, error } = await supabase
      .from("habit_completions")
      .select(
        `
        completed_at,
        points_earned,
        habit_id,
        habits!inner(user_id)
      `
      )
      .eq("habits.user_id", user.id)
      .gte("completed_at", startDate.toISOString())
      .order("completed_at", { ascending: true });

    if (error) throw error;

    const { data: habits, error: habitsError } = await supabase
      .from("habits")
      .select("id, created_at")
      .eq("user_id", user.id);

    if (habitsError) throw habitsError;

    const dailyStatsMap = new Map<string, DailyStats>();

    for (let i = 0; i < days; i++) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      const dateStr = date.toISOString().split("T")[0];

      const habitsActiveOnDate = habits.filter(
        (habit) => new Date(habit.created_at) <= date
      ).length;

      dailyStatsMap.set(dateStr, {
        date: dateStr,
        completions: 0,
        pointsEarned: 0,
        totalHabits: habitsActiveOnDate,
        completionRate: 0,
      });
    }

    completions.forEach((completion) => {
      const date = completion.completed_at.split("T")[0];
      const dayStats = dailyStatsMap.get(date);
      if (dayStats) {
        dayStats.completions += 1;
        dayStats.pointsEarned += completion.points_earned;
      }
    });

    dailyStatsMap.forEach((stats, _date) => {
      if (stats.totalHabits > 0) {
        stats.completionRate = (stats.completions / stats.totalHabits) * 100;
      }
    });

    return Array.from(dailyStatsMap.values()).reverse();
  },

  async getWeeklyStats(weeks: number = 8): Promise<WeeklyStats[]> {
    const dailyStats = await this.getDailyStats(weeks * 7);
    const weeklyStats: WeeklyStats[] = [];

    for (let i = 0; i < weeks; i++) {
      const weekStart = new Date();
      weekStart.setDate(weekStart.getDate() - i * 7 - 6);
      weekStart.setHours(0, 0, 0, 0);

      const weekEnd = new Date(weekStart);
      weekEnd.setDate(weekEnd.getDate() + 6);
      weekEnd.setHours(23, 59, 59, 999);

      const weekData = dailyStats.filter((day) => {
        const dayDate = new Date(day.date);
        return dayDate >= weekStart && dayDate <= weekEnd;
      });

      const totalCompletions = weekData.reduce(
        (sum, day) => sum + day.completions,
        0
      );
      const totalPoints = weekData.reduce(
        (sum, day) => sum + day.pointsEarned,
        0
      );
      const averageCompletionRate =
        weekData.length > 0
          ? weekData.reduce((sum, day) => sum + day.completionRate, 0) /
            weekData.length
          : 0;

      weeklyStats.push({
        week: `${weekStart.toLocaleDateString()} - ${weekEnd.toLocaleDateString()}`,
        completions: totalCompletions,
        pointsEarned: totalPoints,
        averageCompletionRate,
      });
    }

    return weeklyStats.reverse();
  },

  async getStreakData(): Promise<StreakData> {
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();
    if (authError || !user) throw new Error("User not authenticated");

    const { data: completions, error } = await supabase
      .from("habit_completions")
      .select(
        `
        completed_at,
        habits!inner(user_id)
      `
      )
      .eq("habits.user_id", user.id)
      .order("completed_at", { ascending: false });

    if (error) throw error;

    if (completions.length === 0) {
      return {
        currentStreak: 0,
        longestStreak: 0,
        lastCompletionDate: null,
      };
    }

    const completionDates = Array.from(
      new Set(completions.map((c) => c.completed_at.split("T")[0]))
    )
      .sort()
      .reverse();

    let currentStreak = 0;
    let longestStreak = 0;
    let tempStreak = 0;

    const today = new Date().toISOString().split("T")[0];
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    const yesterdayStr = yesterday.toISOString().split("T")[0];

    if (completionDates[0] === today || completionDates[0] === yesterdayStr) {
      currentStreak = 1;
      tempStreak = 1;

      for (let i = 1; i < completionDates.length; i++) {
        const currentDate = new Date(completionDates[i - 1]);
        const nextDate = new Date(completionDates[i]);
        const daysDiff =
          (currentDate.getTime() - nextDate.getTime()) / (1000 * 60 * 60 * 24);

        if (daysDiff === 1) {
          currentStreak++;
          tempStreak++;
        } else {
          break;
        }
      }
    }

    tempStreak = 0;
    for (let i = 0; i < completionDates.length - 1; i++) {
      const currentDate = new Date(completionDates[i]);
      const nextDate = new Date(completionDates[i + 1]);
      const daysDiff =
        (currentDate.getTime() - nextDate.getTime()) / (1000 * 60 * 60 * 24);

      if (daysDiff === 1) {
        tempStreak++;
      } else {
        longestStreak = Math.max(longestStreak, tempStreak + 1);
        tempStreak = 0;
      }
    }
    longestStreak = Math.max(longestStreak, tempStreak + 1);
    longestStreak = Math.max(longestStreak, currentStreak);

    return {
      currentStreak,
      longestStreak,
      lastCompletionDate: completions[0]?.completed_at || null,
    };
  },

  async getRewardOverview(): Promise<RewardOverview> {
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();
    if (authError || !user) throw new Error("User not authenticated");

    const { data: rewards, error } = await supabase
      .from("rewards")
      .select("*")
      .eq("user_id", user.id);

    if (error) throw error;

    const totalRewards = rewards.length;
    const activeRewards = rewards.filter(
      (r) => !r.is_claimed && r.current_points < r.target_points
    ).length;
    const completedRewards = rewards.filter(
      (r) => r.current_points >= r.target_points
    ).length;
    const claimedRewards = rewards.filter((r) => r.is_claimed).length;
    const totalPointsEarned = rewards.reduce(
      (sum, r) => sum + r.current_points,
      0
    );
    const totalTargetPoints = rewards.reduce(
      (sum, r) => sum + r.target_points,
      0
    );

    return {
      totalRewards,
      activeRewards,
      completedRewards,
      claimedRewards,
      totalPointsEarned,
      totalTargetPoints,
    };
  },
};

export default analyticsService;
