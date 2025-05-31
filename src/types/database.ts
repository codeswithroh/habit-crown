export interface Database {
  public: {
    Tables: {
      rewards: {
        Row: {
          id: string;
          user_id: string;
          title: string;
          description: string | null;
          target_points: number;
          current_points: number;
          is_claimed: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id?: string;
          title: string;
          description?: string | null;
          target_points?: number;
          current_points?: number;
          is_claimed?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          title?: string;
          description?: string | null;
          target_points?: number;
          current_points?: number;
          is_claimed?: boolean;
          created_at?: string;
          updated_at?: string;
        };
      };
      habits: {
        Row: {
          id: string;
          user_id: string;
          reward_id: string;
          name: string;
          points_per_completion: number;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id?: string;
          reward_id: string;
          name: string;
          points_per_completion?: number;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          reward_id?: string;
          name?: string;
          points_per_completion?: number;
          created_at?: string;
          updated_at?: string;
        };
      };
      habit_completions: {
        Row: {
          id: string;
          habit_id: string;
          user_id: string;
          points_earned: number;
          completed_at: string;
        };
        Insert: {
          id?: string;
          habit_id: string;
          user_id?: string;
          points_earned: number;
          completed_at?: string;
        };
        Update: {
          id?: string;
          habit_id?: string;
          user_id?: string;
          points_earned?: number;
          completed_at?: string;
        };
      };
    };
  };
}

export type Reward = Database["public"]["Tables"]["rewards"]["Row"];
export type RewardInsert = Database["public"]["Tables"]["rewards"]["Insert"];
export type RewardUpdate = Database["public"]["Tables"]["rewards"]["Update"];

export type Habit = Database["public"]["Tables"]["habits"]["Row"];
export type HabitInsert = Database["public"]["Tables"]["habits"]["Insert"];
export type HabitUpdate = Database["public"]["Tables"]["habits"]["Update"];

export type HabitCompletion =
  Database["public"]["Tables"]["habit_completions"]["Row"];
export type HabitCompletionInsert =
  Database["public"]["Tables"]["habit_completions"]["Insert"];

export interface RewardWithHabits extends Reward {
  habits: Habit[];
}

export interface HabitWithCompletions extends Habit {
  habit_completions: HabitCompletion[];
  completions_today: number;
}

export interface User {
  id: string;
  email: string;
  created_at: string;
}

export interface AuthState {
  user: User | null;
  loading: boolean;
  error: string | null;
}
