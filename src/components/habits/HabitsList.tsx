import { useState } from "react";
import type { HabitWithCompletions } from "../../types/database";
import { useHabits } from "../../hooks/useHabits";
import { HabitForm } from "./HabitForm";
import { CheckCircle, Circle, Edit, Trash2, Coffee } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "react-hot-toast";

interface HabitsListProps {
  habits: HabitWithCompletions[];
  disabled?: boolean;
}

export const HabitsList = ({ habits, disabled = false }: HabitsListProps) => {
  const [editingHabit, setEditingHabit] = useState<string | null>(null);
  const { completeHabit, deleteHabit, isCompleting, isDeleting } = useHabits();

  const handleToggleHabit = (habit: HabitWithCompletions) => {
    if (disabled) return;

    if (habit.completions_today > 0) {
      toast.success("Habit already savored today! ☕", {
        icon: "✨",
      });
      return;
    }

    completeHabit({
      habitId: habit.id,
      pointsEarned: habit.points_per_completion,
    });
    
    toast.success(`+${habit.points_per_completion} points earned! Perfect brew! ☕`, {
      icon: "🎉",
    });
  };

  const handleDeleteHabit = (habitId: string) => {
    if (window.confirm("Remove this habit from your cafe menu?")) {
      deleteHabit(habitId);
      toast.success("Habit removed from menu ☕");
    }
  };

  if (habits.length === 0) {
    return (
      <motion.div 
        className="text-center py-6 sm:py-8"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <motion.div
          animate={{ 
            rotate: [0, 10, -10, 0],
            scale: [1, 1.05, 1]
          }}
          transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
          className="bg-gradient-to-br from-amber-100 to-orange-100 rounded-full w-12 h-12 sm:w-16 sm:h-16 flex items-center justify-center mx-auto mb-4 shadow-lg border border-amber-200"
        >
          <Coffee className="h-6 w-6 sm:h-8 sm:w-8 text-amber-600" />
          <motion.div
            animate={{
              y: [-2, -8, -2],
              opacity: [0.6, 0.3, 0.6],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: "easeInOut",
            }}
            className="absolute -top-2 left-1/2 transform -translate-x-1/2"
          >
            <div className="w-1 h-3 bg-gradient-to-t from-amber-400/60 to-transparent rounded-full"></div>
          </motion.div>
        </motion.div>
        <h3 className="text-base sm:text-lg font-semibold text-amber-800 mb-2">
          No habits brewing yet
        </h3>
        <p className="text-sm text-amber-600">
          Add your first habit to start brewing success! ☕
        </p>
      </motion.div>
    );
  }

  return (
    <div className="space-y-3">
      <AnimatePresence>
        {habits.map((habit, index) => (
          <motion.div
            key={habit.id}
            initial={{ opacity: 0, x: -20, scale: 0.95 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            exit={{ opacity: 0, x: -20, scale: 0.95 }}
            transition={{ 
              duration: 0.3, 
              delay: index * 0.1,
              type: "spring",
              stiffness: 300,
              damping: 25
            }}
            className={`relative border-2 rounded-xl p-3 sm:p-4 transition-all duration-300 ${
              habit.completions_today > 0
                ? "bg-gradient-to-br from-green-50/90 to-emerald-50/90 border-green-300/60 shadow-md"
                : disabled
                ? "bg-gradient-to-br from-gray-50/90 to-gray-100/90 border-gray-200/60"
                : "bg-white/90 border-amber-200/50 hover:border-amber-300/70 hover:shadow-md"
            }`}
          >
            {editingHabit === habit.id ? (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-gradient-to-br from-amber-50/80 to-orange-50/80 rounded-lg p-3 sm:p-4 border border-amber-200/50"
              >
                <HabitForm
                  rewardId={habit.reward_id}
                  habit={habit}
                  onClose={() => setEditingHabit(null)}
                />
              </motion.div>
            ) : (
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-start gap-3 flex-1 min-w-0">
                  <motion.button
                    onClick={() => handleToggleHabit(habit)}
                    disabled={disabled || isCompleting || habit.completions_today > 0}
                    whileHover={!disabled && habit.completions_today === 0 ? { scale: 1.1 } : {}}
                    whileTap={!disabled && habit.completions_today === 0 ? { scale: 0.95 } : {}}
                    className={`flex-shrink-0 mt-0.5 transition-all duration-300 ${
                      habit.completions_today > 0
                        ? "text-green-600"
                        : disabled
                        ? "text-gray-300 cursor-not-allowed"
                        : "text-amber-400 hover:text-green-500 cursor-pointer"
                    }`}
                  >
                    {habit.completions_today > 0 ? (
                      <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ type: "spring", stiffness: 500, damping: 15 }}
                      >
                        <CheckCircle className="h-6 w-6" />
                      </motion.div>
                    ) : (
                      <Circle className="h-6 w-6" />
                    )}
                  </motion.button>

                  <div className="flex-1 min-w-0">
                    <motion.h5
                      className={`font-semibold text-sm sm:text-base leading-relaxed ${
                        habit.completions_today > 0
                          ? "text-green-800 line-through"
                          : disabled
                          ? "text-gray-500"
                          : "text-amber-900"
                      }`}
                      whileHover={!disabled ? { scale: 1.01 } : {}}
                    >
                      {habit.name}
                    </motion.h5>
                    
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1 sm:gap-2 mt-1">
                      <p className="text-xs text-amber-600 font-medium flex items-center">
                        <Coffee className="h-3 w-3 mr-1 flex-shrink-0" />
                        {habit.points_per_completion} points per sip
                      </p>
                      {habit.completions_today > 0 && (
                        <motion.span
                          initial={{ opacity: 0, scale: 0 }}
                          animate={{ opacity: 1, scale: 1 }}
                          className="text-xs bg-gradient-to-r from-green-500 to-emerald-500 text-white px-2 py-1 rounded-full font-medium flex items-center shadow-sm w-fit"
                        >
                          ✨ Savored today!
                        </motion.span>
                      )}
                    </div>
                  </div>
                </div>

                {!disabled && (
                  <div className="flex items-center gap-1 flex-shrink-0">
                    <motion.button
                      onClick={() => setEditingHabit(habit.id)}
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.95 }}
                      className="p-2 text-amber-400 hover:text-amber-600 hover:bg-amber-100/50 rounded-lg transition-all duration-300 cursor-pointer"
                      title="Edit recipe"
                    >
                      <Edit className="h-4 w-4" />
                    </motion.button>
                    <motion.button
                      onClick={() => handleDeleteHabit(habit.id)}
                      disabled={isDeleting}
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.95 }}
                      className="p-2 text-amber-400 hover:text-red-500 hover:bg-red-100/50 rounded-lg transition-all duration-300 disabled:opacity-50 cursor-pointer disabled:cursor-not-allowed"
                      title="Remove from menu"
                    >
                      <Trash2 className="h-4 w-4" />
                    </motion.button>
                  </div>
                )}
              </div>
            )}
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
};