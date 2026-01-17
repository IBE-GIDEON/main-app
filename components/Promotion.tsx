"use client";

import { motion } from "framer-motion";
import { useInView } from "react-intersection-observer";

export default function CTAPromoSection() {
  const [ref, inView] = useInView({ triggerOnce: true, threshold: 0.3 });

  return (
    <section
      ref={ref}
      className="w-full bg-gradient-to-r from-blue-50 via-white to-blue-50 py-32 flex flex-col items-center text-center px-4 md:px-0"
    >
      {/* Animated Heading */}
      <motion.h2
        initial={{ opacity: 0, y: 30 }}
        animate={inView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 1 }}
        className="text-4xl md:text-6xl font-extrabold text-gray-900 mb-6"
      >
        Take Control of ZenOS Today
      </motion.h2>

      {/* Subheading with promises */}
      <motion.p
        initial={{ opacity: 0, y: 20 }}
        animate={inView ? { opacity: 1, y: 0 } : {}}
        transition={{ delay: 0.2, duration: 1 }}
        className="text-lg md:text-xl text-gray-700 max-w-3xl mb-12"
      >
        Manage all your apps, automate tasks, post videos, and connect platforms in one unified dashboard. Everything you need, faster, smarter, and completely in your control.
      </motion.p>

      {/* CTA Buttons */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={inView ? { opacity: 1, y: 0 } : {}}
        transition={{ delay: 0.4, duration: 1 }}
        className="flex flex-col md:flex-row gap-6"
      >
        <button className="bg-blue-600 text-white px-8 py-4 rounded-xl font-semibold text-lg hover:bg-blue-700 transition-colors shadow-lg">
          <a
            href="/create-account"
          >
            Request a Demo
          </a>
        </button>
        <button className="bg-white text-blue-600 border border-blue-600 px-8 py-4 rounded-xl font-semibold text-lg hover:bg-blue-50 transition-colors shadow-lg">
          <a
            href="/create-account"
          >
            Get started
          </a>
        </button>
      </motion.div>

      {/* Optional feature highlights below buttons */}
      <motion.div
        className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl"
        initial={{ opacity: 0, y: 20 }}
        animate={inView ? { opacity: 1, y: 0 } : {}}
        transition={{ delay: 0.6, duration: 1 }}
      >
        <div className="p-6 bg-gray-50 rounded-2xl shadow-lg">
          <h4 className="font-semibold text-lg mb-2">All-in-One Dashboard</h4>
          <p className="text-gray-600 text-sm">Control emails, meetings, and tasks seamlessly in one place.</p>
        </div>
        <div className="p-6 bg-gray-50 rounded-2xl shadow-lg">
          <h4 className="font-semibold text-lg mb-2">Speed & Efficiency</h4>
          <p className="text-gray-600 text-sm">Automate tasks and transfer files instantly across platforms.</p>
        </div>
        <div className="p-6 bg-gray-50 rounded-2xl shadow-lg">
          <h4 className="font-semibold text-lg mb-2">Connect Everything</h4>
          <p className="text-gray-600 text-sm">Integrate all your apps via APIs without limits.</p>
        </div>
      </motion.div>
    </section>
  );
}
