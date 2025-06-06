import { useState } from "react";
import { useHabits } from "../../hooks/useHabits";
import { useHabitSuggestions } from "../../hooks/useHabitSuggestions";
import { HabitSuggestions } from "./HabitSuggestions";
import { X, Sparkles, Coffee } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
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
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [suggestionInput, setSuggestionInput] = useState("");
  
  const { createHabit, updateHabit, isCreating, isUpdating } = useHabits();
  const {
    suggestions,
    isLoading: isSuggestionsLoading,
    error: suggestionsError,
    remainingRequests,
    totalRequests,
    refreshSuggestions,
    clearSuggestions,
  } = useHabitSuggestions();

  const isEditing = !!habit;
  const isLoading = isCreating || isUpdating;

  const handleSelectSuggestion = (suggestion: string) => {
    setName(suggestion);
    setShowSuggestions(false);
    setSuggestionInput("");
    clearSuggestions();
    toast.success("Perfect choice! ☕");
  };

  const handleToggleSuggestions = () => {
    if (showSuggestions) {
      setShowSuggestions(false);
      setSuggestionInput("");
      clearSuggestions();
    } else {
      setShowSuggestions(true);
      if (!suggestionInput.trim()) {
        refreshSuggestions("");
      }
    }
  };

  const handleGetSuggestions = () => {
    if (suggestionInput.trim()) {
      refreshSuggestions(suggestionInput.trim());
    }
  };

  const handleInputChange = (value: string) => {
    setSuggestionInput(value);
  };

  const handleSuggestionKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && suggestionInput.trim()) {
      handleGetSuggestions();
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!name.trim()) {
      toast.error("Please name your habit recipe! ☕");
      return;
    }

    if (pointsPerCompletion < 1) {
      toast.error("Points must be at least 1 to brew success!");
      return;
    }

    try {
      if (isEditing) {
        updateHabit({
          id: habit.id,
          updates: { name, points_per_completion: pointsPerCompletion },
        });
        toast.success("Habit recipe updated! ☕", { icon: "✨" });
      } else {
        createHabit({
          reward_id: rewardId,
          name,
          points_per_completion: pointsPerCompletion,
        });
        toast.success("New habit brewing! ☕", { icon: "🎉" });
      }
      onClose();
    } catch (error: any) {
      toast.error(error.message || "Something went wrong in the kitchen!");
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ type: "spring", damping: 25, stiffness: 300 }}
      className="relative"
    >
      <div className="flex items-center justify-between mb-4 sm:mb-6">
        <div className="flex items-center space-x-2 sm:space-x-3">
          <motion.div
            animate={{ rotate: [0, 5, -5, 0] }}
            transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
            className="bg-gradient-to-br from-amber-200 to-orange-200 p-2 rounded-lg sm:rounded-xl shadow-md flex-shrink-0"
          >
            <Coffee className="h-4 w-4 sm:h-5 sm:w-5 text-amber-700" />
          </motion.div>
          <div className="min-w-0">
            <h4 className="text-lg sm:text-xl font-bold text-amber-900">
              {isEditing ? "Edit Habit Recipe" : "Brew New Habit"}
            </h4>
            <p className="text-xs sm:text-sm text-amber-600">
              Create the perfect daily ritual ☕
            </p>
          </div>
        </div>
        <motion.button
          onClick={onClose}
          whileHover={{ scale: 1.1, rotate: 90 }}
          whileTap={{ scale: 0.95 }}
          className="p-1.5 sm:p-2 hover:bg-amber-100/50 rounded-lg sm:rounded-xl transition-all duration-300 text-amber-600 flex-shrink-0"
        >
          <X className="h-4 w-4 sm:h-5 sm:w-5" />
        </motion.button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6">
        <div>
          <div className="flex items-center gap-2 sm:gap-3 mb-2">
            <label
              htmlFor="habitName"
              className="block text-sm font-semibold text-amber-800 flex items-center"
            >
              <Coffee className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2" />
              Habit Name *
            </label>
            {!isEditing && (
              <motion.button
                type="button"
                onClick={handleToggleSuggestions}
                whileHover={{ scale: 1.05, rotate: 10 }}
                whileTap={{ scale: 0.95 }}
                className={`group relative p-1.5 sm:p-2 rounded-lg sm:rounded-xl transition-all duration-300 ${
                  showSuggestions 
                    ? "text-amber-700 bg-amber-200/60 shadow-md" 
                    : "text-amber-600 hover:text-amber-700 hover:bg-amber-100/50"
                }`}
                title={showSuggestions ? "Hide AI magic" : "Get AI suggestions"}
              >
                <motion.div
                  animate={{ rotate: showSuggestions ? 360 : 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <Sparkles className="h-3 w-3 sm:h-4 sm:w-4" />
                </motion.div>
                <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-2 py-1 bg-amber-800 text-white text-xs rounded-lg opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-10">
                  {showSuggestions ? "Hide suggestions" : "AI Magic ✨"}
                </div>
              </motion.button>
            )}
          </div>
          <motion.input
            id="habitName"
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="e.g., Sip morning coffee mindfully, Read 10 pages with tea..."
            whileFocus={{ scale: 1.01 }}
            className="w-full px-3 sm:px-4 py-2.5 sm:py-3 border-2 border-amber-200/60 rounded-lg sm:rounded-xl focus:ring-4 focus:ring-amber-200/50 focus:border-amber-400 transition-all duration-300 text-sm bg-white/80 backdrop-blur-sm placeholder-amber-400"
            required
          />

          <AnimatePresence>
            {showSuggestions && !isEditing && (
              <motion.div
                initial={{ opacity: 0, height: 0, y: -10 }}
                animate={{ opacity: 1, height: "auto", y: 0 }}
                exit={{ opacity: 0, height: 0, y: -10 }}
                transition={{ duration: 0.4, ease: "easeInOut" }}
                className="mt-3 sm:mt-4 overflow-hidden"
              >
                <div className="p-3 sm:p-4 bg-gradient-to-br from-amber-50/90 via-orange-50/90 to-amber-50/90 backdrop-blur-sm rounded-xl sm:rounded-2xl border-2 border-amber-200/50 shadow-lg">
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-3 sm:mb-4 gap-2">
                    <div className="flex items-center gap-2">
                      <motion.div
                        animate={{ rotate: [0, 360] }}
                        transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
                      >
                        <Sparkles className="h-4 w-4 text-amber-600" />
                      </motion.div>
                      <span className="text-sm font-semibold text-amber-900">AI Barista Suggestions</span>
                    </div>
                    <motion.span 
                      className="text-xs bg-amber-200/80 text-amber-800 px-2 sm:px-3 py-1 rounded-full font-medium shadow-sm w-fit"
                      animate={{ scale: [1, 1.05, 1] }}
                      transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                    >
                      {remainingRequests}/{totalRequests} today
                    </motion.span>
                  </div>
                  
                  <div className="flex flex-col sm:flex-row gap-2 mb-3 sm:mb-4">
                    <motion.input
                      type="text"
                      value={suggestionInput}
                      onChange={(e) => handleInputChange(e.target.value)}
                      onKeyPress={handleSuggestionKeyPress}
                      whileFocus={{ scale: 1.01 }}
                      className="flex-1 px-3 py-2 sm:py-2.5 border-2 border-amber-200/60 rounded-lg sm:rounded-xl focus:ring-4 focus:ring-amber-200/50 focus:border-amber-400 text-sm bg-white/80 backdrop-blur-sm placeholder-amber-400"
                      placeholder="fitness, reading, mindfulness..."
                    />
                    <motion.button
                      type="button"
                      onClick={handleGetSuggestions}
                      disabled={isSuggestionsLoading || remainingRequests === 0 || !suggestionInput.trim()}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className="px-3 sm:px-4 py-2 sm:py-2.5 bg-gradient-to-r from-amber-400 to-orange-400 hover:from-amber-500 hover:to-orange-500 disabled:from-gray-300 disabled:to-gray-400 text-white text-sm rounded-lg sm:rounded-xl font-medium transition-all duration-300 disabled:cursor-not-allowed flex items-center justify-center gap-2 shadow-md w-full sm:w-auto"
                    >
                      {isSuggestionsLoading ? (
                        <>
                          <motion.div
                            animate={{ rotate: 360 }}
                            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                            className="w-3 h-3 border-2 border-white border-t-transparent rounded-full"
                          />
                          <span className="hidden sm:inline">Brewing...</span>
                        </>
                      ) : (
                        <>
                          <Sparkles className="h-3 w-3" />
                          <span>Get Ideas</span>
                        </>
                      )}
                    </motion.button>
                  </div>

                  <HabitSuggestions
                    suggestions={suggestions}
                    isLoading={isSuggestionsLoading}
                    isModelLoaded={true}
                    error={suggestionsError}
                    remainingRequests={remainingRequests}
                    totalRequests={totalRequests}
                    onSelectSuggestion={handleSelectSuggestion}
                  />
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <div>
          <label
            htmlFor="points"
            className="block text-sm font-semibold text-amber-800 mb-2 flex items-center"
          >
            <motion.div
              animate={{ scale: [1, 1.1, 1] }}
              transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
            >
              ⭐
            </motion.div>
            <span className="ml-1 sm:ml-2">Points per Sip *</span>
          </label>
          <motion.input
            id="points"
            type="number"
            value={pointsPerCompletion}
            onChange={(e) => setPointsPerCompletion(Number(e.target.value))}
            min="1"
            max="1000"
            whileFocus={{ scale: 1.01 }}
            className="w-full px-3 sm:px-4 py-2.5 sm:py-3 border-2 border-amber-200/60 rounded-lg sm:rounded-xl focus:ring-4 focus:ring-amber-200/50 focus:border-amber-400 transition-all duration-300 text-sm bg-white/80 backdrop-blur-sm"
            required
          />
          <p className="text-xs text-amber-600 mt-2 flex items-center">
            <Coffee className="h-3 w-3 mr-1" />
            Points earned each time you complete this habit
          </p>
        </div>

        <div className="flex flex-col sm:flex-row items-center space-y-3 sm:space-y-0 sm:space-x-3 pt-2 sm:pt-4">
          <motion.button
            type="submit"
            disabled={isLoading}
            whileHover={{ scale: 1.02, y: -2 }}
            whileTap={{ scale: 0.98 }}
            className="w-full sm:flex-1 bg-gradient-to-r from-amber-400 via-orange-400 to-amber-400 hover:from-amber-500 hover:via-orange-500 hover:to-amber-500 disabled:from-gray-300 disabled:via-gray-400 disabled:to-gray-300 text-white py-2.5 sm:py-3 px-4 rounded-lg sm:rounded-xl font-semibold transition-all duration-300 shadow-lg hover:shadow-xl disabled:cursor-not-allowed text-sm relative overflow-hidden"
          >
            <AnimatePresence mode="wait">
              {isLoading ? (
                <motion.div
                  key="loading"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="flex items-center justify-center"
                >
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                    className="w-4 h-4 border-2 border-white border-t-transparent rounded-full mr-2"
                  />
                  {isEditing ? "Updating recipe..." : "Brewing habit..."}
                </motion.div>
              ) : (
                <motion.div
                  key="idle"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="flex items-center justify-center space-x-2"
                >
                  <motion.div
                    animate={{ rotate: [0, 5, -5, 0] }}
                    transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                  >
                    <Coffee className="h-4 w-4" />
                  </motion.div>
                  <span>{isEditing ? "Update Recipe" : "Brew Habit"}</span>
                  <motion.div
                    animate={{ scale: [1, 1.2, 1] }}
                    transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
                  >
                    <Sparkles className="h-4 w-4" />
                  </motion.div>
                </motion.div>
              )}
            </AnimatePresence>
            
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

          <motion.button
            type="button"
            onClick={onClose}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="w-full sm:w-auto px-4 sm:px-6 py-2.5 sm:py-3 border-2 border-amber-300/60 text-amber-700 rounded-lg sm:rounded-xl hover:bg-amber-50/50 transition-all duration-300 text-sm font-medium"
          >
            Cancel
          </motion.button>
        </div>
      </form>
    </motion.div>
  );
};