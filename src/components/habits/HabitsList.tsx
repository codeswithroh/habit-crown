import { useState } from "react";
import type { HabitWithCompletions } from "../../types/database";
import { useHabits } from "../../hooks/useHabits";
import { HabitForm } from "./HabitForm";
import { CheckCircle, Circle, Edit, Trash2, Plus } from "lucide-react";
import { motion } from "framer-motion";
import { toast } from "react-hot-toast";

interface HabitsListProps {
  habits: HabitWithCompletions[];
  disabled?: boolean;
}

export const HabitsList = ({ habits, disabled = false }: HabitsListProps) => {
  const [editingHabit, setEditingHabit] = useState<string | null>(null);
  const { completeHabit, deleteHabit, isCompleting, isDeleting } = useHabits();

  const handleToggleHabit = (habit: HabitWithCompletions) => {
    if (disabled) return;

    if (habit.completions_today > 0) {
      toast.success("Habit already completed today!");
      return;
    }

    completeHabit({
      habitId: habit.id,
      pointsEarned: habit.points_per_completion,
    });
    toast.success(`+${habit.points_per_completion} points earned!`);
  };

  const handleDeleteHabit = (habitId: string) => {
    if (window.confirm("Are you sure you want to delete this habit?")) {
      deleteHabit(habitId);
      toast.success("Habit deleted successfully");
    }
  };

  if (habits.length === 0) {
    return (
      <div className="text-center py-6 text-gray-500">
        <Circle className="h-8 w-8 mx-auto mb-2 text-gray-300" />
        <p className="text-sm">No habits added yet</p>
        <p className="text-xs">Add habits to start earning points!</p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {habits.map((habit) => (
        <motion.div
          key={habit.id}
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          className={`border rounded-lg p-3 transition-all ${
            habit.completions_today > 0
              ? "bg-green-50 border-green-200"
              : disabled
              ? "bg-gray-50 border-gray-200"
              : "bg-white border-gray-200 hover:border-purple-200"
          }`}
        >
          {editingHabit === habit.id ? (
            <HabitForm
              rewardId={habit.reward_id}
              habit={habit}
              onClose={() => setEditingHabit(null)}
            />
          ) : (
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3 flex-1">
                <button
                  onClick={() => handleToggleHabit(habit)}
                  disabled={
                    disabled || isCompleting || habit.completions_today > 0
                  }
                  className={`flex-shrink-0 transition-colors ${
                    habit.completions_today > 0
                      ? "text-green-500"
                      : disabled
                      ? "text-gray-300 cursor-not-allowed"
                      : "text-gray-400 hover:text-purple-500"
                  }`}
                >
                  {habit.completions_today > 0 ? (
                    <CheckCircle className="h-6 w-6" />
                  ) : (
                    <Circle className="h-6 w-6" />
                  )}
                </button>

                <div className="flex-1">
                  <h5
                    className={`font-medium ${
                      habit.completions_today > 0
                        ? "text-green-800 line-through"
                        : disabled
                        ? "text-gray-500"
                        : "text-gray-800"
                    }`}
                  >
                    {habit.name}
                  </h5>
                  <p className="text-xs text-gray-500">
                    {habit.points_per_completion} points per completion
                    {habit.completions_today > 0 && (
                      <span className="text-green-600 font-medium ml-2">
                        ✓ Completed today
                      </span>
                    )}
                  </p>
                </div>
              </div>

              {!disabled && (
                <div className="flex items-center space-x-1">
                  <button
                    onClick={() => setEditingHabit(habit.id)}
                    className="p-1.5 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                  >
                    <Edit className="h-4 w-4" />
                  </button>
                  <button
                    onClick={() => handleDeleteHabit(habit.id)}
                    disabled={isDeleting}
                    className="p-1.5 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors disabled:opacity-50"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              )}
            </div>
          )}
        </motion.div>
      ))}
    </div>
  );
};
