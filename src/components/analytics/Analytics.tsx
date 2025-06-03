import { useState } from "react";
import { useAnalytics } from "../../hooks/useAnalytics";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
} from "recharts";
import { ProgressRing } from "../ui/ProgressRing";
import {
  TrendingUp,
  Target,
  Trophy,
  Flame,
  Calendar,
  BarChart3,
  Clock,
  Award,
} from "lucide-react";
import { motion } from "framer-motion";

export const Analytics = () => {
  const [viewMode, setViewMode] = useState<"daily" | "weekly">("daily");
  const { dailyStats, weeklyStats, streakData, rewardOverview, isLoading } =
    useAnalytics();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600"></div>
      </div>
    );
  }

  const currentData = viewMode === "daily" ? dailyStats : weeklyStats;
  const totalPointsProgress =
    rewardOverview.totalTargetPoints > 0
      ? (rewardOverview.totalPointsEarned / rewardOverview.totalTargetPoints) *
        100
      : 0;

  const recentCompletionRate =
    dailyStats.slice(-7).reduce((sum, day) => sum + day.completionRate, 0) / 7;

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold text-gray-800">Analytics</h2>
          <p className="text-gray-600 mt-1">Track your progress and insights</p>
        </div>

        <div className="flex items-center space-x-2 bg-white rounded-lg border border-gray-200 p-1">
          <button
            onClick={() => setViewMode("daily")}
            className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
              viewMode === "daily"
                ? "bg-purple-600 text-white"
                : "text-gray-600 hover:text-gray-800"
            }`}
          >
            Daily
          </button>
          <button
            onClick={() => setViewMode("weekly")}
            className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
              viewMode === "weekly"
                ? "bg-purple-600 text-white"
                : "text-gray-600 hover:text-gray-800"
            }`}
          >
            Weekly
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white p-6 rounded-xl shadow-lg border border-gray-200"
        >
          <div className="flex items-center justify-between mb-4">
            <div className="bg-orange-100 p-3 rounded-lg">
              <Flame className="h-6 w-6 text-orange-600" />
            </div>
            <div className="text-right">
              <p className="text-2xl font-bold text-gray-800">
                {streakData.currentStreak}
              </p>
              <p className="text-sm text-gray-600">Current Streak</p>
            </div>
          </div>
          <div className="text-xs text-gray-500">
            Longest: {streakData.longestStreak} days
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white p-6 rounded-xl shadow-lg border border-gray-200"
        >
          <div className="flex items-center justify-between mb-4">
            <div className="bg-blue-100 p-3 rounded-lg">
              <BarChart3 className="h-6 w-6 text-blue-600" />
            </div>
            <div className="text-right">
              <p className="text-2xl font-bold text-gray-800">
                {Math.round(recentCompletionRate)}%
              </p>
              <p className="text-sm text-gray-600">7-Day Rate</p>
            </div>
          </div>
          <div className="text-xs text-gray-500">Weekly completion average</div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-white p-6 rounded-xl shadow-lg border border-gray-200"
        >
          <div className="flex items-center justify-between mb-4">
            <div className="bg-green-100 p-3 rounded-lg">
              <TrendingUp className="h-6 w-6 text-green-600" />
            </div>
            <div className="text-right">
              <p className="text-2xl font-bold text-gray-800">
                {rewardOverview.totalPointsEarned}
              </p>
              <p className="text-sm text-gray-600">Points Earned</p>
            </div>
          </div>
          <div className="text-xs text-gray-500">Total lifetime points</div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-white p-6 rounded-xl shadow-lg border border-gray-200"
        >
          <div className="flex items-center justify-between mb-4">
            <div className="bg-purple-100 p-3 rounded-lg">
              <Trophy className="h-6 w-6 text-purple-600" />
            </div>
            <div className="text-right">
              <p className="text-2xl font-bold text-gray-800">
                {rewardOverview.claimedRewards}
              </p>
              <p className="text-sm text-gray-600">Rewards Claimed</p>
            </div>
          </div>
          <div className="text-xs text-gray-500">
            Out of {rewardOverview.totalRewards} total
          </div>
        </motion.div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="lg:col-span-2 bg-white p-6 rounded-xl shadow-lg border border-gray-200"
        >
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-semibold text-gray-800">
              {viewMode === "daily" ? "Daily" : "Weekly"} Progress
            </h3>
            <div className="flex items-center space-x-4 text-sm">
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-purple-500 rounded-full"></div>
                <span className="text-gray-600">Points Earned</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                <span className="text-gray-600">Completion Rate</span>
              </div>
            </div>
          </div>

          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={currentData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis
                  dataKey={viewMode === "daily" ? "date" : "week"}
                  stroke="#666"
                  fontSize={12}
                  tickFormatter={(value) => {
                    if (viewMode === "daily") {
                      return new Date(value).toLocaleDateString("en", {
                        month: "short",
                        day: "numeric",
                      });
                    }
                    return value.split(" - ")[0];
                  }}
                />
                <YAxis stroke="#666" fontSize={12} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "white",
                    border: "1px solid #e5e7eb",
                    borderRadius: "8px",
                    boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
                  }}
                  formatter={(value, name) => [
                    typeof value === "number" ? value.toFixed(1) : value,
                    name === "pointsEarned"
                      ? "Points"
                      : name === "completionRate"
                      ? "Rate (%)"
                      : name === "averageCompletionRate"
                      ? "Avg Rate (%)"
                      : name,
                  ]}
                />
                <Line
                  type="monotone"
                  dataKey="pointsEarned"
                  stroke="#8b5cf6"
                  strokeWidth={3}
                  dot={{ fill: "#8b5cf6", strokeWidth: 0, r: 4 }}
                  activeDot={{ r: 6 }}
                />
                <Line
                  type="monotone"
                  dataKey={
                    viewMode === "daily"
                      ? "completionRate"
                      : "averageCompletionRate"
                  }
                  stroke="#3b82f6"
                  strokeWidth={3}
                  dot={{ fill: "#3b82f6", strokeWidth: 0, r: 4 }}
                  activeDot={{ r: 6 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="bg-white p-6 rounded-xl shadow-lg border border-gray-200"
        >
          <h3 className="text-xl font-semibold text-gray-800 mb-6">
            Reward Progress
          </h3>

          <div className="space-y-6">
            <div className="text-center">
              <ProgressRing
                progress={totalPointsProgress}
                size={120}
                strokeWidth={8}
                className="text-purple-500 mx-auto mb-4"
              />
              <p className="text-sm text-gray-600 mb-2">Overall Progress</p>
              <p className="text-lg font-semibold text-gray-800">
                {rewardOverview.totalPointsEarned} /{" "}
                {rewardOverview.totalTargetPoints}
              </p>
            </div>

            <div className="space-y-4">
              <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                <div className="flex items-center space-x-3">
                  <Award className="h-5 w-5 text-green-600" />
                  <span className="text-sm font-medium text-green-800">
                    Active
                  </span>
                </div>
                <span className="text-lg font-bold text-green-800">
                  {rewardOverview.activeRewards}
                </span>
              </div>

              <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
                <div className="flex items-center space-x-3">
                  <Target className="h-5 w-5 text-blue-600" />
                  <span className="text-sm font-medium text-blue-800">
                    Completed
                  </span>
                </div>
                <span className="text-lg font-bold text-blue-800">
                  {rewardOverview.completedRewards}
                </span>
              </div>

              <div className="flex items-center justify-between p-3 bg-yellow-50 rounded-lg">
                <div className="flex items-center space-x-3">
                  <Trophy className="h-5 w-5 text-yellow-600" />
                  <span className="text-sm font-medium text-yellow-800">
                    Claimed
                  </span>
                </div>
                <span className="text-lg font-bold text-yellow-800">
                  {rewardOverview.claimedRewards}
                </span>
              </div>
            </div>
          </div>
        </motion.div>
      </div>

      {dailyStats.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
          className="bg-white p-6 rounded-xl shadow-lg border border-gray-200"
        >
          <h3 className="text-xl font-semibold text-gray-800 mb-6">
            Daily Completions
          </h3>

          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={dailyStats.slice(-14)}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis
                  dataKey="date"
                  stroke="#666"
                  fontSize={12}
                  tickFormatter={(value) =>
                    new Date(value).toLocaleDateString("en", {
                      weekday: "short",
                    })
                  }
                />
                <YAxis stroke="#666" fontSize={12} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "white",
                    border: "1px solid #e5e7eb",
                    borderRadius: "8px",
                    boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
                  }}
                  formatter={(value, _name) => [value, "Completions"]}
                  labelFormatter={(label) =>
                    new Date(label).toLocaleDateString()
                  }
                />
                <Bar
                  dataKey="completions"
                  fill="#8b5cf6"
                  radius={[4, 4, 0, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </motion.div>
      )}

      {dailyStats.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
          className="bg-white p-6 rounded-xl shadow-lg border border-gray-200"
        >
          <h3 className="text-xl font-semibold text-gray-800 mb-6">
            Recent Activity
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="text-center p-4 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-lg">
              <Calendar className="h-8 w-8 text-blue-600 mx-auto mb-2" />
              <p className="text-2xl font-bold text-blue-800">
                {dailyStats
                  .slice(-7)
                  .reduce((sum, day) => sum + day.completions, 0)}
              </p>
              <p className="text-sm text-blue-600">This Week</p>
            </div>

            <div className="text-center p-4 bg-gradient-to-br from-green-50 to-emerald-50 rounded-lg">
              <TrendingUp className="h-8 w-8 text-green-600 mx-auto mb-2" />
              <p className="text-2xl font-bold text-green-800">
                {dailyStats
                  .slice(-7)
                  .reduce((sum, day) => sum + day.pointsEarned, 0)}
              </p>
              <p className="text-sm text-green-600">Points This Week</p>
            </div>

            <div className="text-center p-4 bg-gradient-to-br from-purple-50 to-violet-50 rounded-lg">
              <Clock className="h-8 w-8 text-purple-600 mx-auto mb-2" />
              <p className="text-2xl font-bold text-purple-800">
                {dailyStats
                  .slice(-30)
                  .reduce((sum, day) => sum + day.completions, 0)}
              </p>
              <p className="text-sm text-purple-600">This Month</p>
            </div>
          </div>

          <div className="mt-6">
            <h4 className="text-lg font-semibold text-gray-800 mb-4">
              Quick Stats
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
              <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                <span className="text-gray-600">Best Day This Month</span>
                <span className="font-semibold text-gray-800">
                  {Math.max(...dailyStats.slice(-30).map((d) => d.completions))}{" "}
                  completions
                </span>
              </div>

              <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                <span className="text-gray-600">Average Daily Points</span>
                <span className="font-semibold text-gray-800">
                  {dailyStats.length > 0
                    ? Math.round(
                        dailyStats
                          .slice(-30)
                          .reduce((sum, day) => sum + day.pointsEarned, 0) /
                          Math.min(30, dailyStats.length)
                      )
                    : 0}{" "}
                  pts
                </span>
              </div>

              <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                <span className="text-gray-600">Most Productive Day</span>
                <span className="font-semibold text-gray-800">
                  {dailyStats.length > 0 && dailyStats.slice(-30).length > 0
                    ? new Date(
                        dailyStats
                          .slice(-30)
                          .reduce((max, day) =>
                            day.completions > max.completions ? day : max
                          ).date
                      ).toLocaleDateString("en", { weekday: "long" })
                    : "No data"}
                </span>
              </div>

              <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                <span className="text-gray-600">Completion Trend</span>
                <span
                  className={`font-semibold ${
                    dailyStats.length >= 2 &&
                    dailyStats[dailyStats.length - 1].completionRate >
                      dailyStats[dailyStats.length - 2].completionRate
                      ? "text-green-600"
                      : dailyStats.length >= 2 &&
                        dailyStats[dailyStats.length - 1].completionRate <
                          dailyStats[dailyStats.length - 2].completionRate
                      ? "text-red-600"
                      : "text-gray-600"
                  }`}
                >
                  {dailyStats.length >= 2
                    ? dailyStats[dailyStats.length - 1].completionRate >
                      dailyStats[dailyStats.length - 2].completionRate
                      ? "📈 Improving"
                      : dailyStats[dailyStats.length - 1].completionRate <
                        dailyStats[dailyStats.length - 2].completionRate
                      ? "📉 Declining"
                      : "➡️ Steady"
                    : "No trend data"}
                </span>
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </div>
  );
};
