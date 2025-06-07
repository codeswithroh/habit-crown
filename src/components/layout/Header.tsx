import { useAuth } from "../../hooks/useAuth";
import { LogOut, Coffee, User, Sparkles, Heart } from "lucide-react";
import { toast } from "react-hot-toast";
import { AnimatePresence, motion } from "framer-motion";
import { useState } from "react";

export const Header = () => {
  const { user, signOut } = useAuth();
  const [isHovered, setIsHovered] = useState(false);

  const handleSignOut = async () => {
    try {
      await signOut();
      toast.success("See you soon! ☕");
    } catch (error: any) {
      toast.error(error.message || "Failed to sign out");
    }
  };

  return (
    <motion.header 
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className="bg-gradient-to-r from-amber-100/80 via-orange-100/80 to-yellow-100/80 backdrop-blur-sm border-b border-amber-200/50 sticky top-0 z-50"
    >
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          {/* Logo Section */}
          <motion.div 
            className="flex items-center space-x-3"
            whileHover={{ scale: 1.02 }}
            transition={{ type: "spring", stiffness: 400 }}
          >
            <motion.div 
              className="relative"
              animate={{ rotate: [0, 5, -5, 0] }}
              transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
            >
              <div className="bg-gradient-to-br from-amber-200 to-orange-300 p-3 rounded-xl shadow-lg border border-amber-300/50">
                <Coffee className="h-6 w-6 text-amber-800" />
              </div>
              
              {/* Steam effect */}
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
                <div className="w-1 h-2 bg-gradient-to-t from-amber-300/60 to-transparent rounded-full"></div>
              </motion.div>
              <motion.div
                animate={{
                  y: [-2, -10, -2],
                  opacity: [0.4, 0.2, 0.4],
                }}
                transition={{
                  duration: 2.5,
                  repeat: Infinity,
                  ease: "easeInOut",
                  delay: 0.3,
                }}
                className="absolute -top-2 left-1/2 transform -translate-x-2"
              >
                <div className="w-1 h-3 bg-gradient-to-t from-amber-300/40 to-transparent rounded-full"></div>
              </motion.div>
            </motion.div>
            
            <div>
              <motion.h1 
                className="text-xl font-bold bg-gradient-to-r from-amber-800 to-orange-700 bg-clip-text text-transparent"
                whileHover={{ scale: 1.05 }}
                transition={{ type: "spring", stiffness: 400 }}
              >
                HabitCrown
              </motion.h1>
              <motion.p 
                className="text-sm text-amber-600 flex items-center"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3 }}
              >
                Where habits brew 
                <motion.span
                  animate={{ scale: [1, 1.2, 1] }}
                  transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
                  className="ml-1"
                >
                  <Heart className="h-3 w-3 text-red-400 inline" />
                </motion.span>
              </motion.p>
            </div>
          </motion.div>

          {/* User Section */}
          <div className="flex items-center space-x-4">
            <motion.div 
              className="text-right hidden sm:block"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4 }}
            >
              <p className="text-sm font-medium text-amber-800 flex items-center justify-end">
                <User className="h-4 w-4 mr-1" />
                {user?.email}
              </p>
              <motion.p 
                className="text-xs text-amber-600 flex items-center justify-end"
                animate={{ opacity: [0.7, 1, 0.7] }}
                transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
              >
                Welcome back, habit brewer! 
                <Sparkles className="h-3 w-3 ml-1 text-yellow-500" />
              </motion.p>
            </motion.div>
            
            <motion.button
              onClick={handleSignOut}
              onHoverStart={() => setIsHovered(true)}
              onHoverEnd={() => setIsHovered(false)}
              whileHover={{ scale: 1.05, rotate: 2 }}
              whileTap={{ scale: 0.95 }}
              className="group relative flex items-center space-x-2 px-4 py-2 bg-amber-200/60 hover:bg-amber-300/80 text-amber-800 rounded-xl transition-all duration-300 shadow-md hover:shadow-lg border border-amber-300/50 cursor-pointer"
            >
              <motion.div
                animate={isHovered ? { rotate: [0, 10, -10, 0] } : {}}
                transition={{ duration: 0.5 }}
              >
                <LogOut className="h-4 w-4" />
              </motion.div>
              <span className="hidden sm:inline font-medium">Sign Out</span>
              
              {/* Hover effect sparkles */}
              <AnimatePresence>
                {isHovered && (
                  <motion.div
                    initial={{ scale: 0, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ scale: 0, opacity: 0 }}
                    className="absolute -top-1 -right-1"
                  >
                    <Sparkles className="h-3 w-3 text-yellow-500" />
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.button>
          </div>
        </div>
      </div>
      
      {/* Bottom border glow effect */}
      <motion.div
        animate={{
          opacity: [0.3, 0.6, 0.3],
        }}
        transition={{
          duration: 3,
          repeat: Infinity,
          ease: "easeInOut",
        }}
        className="h-px bg-gradient-to-r from-transparent via-amber-300 to-transparent"
      />
    </motion.header>
  );
};