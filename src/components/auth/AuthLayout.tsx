import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { LoginForm } from "./LoginForm";
import { SignUpForm } from "./SignUpForm";
import { Trophy, Crown, Sparkles } from "lucide-react";

export const AuthLayout: React.FC = () => {
  const [isSignUp, setIsSignUp] = useState(false);

  const handleSwitchToSignUp = () => setIsSignUp(true);
  const handleSwitchToLogin = () => setIsSignUp(false);

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="w-full max-w-6xl flex items-center justify-center">
        <div className="grid lg:grid-cols-2 gap-12 items-center w-full">
          {/* Left side - Branding */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            className="hidden lg:block text-center lg:text-left"
          >
            <div className="space-y-6">
              <div className="flex items-center justify-center lg:justify-start space-x-3">
                <div className="relative">
                  <Crown className="h-12 w-12 text-yellow-500" />
                  <Sparkles className="h-4 w-4 text-purple-400 absolute -top-1 -right-1 animate-pulse" />
                </div>
                <div>
                  <h1 className="text-4xl font-bold text-gray-800">
                    HabitCrown
                  </h1>
                  <p className="text-purple-600 font-medium">Earn Your Crown</p>
                </div>
              </div>

              <div className="space-y-4">
                <h2 className="text-3xl lg:text-4xl font-bold text-gray-800 leading-tight">
                  Build habits,
                  <br />
                  <span className="bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
                    earn rewards
                  </span>
                </h2>

                <p className="text-lg text-gray-600 leading-relaxed">
                  Transform your daily habits into meaningful rewards. Set
                  goals, track progress, and celebrate your achievements with
                  the rewards you deserve.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-8">
                <div className="text-center p-4 bg-white/50 rounded-xl backdrop-blur-sm">
                  <Trophy className="h-8 w-8 text-yellow-500 mx-auto mb-2" />
                  <h3 className="font-semibold text-gray-800">Set Rewards</h3>
                  <p className="text-sm text-gray-600">
                    Define meaningful rewards for your goals
                  </p>
                </div>

                <div className="text-center p-4 bg-white/50 rounded-xl backdrop-blur-sm">
                  <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-blue-500 rounded-full mx-auto mb-2 flex items-center justify-center">
                    <span className="text-white font-bold text-sm">✓</span>
                  </div>
                  <h3 className="font-semibold text-gray-800">Track Habits</h3>
                  <p className="text-sm text-gray-600">
                    Complete daily habits to earn points
                  </p>
                </div>

                <div className="text-center p-4 bg-white/50 rounded-xl backdrop-blur-sm">
                  <Crown className="h-8 w-8 text-purple-500 mx-auto mb-2" />
                  <h3 className="font-semibold text-gray-800">Claim Crown</h3>
                  <p className="text-sm text-gray-600">
                    Celebrate when you reach your goals
                  </p>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Right side - Auth Forms */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="w-full flex justify-center"
          >
            <div className="w-full max-w-md">
              <div className="bg-white rounded-2xl shadow-2xl p-8 backdrop-blur-sm border border-white/20">
                {/* Mobile branding */}
                <div className="lg:hidden text-center mb-8">
                  <div className="flex items-center justify-center space-x-3 mb-4">
                    <Crown className="h-10 w-10 text-yellow-500" />
                    <div>
                      <h1 className="text-2xl font-bold text-gray-800">
                        HabitCrown
                      </h1>
                      <p className="text-purple-600 text-sm font-medium">
                        Earn Your Crown
                      </p>
                    </div>
                  </div>
                </div>

                <AnimatePresence mode="wait">
                  {isSignUp ? (
                    <motion.div
                      key="signup"
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -20 }}
                      transition={{ duration: 0.3 }}
                    >
                      <SignUpForm onSwitchToLogin={handleSwitchToLogin} />
                    </motion.div>
                  ) : (
                    <motion.div
                      key="login"
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -20 }}
                      transition={{ duration: 0.3 }}
                    >
                      <LoginForm onSwitchToSignUp={handleSwitchToSignUp} />
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Social proof */}
              <div className="text-center mt-6 text-sm text-gray-500">
                <p>Join thousands of users building better habits</p>
                <div className="flex items-center justify-center space-x-1 mt-2">
                  {[...Array(5)].map((_, i) => (
                    <span key={i} className="text-yellow-400">
                      ★
                    </span>
                  ))}
                  <span className="ml-2 text-gray-600">
                    4.9/5 from our users
                  </span>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Background decorations */}
      <div className="fixed inset-0 -z-10 overflow-hidden">
        <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-purple-200 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse"></div>
        <div
          className="absolute top-3/4 right-1/4 w-64 h-64 bg-blue-200 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse"
          style={{ animationDelay: "2s" }}
        ></div>
        <div
          className="absolute bottom-1/4 left-1/2 w-64 h-64 bg-indigo-200 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse"
          style={{ animationDelay: "4s" }}
        ></div>
      </div>
    </div>
  );
};
