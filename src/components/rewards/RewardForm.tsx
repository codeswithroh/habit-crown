import { useState } from "react";
import { useRewards } from "../../hooks/useRewards";
import { X } from "lucide-react";
import { toast } from "react-hot-toast";

interface RewardFormProps {
  onClose: () => void;
  reward?: any;
}

export const RewardForm = ({ onClose, reward }: RewardFormProps) => {
  const [title, setTitle] = useState(reward?.title || "");
  const [description, setDescription] = useState(reward?.description || "");
  const [targetPoints, setTargetPoints] = useState(
    reward?.target_points || 100
  );
  const { createReward, updateReward, isCreating, isUpdating } = useRewards();

  const isEditing = !!reward;
  const isLoading = isCreating || isUpdating;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!title.trim()) {
      toast.error("Please enter a reward title");
      return;
    }

    if (targetPoints < 1) {
      toast.error("Target points must be at least 1");
      return;
    }

    try {
      if (isEditing) {
        updateReward({
          id: reward.id,
          updates: { title, description, target_points: targetPoints },
        });
        toast.success("Reward updated successfully!");
      } else {
        createReward({
          title,
          description,
          target_points: targetPoints,
        });
        toast.success("Reward created successfully!");
      }
      onClose();
    } catch (error: any) {
      toast.error(error.message || "Something went wrong");
    }
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-xl font-semibold text-gray-800">
          {isEditing ? "Edit Reward" : "Create New Reward"}
        </h3>
        <button
          onClick={onClose}
          className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
        >
          <X className="h-5 w-5 text-gray-500" />
        </button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label
            htmlFor="title"
            className="block text-sm font-medium text-gray-700 mb-2"
          >
            Reward Title *
          </label>
          <input
            id="title"
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="e.g., New smartphone, Weekend trip, etc."
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-colors"
            required
          />
        </div>

        <div>
          <label
            htmlFor="description"
            className="block text-sm font-medium text-gray-700 mb-2"
          >
            Description
          </label>
          <textarea
            id="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Describe your reward in detail..."
            rows={3}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-colors resize-none"
          />
        </div>

        <div>
          <label
            htmlFor="targetPoints"
            className="block text-sm font-medium text-gray-700 mb-2"
          >
            Target Points *
          </label>
          <input
            id="targetPoints"
            type="number"
            value={targetPoints}
            onChange={(e) => setTargetPoints(Number(e.target.value))}
            min="1"
            max="10000"
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-colors"
            required
          />
          <p className="text-xs text-gray-500 mt-1">
            How many points needed to earn this reward?
          </p>
        </div>

        <div className="flex items-center space-x-3 pt-4">
          <button
            type="submit"
            disabled={isLoading}
            className="flex-1 bg-gradient-to-r from-purple-600 to-blue-600 text-white py-3 px-4 rounded-lg font-medium hover:from-purple-700 hover:to-blue-700 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
          >
            {isLoading ? (
              <div className="flex items-center justify-center">
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                {isEditing ? "Updating..." : "Creating..."}
              </div>
            ) : isEditing ? (
              "Update Reward"
            ) : (
              "Create Reward"
            )}
          </button>

          <button
            type="button"
            onClick={onClose}
            className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
};
