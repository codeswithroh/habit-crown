import { AlertCircle, Coffee, Cookie, Sparkles, Heart } from 'lucide-react';
import { motion, AnimatePresence } from "framer-motion";

interface HabitSuggestionsProps {
  suggestions: string[];
  isLoading: boolean;
  isModelLoaded: boolean;
  error: string | null;
  remainingRequests: number;
  totalRequests: number;
  onSelectSuggestion: (suggestion: string) => void;
}

export const HabitSuggestions = ({
  suggestions,
  isLoading,
  error,
  onSelectSuggestion,
}: HabitSuggestionsProps) => {
  if (isLoading) {
    return (
      <motion.div 
        className="flex items-center justify-center py-6"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
      >
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
          className="mr-3"
        >
          <Coffee className="h-5 w-5 text-amber-600" />
        </motion.div>
        <span className="text-sm text-amber-700 font-medium">
          Brewing perfect suggestions...
        </span>
        <motion.div
          animate={{
            y: [-2, -6, -2],
            opacity: [0.6, 0.3, 0.6],
          }}
          transition={{
            duration: 1.5,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          className="ml-2"
        >
          <div className="w-1 h-2 bg-gradient-to-t from-amber-400/60 to-transparent rounded-full"></div>
        </motion.div>
      </motion.div>
    );
  }

  if (error) {
    return (
      <motion.div 
        className="flex items-center justify-center py-4 bg-gradient-to-r from-orange-100/80 to-amber-100/80 rounded-xl border border-orange-200/60"
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ type: "spring", damping: 25, stiffness: 300 }}
      >
        <motion.div
          animate={{ rotate: [0, 10, -10, 0] }}
          transition={{ duration: 1, repeat: Infinity, ease: "easeInOut" }}
        >
          <AlertCircle className="h-4 w-4 mr-2 text-orange-600" />
        </motion.div>
        <span className="text-sm text-orange-700 font-medium">{error}</span>
      </motion.div>
    );
  }

  if (suggestions.length === 0) {
    return (
      <motion.div 
        className="text-center py-6"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <motion.div
          animate={{ 
            rotate: [0, 5, -5, 0],
            scale: [1, 1.05, 1]
          }}
          transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
          className="bg-gradient-to-br from-amber-100 to-orange-100 rounded-full w-12 h-12 flex items-center justify-center mx-auto mb-3 shadow-md"
        >
          <Cookie className="h-6 w-6 text-amber-600" />
        </motion.div>
        <p className="text-sm text-amber-600 font-medium">
          Enter a topic above and click "Get Ideas" to brew AI suggestions ☕
        </p>
      </motion.div>
    );
  }

  return (
    <div className="space-y-3">
      <motion.p 
        className="text-xs text-amber-700 mb-3 font-medium flex items-center"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
      >
        <Sparkles className="h-3 w-3 mr-1" />
        Click any suggestion to add it to your menu:
      </motion.p>
      
      <AnimatePresence>
        {suggestions.map((suggestion, index) => (
          <motion.button
            key={index}
            onClick={() => onSelectSuggestion(suggestion)}
            initial={{ opacity: 0, x: -20, scale: 0.95 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            exit={{ opacity: 0, x: -20, scale: 0.95 }}
            whileHover={{ 
              scale: 1.02, 
              y: -2,
              boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.1)"
            }}
            whileTap={{ scale: 0.98 }}
            transition={{ 
              duration: 0.3, 
              delay: index * 0.1,
              type: "spring",
              stiffness: 300,
              damping: 25
            }}
            className="w-full text-left p-4 text-sm bg-gradient-to-r from-white/90 to-amber-50/60 hover:from-amber-50/80 hover:to-orange-50/80 border-2 border-amber-200/50 hover:border-amber-300/70 rounded-xl transition-all duration-300 group relative overflow-hidden cursor-pointer"
          >
            <div className="flex items-center relative z-10">
              <motion.span
                className="inline-flex items-center justify-center w-6 h-6 bg-gradient-to-br from-amber-200 to-orange-200 text-amber-700 rounded-full text-xs font-bold mr-3 shadow-md group-hover:from-amber-300 group-hover:to-orange-300 transition-all duration-300"
                whileHover={{ rotate: 360 }}
                transition={{ duration: 0.5 }}
              >
                {index + 1}
              </motion.span>
              <span className="font-medium text-amber-900 group-hover:text-amber-800 transition-colors flex-1">
                {suggestion}
              </span>
              <motion.div
                initial={{ opacity: 0, scale: 0 }}
                whileHover={{ opacity: 1, scale: 1 }}
                className="ml-2"
              >
                <Heart className="h-4 w-4 text-red-400" />
              </motion.div>
            </div>
            
            <motion.div
              animate={{ 
                x: [-100, 400],
                opacity: [0, 0.3, 0]
              }}
              transition={{ 
                duration: 3, 
                repeat: Infinity, 
                ease: "easeInOut",
                delay: index * 0.5
              }}
              className="absolute top-0 left-0 w-full h-full bg-gradient-to-r from-transparent via-amber-200/30 to-transparent pointer-events-none"
            />
          </motion.button>
        ))}
      </AnimatePresence>
    </div>
  );
};