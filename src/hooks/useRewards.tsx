import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "../services/supabase";
import type {
  Reward,
  RewardInsert,
  RewardUpdate,
  RewardWithHabits,
} from "../types/database";

const rewardsService = {
  async getRewards(): Promise<RewardWithHabits[]> {
    const { data, error } = await supabase
      .from("rewards")
      .select(
        `
        *,
        habits (*)
      `
      )
      .order("created_at", { ascending: false });

    if (error) throw error;
    return data as RewardWithHabits[];
  },

  async createReward(reward: RewardInsert): Promise<Reward> {
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();
    if (authError || !user) throw new Error("User not authenticated");

    const { data, error } = await supabase
      .from("rewards")
      .insert({
        ...reward,
        user_id: user.id,
      })
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  async updateReward(id: string, updates: RewardUpdate): Promise<Reward> {
    const { data, error } = await supabase
      .from("rewards")
      .update(updates)
      .eq("id", id)
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  async deleteReward(id: string): Promise<void> {
    const { error } = await supabase.from("rewards").delete().eq("id", id);

    if (error) throw error;
  },

  async claimReward(id: string): Promise<Reward> {
    const { data, error } = await supabase
      .from("rewards")
      .update({ is_claimed: true })
      .eq("id", id)
      .select()
      .single();

    if (error) throw error;
    return data;
  },
};

export const useRewards = () => {
  const queryClient = useQueryClient();

  const rewardsQuery = useQuery({
    queryKey: ["rewards"],
    queryFn: rewardsService.getRewards,
  });

  const createRewardMutation = useMutation({
    mutationFn: rewardsService.createReward,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["rewards"] });
      queryClient.invalidateQueries({ queryKey: ["analytics"] });
    },
  });

  const updateRewardMutation = useMutation({
    mutationFn: ({ id, updates }: { id: string; updates: RewardUpdate }) =>
      rewardsService.updateReward(id, updates),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["rewards"] });
    },
  });

  const deleteRewardMutation = useMutation({
    mutationFn: rewardsService.deleteReward,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["rewards"] });
      queryClient.invalidateQueries({ queryKey: ["analytics"] });
    },
  });

  const claimRewardMutation = useMutation({
    mutationFn: rewardsService.claimReward,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["rewards"] });
      queryClient.invalidateQueries({ queryKey: ["analytics"] });
    },
  });

  return {
    rewards: rewardsQuery.data ?? [],
    isLoading: rewardsQuery.isLoading,
    error: rewardsQuery.error,
    createReward: createRewardMutation.mutate,
    updateReward: updateRewardMutation.mutate,
    deleteReward: deleteRewardMutation.mutate,
    claimReward: claimRewardMutation.mutate,
    isCreating: createRewardMutation.isPending,
    isUpdating: updateRewardMutation.isPending,
    isDeleting: deleteRewardMutation.isPending,
    isClaiming: claimRewardMutation.isPending,
  };
};
