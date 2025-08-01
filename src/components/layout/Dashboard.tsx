import { useState } from "react";
import { useRewards } from "../../hooks/useRewards";
import { RewardCard } from "../rewards/RewardCard";
import { CompletedRewardCard } from "../rewards/CompleteRewardCard";
import { RewardForm } from "../rewards/RewardForm";
import { Analytics } from "../analytics/Analytics";
import { LofiPlayer } from "../music/LofiPlayer";
import { 
  Plus, 
  BarChart3, 
  Coffee, 
  Target, 
  CheckCircle2,
  Clock,
  Zap,
  Sparkles,
  Heart,
  Cookie,
  Music
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export const Dashboard = () => {
  const { rewards, isLoading } = useRewards();
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [activeTab, setActiveTab] = useState<"rewards" | "analytics" | "music">("rewards");
  const [rewardViewMode, setRewardViewMode] = useState<"active" | "completed" | "all">("active");

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
          className="relative"
        >
          <Coffee className="h-8 w-8 text-amber-600" />
          <motion.div
            animate={{
              y: [-2, -6, -2],
              opacity: [0.6, 0.3, 0.6],
            }}
            transition={{
              duration: 1.5,
              repeat: Infinity,
              ease: "easeInOut",
            }}
            className="absolute -top-1 left-1/2 transform -translate-x-1/2"
          >
            <div className="w-1 h-2 bg-gradient-to-t from-amber-400/60 to-transparent rounded-full"></div>
          </motion.div>
        </motion.div>
      </div>
    );
  }

  const activeRewards = rewards.filter(reward => 
    !reward.is_claimed && reward.current_points < reward.target_points
  );
  const readyToClaimRewards = rewards.filter(reward => 
    !reward.is_claimed && reward.current_points >= reward.target_points
  );
  const completedRewards = rewards.filter(reward => reward.is_claimed);

  const getFilteredRewards = () => {
    switch (rewardViewMode) {
      case "active":
        return [...readyToClaimRewards, ...activeRewards];
      case "completed":
        return completedRewards;
      case "all":
        return [...readyToClaimRewards, ...activeRewards, ...completedRewards];
      default:
        return [...readyToClaimRewards, ...activeRewards];
    }
  };

  const filteredRewards = getFilteredRewards();

  return (
    <div className="space-y-8">
      {/* Tab Navigation */}
      <motion.div 
        className="flex flex-col md:flex-row md:items-center md:justify-between gap-4"
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
      >
        <div className="flex items-center space-x-1 bg-white/70 backdrop-blur-sm rounded-2xl border border-amber-200/50 p-2 shadow-lg">
          <motion.button
            onClick={() => setActiveTab("rewards")}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className={`flex items-center space-x-2 px-6 py-3 rounded-xl text-sm font-medium transition-all duration-300 cursor-pointer ${
              activeTab === "rewards"
                ? "bg-gradient-to-r from-amber-200 to-orange-200 text-amber-800 shadow-md"
                : "text-amber-600 hover:text-amber-800 hover:bg-amber-50"
            }`}
          >
            <motion.div
              animate={activeTab === "rewards" ? { rotate: [0, 5, -5, 0] } : {}}
              transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
            >
              <Coffee className="h-4 w-4" />
            </motion.div>
            <span>My Rewards</span>
            {activeTab === "rewards" && (
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                className="w-2 h-2 bg-amber-600 rounded-full"
              />
            )}
          </motion.button>
          
          <motion.button
            onClick={() => setActiveTab("analytics")}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className={`flex items-center space-x-2 px-6 py-3 rounded-xl text-sm font-medium transition-all duration-300 cursor-pointer ${
              activeTab === "analytics"
                ? "bg-gradient-to-r from-amber-200 to-orange-200 text-amber-800 shadow-md"
                : "text-amber-600 hover:text-amber-800 hover:bg-amber-50"
            }`}
          >
            <BarChart3 className="h-4 w-4" />
            <span>Progress</span>
            {activeTab === "analytics" && (
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                className="w-2 h-2 bg-amber-600 rounded-full"
              />
            )}
          </motion.button>
          
          <motion.button
            onClick={() => setActiveTab("music")}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className={`flex items-center space-x-2 px-6 py-3 rounded-xl text-sm font-medium transition-all duration-300 cursor-pointer ${
              activeTab === "music"
                ? "bg-gradient-to-r from-amber-200 to-orange-200 text-amber-800 shadow-md"
                : "text-amber-600 hover:text-amber-800 hover:bg-amber-50"
            }`}
          >
            <motion.div
              animate={activeTab === "music" ? { 
                rotate: [0, 5, -5, 0],
                scale: [1, 1.1, 1]
              } : {}}
              transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
            >
              <Music className="h-4 w-4" />
            </motion.div>
            <span>Lofi Music</span>
            {activeTab === "music" && (
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                className="w-2 h-2 bg-amber-600 rounded-full"
              />
            )}
          </motion.button>
        </div>

        {activeTab === "rewards" && (
          <motion.button
            onClick={() => setShowCreateForm(true)}
            whileHover={{ scale: 1.05, rotate: 2 }}
            whileTap={{ scale: 0.95 }}
            initial={{ x: 20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="group relative flex items-center space-x-2 bg-gradient-to-r from-amber-400 to-orange-400 hover:from-amber-500 hover:to-orange-500 text-white px-6 py-3 rounded-2xl font-medium transition-all duration-300 shadow-lg hover:shadow-xl cursor-pointer"
          >
            <motion.div
              animate={{ rotate: [0, 90, 0] }}
              transition={{ duration: 0.3 }}
              className="group-hover:animate-spin"
            >
              <Plus className="h-5 w-5" />
            </motion.div>
            <span>Brew New Reward</span>
            <motion.div
              animate={{ scale: [1, 1.2, 1] }}
              transition={{ duration: 1, repeat: Infinity, ease: "easeInOut" }}
            >
              <Sparkles className="h-4 w-4" />
            </motion.div>
          </motion.button>
        )}
      </motion.div>

      <AnimatePresence mode="wait">
        {activeTab === "rewards" ? (
          <motion.div
            key="rewards"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
            className="space-y-8"
          >
            {/* Stats Overview */}
            <motion.div 
              className="grid grid-cols-1 md:grid-cols-4 gap-4"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <motion.div
                whileHover={{ scale: 1.02, rotate: 1 }}
                className="bg-gradient-to-br from-orange-100/80 to-amber-100/80 backdrop-blur-sm border border-orange-200/50 rounded-2xl p-6 shadow-lg"
              >
                <div className="flex items-center">
                  <motion.div 
                    className="bg-gradient-to-br from-orange-400 to-amber-500 p-3 rounded-xl mr-4 shadow-md"
                    animate={{ rotate: [0, 5, -5, 0] }}
                    transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                  >
                    <Clock className="h-5 w-5 text-white" />
                  </motion.div>
                  <div>
                    <motion.p 
                      className="text-2xl font-bold text-orange-800"
                      animate={{ scale: [1, 1.05, 1] }}
                      transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                    >
                      {activeRewards.length}
                    </motion.p>
                    <p className="text-sm text-orange-600 font-medium">Brewing</p>
                  </div>
                </div>
              </motion.div>

              <motion.div
                whileHover={{ scale: 1.02, rotate: -1 }}
                className="bg-gradient-to-br from-green-100/80 to-emerald-100/80 backdrop-blur-sm border border-green-200/50 rounded-2xl p-6 shadow-lg"
              >
                <div className="flex items-center">
                  <motion.div 
                    className="bg-gradient-to-br from-green-400 to-emerald-500 p-3 rounded-xl mr-4 shadow-md"
                    animate={{ scale: [1, 1.1, 1] }}
                    transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
                  >
                    <Zap className="h-5 w-5 text-white" />
                  </motion.div>
                  <div>
                    <motion.p 
                      className="text-2xl font-bold text-green-800"
                      animate={{ scale: [1, 1.05, 1] }}
                      transition={{ duration: 2, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
                    >
                      {readyToClaimRewards.length}
                    </motion.p>
                    <p className="text-sm text-green-600 font-medium">Ready!</p>
                  </div>
                </div>
              </motion.div>

              <motion.div
                whileHover={{ scale: 1.02, rotate: 1 }}
                className="bg-gradient-to-br from-purple-100/80 to-pink-100/80 backdrop-blur-sm border border-purple-200/50 rounded-2xl p-6 shadow-lg"
              >
                <div className="flex items-center">
                  <motion.div 
                    className="bg-gradient-to-br from-purple-400 to-pink-500 p-3 rounded-xl mr-4 shadow-md"
                    animate={{ rotate: [0, 10, -10, 0] }}
                    transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                  >
                    <CheckCircle2 className="h-5 w-5 text-white" />
                  </motion.div>
                  <div>
                    <motion.p 
                      className="text-2xl font-bold text-purple-800"
                      animate={{ scale: [1, 1.05, 1] }}
                      transition={{ duration: 2, repeat: Infinity, ease: "easeInOut", delay: 1 }}
                    >
                      {completedRewards.length}
                    </motion.p>
                    <p className="text-sm text-purple-600 font-medium">Enjoyed</p>
                  </div>
                </div>
              </motion.div>

              <motion.div
                whileHover={{ scale: 1.02, rotate: -1 }}
                className="bg-gradient-to-br from-blue-100/80 to-indigo-100/80 backdrop-blur-sm border border-blue-200/50 rounded-2xl p-6 shadow-lg"
              >
                <div className="flex items-center">
                  <motion.div 
                    className="bg-gradient-to-br from-blue-400 to-indigo-500 p-3 rounded-xl mr-4 shadow-md"
                    animate={{ y: [0, -2, 0] }}
                    transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                  >
                    <Target className="h-5 w-5 text-white" />
                  </motion.div>
                  <div>
                    <motion.p 
                      className="text-2xl font-bold text-blue-800"
                      animate={{ scale: [1, 1.05, 1] }}
                      transition={{ duration: 2, repeat: Infinity, ease: "easeInOut", delay: 1.5 }}
                    >
                      {rewards.length}
                    </motion.p>
                    <p className="text-sm text-blue-600 font-medium">Total</p>
                  </div>
                </div>
              </motion.div>
            </motion.div>

            {/* Filter Tabs */}
            <motion.div 
              className="flex items-center justify-between"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
            >
              <div className="flex items-center space-x-2 bg-white/70 backdrop-blur-sm rounded-2xl p-2 border border-amber-200/50 shadow-md">
                {[
                  { mode: "active", icon: Clock, label: "Active", count: activeRewards.length + readyToClaimRewards.length },
                  { mode: "completed", icon: CheckCircle2, label: "Completed", count: completedRewards.length },
                  { mode: "all", icon: Coffee, label: "All", count: rewards.length }
                ].map(({ mode, icon: Icon, label, count }) => (
                  <motion.button
                    key={mode}
                    onClick={() => setRewardViewMode(mode as any)}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className={`flex items-center space-x-2 px-4 py-2 rounded-xl text-sm font-medium transition-all duration-300 cursor-pointer ${
                      rewardViewMode === mode
                        ? "bg-gradient-to-r from-amber-200 to-orange-200 text-amber-800 shadow-md"
                        : "text-amber-600 hover:text-amber-800 hover:bg-amber-50"
                    }`}
                  >
                    <Icon className="h-4 w-4" />
                    <span>{label} ({count})</span>
                    {rewardViewMode === mode && (
                      <motion.div
                        layoutId="filter-indicator"
                        className="w-2 h-2 bg-amber-600 rounded-full"
                      />
                    )}
                  </motion.button>
                ))}
              </div>

              {readyToClaimRewards.length > 0 && rewardViewMode === "active" && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  whileHover={{ scale: 1.02 }}
                  className="bg-gradient-to-r from-green-400 to-emerald-400 text-white px-4 py-2 rounded-2xl text-sm font-medium flex items-center space-x-2 shadow-lg"
                >
                  <motion.div
                    animate={{ rotate: [0, 360] }}
                    transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                  >
                    <Zap className="h-4 w-4" />
                  </motion.div>
                  <span>{readyToClaimRewards.length} reward{readyToClaimRewards.length !== 1 ? 's' : ''} ready!</span>
                  <motion.div
                    animate={{ scale: [1, 1.2, 1] }}
                    transition={{ duration: 1, repeat: Infinity, ease: "easeInOut" }}
                  >
                    <Sparkles className="h-3 w-3" />
                  </motion.div>
                </motion.div>
              )}
            </motion.div>

            <AnimatePresence>
              {showCreateForm && (
                <motion.div
                  initial={{ opacity: 0, y: -20, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: -20, scale: 0.95 }}
                  transition={{ type: "spring", damping: 25, stiffness: 300 }}
                  className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl p-6 border border-amber-200/50"
                >
                  <RewardForm onClose={() => setShowCreateForm(false)} />
                </motion.div>
              )}
            </AnimatePresence>

            {/* Section Headers and Content */}
            {rewardViewMode === "active" && (
              <div className="space-y-8">
                {/* Ready to Claim Section */}
                {readyToClaimRewards.length > 0 && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.6 }}
                  >
                    <div className="flex items-center mb-6">
                      <motion.div 
                        className="bg-gradient-to-br from-green-200 to-emerald-200 p-3 rounded-2xl mr-4 shadow-md border border-green-300/50"
                        animate={{ scale: [1, 1.05, 1] }}
                        transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                      >
                        <Zap className="h-6 w-6 text-green-700" />
                      </motion.div>
                      <div>
                        <h2 className="text-2xl font-bold text-gray-800 flex items-center">
                          Ready to Enjoy! 
                          <motion.span
                            animate={{ rotate: [0, 10, -10, 0] }}
                            transition={{ duration: 1, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
                            className="ml-2"
                          >
                            <Cookie className="h-5 w-5 text-amber-600" />
                          </motion.span>
                        </h2>
                        <p className="text-green-600 text-sm flex items-center">
                          Your rewards are perfectly brewed 
                          <Heart className="h-3 w-3 text-red-400 ml-1" />
                        </p>
                      </div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                      {readyToClaimRewards.map((reward, index) => (
                        <motion.div
                          key={reward.id}
                          initial={{ opacity: 0, scale: 0.9, y: 20 }}
                          animate={{ opacity: 1, scale: 1, y: 0 }}
                          transition={{ 
                            duration: 0.4, 
                            delay: index * 0.1,
                            type: "spring",
                            damping: 25,
                            stiffness: 300
                          }}
                        >
                          <RewardCard reward={reward} />
                        </motion.div>
                      ))}
                    </div>
                  </motion.div>
                )}

                {/* In Progress Section */}
                {activeRewards.length > 0 && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.8 }}
                  >
                    <div className="flex items-center mb-6">
                      <motion.div 
                        className="bg-gradient-to-br from-orange-200 to-amber-200 p-3 rounded-2xl mr-4 shadow-md border border-orange-300/50"
                        animate={{ rotate: [0, 5, -5, 0] }}
                        transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                      >
                        <Clock className="h-6 w-6 text-orange-700" />
                      </motion.div>
                      <div>
                        <h2 className="text-2xl font-bold text-gray-800 flex items-center">
                          Brewing in Progress 
                          <motion.span
                            animate={{ y: [0, -2, 0] }}
                            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                            className="ml-2"
                          >
                            <Coffee className="h-5 w-5 text-amber-600" />
                          </motion.span>
                        </h2>
                        <p className="text-orange-600 text-sm">Keep nurturing these habits to unlock rewards</p>
                      </div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                      {activeRewards.map((reward, index) => (
                        <motion.div
                          key={reward.id}
                          initial={{ opacity: 0, scale: 0.9, y: 20 }}
                          animate={{ opacity: 1, scale: 1, y: 0 }}
                          transition={{ 
                            duration: 0.4, 
                            delay: index * 0.1,
                            type: "spring",
                            damping: 25,
                            stiffness: 300
                          }}
                        >
                          <RewardCard reward={reward} />
                        </motion.div>
                      ))}
                    </div>
                  </motion.div>
                )}

                {/* Empty State for Active */}
                {activeRewards.length === 0 && readyToClaimRewards.length === 0 && (
                  <motion.div 
                    className="text-center py-16"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8 }}
                  >
                    <motion.div 
                      className="bg-gradient-to-br from-amber-100 to-orange-100 rounded-3xl w-32 h-32 flex items-center justify-center mx-auto mb-8 shadow-lg border border-amber-200"
                      animate={{ 
                        rotate: [0, 5, -5, 0],
                        scale: [1, 1.05, 1]
                      }}
                      transition={{ 
                        duration: 4, 
                        repeat: Infinity, 
                        ease: "easeInOut" 
                      }}
                    >
                      <Coffee className="h-16 w-16 text-amber-600" />
                      <motion.div
                        animate={{
                          y: [-4, -12, -4],
                          opacity: [0.6, 0.3, 0.6],
                        }}
                        transition={{
                          duration: 2,
                          repeat: Infinity,
                          ease: "easeInOut",
                        }}
                        className="absolute -top-2 left-1/2 transform -translate-x-1/2"
                      >
                        <div className="w-2 h-4 bg-gradient-to-t from-amber-400/60 to-transparent rounded-full"></div>
                      </motion.div>
                    </motion.div>
                    <h3 className="text-2xl font-bold text-gray-700 mb-4">
                      Your cafe is waiting! 
                    </h3>
                    <p className="text-gray-500 mb-8 max-w-md mx-auto">
                      Start your habit journey by brewing your first reward. Every great habit starts with a dream worth working for.
                    </p>
                    <motion.button
                      onClick={() => setShowCreateForm(true)}
                      whileHover={{ scale: 1.05, rotate: 2 }}
                      whileTap={{ scale: 0.95 }}
                      className="bg-gradient-to-r from-amber-400 to-orange-400 hover:from-amber-500 hover:to-orange-500 text-white px-8 py-4 rounded-2xl font-medium transition-all duration-300 shadow-lg hover:shadow-xl flex items-center space-x-2 mx-auto"
                    >
                      <Plus className="h-5 w-5" />
                      <span>Brew Your First Reward</span>
                      <Sparkles className="h-4 w-4" />
                    </motion.button>
                  </motion.div>
                )}
              </div>
            )}

            {/* Completed Rewards Section */}
            {rewardViewMode === "completed" && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
              >
                {completedRewards.length > 0 ? (
                  <>
                    <div className="flex items-center mb-6">
                      <motion.div 
                        className="bg-gradient-to-br from-purple-200 to-pink-200 p-3 rounded-2xl mr-4 shadow-md border border-purple-300/50"
                        animate={{ scale: [1, 1.1, 1] }}
                        transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                      >
                        <Coffee className="h-6 w-6 text-purple-700" />
                      </motion.div>
                      <div>
                        <h2 className="text-2xl font-bold text-gray-800 flex items-center">
                          Savored Rewards 
                          <motion.span
                            animate={{ rotate: [0, 360] }}
                            transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
                            className="ml-2"
                          >
                            <Sparkles className="h-5 w-5 text-yellow-500" />
                          </motion.span>
                        </h2>
                        <p className="text-purple-600 text-sm">Your sweet achievements and memorable moments</p>
                      </div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                      {completedRewards.map((reward, index) => (
                        <motion.div
                          key={reward.id}
                          initial={{ opacity: 0, scale: 0.9, y: 20 }}
                          animate={{ opacity: 1, scale: 1, y: 0 }}
                          transition={{ 
                            duration: 0.4, 
                            delay: index * 0.1,
                            type: "spring",
                            damping: 25,
                            stiffness: 300
                          }}
                        >
                          <CompletedRewardCard reward={reward} />
                        </motion.div>
                      ))}
                    </div>
                  </>
                ) : (
                  <motion.div 
                    className="text-center py-16"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8 }}
                  >
                    <motion.div 
                      className="bg-gradient-to-br from-purple-100 to-pink-100 rounded-3xl w-32 h-32 flex items-center justify-center mx-auto mb-8 shadow-lg border border-purple-200"
                      animate={{ 
                        rotate: [0, 10, -10, 0],
                        scale: [1, 1.05, 1]
                      }}
                      transition={{ 
                        duration: 3, 
                        repeat: Infinity, 
                        ease: "easeInOut" 
                      }}
                    >
                      <Coffee className="h-16 w-16 text-purple-600" />
                    </motion.div>
                    <h3 className="text-2xl font-bold text-gray-700 mb-4">
                      No savored rewards yet
                    </h3>
                    <p className="text-gray-500 mb-8 max-w-md mx-auto">
                      Keep brewing your habits! Soon you'll have delicious rewards to celebrate and remember.
                    </p>
                  </motion.div>
                )}
              </motion.div>
            )}

            {/* All Rewards View */}
            {rewardViewMode === "all" && filteredRewards.length > 0 && (
              <motion.div 
                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
              >
                {filteredRewards.map((reward, index) => (
                  <motion.div
                    key={reward.id}
                    initial={{ opacity: 0, scale: 0.9, y: 20 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    transition={{ 
                      duration: 0.4, 
                      delay: index * 0.05,
                      type: "spring",
                      damping: 25,
                      stiffness: 300
                    }}
                  >
                    {reward.is_claimed ? (
                      <CompletedRewardCard reward={reward} />
                    ) : (
                      <RewardCard reward={reward} />
                    )}
                  </motion.div>
                ))}
              </motion.div>
            )}
          </motion.div>
        ) : activeTab === "analytics" ? (
          <motion.div
            key="analytics"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
            transition={{ duration: 0.3 }}
          >
            <Analytics />
          </motion.div>
        ) : (
          <motion.div
            key="music"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
            transition={{ duration: 0.3 }}
          >
            <LofiPlayer />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};