import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useRewards } from "../../hooks/useRewards";
import type { Reward } from "../../types/database";
import { Trophy, Gift, Sparkles, X, Coffee, Heart, Cookie, Star } from "lucide-react";
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
      toast.success("Congratulations! Time to savor your reward! ☕", {
        icon: "🎉",
      });

      setTimeout(() => {
        setShowConfetti(false);
        setTimeout(onClose, 1000);
      }, 4000);
    } catch (error: any) {
      toast.error(error.message || "Failed to claim your reward");
    }
  };

  const celebrationVariants = {
    initial: { scale: 0, rotate: -180, opacity: 0 },
    animate: {
      scale: [0, 1.2, 1],
      rotate: [180, 0],
      opacity: 1,
      transition: { duration: 0.8, ease: "easeOut" },
    },
    exit: { scale: 0, opacity: 0, transition: { duration: 0.3 } },
  };

  const sparkleVariants = {
    animate: {
      scale: [1, 1.3, 1],
      rotate: [0, 180, 360],
      transition: {
        duration: 2,
        repeat: Infinity,
        ease: "easeInOut",
      },
    },
  };

  const floatingElements = Array.from({ length: 8 }, (_, i) => i);

  return (
    <>
      {showConfetti && (
        <Confetti
          width={window.innerWidth}
          height={window.innerHeight}
          numberOfPieces={300}
          recycle={false}
          gravity={0.2}
          colors={['#f59e0b', '#f97316', '#ef4444', '#eab308', '#fb923c']}
        />
      )}

      <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
        <motion.div
          initial={{ scale: 0.9, opacity: 0, y: 50 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.9, opacity: 0, y: 50 }}
          transition={{ type: "spring", damping: 25, stiffness: 300 }}
          className="bg-gradient-to-br from-white/95 via-amber-50/95 to-orange-50/95 backdrop-blur-md rounded-3xl shadow-2xl max-w-md w-full p-8 text-center relative overflow-hidden border-2 border-amber-200/50"
        >
          {floatingElements.map((i) => (
            <motion.div
              key={i}
              className="absolute opacity-20"
              animate={{
                y: [0, -20, 0],
                x: [0, Math.sin(i) * 10, 0],
                rotate: [0, 360],
                scale: [1, 1.2, 1],
              }}
              transition={{
                duration: 3 + i * 0.5,
                repeat: Infinity,
                ease: "easeInOut",
                delay: i * 0.3,
              }}
              style={{
                left: `${10 + (i % 4) * 20}%`,
                top: `${10 + Math.floor(i / 4) * 30}%`,
              }}
            >
              {i % 4 === 0 && <Coffee className="h-6 w-6 text-amber-400" />}
              {i % 4 === 1 && <Cookie className="h-5 w-5 text-orange-400" />}
              {i % 4 === 2 && <Heart className="h-4 w-4 text-red-400" />}
              {i % 4 === 3 && <Star className="h-5 w-5 text-yellow-400" />}
            </motion.div>
          ))}

          <motion.button
            onClick={onClose}
            whileHover={{ scale: 1.1, rotate: 90 }}
            whileTap={{ scale: 0.95 }}
            className="absolute top-4 right-4 p-2 text-amber-400 hover:text-amber-600 hover:bg-amber-100/50 rounded-xl transition-all duration-300 z-10"
          >
            <X className="h-6 w-6" />
          </motion.button>

          <AnimatePresence mode="wait">
            {!claimed ? (
              <motion.div
                key="claim"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="space-y-8 relative z-10"
              >
                <div className="relative">
                  <motion.div
                    animate={sparkleVariants.animate}
                    className="absolute -top-3 -right-3 text-yellow-500"
                  >
                    <Sparkles className="h-8 w-8" />
                  </motion.div>
                  <motion.div
                    animate={sparkleVariants.animate}
                    className="absolute -bottom-3 -left-3 text-orange-400"
                    style={{ animationDelay: '1s' }}
                  >
                    <Sparkles className="h-6 w-6" />
                  </motion.div>

                  <motion.div
                    animate={{ 
                      rotate: [0, 10, -10, 0],
                      scale: [1, 1.05, 1]
                    }}
                    transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                    className="bg-gradient-to-br from-amber-200 to-orange-200 rounded-full w-24 h-24 flex items-center justify-center mx-auto mb-6 shadow-lg border-2 border-amber-300/50 relative"
                  >
                    <Gift className="h-12 w-12 text-amber-700" />
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
                      <div className="w-2 h-4 bg-gradient-to-t from-amber-400/60 to-transparent rounded-full"></div>
                    </motion.div>
                  </motion.div>
                </div>

                <div>
                  <motion.h2 
                    className="text-3xl font-bold text-amber-900 mb-3 flex items-center justify-center"
                    animate={{ scale: [1, 1.02, 1] }}
                    transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                  >
                    Perfect Brew! 
                    <motion.span
                      animate={{ rotate: [0, 10, -10, 0] }}
                      transition={{ duration: 1, repeat: Infinity, ease: "easeInOut" }}
                      className="ml-2"
                    >
                      ☕
                    </motion.span>
                  </motion.h2>
                  <p className="text-amber-700 text-lg mb-6">
                    Your habits have brewed something wonderful! Time to savor your reward.
                  </p>

                  <motion.div 
                    className="bg-gradient-to-br from-amber-100/80 to-orange-100/80 backdrop-blur-sm rounded-2xl p-6 mb-8 border-2 border-amber-200/50 shadow-md"
                    whileHover={{ scale: 1.02 }}
                  >
                    <div className="flex items-center justify-center mb-3">
                      <motion.div
                        animate={{ rotate: [0, 5, -5, 0] }}
                        transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                      >
                        <Coffee className="h-6 w-6 text-amber-600 mr-2" />
                      </motion.div>
                      <h3 className="font-bold text-xl text-amber-900">
                        {reward.title}
                      </h3>
                    </div>
                    {reward.description && (
                      <p className="text-amber-700 text-sm mb-4 leading-relaxed">
                        {reward.description}
                      </p>
                    )}
                    <div className="flex items-center justify-center space-x-3 text-sm">
                      <motion.div
                        animate={{ scale: [1, 1.1, 1] }}
                        transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
                      >
                        <Trophy className="h-5 w-5 text-yellow-600" />
                      </motion.div>
                      <span className="font-semibold text-amber-800">
                        {reward.current_points} / {reward.target_points} points earned!
                      </span>
                    </div>
                  </motion.div>
                </div>

                <motion.button
                  whileHover={{ scale: 1.05, y: -3 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={handleClaim}
                  disabled={isClaiming}
                  className="w-full bg-gradient-to-r from-amber-400 via-orange-400 to-amber-400 hover:from-amber-500 hover:via-orange-500 hover:to-amber-500 disabled:from-gray-300 disabled:via-gray-400 disabled:to-gray-300 text-white py-4 px-6 rounded-2xl font-bold text-xl transition-all duration-300 shadow-lg hover:shadow-xl disabled:cursor-not-allowed flex items-center justify-center space-x-3 relative overflow-hidden"
                >
                  <AnimatePresence mode="wait">
                    {isClaiming ? (
                      <motion.div
                        key="loading"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="flex items-center"
                      >
                        <motion.div
                          animate={{ rotate: 360 }}
                          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                          className="w-6 h-6 border-2 border-white border-t-transparent rounded-full mr-3"
                        />
                        <span>Preparing your reward...</span>
                      </motion.div>
                    ) : (
                      <motion.div
                        key="idle"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="flex items-center space-x-3"
                      >
                        <motion.div
                          animate={{ rotate: [0, 360] }}
                          transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                        >
                          <Gift className="h-6 w-6" />
                        </motion.div>
                        <span>Savor My Reward!</span>
                        <motion.div
                          animate={{ scale: [1, 1.3, 1] }}
                          transition={{ duration: 1, repeat: Infinity, ease: "easeInOut" }}
                        >
                          <Heart className="h-5 w-5 text-red-300" />
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
              </motion.div>
            ) : (
              <motion.div
                key="success"
                variants={celebrationVariants}
                initial="initial"
                animate="animate"
                exit="exit"
                className="space-y-8 relative z-10"
              >
                <motion.div
                  animate={{
                    rotate: [0, 15, -15, 0],
                    scale: [1, 1.1, 1],
                  }}
                  transition={{
                    duration: 0.8,
                    repeat: 3,
                    ease: "easeInOut",
                  }}
                  className="bg-gradient-to-br from-yellow-200 to-orange-200 rounded-full w-32 h-32 flex items-center justify-center mx-auto shadow-xl border-3 border-yellow-300"
                >
                  <Trophy className="h-16 w-16 text-yellow-700" />
                </motion.div>

                <div>
                  <motion.h2
                    animate={{
                      scale: [1, 1.05, 1],
                    }}
                    transition={{
                      duration: 1,
                      repeat: 2,
                      ease: "easeInOut",
                    }}
                    className="text-4xl font-bold bg-gradient-to-r from-amber-600 via-orange-600 to-amber-600 bg-clip-text text-transparent mb-4"
                  >
                    Reward Savored! 
                  </motion.h2>
                  <p className="text-amber-700 text-xl leading-relaxed">
                    You've earned it! Enjoy every moment of your <strong>{reward.title}</strong>
                  </p>
                </div>

                <motion.div
                  animate={{
                    y: [0, -8, 0],
                    scale: [1, 1.1, 1],
                  }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                    ease: "easeInOut",
                  }}
                  className="text-6xl"
                >
                  🎉☕🎁✨🏆
                </motion.div>

                <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 1 }}
                  className="text-amber-600 font-medium"
                >
                  Keep brewing more amazing habits! ☕
                </motion.p>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </div>
    </>
  );
};