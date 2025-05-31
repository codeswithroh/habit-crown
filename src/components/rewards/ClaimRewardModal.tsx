import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useRewards } from "../../hooks/useRewards";
import type { Reward } from "../../types/database";
import { Trophy, Gift, Sparkles, X, PartyPopper } from "lucide-react";
import { toast } from "react-hot-toast";
import Confetti from "react-confetti";

interface ClaimRewardModalProps {
  reward: Reward;
  onClose: () => void;
}

export const ClaimRewardModal = ({
  reward,
  onClose,
}: ClaimRewardModalProps) => {
  const [showConfetti, setShowConfetti] = useState(false);
  const [claimed, setClaimed] = useState(false);
  const { claimReward, isClaiming } = useRewards();

  const handleClaim = async () => {
    try {
      claimReward(reward.id);
      setClaimed(true);
      setShowConfetti(true);
      toast.success("Congratulations! Reward claimed!");

      setTimeout(() => {
        setShowConfetti(false);
        setTimeout(onClose, 1000);
      }, 3000);
    } catch (error: any) {
      toast.error(error.message || "Failed to claim reward");
    }
  };

  const celebrationVariants = {
    initial: { scale: 0, rotate: -180, opacity: 0 },
    animate: {
      scale: [0, 1.2, 1],
      rotate: [180, 0],
      opacity: 1,
      transition: { duration: 0.6, ease: "easeOut" },
    },
    exit: { scale: 0, opacity: 0, transition: { duration: 0.3 } },
  };

  const sparkleVariants = {
    animate: {
      scale: [1, 1.2, 1],
      rotate: [0, 180, 360],
      transition: {
        duration: 2,
        repeat: Infinity,
        ease: "easeInOut",
      },
    },
  };

  return (
    <>
      {showConfetti && (
        <Confetti
          width={window.innerWidth}
          height={window.innerHeight}
          numberOfPieces={200}
          recycle={false}
          gravity={0.3}
        />
      )}

      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-8 text-center relative overflow-hidden"
        >
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X className="h-5 w-5" />
          </button>

          <AnimatePresence mode="wait">
            {!claimed ? (
              <motion.div
                key="claim"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="space-y-6"
              >
                <div className="relative">
                  <motion.div
                    animate={sparkleVariants.animate}
                    className="absolute -top-2 -right-2 text-yellow-400"
                  >
                    <Sparkles className="h-6 w-6" />
                  </motion.div>
                  <motion.div
                    animate={sparkleVariants.animate}
                    className="absolute -bottom-2 -left-2 text-purple-400"
                  >
                    <Sparkles className="h-5 w-5" />
                  </motion.div>

                  <div className="bg-gradient-to-br from-purple-100 to-blue-100 rounded-full w-20 h-20 flex items-center justify-center mx-auto mb-4">
                    <Gift className="h-10 w-10 text-purple-600" />
                  </div>
                </div>

                <div>
                  <h2 className="text-2xl font-bold text-gray-800 mb-2">
                    Congratulations! 🎉
                  </h2>
                  <p className="text-gray-600 mb-4">
                    You've reached your goal and can now claim your reward!
                  </p>

                  <div className="bg-gradient-to-r from-purple-50 to-blue-50 rounded-lg p-4 mb-6">
                    <h3 className="font-bold text-lg text-gray-800 mb-2">
                      {reward.title}
                    </h3>
                    {reward.description && (
                      <p className="text-gray-600 text-sm">
                        {reward.description}
                      </p>
                    )}
                    <div className="mt-3 flex items-center justify-center space-x-2 text-sm text-purple-600">
                      <Trophy className="h-4 w-4" />
                      <span className="font-medium">
                        {reward.current_points} / {reward.target_points} points
                        completed
                      </span>
                    </div>
                  </div>
                </div>

                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={handleClaim}
                  disabled={isClaiming}
                  className="w-full bg-gradient-to-r from-green-500 to-emerald-600 text-white py-4 px-6 rounded-xl font-bold text-lg hover:from-green-600 hover:to-emerald-700 transition-all shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
                >
                  {isClaiming ? (
                    <>
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                      <span>Claiming...</span>
                    </>
                  ) : (
                    <>
                      <PartyPopper className="h-6 w-6" />
                      <span>Claim My Reward!</span>
                    </>
                  )}
                </motion.button>
              </motion.div>
            ) : (
              <motion.div
                key="success"
                variants={celebrationVariants}
                initial="initial"
                animate="animate"
                exit="exit"
                className="space-y-6"
              >
                <motion.div
                  animate={{
                    rotate: [0, 10, -10, 0],
                    scale: [1, 1.1, 1],
                  }}
                  transition={{
                    duration: 0.5,
                    repeat: 2,
                    ease: "easeInOut",
                  }}
                  className="bg-gradient-to-br from-yellow-100 to-orange-100 rounded-full w-24 h-24 flex items-center justify-center mx-auto"
                >
                  <Trophy className="h-12 w-12 text-yellow-600" />
                </motion.div>

                <div>
                  <motion.h2
                    animate={{
                      scale: [1, 1.05, 1],
                    }}
                    transition={{
                      duration: 1,
                      repeat: 1,
                      ease: "easeInOut",
                    }}
                    className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent mb-2"
                  >
                    Reward Claimed! 🎊
                  </motion.h2>
                  <p className="text-gray-600 text-lg">
                    You've earned it! Enjoy your {reward.title}
                  </p>
                </div>

                <motion.div
                  animate={{
                    y: [0, -5, 0],
                  }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                    ease: "easeInOut",
                  }}
                  className="text-4xl"
                >
                  🎉🎁🌟
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </div>
    </>
  );
};
