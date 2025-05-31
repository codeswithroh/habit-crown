import { useState } from "react";
import type { RewardWithHabits } from "../../types/database";
import { useRewards } from "../../hooks/useRewards";
import { useHabits } from "../../hooks/useHabits";
import { ProgressRing } from "../ui/ProgressRing";
import { HabitsList } from "../habits/HabitsList";
import { HabitForm } from "../habits/HabitForm";
import { ClaimRewardModal } from "./ClaimRewardModal";
import { RewardForm } from "./RewardForm";
import { Trophy, Plus, Edit, Trash2, Gift } from "lucide-react";
import { motion } from "framer-motion";
import { toast } from "react-hot-toast";

interface RewardCardProps {
  reward: RewardWithHabits;
}

export const RewardCard = ({ reward }: RewardCardProps) => {
  const [showHabitForm, setShowHabitForm] = useState(false);
  const [showEditForm, setShowEditForm] = useState(false);
  const [showClaimModal, setShowClaimModal] = useState(false);
  const { deleteReward, isDeleting } = useRewards();
  const { habits } = useHabits(reward.id);

  const progressPercentage = Math.min(
    (reward.current_points / reward.target_points) * 100,
    100
  );
  const isComplete = reward.current_points >= reward.target_points;
  const canClaim = isComplete && !reward.is_claimed;

  const handleDelete = () => {
    if (
      window.confirm(
        "Are you sure you want to delete this reward? This will also delete all associated habits."
      )
    ) {
      deleteReward(reward.id);
      toast.success("Reward deleted successfully");
    }
  };

  const handleClaim = () => {
    if (canClaim) {
      setShowClaimModal(true);
    }
  };

  return (
    <>
      <motion.div
        whileHover={{ y: -2 }}
        className={`bg-white rounded-xl shadow-lg border-2 transition-all duration-300 ${
          reward.is_claimed
            ? "border-green-200 bg-green-50"
            : canClaim
            ? "border-purple-300 bg-gradient-to-br from-purple-50 to-blue-50 shadow-xl"
            : "border-gray-200 hover:border-purple-200 hover:shadow-xl"
        }`}
      >
        <div className="p-6">
          <div className="flex items-start justify-between mb-4">
            <div className="flex-1">
              <h3 className="text-xl font-bold text-gray-800 mb-2 flex items-center">
                {reward.is_claimed && (
                  <Trophy className="h-5 w-5 text-yellow-500 mr-2" />
                )}
                {reward.title}
              </h3>
              {reward.description && (
                <p className="text-gray-600 text-sm mb-3">
                  {reward.description}
                </p>
              )}
            </div>

            <div className="flex items-center space-x-2">
              <button
                onClick={() => setShowEditForm(true)}
                className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <Edit className="h-4 w-4" />
              </button>
              <button
                onClick={handleDelete}
                disabled={isDeleting}
                className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors disabled:opacity-50"
              >
                <Trash2 className="h-4 w-4" />
              </button>
            </div>
          </div>

          <div className="flex items-center justify-between mb-6">
            <div className="flex-1 mr-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-gray-700">
                  Progress
                </span>
                <span className="text-sm text-gray-600">
                  {reward.current_points} / {reward.target_points} points
                </span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-3">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${progressPercentage}%` }}
                  transition={{ duration: 0.5, ease: "easeOut" }}
                  className={`h-3 rounded-full ${
                    isComplete
                      ? "bg-gradient-to-r from-green-400 to-green-600"
                      : "bg-gradient-to-r from-purple-500 to-blue-500"
                  }`}
                />
              </div>
            </div>

            <ProgressRing
              progress={progressPercentage}
              size={60}
              strokeWidth={4}
              className={isComplete ? "text-green-500" : "text-purple-500"}
            />
          </div>

          {canClaim && (
            <motion.button
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={handleClaim}
              className="w-full bg-gradient-to-r from-green-500 to-emerald-600 text-white py-3 px-4 rounded-lg font-medium hover:from-green-600 hover:to-emerald-700 transition-all shadow-lg hover:shadow-xl mb-4 flex items-center justify-center space-x-2"
            >
              <Gift className="h-5 w-5" />
              <span>Claim Reward!</span>
            </motion.button>
          )}

          {reward.is_claimed && (
            <div className="bg-green-100 border border-green-200 rounded-lg p-3 mb-4 text-center">
              <Trophy className="h-6 w-6 text-yellow-500 mx-auto mb-1" />
              <p className="text-green-800 font-medium">Reward Claimed!</p>
              <p className="text-green-600 text-sm">
                Congratulations on completing your goal!
              </p>
            </div>
          )}

          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h4 className="text-lg font-semibold text-gray-800">Habits</h4>
              {!reward.is_claimed && (
                <button
                  onClick={() => setShowHabitForm(true)}
                  className="flex items-center space-x-1 text-purple-600 hover:text-purple-700 text-sm font-medium"
                >
                  <Plus className="h-4 w-4" />
                  <span>Add Habit</span>
                </button>
              )}
            </div>

            {showHabitForm && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                className="bg-gray-50 rounded-lg p-4"
              >
                <HabitForm
                  rewardId={reward.id}
                  onClose={() => setShowHabitForm(false)}
                />
              </motion.div>
            )}

            <HabitsList habits={habits} disabled={reward.is_claimed} />
          </div>
        </div>
      </motion.div>

      {showEditForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl shadow-xl max-w-md w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <RewardForm
                reward={reward}
                onClose={() => setShowEditForm(false)}
              />
            </div>
          </div>
        </div>
      )}

      {showClaimModal && (
        <ClaimRewardModal
          reward={reward}
          onClose={() => setShowClaimModal(false)}
        />
      )}
    </>
  );
};
