import { useState } from "react";
import type { RewardWithHabits } from "../../types/database";
import { useRewards } from "../../hooks/useRewards";
import { useHabits } from "../../hooks/useHabits";
import { 
  Trophy, 
  Calendar, 
  Target, 
  Copy, 
  Sparkles,
  ChevronDown,
  RotateCcw,
  Coffee,
  Heart,
  Cookie,
  Star
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "react-hot-toast";

interface CompletedRewardCardProps {
  reward: RewardWithHabits;
}

export const CompletedRewardCard = ({ reward }: CompletedRewardCardProps) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [showNewRewardForm, setShowNewRewardForm] = useState(false);
  const [newRewardTitle, setNewRewardTitle] = useState("");
  const [newRewardTargetPoints, setNewRewardTargetPoints] = useState(1000);
  const [isCreatingNewReward, setIsCreatingNewReward] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  
  const { createReward } = useRewards();
  const { habits, createHabit } = useHabits(reward.id);

  const completedDate = new Date(reward.updated_at).toLocaleDateString();
  const daysToComplete = Math.ceil(
    (new Date(reward.updated_at).getTime() - new Date(reward.created_at).getTime()) / 
    (1000 * 60 * 60 * 24)
  );

  const handleCreateSimilarReward = async () => {
    if (!newRewardTitle.trim()) {
      toast.error("Please name your new reward creation! ☕");
      return;
    }

    setIsCreatingNewReward(true);
    try {
      const newReward = await new Promise<any>((resolve, reject) => {
        createReward(
          {
            title: newRewardTitle,
            description: `Inspired by the successful brew: ${reward.title}`,
            target_points: newRewardTargetPoints,
          },
          {
            onSuccess: resolve,
            onError: reject,
          }
        );
      });

      const habitCopyPromises = habits.map(habit => 
        new Promise((resolve, reject) => {
          createHabit(
            {
              reward_id: newReward.id,
              name: habit.name,
              points_per_completion: habit.points_per_completion,
            },
            {
              onSuccess: resolve,
              onError: reject,
            }
          );
        })
      );

      await Promise.all(habitCopyPromises);

      toast.success(`New reward "${newRewardTitle}" brewing with ${habits.length} proven habits! ☕`, {
        icon: "🎉",
      });
      setShowNewRewardForm(false);
      setNewRewardTitle("");
      setNewRewardTargetPoints(1000);
    } catch (error: any) {
      toast.error(error.message || "Something went wrong in the brewing process!");
    } finally {
      setIsCreatingNewReward(false);
    }
  };

  const suggestedTitles = [
    `${reward.title} 2.0`,
    `Advanced ${reward.title}`,
    `Next Level ${reward.title}`,
    `${reward.title} - Second Serving`
  ];

  return (
    <motion.div
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
      whileHover={{ y: -4, rotate: 0.5 }}
      transition={{ type: "spring", stiffness: 300, damping: 20 }}
      className="relative bg-gradient-to-br from-emerald-50/90 via-green-50/90 to-emerald-50/90 backdrop-blur-sm border-2 border-emerald-300/60 rounded-3xl shadow-lg transition-all duration-500 hover:shadow-xl overflow-hidden"
    >
      <motion.div
        animate={{
          background: [
            "linear-gradient(45deg, rgba(34, 197, 94, 0.1), rgba(16, 185, 129, 0.1))",
            "linear-gradient(45deg, rgba(16, 185, 129, 0.1), rgba(34, 197, 94, 0.1))",
          ]
        }}
        transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
        className="absolute inset-0 pointer-events-none"
      />

      {isHovered && (
        <motion.div
          initial={{ opacity: 0, scale: 0 }}
          animate={{ opacity: 1, scale: 1 }}
          className="absolute top-4 right-4 z-10"
        >
          <Sparkles className="h-4 w-4 text-yellow-500" />
        </motion.div>
      )}

      <div className="p-6 relative z-20">
        <div className="flex items-start justify-between mb-4">
          <div className="flex-1">
            <div className="flex items-center mb-3">
              <motion.div
                animate={{ rotate: [0, 10, -10, 0] }}
                transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                className="bg-gradient-to-br from-yellow-200 to-orange-200 p-2 rounded-xl shadow-md mr-3"
              >
                <Trophy className="h-6 w-6 text-yellow-700" />
              </motion.div>
              <div>
                <h3 className="text-xl font-bold text-emerald-900 flex items-center">
                  {reward.title}
                  <motion.span
                    animate={{ scale: [1, 1.2, 1] }}
                    transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
                    className="ml-2"
                  >
                    <Heart className="h-4 w-4 text-red-400" />
                  </motion.span>
                </h3>
                {reward.description && (
                  <p className="text-emerald-700/80 text-sm mt-1 leading-relaxed">{reward.description}</p>
                )}
              </div>
            </div>
            
            <div className="flex items-center space-x-4 text-sm">
              <div className="flex items-center bg-emerald-100/80 px-3 py-1.5 rounded-xl">
                <Calendar className="h-4 w-4 mr-2 text-emerald-600" />
                <span className="text-emerald-800 font-medium">Savored {completedDate}</span>
              </div>
              <div className="flex items-center bg-emerald-100/80 px-3 py-1.5 rounded-xl">
                <Target className="h-4 w-4 mr-2 text-emerald-600" />
                <span className="text-emerald-800 font-medium">{daysToComplete} days journey</span>
              </div>
            </div>
          </div>
          
          <motion.div 
            className="bg-gradient-to-r from-emerald-500 to-green-500 text-white px-4 py-2 rounded-full shadow-md"
            animate={{ scale: [1, 1.05, 1] }}
            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
          >
            <span className="text-sm font-bold flex items-center">
              <motion.div
                animate={{ rotate: [0, 360] }}
                transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
                className="mr-1"
              >
                ✨
              </motion.div>
              SAVORED
            </span>
          </motion.div>
        </div>

        <div className="mb-6">
          <div className="flex items-center justify-between mb-3">
            <span className="text-sm font-semibold text-emerald-800 flex items-center">
              <Star className="h-4 w-4 mr-1" />
              Journey Complete
            </span>
            <span className="text-sm text-emerald-700 font-medium">
              {reward.current_points} / {reward.target_points} points
            </span>
          </div>
          <div className="w-full bg-emerald-200/50 rounded-full h-4 shadow-inner">
            <motion.div 
              className="h-4 bg-gradient-to-r from-emerald-400 via-green-400 to-emerald-400 rounded-full relative overflow-hidden"
              initial={{ width: 0 }}
              animate={{ width: "100%" }}
              transition={{ duration: 1, ease: "easeOut" }}
            >
              <motion.div
                animate={{ 
                  x: [-100, 400],
                  opacity: [0, 0.8, 0]
                }}
                transition={{ 
                  duration: 2, 
                  repeat: Infinity, 
                  ease: "easeInOut"
                }}
                className="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent"
              />
            </motion.div>
          </div>
        </div>

        <div className="space-y-4 mb-4">
          <motion.button
            onClick={() => setShowNewRewardForm(!showNewRewardForm)}
            whileHover={{ scale: 1.02, y: -2 }}
            whileTap={{ scale: 0.98 }}
            className="w-full bg-gradient-to-r from-amber-400 via-orange-400 to-amber-400 hover:from-amber-500 hover:via-orange-500 hover:to-amber-500 text-white py-3 px-4 rounded-2xl font-semibold transition-all duration-300 shadow-lg hover:shadow-xl flex items-center justify-center space-x-3 relative overflow-hidden cursor-pointer"
          >
            <motion.div
              animate={{ rotate: [0, 5, -5, 0] }}
              transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
            >
              <Copy className="h-5 w-5" />
            </motion.div>
            <span>Brew Similar Reward</span>
            <motion.div
              animate={{ scale: [1, 1.2, 1] }}
              transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
            >
              <Sparkles className="h-4 w-4" />
            </motion.div>
            
            <motion.div
              animate={{ 
                x: [-100, 400],
                opacity: [0, 1, 0]
              }}
              transition={{ 
                duration: 2.5, 
                repeat: Infinity, 
                ease: "easeInOut",
                delay: 1
              }}
              className="absolute top-0 left-0 w-full h-full bg-gradient-to-r from-transparent via-white/20 to-transparent"
            />
          </motion.button>

          <motion.button
            onClick={() => setIsExpanded(!isExpanded)}
            whileHover={{ scale: 1.01 }}
            whileTap={{ scale: 0.99 }}
            className="w-full bg-emerald-100/80 hover:bg-emerald-200/80 text-emerald-800 py-3 px-4 rounded-2xl font-medium transition-all duration-300 flex items-center justify-center space-x-2 cursor-pointer"
          >
            <Coffee className="h-4 w-4" />
            <span>View Success Recipe ({habits.length})</span>
            <motion.div
              animate={{ rotate: isExpanded ? 180 : 0 }}
              transition={{ duration: 0.3, ease: "easeInOut" }}
            >
              <ChevronDown className="h-4 w-4" />
            </motion.div>
          </motion.button>
        </div>

        <AnimatePresence>
          {showNewRewardForm && (
            <motion.div
              initial={{ opacity: 0, height: 0, scale: 0.95 }}
              animate={{ opacity: 1, height: "auto", scale: 1 }}
              exit={{ opacity: 0, height: 0, scale: 0.95 }}
              transition={{ duration: 0.4, ease: "easeInOut" }}
              className="overflow-hidden"
            >
              <div className="bg-gradient-to-br from-amber-50/90 to-orange-50/90 backdrop-blur-sm rounded-2xl p-5 border-2 border-amber-200/60 mb-4 shadow-md">
                <div className="flex items-center mb-4">
                  <motion.div
                    animate={{ rotate: [0, 360] }}
                    transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
                    className="bg-gradient-to-br from-amber-200 to-orange-200 p-2 rounded-xl shadow-md mr-3"
                  >
                    <Sparkles className="h-5 w-5 text-amber-700" />
                  </motion.div>
                  <div>
                    <h4 className="font-bold text-amber-900">Brew New Reward</h4>
                    <p className="text-xs text-amber-600">Based on your successful recipe</p>
                  </div>
                </div>
                
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-semibold text-amber-800 mb-2 flex items-center">
                      <Coffee className="h-4 w-4 mr-1" />
                      Reward Name *
                    </label>
                    <motion.input
                      type="text"
                      value={newRewardTitle}
                      onChange={(e) => setNewRewardTitle(e.target.value)}
                      placeholder="Enter new reward name..."
                      whileFocus={{ scale: 1.01 }}
                      className="w-full px-3 py-2.5 border-2 border-amber-200/60 rounded-xl focus:ring-4 focus:ring-amber-200/50 focus:border-amber-400 transition-all duration-300 text-sm bg-white/80 backdrop-blur-sm placeholder-amber-400"
                    />
                    
                    <div className="flex flex-wrap gap-2 mt-3">
                      {suggestedTitles.map((title, index) => (
                        <motion.button
                          key={index}
                          onClick={() => setNewRewardTitle(title)}
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          className="text-xs bg-amber-200/80 text-amber-800 hover:bg-amber-300/80 hover:text-amber-900 px-3 py-1.5 rounded-lg transition-all duration-300 font-medium"
                        >
                          {title}
                        </motion.button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-amber-800 mb-2 flex items-center">
                      <Star className="h-4 w-4 mr-1" />
                      Target Points *
                    </label>
                    <motion.select
                      value={newRewardTargetPoints}
                      onChange={(e) => setNewRewardTargetPoints(Number(e.target.value))}
                      whileFocus={{ scale: 1.01 }}
                      className="w-full px-3 py-2.5 border-2 border-amber-200/60 rounded-xl focus:ring-4 focus:ring-amber-200/50 focus:border-amber-400 transition-all duration-300 text-sm bg-white/80 backdrop-blur-sm"
                    >
                      <option value={500}>500 points (Easier sip)</option>
                      <option value={1000}>1000 points (Same as before)</option>
                      <option value={1500}>1500 points (Stronger brew)</option>
                      <option value={2000}>2000 points (Premium roast)</option>
                    </motion.select>
                  </div>

                  <div className="bg-blue-100/80 p-3 rounded-xl border border-blue-200/60">
                    <p className="text-xs text-blue-800 flex items-center">
                      <RotateCcw className="h-3 w-3 mr-2" />
                      This will copy all {habits.length} proven habits from "{reward.title}" to your new reward
                    </p>
                  </div>

                  <div className="flex space-x-3">
                    <motion.button
                      onClick={handleCreateSimilarReward}
                      disabled={isCreatingNewReward || !newRewardTitle.trim()}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      className="flex-1 bg-gradient-to-r from-emerald-500 to-green-600 hover:from-emerald-600 hover:to-green-700 disabled:from-gray-300 disabled:to-gray-400 text-white py-2.5 px-4 rounded-xl font-semibold transition-all duration-300 disabled:cursor-not-allowed text-sm flex items-center justify-center shadow-md"
                    >
                      {isCreatingNewReward ? (
                        <>
                          <motion.div
                            animate={{ rotate: 360 }}
                            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                            className="w-4 h-4 border-2 border-white border-t-transparent rounded-full mr-2"
                          />
                          Brewing...
                        </>
                      ) : (
                        <>
                          <Copy className="h-4 w-4 mr-2" />
                          Brew Reward
                        </>
                      )}
                    </motion.button>
                    <motion.button
                      onClick={() => setShowNewRewardForm(false)}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className="px-4 py-2.5 border-2 border-amber-300/60 text-amber-700 rounded-xl hover:bg-amber-50/50 transition-all duration-300 text-sm font-medium"
                    >
                      Cancel
                    </motion.button>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <AnimatePresence>
          {isExpanded && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.4, ease: "easeInOut" }}
              className="overflow-hidden"
            >
              <div className="bg-gradient-to-br from-emerald-50/80 to-green-50/80 backdrop-blur-sm rounded-2xl p-5 border-2 border-emerald-200/50 shadow-md">
                <h4 className="font-bold text-emerald-900 mb-4 flex items-center">
                  <Cookie className="h-5 w-5 mr-2" />
                  Successful Recipe ({habits.length})
                </h4>
                
                {habits.length > 0 ? (
                  <div className="space-y-3">
                    {habits.map((habit, index) => (
                      <motion.div
                        key={habit.id}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.1 }}
                        className="flex items-center justify-between p-3 bg-white/80 backdrop-blur-sm rounded-xl border border-emerald-200/60 shadow-sm"
                      >
                        <div className="flex items-center">
                          <motion.div 
                            className="w-3 h-3 bg-emerald-500 rounded-full mr-3 shadow-md"
                            animate={{ scale: [1, 1.2, 1] }}
                            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut", delay: index * 0.2 }}
                          />
                          <div>
                            <h5 className="font-semibold text-emerald-900">{habit.name}</h5>
                            <p className="text-xs text-emerald-600 flex items-center">
                              <Coffee className="h-3 w-3 mr-1" />
                              {habit.points_per_completion} points per completion
                            </p>
                          </div>
                        </div>
                        <div className="text-xs bg-emerald-500 text-white px-3 py-1 rounded-full font-semibold shadow-md">
                          Mastered ✨
                        </div>
                      </motion.div>
                    ))}
                  </div>
                ) : (
                  <p className="text-emerald-600 text-sm text-center py-6">
                    No habits were recorded for this reward
                  </p>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <motion.div 
          className="mt-6 text-center"
          animate={{ y: [0, -2, 0] }}
          transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
        >
          <div className="inline-flex items-center bg-gradient-to-r from-yellow-400 via-orange-400 to-yellow-400 text-white px-6 py-3 rounded-full text-sm font-bold shadow-lg">
            <motion.div
              animate={{ rotate: [0, 360] }}
              transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
              className="mr-2"
            >
              <Trophy className="h-5 w-5" />
            </motion.div>
            Reward Successfully Savored!
            <motion.div
              animate={{ scale: [1, 1.3, 1] }}
              transition={{ duration: 1, repeat: Infinity, ease: "easeInOut" }}
              className="ml-2"
            >
              ☕
            </motion.div>
          </div>
        </motion.div>

        {isHovered && (
          <motion.div
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: 1, scale: 1 }}
            className="absolute bottom-4 left-4"
          >
            <Heart className="h-4 w-4 text-red-400" />
          </motion.div>
        )}
      </div>
    </motion.div>
  );
};