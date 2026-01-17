// components/Toast.tsx
"use client";

import { motion, AnimatePresence } from "framer-motion";
import { IoClose } from "react-icons/io5";

interface ToastProps {
  message: string;
  type: "success" | "error" | "info";
  onClose: () => void;
}

export default function Toast({ message, type, onClose }: ToastProps) {
  const bgColor = {
    success: "bg-green-500",
    error: "bg-red-500",
    info: "bg-blue-500",
  };

  return (
    <AnimatePresence>
      {message && (
        <motion.div
          initial={{ opacity: 0, x: 300 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: 300 }}
          transition={{ type: "spring", stiffness: 300, damping: 25 }}
          className={`fixed top-5 right-5 z-50 min-w-[250px] max-w-xs text-white px-5 py-4 rounded-xl shadow-lg flex justify-between items-center ${bgColor[type]}`}
        >
          <span>{message}</span>
          <button onClick={onClose} className="ml-3 text-white hover:opacity-90">
            <IoClose size={18} />
          </button>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
