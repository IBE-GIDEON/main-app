"use client";

import { useState, useRef } from "react";
import { motion } from "framer-motion";

export default function VideoSection() {
  const [isPlaying, setIsPlaying] = useState(true);
  const mainVideoRef = useRef<HTMLVideoElement>(null);

  // Play/Pause toggle
  const togglePlay = () => {
    if (!mainVideoRef.current) return;
    if (isPlaying) {
      mainVideoRef.current.pause();
    } else {
      mainVideoRef.current.play();
    }
    setIsPlaying(!isPlaying);
  };

  return (
    <section className="relative w-full py-32 bg-gray-50 flex flex-col items-center">
      {/* Section Heading */}
      <motion.h2
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1 }}
        className="text-5xl md:text-6xl font-bold text-gray-900 mb-12 text-center"
      >
        Introducing Zen 1.0
        <div><h1 className="text-[16px] mt-8">personal-oriented</h1></div>
      </motion.h2>

      {/* Main Video Box */}
      <div className="relative w-[1000px] max-w-full h-[600px] rounded-3xl overflow-hidden shadow-2xl border-4 border-blue-400/40 animate-pulse-glow">
        <video
          ref={mainVideoRef}
          autoPlay
          loop
          muted
          className="w-full h-full object-cover rounded-3xl"
        >
          <source src="/" type="video/mp4" />
          Your browser does not support the video tag.
        </video>

        {/* Play/Pause Button */}
        <button
          onClick={togglePlay}
          className="absolute left-6 bottom-6 bg-white/30 backdrop-blur-md p-4 rounded-full hover:bg-white/60 shadow-lg transition-all z-20"
        >
          {isPlaying ? "⏸" : "▶️"}
        </button>
      </div>
    </section>
  );
}
