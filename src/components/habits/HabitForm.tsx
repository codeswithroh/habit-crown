import { useState } from "react";
import { useHabits } from "../../hooks/useHabits";
import { X } from "lucide-react";
import { toast } from "react-hot-toast";

interface HabitFormProps {
  rewardId: string;
  onClose: () => void;
  habit?: any;
}

export const HabitForm = ({ rewardId, onClose, habit }: HabitFormProps) => {
  const [name, setName] = useState(habit?.name || "");
  const [pointsPerCompletion, setPointsPerCompletion] = useState(
    habit?.points_per_completion || 10
  );
  const { createHabit, updateHabit, isCreating, isUpdating } = useHabits();

  const isEditing = !!habit;
  const isLoading = isCreating || isUpdating;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!name.trim()) {
      toast.error("Please enter a habit name");
      return;
    }

    if (pointsPerCompletion < 1) {
      toast.error("Points per completion must be at least 1");
      return;
    }

    try {
      if (isEditing) {
        updateHabit({
          id: habit.id,
          updates: { name, points_per_completion: pointsPerCompletion },
        });
        toast.success("Habit updated successfully!");
      } else {
        createHabit({
          reward_id: rewardId,
          name,
          points_per_completion: pointsPerCompletion,
        });
        toast.success("Habit created successfully!");
      }
      onClose();
    } catch (error: any) {
      toast.error(error.message || "Something went wrong");
    }
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h4 className="text-lg font-semibold text-gray-800">
          {isEditing ? "Edit Habit" : "Add New Habit"}
        </h4>
        <button
          onClick={onClose}
          className="p-1 hover:bg-gray-200 rounded-lg transition-colors"
        >
          <X className="h-4 w-4 text-gray-500" />
        </button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label
            htmlFor="habitName"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Habit Name *
          </label>
          <input
            id="habitName"
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="e.g., Exercise for 30 minutes, Read 10 pages, etc."
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-colors text-sm"
            required
          />
        </div>

        <div>
          <label
            htmlFor="points"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Points per Completion *
          </label>
          <input
            id="points"
            type="number"
            value={pointsPerCompletion}
            onChange={(e) => setPointsPerCompletion(Number(e.target.value))}
            min="1"
            max="1000"
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-colors text-sm"
            required
          />
          <p className="text-xs text-gray-500 mt-1">
            Points earned each time you complete this habit
          </p>
        </div>

        <div className="flex items-center space-x-2 pt-2">
          <button
            type="submit"
            disabled={isLoading}
            className="flex-1 bg-purple-600 text-white py-2 px-4 rounded-lg font-medium hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-all text-sm"
          >
            {isLoading ? (
              <div className="flex items-center justify-center">
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                {isEditing ? "Updating..." : "Adding..."}
              </div>
            ) : isEditing ? (
              "Update Habit"
            ) : (
              "Add Habit"
            )}
          </button>

          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors text-sm"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
};
