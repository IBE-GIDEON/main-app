"use client";
import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

export default function AppLoader({ children }: { children: React.ReactNode }) {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 2500); // shows for 2.5s
    return () => clearTimeout(timer);
  }, []);

  return (
    <AnimatePresence>
      {loading ? (
        <motion.div
          key="loader"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-gradient-to-br from-white via-slate-50 to-slate-100"
        >
          {/* Logo Placeholder */}
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="text-3xl font-bold tracking-wide text-gray-800"
          >
            Zen<span className="text-indigo-600">OS</span>
          </motion.div>

          {/* Subtext */}
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6, duration: 0.6 }}
            className="text-gray-500 mt-2"
          >
            lets package your digital life…
          </motion.p>

          {/* Spinner */}
          <div className="mt-6 w-10 h-10 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin"></div>
        </motion.div>
      ) : (
        <motion.div
          key="content"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8 }}
        >
          {children}
        </motion.div>
      )}
    </AnimatePresence>
  );
}
