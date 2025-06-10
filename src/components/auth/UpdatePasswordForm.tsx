import React, { useState } from "react";
import { useAuth } from "../../hooks/useAuth";
import { toast } from "react-hot-toast";
import { motion } from "framer-motion";
import { Coffee, Heart, Lock, Eye, EyeOff } from "lucide-react";
import { useNavigate } from "react-router-dom";

export const UpdatePasswordForm: React.FC = () => {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [focusedField, setFocusedField] = useState<string | null>(null);
  const { updatePassword } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!password || !confirmPassword) {
      toast.error("Please fill in all fields");
      return;
    }

    if (password !== confirmPassword) {
      toast.error("Passwords don't match! Try again ☕");
      return;
    }

    if (password.length < 6) {
      toast.error("Password needs at least 6 characters for security!");
      return;
    }

    setLoading(true);
    try {
      await updatePassword(password);
      toast.success("Password updated successfully! ☕");
      navigate("/login");
    } catch (error: any) {
      toast.error(error.message || "Failed to update password");
    } finally {
      setLoading(false);
    }
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
            <h1 className="text-3xl font-bold text-amber-900">Update Password</h1>
            <motion.p 
              className="text-amber-600 flex items-center justify-center"
              animate={{ opacity: [0.7, 1, 0.7] }}
              transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
            >
              Create your new secret blend
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
            htmlFor="password"
            className="block text-sm font-medium text-amber-800 mb-2 flex items-center"
          >
            <Lock className="h-4 w-4 mr-2" />
            New Password
          </label>
          <div className="relative">
            <motion.input
              id="password"
              type={showPassword ? "text" : "password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              onFocus={() => setFocusedField("password")}
              onBlur={() => setFocusedField(null)}
              className={`w-full px-4 py-4 pl-12 pr-12 border-2 rounded-2xl transition-all duration-300 bg-white/80 backdrop-blur-sm ${
                focusedField === "password"
                  ? "border-amber-400 shadow-lg ring-4 ring-amber-100"
                  : "border-amber-200 hover:border-amber-300"
              } focus:outline-none`}
              placeholder="Create your new secret blend..."
              required
              minLength={6}
              whileFocus={{ scale: 1.02 }}
            />
            <motion.div 
              className="absolute left-4 top-1/2 transform -translate-y-1/2"
              animate={{ 
                scale: focusedField === "password" ? 1.1 : 1,
                color: focusedField === "password" ? "#d97706" : "#92400e"
              }}
            >
              <Lock className="h-5 w-5" />
            </motion.div>
            <motion.button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-4 top-1/2 transform -translate-y-1/2 text-amber-600 hover:text-amber-800 transition-colors cursor-pointer"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
            >
              {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
            </motion.button>
          </div>
        </motion.div>

        <motion.div
          whileHover={{ scale: 1.01 }}
          transition={{ type: "spring", stiffness: 400, damping: 25 }}
        >
          <label
            htmlFor="confirmPassword"
            className="block text-sm font-medium text-amber-800 mb-2 flex items-center"
          >
            <Lock className="h-4 w-4 mr-2" />
            Confirm New Password
          </label>
          <div className="relative">
            <motion.input
              id="confirmPassword"
              type={showConfirmPassword ? "text" : "password"}
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              onFocus={() => setFocusedField("confirmPassword")}
              onBlur={() => setFocusedField(null)}
              className={`w-full px-4 py-4 pl-12 pr-12 border-2 rounded-2xl transition-all duration-300 bg-white/80 backdrop-blur-sm ${
                focusedField === "confirmPassword"
                  ? "border-amber-400 shadow-lg ring-4 ring-amber-100"
                  : "border-amber-200 hover:border-amber-300"
              } focus:outline-none`}
              placeholder="Confirm your new blend..."
              required
              minLength={6}
              whileFocus={{ scale: 1.02 }}
            />
            <motion.div 
              className="absolute left-4 top-1/2 transform -translate-y-1/2"
              animate={{ 
                scale: focusedField === "confirmPassword" ? 1.1 : 1,
                color: focusedField === "confirmPassword" ? "#d97706" : "#92400e"
              }}
            >
              <Lock className="h-5 w-5" />
            </motion.div>
            <motion.button
              type="button"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              className="absolute right-4 top-1/2 transform -translate-y-1/2 text-amber-600 hover:text-amber-800 transition-colors cursor-pointer"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
            >
              {showConfirmPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
            </motion.button>
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
                <span>Updating password...</span>
              </>
            ) : (
              <>
                <span>Update Password</span>
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
    </div>
  );
}; 