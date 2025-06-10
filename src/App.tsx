import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { AuthProvider, useAuth } from "./hooks/useAuth";
import { AuthLayout } from "./components/auth/AuthLayout";
import { AuthPageLayout } from "./components/auth/AuthPageLayout";
import { Dashboard } from "./components/layout/Dashboard";
import { Header } from "./components/layout/Header";
import { Toaster } from "react-hot-toast";
import { motion } from "framer-motion";
import { Coffee, Sparkles } from "lucide-react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { ForgotPasswordForm } from "./components/auth/ForgotPasswordForm";
import { UpdatePasswordForm } from "./components/auth/UpdatePasswordForm";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000,
      refetchOnWindowFocus: false,
    },
  },
});

const LoadingScreen = () => (
  <div className="min-h-screen bg-gradient-to-br from-amber-50 via-orange-50 to-yellow-50 flex items-center justify-center relative overflow-hidden">
    {/* Floating coffee beans */}
    <div className="absolute inset-0">
      {[...Array(12)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute"
          initial={{ 
            x: Math.random() * window.innerWidth,
            y: Math.random() * window.innerHeight,
            rotate: 0,
            opacity: 0.1
          }}
          animate={{ 
            y: [null, -20, 0],
            rotate: [0, 360],
            opacity: [0.1, 0.3, 0.1]
          }}
          transition={{
            duration: 3 + Math.random() * 2,
            repeat: Infinity,
            ease: "easeInOut",
            delay: i * 0.3
          }}
        >
          <Coffee className="h-4 w-4 text-amber-400" />
        </motion.div>
      ))}
    </div>
    
    <motion.div
      initial={{ scale: 0.8, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className="text-center"
    >
      <motion.div
        animate={{ rotate: [0, 5, -5, 0] }}
        transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
        className="relative mb-6"
      >
        <div className="bg-gradient-to-br from-amber-100 to-orange-100 p-6 rounded-2xl shadow-lg border border-amber-200">
          <Coffee className="h-12 w-12 text-amber-600 mx-auto" />
          <motion.div
            animate={{ scale: [1, 1.1, 1] }}
            transition={{ duration: 1, repeat: Infinity, ease: "easeInOut" }}
            className="absolute -top-1 -right-1"
          >
            <Sparkles className="h-4 w-4 text-yellow-500" />
          </motion.div>
        </div>
      </motion.div>
      
      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.3, duration: 0.5 }}
      >
        <h2 className="text-2xl font-bold text-amber-800 mb-2">Brewing Your Habits</h2>
        <p className="text-amber-600">Creating the perfect blend of motivation...</p>
      </motion.div>
      
      <motion.div
        animate={{ rotate: 360 }}
        transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
        className="mt-6"
      >
        <div className="w-8 h-8 border-3 border-amber-300 border-t-amber-600 rounded-full mx-auto"></div>
      </motion.div>
    </motion.div>
  </div>
);

const PrivateRoute = ({ children }: { children: React.ReactNode }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return <LoadingScreen />;
  }

  if (!user) {
    return <Navigate to="/login" />;
  }

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.6 }}
      className="min-h-screen bg-gradient-to-br from-amber-50 via-orange-50 to-yellow-50 relative"
    >
      {/* Ambient background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {/* Floating steam/smoke effect */}
        {[...Array(6)].map((_, i) => (
          <motion.div
            key={`steam-${i}`}
            className="absolute rounded-full bg-gradient-to-t from-amber-100/30 to-transparent"
            style={{
              left: `${20 + i * 15}%`,
              top: `${80 + Math.sin(i) * 10}%`,
              width: `${15 + Math.random() * 10}px`,
              height: `${30 + Math.random() * 20}px`,
            }}
            animate={{
              y: [-20, -60, -20],
              opacity: [0.3, 0.6, 0.3],
              scale: [1, 1.1, 1],
            }}
            transition={{
              duration: 4 + Math.random() * 2,
              repeat: Infinity,
              ease: "easeInOut",
              delay: i * 0.5,
            }}
          />
        ))}
        
        {/* Subtle sparkles */}
        {[...Array(8)].map((_, i) => (
          <motion.div
            key={`sparkle-${i}`}
            className="absolute"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
            animate={{
              scale: [0, 1, 0],
              rotate: [0, 180, 360],
              opacity: [0, 0.6, 0],
            }}
            transition={{
              duration: 3,
              repeat: Infinity,
              ease: "easeInOut",
              delay: i * 0.4,
            }}
          >
            <Sparkles className="h-2 w-2 text-yellow-400" />
          </motion.div>
        ))}
      </div>
      
      <Header />
      <main className="container mx-auto px-4 py-8 relative z-10">
        <Dashboard />
      </main>
    </motion.div>
  );
};

const PublicRoute = ({ children }: { children: React.ReactNode }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return <LoadingScreen />;
  }

  if (user) {
    return <Navigate to="/" />;
  }

  return <>{children}</>;
};

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <Router>
          <Routes>
            <Route path="/" element={<PrivateRoute><Dashboard /></PrivateRoute>} />
            <Route path="/login" element={<PublicRoute><AuthLayout /></PublicRoute>} />
            <Route path="/forgot-password" element={<PublicRoute><AuthPageLayout><ForgotPasswordForm /></AuthPageLayout></PublicRoute>} />
            <Route path="/update-password" element={<AuthPageLayout><UpdatePasswordForm /></AuthPageLayout>} />
          </Routes>
          <Toaster 
            position="top-right"
            toastOptions={{
              duration: 4000,
              style: {
                background: '#fef3c7',
                color: '#92400e',
                border: '1px solid #f59e0b',
                borderRadius: '12px',
                fontWeight: '500',
                boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
              },
              success: {
                style: {
                  background: '#d1fae5',
                  color: '#065f46',
                  border: '1px solid #10b981',
                },
              },
              error: {
                style: {
                  background: '#fed7d7',
                  color: '#c53030',
                  border: '1px solid #f56565',
                },
              },
            }}
          />
        </Router>
      </AuthProvider>
    </QueryClientProvider>
  );
}