import { useState } from "react";
import { useRewards } from "../../hooks/useRewards";
import { X, Coffee, Gift, Sparkles, Heart, Cookie } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
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
  const [isHovered, setIsHovered] = useState(false);
  const { createReward, updateReward, isCreating, isUpdating } = useRewards();

  const isEditing = !!reward;
  const isLoading = isCreating || isUpdating;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!title.trim()) {
      toast.error("Please name your reward! Every good brew needs a name ☕");
      return;
    }

    if (targetPoints < 1) {
      toast.error("Target points must be at least 1 to create magic!");
      return;
    }

    try {
      if (isEditing) {
        updateReward({
          id: reward.id,
          updates: { title, description, target_points: targetPoints },
        });
        toast.success("Reward recipe updated! ☕", { icon: "✨" });
      } else {
        createReward({
          title,
          description,
          target_points: targetPoints,
        });
        toast.success("New reward brewing! ☕", { icon: "🎉" });
      }
      onClose();
    } catch (error: any) {
      toast.error(error.message || "Something went wrong in the kitchen!");
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95, y: 20 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95, y: 20 }}
      transition={{ type: "spring", damping: 25, stiffness: 300 }}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
      className="relative"
    >
      {isHovered && (
        <motion.div
          initial={{ opacity: 0, scale: 0 }}
          animate={{ opacity: 1, scale: 1 }}
          className="absolute top-2 right-12 z-10"
        >
          <Sparkles className="h-4 w-4 text-yellow-500" />
        </motion.div>
      )}

      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center space-x-4">
          <motion.div
            animate={{ rotate: [0, 10, -10, 0] }}
            transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
            className="bg-gradient-to-br from-amber-200 to-orange-200 p-3 rounded-2xl shadow-lg border border-amber-300/50"
          >
            <Gift className="h-6 w-6 text-amber-700" />
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
              className="absolute -top-1 left-1/2 transform -translate-x-1/2"
            >
              <div className="w-1 h-3 bg-gradient-to-t from-amber-400/60 to-transparent rounded-full"></div>
            </motion.div>
          </motion.div>
          <div>
            <h3 className="text-2xl font-bold text-amber-900">
              {isEditing ? "Edit Reward Recipe" : "Brew New Reward"}
            </h3>
            <p className="text-amber-600 flex items-center">
              Create something worth savoring 
              <motion.span
                animate={{ scale: [1, 1.2, 1] }}
                transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
                className="ml-1"
              >
                <Heart className="h-4 w-4 text-red-400" />
              </motion.span>
            </p>
          </div>
        </div>
        <motion.button
          onClick={onClose}
          whileHover={{ scale: 1.1, rotate: 90 }}
          whileTap={{ scale: 0.95 }}
          className="p-2 hover:bg-amber-100/50 rounded-xl transition-all duration-300 text-amber-600 cursor-pointer"
        >
          <X className="h-6 w-6" />
        </motion.button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label
            htmlFor="title"
            className="block text-sm font-semibold text-amber-800 mb-2 flex items-center"
          >
            <motion.div
              animate={{ rotate: [0, 5, -5, 0] }}
              transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
            >
              <Coffee className="h-4 w-4 mr-2" />
            </motion.div>
            Reward Name *
          </label>
          <motion.input
            id="title"
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="e.g., Weekend cafe visit, New cozy book, Artisan coffee beans..."
            whileFocus={{ scale: 1.01 }}
            className="w-full px-4 py-4 border-2 border-amber-200/60 rounded-2xl focus:ring-4 focus:ring-amber-200/50 focus:border-amber-400 transition-all duration-300 bg-white/80 backdrop-blur-sm placeholder-amber-400 text-amber-900"
            required
          />
        </div>

        <div>
          <label
            htmlFor="description"
            className="block text-sm font-semibold text-amber-800 mb-2 flex items-center"
          >
            <motion.div
              animate={{ scale: [1, 1.1, 1] }}
              transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
            >
              <Cookie className="h-4 w-4 mr-2" />
            </motion.div>
            Description (Optional)
          </label>
          <motion.textarea
            id="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Describe this special treat in detail... What makes it worth the effort?"
            rows={4}
            whileFocus={{ scale: 1.01 }}
            className="w-full px-4 py-4 border-2 border-amber-200/60 rounded-2xl focus:ring-4 focus:ring-amber-200/50 focus:border-amber-400 transition-all duration-300 resize-none bg-white/80 backdrop-blur-sm placeholder-amber-400 text-amber-900"
          />
        </div>

        <div>
          <label
            htmlFor="targetPoints"
            className="block text-sm font-semibold text-amber-800 mb-2 flex items-center"
          >
            <motion.div
              animate={{ rotate: [0, 360] }}
              transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
            >
              ⭐
            </motion.div>
            <span className="ml-2">Target Points *</span>
          </label>
          <motion.input
            id="targetPoints"
            type="number"
            value={targetPoints}
            onChange={(e) => setTargetPoints(Number(e.target.value))}
            min="1"
            max="10000"
            whileFocus={{ scale: 1.01 }}
            className="w-full px-4 py-4 border-2 border-amber-200/60 rounded-2xl focus:ring-4 focus:ring-amber-200/50 focus:border-amber-400 transition-all duration-300 bg-white/80 backdrop-blur-sm text-amber-900"
            required
          />
          <p className="text-xs text-amber-600 mt-2 flex items-center">
            <Coffee className="h-3 w-3 mr-1" />
            How many points needed to savor this reward?
          </p>
        </div>

        <div className="flex items-center space-x-4 pt-6">
          <motion.button
            type="submit"
            disabled={isLoading}
            whileHover={{ scale: 1.02, y: -2 }}
            whileTap={{ scale: 0.98 }}
            className="flex-1 bg-gradient-to-r from-amber-400 via-orange-400 to-amber-400 hover:from-amber-500 hover:via-orange-500 hover:to-amber-500 disabled:from-gray-300 disabled:via-gray-400 disabled:to-gray-300 text-white py-4 px-6 rounded-2xl font-bold text-lg transition-all duration-300 shadow-lg hover:shadow-xl disabled:cursor-not-allowed cursor-pointer relative overflow-hidden"
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
                    className="w-5 h-5 border-2 border-white border-t-transparent rounded-full mr-3"
                  />
                  {isEditing ? "Updating recipe..." : "Brewing reward..."}
                </motion.div>
              ) : (
                <motion.div
                  key="idle"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="flex items-center justify-center space-x-3"
                >
                  <motion.div
                    animate={{ rotate: [0, 10, -10, 0] }}
                    transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                  >
                    <Gift className="h-5 w-5" />
                  </motion.div>
                  <span>{isEditing ? "Update Reward" : "Brew Reward"}</span>
                  <motion.div
                    animate={{ scale: [1, 1.2, 1] }}
                    transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
                  >
                    <Sparkles className="h-5 w-5" />
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
            className="px-8 py-4 border-2 border-amber-300/60 text-amber-700 rounded-2xl hover:bg-amber-50/50 transition-all duration-300 font-semibold cursor-pointer"
          >
            Cancel
          </motion.button>
        </div>
      </form>

      {isHovered && (
        <motion.div
          initial={{ opacity: 0, scale: 0 }}
          animate={{ opacity: 1, scale: 1 }}
          className="absolute bottom-4 left-4"
        >
          <Heart className="h-4 w-4 text-red-400" />
        </motion.div>
      )}
    </motion.div>
  );
};