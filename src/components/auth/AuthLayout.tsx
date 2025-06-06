import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { LoginForm } from "./LoginForm";
import { SignUpForm } from "./SignUpForm";
import { Coffee, Heart, Sparkles, Cookie, Croissant } from "lucide-react";

export const AuthLayout: React.FC = () => {
  const [isSignUp, setIsSignUp] = useState(false);

  const handleSwitchToSignUp = () => setIsSignUp(true);
  const handleSwitchToLogin = () => setIsSignUp(false);

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-orange-50 to-yellow-50 flex items-center justify-center p-4 relative overflow-hidden">
      {/* Floating coffee beans and pastries */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(15)].map((_, i) => (
          <motion.div
            key={`float-${i}`}
            className="absolute opacity-20"
            initial={{ 
              x: Math.random() * window.innerWidth,
              y: window.innerHeight + 50,
              rotate: 0
            }}
            animate={{ 
              y: -50,
              rotate: 360,
              x: Math.random() * window.innerWidth
            }}
            transition={{
              duration: 15 + Math.random() * 10,
              repeat: Infinity,
              ease: "linear",
              delay: i * 2
            }}
          >
            {i % 4 === 0 && <Coffee className="h-6 w-6 text-amber-400" />}
            {i % 4 === 1 && <Cookie className="h-5 w-5 text-orange-400" />}
            {i % 4 === 2 && <Croissant className="h-6 w-6 text-yellow-600" />}
            {i % 4 === 3 && <Heart className="h-4 w-4 text-red-300" />}
          </motion.div>
        ))}
      </div>

      <div className="w-full max-w-6xl flex items-center justify-center relative z-10">
        <div className="grid lg:grid-cols-2 gap-12 items-center w-full">
          {/* Left side - Cafe Branding */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="hidden lg:block text-center lg:text-left"
          >
            <div className="space-y-8">
              {/* Logo */}
              <motion.div 
                className="flex items-center justify-center lg:justify-start space-x-4"
                whileHover={{ scale: 1.02 }}
                transition={{ type: "spring", stiffness: 400 }}
              >
                <motion.div 
                  className="relative"
                  animate={{ rotate: [0, 5, -5, 0] }}
                  transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                >
                  <div className="bg-gradient-to-br from-amber-200 to-orange-300 p-4 rounded-2xl shadow-lg border-2 border-amber-300/50">
                    <Coffee className="h-10 w-10 text-amber-800" />
                  </div>
                  
                  {/* Steam effects */}
                  {[...Array(3)].map((_, i) => (
                    <motion.div
                      key={i}
                      animate={{
                        y: [-5, -20, -5],
                        opacity: [0.8, 0.3, 0.8],
                        scale: [1, 1.2, 1]
                      }}
                      transition={{
                        duration: 2 + i * 0.3,
                        repeat: Infinity,
                        ease: "easeInOut",
                        delay: i * 0.4
                      }}
                      className="absolute"
                      style={{
                        left: `${30 + i * 15}%`,
                        top: '-10px'
                      }}
                    >
                      <div className="w-1 h-4 bg-gradient-to-t from-amber-300/60 to-transparent rounded-full"></div>
                    </motion.div>
                  ))}
                </motion.div>
                
                <div>
                  <motion.h1 
                    className="text-5xl font-bold bg-gradient-to-r from-amber-800 via-orange-700 to-amber-800 bg-clip-text text-transparent"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                  >
                    HabitCrown
                  </motion.h1>
                  <motion.p 
                    className="text-lg text-amber-600 font-medium flex items-center"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.5 }}
                  >
                    Where habits brew into rewards
                    <motion.span
                      animate={{ scale: [1, 1.3, 1] }}
                      transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                      className="ml-2"
                    >
                      <Heart className="h-4 w-4 text-red-400" />
                    </motion.span>
                  </motion.p>
                </div>
              </motion.div>

              {/* Welcome message */}
              <motion.div 
                className="space-y-6"
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6, duration: 0.8 }}
              >
                <h2 className="text-4xl lg:text-5xl font-bold text-gray-800 leading-tight">
                  Sip, Savor,
                  <br />
                  <span className="bg-gradient-to-r from-amber-600 via-orange-600 to-amber-600 bg-clip-text text-transparent">
                    & Succeed
                  </span>
                </h2>

                <p className="text-xl text-amber-700 leading-relaxed max-w-md">
                  Welcome to your personal habit cafe. Every small action brews into something beautiful. 
                  Start your journey with a warm cup of motivation.
                </p>
              </motion.div>

              {/* Feature cards */}
              <motion.div 
                className="grid grid-cols-1 sm:grid-cols-3 gap-6 pt-8"
                initial={{ opacity: 0, y: 40 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.8, duration: 0.8 }}
              >
                {[
                  { icon: Coffee, title: "Brew Goals", desc: "Set meaningful rewards that motivate you", color: "amber" },
                  { icon: Cookie, title: "Daily Habits", desc: "Small consistent actions that add up", color: "orange" },
                  { icon: Sparkles, title: "Sweet Success", desc: "Celebrate every milestone achieved", color: "yellow" }
                ].map((feature, index) => (
                  <motion.div
                    key={feature.title}
                    className={`text-center p-6 bg-gradient-to-br from-${feature.color}-100/70 to-${feature.color}-200/70 backdrop-blur-sm rounded-2xl border border-${feature.color}-200/50 shadow-lg`}
                    whileHover={{ 
                      scale: 1.05, 
                      rotate: index % 2 === 0 ? 2 : -2,
                      boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.1)"
                    }}
                    transition={{ type: "spring", stiffness: 300, damping: 20 }}
                  >
                    <motion.div
                      animate={{ 
                        rotate: [0, 10, -10, 0],
                        scale: [1, 1.1, 1]
                      }}
                      transition={{ 
                        duration: 3 + index,
                        repeat: Infinity,
                        ease: "easeInOut",
                        delay: index * 0.5
                      }}
                    >
                      <feature.icon className={`h-10 w-10 text-${feature.color}-600 mx-auto mb-3`} />
                    </motion.div>
                    <h3 className="font-bold text-gray-800 mb-2">{feature.title}</h3>
                    <p className="text-sm text-gray-600 leading-relaxed">{feature.desc}</p>
                  </motion.div>
                ))}
              </motion.div>
            </div>
          </motion.div>

          {/* Right side - Auth Forms */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
            className="w-full flex justify-center"
          >
            <div className="w-full max-w-md">
              <motion.div 
                className="bg-white/90 backdrop-blur-md rounded-3xl shadow-2xl p-8 border-2 border-amber-200/50 relative overflow-hidden"
                whileHover={{ 
                  boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.15)",
                  scale: 1.01
                }}
                transition={{ type: "spring", stiffness: 300, damping: 20 }}
              >
                {/* Decorative elements */}
                <div className="absolute top-4 right-4 opacity-20">
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                  >
                    <Sparkles className="h-6 w-6 text-amber-400" />
                  </motion.div>
                </div>
                
                <div className="absolute bottom-4 left-4 opacity-20">
                  <motion.div
                    animate={{ rotate: [0, 10, -10, 0] }}
                    transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                  >
                    <Cookie className="h-5 w-5 text-orange-400" />
                  </motion.div>
                </div>

                {/* Mobile branding */}
                <div className="lg:hidden text-center mb-8">
                  <motion.div 
                    className="flex items-center justify-center space-x-3 mb-4"
                    whileHover={{ scale: 1.05 }}
                  >
                    <motion.div
                      animate={{ rotate: [0, 5, -5, 0] }}
                      transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                    >
                      <Coffee className="h-8 w-8 text-amber-600" />
                    </motion.div>
                    <div>
                      <h1 className="text-2xl font-bold bg-gradient-to-r from-amber-800 to-orange-700 bg-clip-text text-transparent">
                        HabitCrown
                      </h1>
                      <p className="text-amber-600 text-sm font-medium">
                        Where habits brew ☕
                      </p>
                    </div>
                  </motion.div>
                </div>

                {/* Form container */}
                <AnimatePresence mode="wait">
                  {isSignUp ? (
                    <motion.div
                      key="signup"
                      initial={{ opacity: 0, x: 30, rotateY: -10 }}
                      animate={{ opacity: 1, x: 0, rotateY: 0 }}
                      exit={{ opacity: 0, x: -30, rotateY: 10 }}
                      transition={{ 
                        duration: 0.4,
                        type: "spring",
                        stiffness: 300,
                        damping: 25
                      }}
                    >
                      <SignUpForm onSwitchToLogin={handleSwitchToLogin} />
                    </motion.div>
                  ) : (
                    <motion.div
                      key="login"
                      initial={{ opacity: 0, x: -30, rotateY: 10 }}
                      animate={{ opacity: 1, x: 0, rotateY: 0 }}
                      exit={{ opacity: 0, x: 30, rotateY: -10 }}
                      transition={{ 
                        duration: 0.4,
                        type: "spring",
                        stiffness: 300,
                        damping: 25
                      }}
                    >
                      <LoginForm onSwitchToSignUp={handleSwitchToSignUp} />
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>

              {/* Social proof */}
              <motion.div 
                className="text-center mt-8 text-sm text-amber-700"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1.2 }}
              >
                <motion.p
                  animate={{ opacity: [0.7, 1, 0.7] }}
                  transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                >
                  Join our cozy community of habit builders
                </motion.p>
                <div className="flex items-center justify-center space-x-1 mt-3">
                  {[...Array(5)].map((_, i) => (
                    <motion.span 
                      key={i} 
                      className="text-yellow-400 text-lg"
                      animate={{ 
                        scale: [1, 1.2, 1],
                        rotate: [0, 10, 0]
                      }}
                      transition={{ 
                        duration: 0.5,
                        delay: i * 0.1,
                        repeat: Infinity,
                        repeatDelay: 3
                      }}
                    >
                      ★
                    </motion.span>
                  ))}
                  <span className="ml-3 text-amber-600 font-medium">
                    4.9/5 - Loved by cafe visitors
                  </span>
                </div>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Background cafe ambiance */}
      <div className="fixed inset-0 -z-10 overflow-hidden">
        {/* Warm lighting effects */}
        <motion.div
          animate={{
            opacity: [0.1, 0.3, 0.1],
            scale: [1, 1.1, 1]
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          className="absolute top-1/4 left-1/4 w-96 h-96 bg-gradient-radial from-amber-200/30 to-transparent rounded-full blur-3xl"
        />
        <motion.div
          animate={{
            opacity: [0.1, 0.25, 0.1],
            scale: [1, 1.2, 1]
          }}
          transition={{
            duration: 10,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 2
          }}
          className="absolute top-3/4 right-1/4 w-80 h-80 bg-gradient-radial from-orange-200/30 to-transparent rounded-full blur-3xl"
        />
        <motion.div
          animate={{
            opacity: [0.1, 0.2, 0.1],
            scale: [1, 1.15, 1]
          }}
          transition={{
            duration: 12,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 4
          }}
          className="absolute bottom-1/4 left-1/2 w-72 h-72 bg-gradient-radial from-yellow-200/30 to-transparent rounded-full blur-3xl"
        />
      </div>
    </div>
  );
};