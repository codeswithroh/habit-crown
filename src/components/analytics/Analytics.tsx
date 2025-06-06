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
  Coffee,
  Calendar,
  BarChart3,
  Clock,
  Award,
  Star,
  Zap
} from "lucide-react";
import { motion } from "framer-motion";

export const Analytics = () => {
  const [viewMode, setViewMode] = useState<"daily" | "weekly">("daily");
  const { dailyStats, weeklyStats, streakData, rewardOverview, isLoading } =
    useAnalytics();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
          className="relative mr-4"
        >
          <Coffee className="h-8 w-8 text-amber-600" />
          <motion.div
            animate={{
              y: [-2, -8, -2],
              opacity: [0.6, 0.3, 0.6],
            }}
            transition={{
              duration: 1.5,
              repeat: Infinity,
              ease: "easeInOut",
            }}
            className="absolute -top-2 left-1/2 transform -translate-x-1/2"
          >
            <div className="w-1 h-3 bg-gradient-to-t from-amber-400/60 to-transparent rounded-full"></div>
          </motion.div>
        </motion.div>
        <span className="text-amber-700 font-medium">Brewing your insights...</span>
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
    <div className="space-y-6 sm:space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="flex items-center space-x-3">
          <motion.div
            animate={{ rotate: [0, 5, -5, 0] }}
            transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
            className="bg-gradient-to-br from-amber-200 to-orange-200 p-3 rounded-2xl shadow-lg border border-amber-300/50"
          >
            <BarChart3 className="h-6 w-6 text-amber-700" />
          </motion.div>
          <div>
            <h2 className="text-2xl sm:text-3xl font-bold text-amber-900">Analytics</h2>
            <p className="text-amber-600 text-sm sm:text-base">Track your brewing progress ☕</p>
          </div>
        </div>

        <div className="flex items-center space-x-2 bg-white/80 backdrop-blur-sm rounded-2xl border-2 border-amber-200/50 p-1 shadow-md">
          <button
            onClick={() => setViewMode("daily")}
            className={`px-3 sm:px-4 py-2 rounded-xl text-sm font-medium transition-all duration-300 ${
              viewMode === "daily"
                ? "bg-gradient-to-r from-amber-400 to-orange-400 text-white shadow-md"
                : "text-amber-600 hover:text-amber-800 hover:bg-amber-50"
            }`}
          >
            Daily Brew
          </button>
          <button
            onClick={() => setViewMode("weekly")}
            className={`px-3 sm:px-4 py-2 rounded-xl text-sm font-medium transition-all duration-300 ${
              viewMode === "weekly"
                ? "bg-gradient-to-r from-amber-400 to-orange-400 text-white shadow-md"
                : "text-amber-600 hover:text-amber-800 hover:bg-amber-50"
            }`}
          >
            Weekly Blend
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          whileHover={{ scale: 1.02, rotate: 0.5 }}
          className="bg-gradient-to-br from-orange-50/90 to-amber-50/90 backdrop-blur-sm border-2 border-orange-200/50 rounded-2xl p-4 sm:p-6 shadow-lg"
        >
          <div className="flex items-center justify-between mb-4">
            <motion.div 
              className="bg-gradient-to-br from-orange-400 to-amber-500 p-3 rounded-xl shadow-md"
              animate={{ scale: [1, 1.05, 1] }}
              transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
            >
              <Coffee className="h-5 w-5 text-white" />
            </motion.div>
            <div className="text-right">
              <motion.p 
                className="text-xl sm:text-2xl font-bold text-orange-800"
                animate={{ scale: [1, 1.05, 1] }}
                transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
              >
                {streakData.currentStreak}
              </motion.p>
              <p className="text-sm text-orange-600 font-medium">Current Streak</p>
            </div>
          </div>
          <div className="text-xs text-orange-500 flex items-center">
            <Star className="h-3 w-3 mr-1" />
            Longest: {streakData.longestStreak} days
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          whileHover={{ scale: 1.02, rotate: -0.5 }}
          className="bg-gradient-to-br from-blue-50/90 to-indigo-50/90 backdrop-blur-sm border-2 border-blue-200/50 rounded-2xl p-4 sm:p-6 shadow-lg"
        >
          <div className="flex items-center justify-between mb-4">
            <motion.div 
              className="bg-gradient-to-br from-blue-400 to-indigo-500 p-3 rounded-xl shadow-md"
              animate={{ rotate: [0, 5, -5, 0] }}
              transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
            >
              <TrendingUp className="h-5 w-5 text-white" />
            </motion.div>
            <div className="text-right">
              <motion.p 
                className="text-xl sm:text-2xl font-bold text-blue-800"
                animate={{ scale: [1, 1.05, 1] }}
                transition={{ duration: 2, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
              >
                {Math.round(recentCompletionRate)}%
              </motion.p>
              <p className="text-sm text-blue-600 font-medium">7-Day Rate</p>
            </div>
          </div>
          <div className="text-xs text-blue-500 flex items-center">
            <Clock className="h-3 w-3 mr-1" />
            Weekly completion average
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          whileHover={{ scale: 1.02, rotate: 0.5 }}
          className="bg-gradient-to-br from-green-50/90 to-emerald-50/90 backdrop-blur-sm border-2 border-green-200/50 rounded-2xl p-4 sm:p-6 shadow-lg"
        >
          <div className="flex items-center justify-between mb-4">
            <motion.div 
              className="bg-gradient-to-br from-green-400 to-emerald-500 p-3 rounded-xl shadow-md"
              animate={{ y: [0, -2, 0] }}
              transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
            >
              <Zap className="h-5 w-5 text-white" />
            </motion.div>
            <div className="text-right">
              <motion.p 
                className="text-xl sm:text-2xl font-bold text-green-800"
                animate={{ scale: [1, 1.05, 1] }}
                transition={{ duration: 2, repeat: Infinity, ease: "easeInOut", delay: 1 }}
              >
                {rewardOverview.totalPointsEarned}
              </motion.p>
              <p className="text-sm text-green-600 font-medium">Points Earned</p>
            </div>
          </div>
          <div className="text-xs text-green-500 flex items-center">
            <Coffee className="h-3 w-3 mr-1" />
            Total lifetime points
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          whileHover={{ scale: 1.02, rotate: -0.5 }}
          className="bg-gradient-to-br from-purple-50/90 to-pink-50/90 backdrop-blur-sm border-2 border-purple-200/50 rounded-2xl p-4 sm:p-6 shadow-lg"
        >
          <div className="flex items-center justify-between mb-4">
            <motion.div 
              className="bg-gradient-to-br from-purple-400 to-pink-500 p-3 rounded-xl shadow-md"
              animate={{ scale: [1, 1.05, 1] }}
              transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
            >
              <Trophy className="h-5 w-5 text-white" />
            </motion.div>
            <div className="text-right">
              <motion.p 
                className="text-xl sm:text-2xl font-bold text-purple-800"
                animate={{ scale: [1, 1.05, 1] }}
                transition={{ duration: 2, repeat: Infinity, ease: "easeInOut", delay: 1.5 }}
              >
                {rewardOverview.claimedRewards}
              </motion.p>
              <p className="text-sm text-purple-600 font-medium">Rewards Savored</p>
            </div>
          </div>
          <div className="text-xs text-purple-500 flex items-center">
            <Award className="h-3 w-3 mr-1" />
            Out of {rewardOverview.totalRewards} total
          </div>
        </motion.div>
      </div>

      {/* Main Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Progress Chart */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="lg:col-span-2 bg-white/90 backdrop-blur-sm border-2 border-amber-200/50 rounded-2xl p-4 sm:p-6 shadow-lg"
        >
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6 gap-4">
            <div className="flex items-center space-x-3">
              <motion.div
                animate={{ rotate: [0, 5, -5, 0] }}
                transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                className="bg-gradient-to-br from-amber-200 to-orange-200 p-2 rounded-xl shadow-md"
              >
                <BarChart3 className="h-5 w-5 text-amber-700" />
              </motion.div>
              <h3 className="text-lg sm:text-xl font-semibold text-amber-900">
                {viewMode === "daily" ? "Daily" : "Weekly"} Brewing Progress
              </h3>
            </div>
            <div className="flex items-center space-x-4 text-xs sm:text-sm">
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-amber-500 rounded-full"></div>
                <span className="text-amber-600 font-medium">Points Earned</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-orange-500 rounded-full"></div>
                <span className="text-amber-600 font-medium">Completion Rate</span>
              </div>
            </div>
          </div>

          <div className="h-64 sm:h-80">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={currentData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f59e0b20" />
                <XAxis
                  dataKey={viewMode === "daily" ? "date" : "week"}
                  stroke="#92400e"
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
                <YAxis stroke="#92400e" fontSize={12} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "rgba(255, 255, 255, 0.95)",
                    border: "2px solid #f59e0b40",
                    borderRadius: "12px",
                    boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.1)",
                    backdropFilter: "blur(8px)",
                  }}
                  formatter={(value, name) => [
                    typeof value === "number" ? value.toFixed(1) : value,
                    name === "pointsEarned"
                      ? "Points ☕"
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
                  stroke="#f59e0b"
                  strokeWidth={3}
                  dot={{ fill: "#f59e0b", strokeWidth: 0, r: 4 }}
                  activeDot={{ r: 6, fill: "#f59e0b" }}
                />
                <Line
                  type="monotone"
                  dataKey={
                    viewMode === "daily"
                      ? "completionRate"
                      : "averageCompletionRate"
                  }
                  stroke="#ea580c"
                  strokeWidth={3}
                  dot={{ fill: "#ea580c", strokeWidth: 0, r: 4 }}
                  activeDot={{ r: 6, fill: "#ea580c" }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </motion.div>

        {/* Reward Progress */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="bg-white/90 backdrop-blur-sm border-2 border-amber-200/50 rounded-2xl p-4 sm:p-6 shadow-lg"
        >
          <div className="flex items-center space-x-3 mb-6">
            <motion.div
              animate={{ rotate: [0, 360] }}
              transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
              className="bg-gradient-to-br from-amber-200 to-orange-200 p-2 rounded-xl shadow-md"
            >
              <Target className="h-5 w-5 text-amber-700" />
            </motion.div>
            <h3 className="text-lg sm:text-xl font-semibold text-amber-900">
              Reward Progress
            </h3>
          </div>

          <div className="space-y-6">
            <div className="text-center">
              <ProgressRing
                progress={totalPointsProgress}
                size={120}
                strokeWidth={8}
                className="text-amber-500 mx-auto mb-4"
              />
              <p className="text-sm text-amber-600 mb-2 font-medium">Overall Progress</p>
              <p className="text-lg font-bold text-amber-900">
                {rewardOverview.totalPointsEarned} /{" "}
                {rewardOverview.totalTargetPoints} points
              </p>
            </div>

            <div className="space-y-4">
              <motion.div 
                className="flex items-center justify-between p-3 bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl border border-green-200/60"
                whileHover={{ scale: 1.02 }}
              >
                <div className="flex items-center space-x-3">
                  <Award className="h-5 w-5 text-green-600" />
                  <span className="text-sm font-semibold text-green-800">
                    Active Brews
                  </span>
                </div>
                <span className="text-lg font-bold text-green-800">
                  {rewardOverview.activeRewards}
                </span>
              </motion.div>

              <motion.div 
                className="flex items-center justify-between p-3 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl border border-blue-200/60"
                whileHover={{ scale: 1.02 }}
              >
                <div className="flex items-center space-x-3">
                  <Target className="h-5 w-5 text-blue-600" />
                  <span className="text-sm font-semibold text-blue-800">
                    Ready to Savor
                  </span>
                </div>
                <span className="text-lg font-bold text-blue-800">
                  {rewardOverview.completedRewards}
                </span>
              </motion.div>

              <motion.div 
                className="flex items-center justify-between p-3 bg-gradient-to-r from-amber-50 to-orange-50 rounded-xl border border-amber-200/60"
                whileHover={{ scale: 1.02 }}
              >
                <div className="flex items-center space-x-3">
                  <Trophy className="h-5 w-5 text-amber-600" />
                  <span className="text-sm font-semibold text-amber-800">
                    Savored
                  </span>
                </div>
                <span className="text-lg font-bold text-amber-800">
                  {rewardOverview.claimedRewards}
                </span>
              </motion.div>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Daily Completions Chart */}
      {dailyStats.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
          className="bg-white/90 backdrop-blur-sm border-2 border-amber-200/50 rounded-2xl p-4 sm:p-6 shadow-lg"
        >
          <div className="flex items-center space-x-3 mb-6">
            <motion.div
              animate={{ scale: [1, 1.1, 1] }}
              transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
              className="bg-gradient-to-br from-amber-200 to-orange-200 p-2 rounded-xl shadow-md"
            >
              <Calendar className="h-5 w-5 text-amber-700" />
            </motion.div>
            <h3 className="text-lg sm:text-xl font-semibold text-amber-900">
              Daily Habit Completions
            </h3>
          </div>

          <div className="h-48 sm:h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={dailyStats.slice(-14)}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f59e0b20" />
                <XAxis
                  dataKey="date"
                  stroke="#92400e"
                  fontSize={12}
                  tickFormatter={(value) =>
                    new Date(value).toLocaleDateString("en", {
                      weekday: "short",
                    })
                  }
                />
                <YAxis stroke="#92400e" fontSize={12} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "rgba(255, 255, 255, 0.95)",
                    border: "2px solid #f59e0b40",
                    borderRadius: "12px",
                    boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.1)",
                    backdropFilter: "blur(8px)",
                  }}
                  formatter={(value) => [value, "Completions ☕"]}
                  labelFormatter={(label) =>
                    new Date(label).toLocaleDateString()
                  }
                />
                <Bar
                  dataKey="completions"
                  fill="url(#barGradient)"
                  radius={[4, 4, 0, 0]}
                />
                <defs>
                  <linearGradient id="barGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#f59e0b" />
                    <stop offset="100%" stopColor="#ea580c" />
                  </linearGradient>
                </defs>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </motion.div>
      )}

      {/* Quick Stats */}
      {dailyStats.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
          className="bg-white/90 backdrop-blur-sm border-2 border-amber-200/50 rounded-2xl p-4 sm:p-6 shadow-lg"
        >
          <div className="flex items-center space-x-3 mb-6">
            <motion.div
              animate={{ rotate: [0, 5, -5, 0] }}
              transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
              className="bg-gradient-to-br from-amber-200 to-orange-200 p-2 rounded-xl shadow-md"
            >
              <Coffee className="h-5 w-5 text-amber-700" />
            </motion.div>
            <h3 className="text-lg sm:text-xl font-semibold text-amber-900">
              Recent Brewing Activity
            </h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
            <motion.div 
              className="text-center p-4 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl border border-blue-200/60"
              whileHover={{ scale: 1.02 }}
            >
              <Calendar className="h-6 w-6 sm:h-8 sm:w-8 text-blue-600 mx-auto mb-2" />
              <p className="text-xl sm:text-2xl font-bold text-blue-800">
                {dailyStats
                  .slice(-7)
                  .reduce((sum, day) => sum + day.completions, 0)}
              </p>
              <p className="text-sm text-blue-600 font-medium">This Week</p>
            </motion.div>

            <motion.div 
              className="text-center p-4 bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl border border-green-200/60"
              whileHover={{ scale: 1.02 }}
            >
              <Zap className="h-6 w-6 sm:h-8 sm:w-8 text-green-600 mx-auto mb-2" />
              <p className="text-xl sm:text-2xl font-bold text-green-800">
                {dailyStats
                  .slice(-7)
                  .reduce((sum, day) => sum + day.pointsEarned, 0)}
              </p>
              <p className="text-sm text-green-600 font-medium">Points This Week</p>
            </motion.div>

            <motion.div 
              className="text-center p-4 bg-gradient-to-br from-amber-50 to-orange-50 rounded-xl border border-amber-200/60"
              whileHover={{ scale: 1.02 }}
            >
              <Clock className="h-6 w-6 sm:h-8 sm:w-8 text-amber-600 mx-auto mb-2" />
              <p className="text-xl sm:text-2xl font-bold text-amber-800">
                {dailyStats
                  .slice(-30)
                  .reduce((sum, day) => sum + day.completions, 0)}
              </p>
              <p className="text-sm text-amber-600 font-medium">This Month</p>
            </motion.div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
            <motion.div 
              className="flex justify-between items-center p-3 bg-gradient-to-r from-amber-50 to-orange-50 rounded-xl border border-amber-200/60"
              whileHover={{ scale: 1.02 }}
            >
              <span className="text-amber-600 font-medium">Best Daily Brew</span>
              <span className="font-bold text-amber-800">
                {Math.max(...dailyStats.slice(-30).map((d) => d.completions))}{" "}
                habits
              </span>
            </motion.div>

            <motion.div 
              className="flex justify-between items-center p-3 bg-gradient-to-r from-amber-50 to-orange-50 rounded-xl border border-amber-200/60"
              whileHover={{ scale: 1.02 }}
            >
              <span className="text-amber-600 font-medium">Avg Daily Points</span>
              <span className="font-bold text-amber-800">
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
            </motion.div>

            <motion.div 
              className="flex justify-between items-center p-3 bg-gradient-to-r from-amber-50 to-orange-50 rounded-xl border border-amber-200/60"
              whileHover={{ scale: 1.02 }}
            >
              <span className="text-amber-600 font-medium">Most Productive Day</span>
              <span className="font-bold text-amber-800">
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
            </motion.div>

            <motion.div 
              className="flex justify-between items-center p-3 bg-gradient-to-r from-amber-50 to-orange-50 rounded-xl border border-amber-200/60"
              whileHover={{ scale: 1.02 }}
            >
              <span className="text-amber-600 font-medium">Brewing Trend</span>
              <span
                className={`font-bold ${
                  dailyStats.length >= 2 &&
                  dailyStats[dailyStats.length - 1].completionRate >
                    dailyStats[dailyStats.length - 2].completionRate
                    ? "text-green-600"
                    : dailyStats.length >= 2 &&
                      dailyStats[dailyStats.length - 1].completionRate <
                        dailyStats[dailyStats.length - 2].completionRate
                    ? "text-red-600"
                    : "text-amber-600"
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
            </motion.div>
          </div>
        </motion.div>
      )}
    </div>
  );
};