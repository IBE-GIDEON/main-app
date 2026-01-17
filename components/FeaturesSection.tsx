"use client";

import { motion } from "framer-motion";
import { FiMic, FiZap, FiUpload, FiLink, FiUsers } from "react-icons/fi";
import CountUp from "react-countup";
import { useInView } from "react-intersection-observer";

// Type for feature box
type Feature = {
  title: string;
  description: string;
  icon: JSX.Element;
  highlight?: boolean;
};

// Features array
const features: Feature[] = [
  { title: "Voice Command", description: "Control ZenOS with your voice.", icon: <FiMic size={28} />, highlight: true },
  { title: "All-in-One Dashboard", description: "Manage everything in one place, no stress", icon: <FiLink size={28} /> },
  { title: "Speed Transfers", description: "Transfer files, money etc. instantly.", icon: <FiZap size={28} /> },
  { title: "Post Videos", description: "Upload and share videos to connected social apps.", icon: <FiUpload size={28} /> },
  { title: "API Integrations", description: "Connect all apps seamlessly in one toggle.", icon: <FiLink size={28} /> },
  { title: "User & Support Stats", description: "Monitor usage and life/work progress.", icon: <FiUsers size={28} /> },
];

export default function FeaturesSection() {
  // Hook for stats animation
  const [ref, inView] = useInView({ triggerOnce: true, threshold: 0.3 });

  return (
    <section className="w-full py-32 bg-white flex flex-col items-center">
      <motion.h2
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 1 }}
        className="text-5xl md:text-6xl font-bold text-gray-900 mb-12 text-center"
      >
        Incredible Features
      </motion.h2>

      {/* Features Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-10 max-w-6xl w-full">
        {features.map((feature, idx) => (
          <motion.div
            key={idx}
            className={`relative rounded-3xl p-8 shadow-xl flex flex-col items-start cursor-pointer transition-transform bg-gradient-to-br ${
              feature.highlight ? "from-blue-50 via-blue-100 to-blue-50" : "from-gray-50 via-gray-50 to-gray-50"
            }`}
            whileHover={{ scale: 1.05 }}
            transition={{ type: "spring", stiffness: 200 }}
          >
            {/* Icon */}
            <motion.div
              className={`p-4 rounded-full mb-6 flex items-center justify-center ${
                feature.highlight ? "bg-blue-200 text-blue-600" : "bg-blue-100 text-blue-600"
              }`}
              animate={
                feature.highlight
                  ? {
                      scale: [1, 1.1, 1],
                      rotate: [0, 5, -5, 0],
                      transition: { repeat: Infinity, duration: 2 },
                    }
                  : undefined
              }
            >
              {feature.icon}
            </motion.div>

            <h3 className="text-xl md:text-2xl font-semibold mb-2 text-gray-900">
              {feature.title}
            </h3>
            <p className="text-gray-700">{feature.description}</p>
          </motion.div>
        ))}
      </div>

      {/* Stats with CountUp */}
      <motion.div
        ref={ref}
        className="mt-16 w-full max-w-6xl flex justify-around text-center"
        initial={{ opacity: 0, y: 20 }}
        animate={inView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 1 }}
      >
        <div>
          <h4 className="text-4xl font-bold text-gray-900">
            {inView ? <CountUp end={5000} duration={2} separator="," /> : 0}
          </h4>
          <p className="text-gray-600">Active Users</p>
        </div>
        <div>
          <h4 className="text-4xl font-bold text-gray-900">
            {inView ? <CountUp end={1200} duration={2} separator="," /> : 0}
          </h4>
          <p className="text-gray-600">Supporters</p>
        </div>
        <div>
          <h4 className="text-4xl font-bold text-gray-900">
            {inView ? <CountUp end={50} duration={2} separator="," /> : 0}
          </h4>
          <p className="text-gray-600">Connected Apps</p>
        </div>
      </motion.div>
    </section>
  );
}
