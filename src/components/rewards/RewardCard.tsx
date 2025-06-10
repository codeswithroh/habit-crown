import { useState } from "react";
import type { RewardWithHabits } from "../../types/database";
import { useRewards } from "../../hooks/useRewards";
import { useHabits } from "../../hooks/useHabits";
import { ProgressRing } from "../ui/ProgressRing";
import { HabitsList } from "../habits/HabitsList";
import { HabitForm } from "../habits/HabitForm";
import { ClaimRewardModal } from "./ClaimRewardModal";
import { RewardForm } from "./RewardForm";
import {
  Plus, 
  Edit, 
  Trash2, 
  Gift, 
  ChevronDown,
  Coffee,
  Sparkles,
  Cookie,
  Star
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "react-hot-toast";

interface RewardCardProps {
  reward: RewardWithHabits;
}

export const RewardCard = ({ reward }: RewardCardProps) => {
  const [showHabitForm, setShowHabitForm] = useState(false);
  const [showEditForm, setShowEditForm] = useState(false);
  const [showClaimModal, setShowClaimModal] = useState(false);
  const [isHabitsExpanded, setIsHabitsExpanded] = useState(true);
  
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
      toast.success("Reward deleted successfully ☕");
    }
  };

  const handleClaim = () => {
    if (canClaim) {
      setShowClaimModal(true);
    }
  };

  const toggleHabitsExpanded = () => {
    setIsHabitsExpanded(!isHabitsExpanded);
    if (showHabitForm && !isHabitsExpanded) {
      setShowHabitForm(false);
    }
  };

  const getCardStyling = () => {
    if (canClaim) {
      return "border-amber-300/60 bg-gradient-to-br from-amber-50/80 via-orange-50/80 to-yellow-50/80 shadow-xl ring-2 ring-amber-200/50";
    }
    return "border-amber-200/40 hover:border-amber-300/60 hover:shadow-lg bg-gradient-to-br from-white/90 to-amber-50/30";
  };

  return (
    <>
      <motion.div
        whileHover={{ y: -4, rotate: isComplete ? 1 : 0.5 }}
        transition={{ type: "spring", stiffness: 300, damping: 20 }}
        className={`relative bg-white/90 backdrop-blur-sm rounded-2xl sm:rounded-3xl shadow-lg border-2 transition-all duration-500 overflow-hidden ${getCardStyling()}`}
      >
        {canClaim && (
          <motion.div 
            className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-amber-400 via-orange-400 to-amber-400"
            animate={{ 
              background: [
                "linear-gradient(90deg, #fbbf24, #f97316, #fbbf24)",
                "linear-gradient(90deg, #f97316, #fbbf24, #f97316)",
                "linear-gradient(90deg, #fbbf24, #f97316, #fbbf24)"
              ]
            }}
            transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
          />
        )}

        <div className="p-4 sm:p-6 relative">
          <div className="flex items-start justify-between mb-4">
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between mb-3 gap-2">
                <motion.h3 
                  className="text-lg sm:text-xl font-bold text-amber-900 flex items-center min-w-0 flex-1"
                  whileHover={{ scale: 1.02 }}
                >
                  <motion.div
                    animate={{ rotate: [0, 5, -5, 0] }}
                    transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                    className="mr-2 flex-shrink-0"
                  >
                    <Coffee className="h-4 w-4 sm:h-5 sm:w-5 text-amber-600" />
                  </motion.div>
                  <span className="break-words leading-relaxed">{reward.title}</span>
                </motion.h3>
              </div>
              {reward.description && (
                <motion.p 
                  className="text-amber-700/80 text-sm mb-3 leading-relaxed line-clamp-2"
                  initial={{ opacity: 0.8 }}
                  whileHover={{ opacity: 1 }}
                >
                  {reward.description}
                </motion.p>
              )}
            </div>

            <div className="flex items-center space-x-1 sm:space-x-2 ml-2 flex-shrink-0">
              <motion.button
                onClick={() => setShowEditForm(true)}
                whileHover={{ scale: 1.1, rotate: 5 }}
                whileTap={{ scale: 0.95 }}
                className="p-1.5 sm:p-2 text-amber-400 hover:text-amber-600 hover:bg-amber-100/50 rounded-lg sm:rounded-xl transition-all duration-300"
                title="Edit recipe"
              >
                <Edit className="h-4 w-4" />
              </motion.button>
              <motion.button
                onClick={handleDelete}
                disabled={isDeleting}
                whileHover={{ scale: 1.1, rotate: -5 }}
                whileTap={{ scale: 0.95 }}
                className="p-1.5 sm:p-2 text-amber-400 hover:text-red-500 hover:bg-red-100/50 rounded-lg sm:rounded-xl transition-all duration-300 disabled:opacity-50"
                title="Remove from menu"
              >
                <Trash2 className="h-4 w-4" />
              </motion.button>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6 gap-4">
            <div className="flex-1 sm:mr-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-amber-800 flex items-center">
                  <Star className="h-3 w-3 mr-1" />
                  Progress
                </span>
                <span className="text-sm text-amber-700 font-medium">
                  {reward.current_points} / {reward.target_points} pts
                </span>
              </div>
              <div className="relative w-full bg-amber-100/50 rounded-full h-3 overflow-hidden shadow-inner">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${progressPercentage}%` }}
                  transition={{ duration: 1, ease: "easeOut" }}
                  className={`h-3 rounded-full relative ${
                    isComplete
                      ? "bg-gradient-to-r from-amber-400 via-orange-400 to-amber-400"
                      : "bg-gradient-to-r from-orange-300 via-amber-300 to-orange-300"
                  }`}
                >
                  <motion.div
                    animate={{ 
                      opacity: [0.3, 0.8, 0.3],
                      scale: [1, 1.02, 1]
                    }}
                    transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                    className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent"
                  />
                </motion.div>
              </div>
              <div className="flex items-center justify-between mt-2">
                <span className="text-xs text-amber-600 font-medium">
                  {Math.round(progressPercentage)}% brewed
                </span>
                <span className="text-xs text-amber-600">
                  {reward.target_points - reward.current_points} to savor
                </span>
              </div>
            </div>

            <motion.div
              whileHover={{ scale: 1.05, rotate: 5 }}
              transition={{ type: "spring", stiffness: 300 }}
              className="self-center sm:self-auto"
            >
              <ProgressRing
                progress={progressPercentage}
                size={60}
                strokeWidth={4}
                className={isComplete ? "text-amber-500" : "text-orange-400"}
              />
            </motion.div>
          </div>

          {canClaim && (
            <motion.button
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              whileHover={{ scale: 1.02, y: -2 }}
              whileTap={{ scale: 0.98 }}
              onClick={handleClaim}
              className="w-full bg-gradient-to-r from-amber-400 via-orange-400 to-amber-400 hover:from-amber-500 hover:via-orange-500 hover:to-amber-500 text-white py-3 sm:py-4 px-4 rounded-xl sm:rounded-2xl font-bold text-base sm:text-lg transition-all duration-300 shadow-lg hover:shadow-xl mb-4 flex items-center justify-center space-x-2 sm:space-x-3 relative overflow-hidden"
            >
              <motion.div
                animate={{ rotate: [0, 360] }}
                transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
              >
                <Gift className="h-5 w-5 sm:h-6 sm:w-6" />
              </motion.div>
              <span>Savor Your Reward!</span>
              
              <motion.div
                animate={{ 
                  x: [-100, 400],
                  opacity: [0, 1, 0]
                }}
                transition={{ 
                  duration: 2, 
                  repeat: Infinity, 
                  ease: "easeInOut",
                  delay: 1
                }}
                className="absolute top-0 left-0 w-full h-full bg-gradient-to-r from-transparent via-white/20 to-transparent"
              />
            </motion.button>
          )}

          <div className="space-y-4">
            <div className="flex items-center justify-between w-full">
              <motion.button
                onClick={toggleHabitsExpanded}
                whileHover={{ scale: 1.01 }}
                whileTap={{ scale: 0.99 }}
                className="flex items-center space-x-3 text-left group flex-1 cursor-pointer"
              >
                <motion.div
                  animate={{ rotate: [0, 5, -5, 0] }}
                  transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                  className="bg-gradient-to-br from-amber-200 to-orange-200 p-2 rounded-lg sm:rounded-xl shadow-md flex-shrink-0"
                >
                  <Coffee className="h-4 w-4 text-amber-700" />
                </motion.div>
                <div className="min-w-0">
                  <span className="text-base sm:text-lg font-semibold text-amber-900 group-hover:text-amber-700 transition-colors">
                    Daily Habits
                  </span>
                  <motion.span 
                    className="text-amber-600 ml-2 group-hover:text-amber-800 transition-colors"
                    animate={{ scale: [1, 1.05, 1] }}
                    transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                  >
                    ({habits.length})
                  </motion.span>
                </div>
              </motion.button>
              
              <div className="flex items-center space-x-2 sm:space-x-3 flex-shrink-0">
                {!reward.is_claimed && isHabitsExpanded && (
                  <motion.button
                    onClick={() => setShowHabitForm(true)}
                    whileHover={{ scale: 1.05, rotate: 90 }}
                    whileTap={{ scale: 0.95 }}
                    className="flex items-center space-x-1 sm:space-x-2 bg-gradient-to-r from-amber-300 to-orange-300 hover:from-amber-400 hover:to-orange-400 text-amber-800 hover:text-white px-2 sm:px-3 py-1.5 rounded-lg sm:rounded-xl text-xs sm:text-sm font-medium transition-all duration-300 shadow-md cursor-pointer"
                  >
                    <Plus className="h-3 w-3 sm:h-4 sm:w-4" />
                    <span className="hidden sm:inline">Add Habit</span>
                    <span className="sm:hidden">Add</span>
                  </motion.button>
                )}
                
                <motion.button
                  onClick={toggleHabitsExpanded}
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                  className="p-1 rounded-lg hover:bg-amber-100/50 transition-colors cursor-pointer"
                >
                  <motion.div
                    animate={{ rotate: isHabitsExpanded ? 180 : 0 }}
                    transition={{ duration: 0.3, ease: "easeInOut" }}
                  >
                    <ChevronDown className="h-4 w-4 sm:h-5 sm:w-5 text-amber-600 hover:text-amber-800 transition-colors" />
                  </motion.div>
                </motion.button>
              </div>
            </div>

            <AnimatePresence>
              {isHabitsExpanded && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.4, ease: "easeInOut" }}
                  className="overflow-hidden"
                >
                  <div className="space-y-4">
                    {showHabitForm && (
                      <motion.div
                        initial={{ opacity: 0, y: -20, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: -20, scale: 0.95 }}
                        transition={{ type: "spring", damping: 25, stiffness: 300 }}
                        className="bg-gradient-to-br from-amber-50/80 to-orange-50/80 backdrop-blur-sm rounded-xl sm:rounded-2xl p-3 sm:p-4 border border-amber-200/50 shadow-md"
                      >
                        <HabitForm
                          rewardId={reward.id}
                          onClose={() => setShowHabitForm(false)}
                        />
                      </motion.div>
                    )}

                    <div className="bg-gradient-to-br from-white/60 to-amber-50/60 backdrop-blur-sm rounded-xl sm:rounded-2xl p-3 sm:p-4 border border-amber-200/30">
                      <HabitsList habits={habits} disabled={reward.is_claimed} />
                    </div>

                    {!showHabitForm && habits.length === 0 && !reward.is_claimed && (
                      
                        <motion.button
                          onClick={() => setShowHabitForm(true)}
                          whileHover={{ scale: 1.05, y: -2 }}
                          whileTap={{ scale: 0.95 }}
                          className="flex items-center justify-center mx-auto space-x-2 text-sm font-medium bg-gradient-to-r from-amber-300 to-orange-300 hover:from-amber-400 hover:to-orange-400 text-amber-800 hover:text-white px-4 py-2 rounded-xl transition-all duration-300 shadow-md cursor-pointer"
                        >
                          <Plus className="h-4 w-4" />
                          <span>Brew Your First Habit</span>
                          <Sparkles className="h-4 w-4" />
                        </motion.button>
                    )}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {!isHabitsExpanded && habits.length > 0 && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="bg-gradient-to-r from-amber-50/80 to-orange-50/80 backdrop-blur-sm rounded-lg sm:rounded-xl p-3 border border-amber-200/40"
              >
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                  <span className="text-sm text-amber-800 font-medium">
                    {habits.filter(h => h.completions_today > 0).length} of {habits.length} habits completed today
                  </span>
                  <div className="flex space-x-1">
                    {habits.slice(0, 4).map((habit) => (
                      <motion.div
                        key={habit.id}
                        className={`w-2 h-2 rounded-full ${
                          habit.completions_today > 0 
                            ? 'bg-amber-400' 
                            : 'bg-amber-200'
                        }`}
                        title={habit.name}
                        whileHover={{ scale: 1.5 }}
                        animate={habit.completions_today > 0 ? {
                          scale: [1, 1.2, 1],
                        } : {}}
                        transition={{ duration: 1, repeat: Infinity, ease: "easeInOut" }}
                      />
                    ))}
                    {habits.length > 4 && (
                      <span className="text-xs text-amber-600 ml-2 font-medium">+{habits.length - 4}</span>
                    )}
                  </div>
                </div>
              </motion.div>
            )}
          </div>
        </div>
      </motion.div>

      {showEditForm && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <motion.div 
            className="bg-white/95 backdrop-blur-md rounded-2xl sm:rounded-3xl shadow-2xl max-w-md w-full max-h-[90vh] overflow-y-auto border border-amber-200/50"
            initial={{ scale: 0.9, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.9, opacity: 0, y: 20 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
          >
            <div className="p-4 sm:p-6">
              <RewardForm
                reward={reward}
                onClose={() => setShowEditForm(false)}
              />
            </div>
          </motion.div>
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