"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import Gradient from "@/components/Gradient";

const connectedApps = [
  { name: "Gmail", icon: "/gmail.webp" },
  { name: "Notion", icon: "/notion.webp" },
  { name: "Zoom", icon: "/zoom.webp" },
  { name: "Slack", icon: "/slack.webp" },
  { name: "Google Calendar", icon: "/calender.webp" },
];

export default function HeroSection() {
  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-[#f8fbff] via-white to-[#eef4ff] pt-32 pb-24">
      {/* ===== Faded Gradient Glow Background ===== */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute top-[-250px] left-[-150px] w-[600px] h-[600px] bg-blue-300/30 rounded-full blur-3xl"></div>
        <div className="absolute bottom-[-200px] right-[-200px] w-[550px] h-[550px] bg-indigo-400/20 rounded-full blur-3xl"></div>
      </div>

      {/* ===== Main Content ===== */}
      <div className="max-w-7xl mx-auto px-6 text-center relative z-10">
        <Gradient />

        {/* Headline */}
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-4xl md:text-5xl font-bold text-gray-900 leading-tight mb-6"
        >
          AI That Thinks Through Unmade Decisions
        </motion.h1>

        {/* Subtext */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.6 }}
          className="text-gray-600 text-lg md:text-xl mb-10 max-w-2xl mx-auto"
        >
          ZenOS automates your day, connects your favorite apps, and keeps
          everything in one place — smarter, faster, and beautifully designed.
        </motion.p>

        {/* Call to Action Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.6 }}
          className="flex flex-col md:flex-row justify-center gap-4 mb-16"
        >
          <a
            href="/create-account"
            className="bg-blue-600 text-white px-8 py-3 rounded-xl font-semibold shadow-lg hover:shadow-2xl hover:bg-blue-700 transition-all"
          >
            Request a Demo
          </a>
          <a
            href="/create-account"
            className="border border-gray-300 text-gray-900 px-8 py-3 rounded-xl font-semibold hover:bg-gray-100 transition-all"
          >
            Get Started
          </a>
        </motion.div>

        {/* Connected Apps */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6, duration: 0.8 }}
          className="flex justify-center flex-wrap gap-8 items-center"
        >
          {connectedApps.map((app) => (
            <div key={app.name} className="flex flex-col items-center">
              <div className="w-20 h-20 flex items-center justify-center rounded-xl bg-gray-50 shadow hover:shadow-lg transition-all p-4">
                <Image src={app.icon} alt={app.name} width={40} height={40} />
              </div>
              <span className="mt-2 text-gray-700 font-medium">
                {app.name}
              </span>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}

