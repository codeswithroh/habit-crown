import React, { useState } from "react";
import { useAuth } from "../../hooks/useAuth";
import { toast } from "react-hot-toast";
import { motion } from "framer-motion";
import { Coffee, Heart, Mail, ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";

export const ForgotPasswordForm: React.FC = () => {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [focusedField, setFocusedField] = useState<string | null>(null);
  const { resetPassword } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) {
      toast.error("Please enter your email address");
      return;
    }

    setLoading(true);
    try {
      await resetPassword(email);
      toast.success("Check your email for password reset instructions ☕");
      navigate("/login");
    } catch (error: any) {
      toast.error(error.message || "Failed to send reset instructions");
    } finally {
      setLoading(false);
    }
  };

  const handleBackToLogin = () => {
    navigate("/login");
  };

  return (
    <div className="w-full max-w-md">
      <motion.div 
        className="text-center mb-8"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <motion.div
          className="flex items-center justify-center mb-4"
          whileHover={{ scale: 1.05 }}
        >
          <motion.div
            animate={{ rotate: [0, 5, -5, 0] }}
            transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
            className="mr-3"
          >
            <Coffee className="h-8 w-8 text-amber-600" />
          </motion.div>
          <div>
            <h1 className="text-3xl font-bold text-amber-900">Forgot Password?</h1>
            <motion.p 
              className="text-amber-600 flex items-center justify-center"
              animate={{ opacity: [0.7, 1, 0.7] }}
              transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
            >
              We'll help you brew a new one
              <motion.span
                animate={{ scale: [1, 1.2, 1] }}
                transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
                className="ml-2"
              >
                <Heart className="h-4 w-4 text-red-400" />
              </motion.span>
            </motion.p>
          </div>
        </motion.div>
      </motion.div>

      <motion.form 
        onSubmit={handleSubmit} 
        className="space-y-6"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.2 }}
      >
        <motion.div
          whileHover={{ scale: 1.01 }}
          transition={{ type: "spring", stiffness: 400, damping: 25 }}
        >
          <label
            htmlFor="email"
            className="block text-sm font-medium text-amber-800 mb-2 flex items-center"
          >
            <Mail className="h-4 w-4 mr-2" />
            Email Address
          </label>
          <div className="relative">
            <motion.input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              onFocus={() => setFocusedField("email")}
              onBlur={() => setFocusedField(null)}
              className={`w-full px-4 py-4 pl-12 border-2 rounded-2xl transition-all duration-300 bg-white/80 backdrop-blur-sm ${
                focusedField === "email"
                  ? "border-amber-400 shadow-lg ring-4 ring-amber-100"
                  : "border-amber-200 hover:border-amber-300"
              } focus:outline-none`}
              placeholder="your.email@cafe.com"
              required
              whileFocus={{ scale: 1.02 }}
            />
            <motion.div 
              className="absolute left-4 top-1/2 transform -translate-y-1/2"
              animate={{ 
                scale: focusedField === "email" ? 1.1 : 1,
                color: focusedField === "email" ? "#d97706" : "#92400e"
              }}
            >
              <Mail className="h-5 w-5" />
            </motion.div>
          </div>
        </motion.div>

        <motion.button
          type="submit"
          disabled={loading}
          className="group relative w-full bg-gradient-to-r from-amber-400 via-orange-400 to-amber-400 hover:from-amber-500 hover:via-orange-500 hover:to-amber-500 text-white py-4 px-6 rounded-2xl font-semibold text-lg transition-all duration-300 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer overflow-hidden"
          whileHover={{ scale: 1.02, y: -2 }}
          whileTap={{ scale: 0.98 }}
          animate={loading ? { opacity: 0.7 } : { opacity: 1 }}
        >
          <motion.div
            className="absolute inset-0 bg-gradient-to-r from-yellow-400 to-orange-400 opacity-0 group-hover:opacity-100"
            initial={{ x: "-100%" }}
            whileHover={{ x: "0%" }}
            transition={{ duration: 0.3 }}
          />
          
          <div className="relative flex items-center justify-center space-x-3">
            {loading ? (
              <>
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                  className="relative"
                >
                  <Coffee className="h-6 w-6" />
                  <motion.div
                    animate={{
                      y: [-2, -6, -2],
                      opacity: [0.6, 0.3, 0.6],
                    }}
                    transition={{
                      duration: 1,
                      repeat: Infinity,
                      ease: "easeInOut",
                    }}
                    className="absolute -top-1 left-1/2 transform -translate-x-1/2"
                  >
                    <div className="w-1 h-2 bg-white/60 rounded-full"></div>
                  </motion.div>
                </motion.div>
                <span>Sending instructions...</span>
              </>
            ) : (
              <>
                <span>Reset Password</span>
                <motion.span
                  animate={{ scale: [1, 1.2, 1] }}
                  transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
                >
                  ☕
                </motion.span>
              </>
            )}
          </div>
        </motion.button>
      </motion.form>

      <motion.div 
        className="mt-8 text-center"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.4 }}
      >
        <motion.button
          onClick={handleBackToLogin}
          className="text-amber-600 hover:text-amber-800 font-medium transition-colors relative group cursor-pointer flex items-center justify-center"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          <span className="relative">
            Back to Login
            <motion.div
              className="absolute bottom-0 left-0 w-full h-0.5 bg-amber-400 origin-left"
              initial={{ scaleX: 0 }}
              whileHover={{ scaleX: 1 }}
              transition={{ duration: 0.3 }}
            />
          </span>
        </motion.button>
      </motion.div>
    </div>
  );
}; 