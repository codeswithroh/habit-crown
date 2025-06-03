import { useState } from "react";
import { useRewards } from "../../hooks/useRewards";
import { RewardCard } from "../rewards/RewardCard";
import { RewardForm } from "../rewards/RewardForm";
import { Analytics } from "../analytics/Analytics";
import { Plus, BarChart3, Trophy } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export const Dashboard = () => {
  const { rewards, isLoading } = useRewards();
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [activeTab, setActiveTab] = useState<"rewards" | "analytics">(
    "rewards"
  );

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-1 bg-white rounded-lg border border-gray-200 p-1">
          <button
            onClick={() => setActiveTab("rewards")}
            className={`flex items-center space-x-2 px-4 py-2 rounded-md text-sm font-medium transition-colors ${
              activeTab === "rewards"
                ? "bg-purple-600 text-white"
                : "text-gray-600 hover:text-gray-800"
            }`}
          >
            <Trophy className="h-4 w-4" />
            <span>Rewards</span>
          </button>
          <button
            onClick={() => setActiveTab("analytics")}
            className={`flex items-center space-x-2 px-4 py-2 rounded-md text-sm font-medium transition-colors ${
              activeTab === "analytics"
                ? "bg-purple-600 text-white"
                : "text-gray-600 hover:text-gray-800"
            }`}
          >
            <BarChart3 className="h-4 w-4" />
            <span>Analytics</span>
          </button>
        </div>

        {activeTab === "rewards" && (
          <button
            onClick={() => setShowCreateForm(true)}
            className="flex items-center space-x-2 bg-gradient-to-r from-purple-600 to-blue-600 text-white px-6 py-3 rounded-lg font-medium hover:from-purple-700 hover:to-blue-700 transition-all shadow-lg hover:shadow-xl"
          >
            <Plus className="h-5 w-5" />
            <span>New Reward</span>
          </button>
        )}
      </div>

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
            <div>
              <h2 className="text-3xl font-bold text-gray-800">Your Rewards</h2>
              <p className="text-gray-600 mt-1">
                {rewards.length === 0
                  ? "Create your first reward to get started!"
                  : `${rewards.length} reward${
                      rewards.length === 1 ? "" : "s"
                    } in progress`}
              </p>
            </div>

            <AnimatePresence>
              {showCreateForm && (
                <motion.div
                  initial={{ opacity: 0, y: -20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  className="bg-white rounded-xl shadow-lg p-6 border border-gray-200"
                >
                  <RewardForm onClose={() => setShowCreateForm(false)} />
                </motion.div>
              )}
            </AnimatePresence>

            {rewards.length === 0 ? (
              <div className="text-center py-12">
                <div className="bg-gray-100 rounded-full w-24 h-24 flex items-center justify-center mx-auto mb-6">
                  <Plus className="h-12 w-12 text-gray-400" />
                </div>
                <h3 className="text-xl font-semibold text-gray-700 mb-2">
                  No rewards yet
                </h3>
                <p className="text-gray-500 mb-6">
                  Create your first reward and start building healthy habits!
                </p>
                <button
                  onClick={() => setShowCreateForm(true)}
                  className="bg-gradient-to-r from-purple-600 to-blue-600 text-white px-8 py-3 rounded-lg font-medium hover:from-purple-700 hover:to-blue-700 transition-all"
                >
                  Create Your First Reward
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <AnimatePresence>
                  {rewards.map((reward) => (
                    <motion.div
                      key={reward.id}
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.9 }}
                      transition={{ duration: 0.2 }}
                    >
                      <RewardCard reward={reward} />
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>
            )}
          </motion.div>
        ) : (
          <motion.div
            key="analytics"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
            transition={{ duration: 0.3 }}
          >
            <Analytics />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
