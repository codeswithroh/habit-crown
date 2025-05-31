import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "../services/supabase";
import type {
  Habit,
  HabitInsert,
  HabitUpdate,
  HabitCompletion,
  HabitCompletionInsert,
  HabitWithCompletions,
} from "../types/database";

const habitsService = {
  async getHabits(rewardId?: string): Promise<HabitWithCompletions[]> {
    let query = supabase
      .from("habits")
      .select(
        `
        *,
        habit_completions (*)
      `
      )
      .order("created_at", { ascending: false });

    if (rewardId) {
      query = query.eq("reward_id", rewardId);
    }

    const { data, error } = await query;

    if (error) throw error;

    const today = new Date().toDateString();

    return data.map((habit) => ({
      ...habit,
      completions_today: habit.habit_completions.filter(
        (completion: any) =>
          new Date(completion.completed_at).toDateString() === today
      ).length,
    })) as HabitWithCompletions[];
  },

  async createHabit(habit: HabitInsert): Promise<Habit> {
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();
    if (authError || !user) throw new Error("User not authenticated");

    const { data, error } = await supabase
      .from("habits")
      .insert({
        ...habit,
        user_id: user.id,
      })
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  async updateHabit(id: string, updates: HabitUpdate): Promise<Habit> {
    const { data, error } = await supabase
      .from("habits")
      .update(updates)
      .eq("id", id)
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  async deleteHabit(id: string): Promise<void> {
    const { error } = await supabase.from("habits").delete().eq("id", id);

    if (error) throw error;
  },

  async completeHabit(
    habitId: string,
    pointsEarned: number
  ): Promise<HabitCompletion> {
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();
    if (authError || !user) throw new Error("User not authenticated");

    const { data, error } = await supabase
      .from("habit_completions")
      .insert({
        habit_id: habitId,
        user_id: user.id,
        points_earned: pointsEarned,
      })
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  async undoHabitCompletion(completionId: string): Promise<void> {
    const { error } = await supabase
      .from("habit_completions")
      .delete()
      .eq("id", completionId);

    if (error) throw error;
  },

  async getTodayCompletions(habitId: string): Promise<HabitCompletion[]> {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const { data, error } = await supabase
      .from("habit_completions")
      .select("*")
      .eq("habit_id", habitId)
      .gte("completed_at", today.toISOString());

    if (error) throw error;
    return data;
  },
};

export const useHabits = (rewardId?: string) => {
  const queryClient = useQueryClient();

  const habitsQuery = useQuery({
    queryKey: ["habits", rewardId],
    queryFn: () => habitsService.getHabits(rewardId),
  });

  const createHabitMutation = useMutation({
    mutationFn: habitsService.createHabit,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["habits"] });
      queryClient.invalidateQueries({ queryKey: ["rewards"] });
    },
  });

  const updateHabitMutation = useMutation({
    mutationFn: ({ id, updates }: { id: string; updates: HabitUpdate }) =>
      habitsService.updateHabit(id, updates),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["habits"] });
    },
  });

  const deleteHabitMutation = useMutation({
    mutationFn: habitsService.deleteHabit,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["habits"] });
      queryClient.invalidateQueries({ queryKey: ["rewards"] });
    },
  });

  const completeHabitMutation = useMutation({
    mutationFn: ({
      habitId,
      pointsEarned,
    }: {
      habitId: string;
      pointsEarned: number;
    }) => habitsService.completeHabit(habitId, pointsEarned),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["habits"] });
      queryClient.invalidateQueries({ queryKey: ["rewards"] });
    },
  });

  const undoCompletionMutation = useMutation({
    mutationFn: habitsService.undoHabitCompletion,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["habits"] });
      queryClient.invalidateQueries({ queryKey: ["rewards"] });
    },
  });

  return {
    habits: habitsQuery.data ?? [],
    isLoading: habitsQuery.isLoading,
    error: habitsQuery.error,
    createHabit: createHabitMutation.mutate,
    updateHabit: updateHabitMutation.mutate,
    deleteHabit: deleteHabitMutation.mutate,
    completeHabit: completeHabitMutation.mutate,
    undoCompletion: undoCompletionMutation.mutate,
    isCreating: createHabitMutation.isPending,
    isUpdating: updateHabitMutation.isPending,
    isDeleting: deleteHabitMutation.isPending,
    isCompleting: completeHabitMutation.isPending,
  };
};
