"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import Footer from "@/components/Footer";

const productFeatures = [
  {
    title: "Unified Productivity",
    description: `ZenOS centralizes all your tasks, notes, and projects. 
    With cross-device syncing, you never lose track of your work. 
    Manage daily to-dos, long-term projects, and collaborate seamlessly—all in one place. 
    Track your projects visually with timeline views, Kanban boards, and AI suggestions to stay productive.`,
    icon: "/unified productivity.png",
  },
  {
    title: "AI Assistant",
    description: `ZenOS AI understands your commands, generates summaries, suggests tasks, and prioritizes your schedule intelligently.
    It helps you focus on what matters while automating repetitive work.
    AI can analyze your inbox, calendar, and notes to suggest next steps and reminders proactively.`,
    icon: "/Ai assistant.png",
  },
  {
    title: "Third-Party Integrations",
    description: `Connect Gmail, Notion, Zoom, Slack, TikTok, and more. 
    ZenOS enables AI automation across all platforms, making it easy to sync data and automate workflows without manual effort.
    Each integration shows real-time updates, notifications, and automated task handling.`,
    icon: "/integrations.png",
  },
  {
    title: "Automation & Smart ZenFlows",
    description: `Trigger multiple actions with a single command using ZenFlows.
    Prebuilt templates allow anyone to automate common workflows instantly, saving hours every week.
    Visual cues and flow diagrams help you understand and customize automations easily.`,
    icon: "/zenflows.png",
  },
  {
    title: "Notifications & Context Management",
    description: `ZenOS filters and prioritizes notifications intelligently. 
    Focus only on what matters while keeping track of ongoing tasks and projects across apps.
    Context-aware summaries show key updates, minimizing distractions and maximizing productivity.`,
    icon: "/context management.png",
  },
  {
    title: "Data Security & Control",
    description: `Your data is fully yours. Optional decentralized storage and granular permissions let you decide exactly what apps can access.
    ZenOS keeps your information safe without compromising functionality.
    Visual indicators show which apps have access and when data is being synced.`,
    icon: "/datasec.png",
  },
  {
    title: "Voice Command & Speed Transfers",
    description: `Use voice commands to manage tasks, post content, and trigger automations. 
    ZenOS also offers ultra-fast data transfer across platforms, saving you time and effort.
    Voice recognition adapts to your style, supporting natural language commands.`,
    icon: "/voice.png",
  },
  {
    title: "Email & Social Media Automation",
    description: `Automate sending emails, posting videos, or sharing content across multiple accounts. 
    ZenOS ensures your communications are always timely and consistent.
    Visual workflow previews help track outgoing posts and scheduled emails.`,
    icon: "/social automation.png",
  },
  {
    title: "Health & Life Tracking",
    description: `Track habits, health metrics, and personal goals. 
    ZenOS intelligently summarizes your progress, helping you maintain balance between work, health, and personal life.
    Charts and AI-generated insights help you make informed decisions quickly.`,
    icon: "/health.png",
  },
  {
    title: "Custom Workflows & Templates",
    description: `Create your own automations or use prebuilt templates for common tasks. 
    ZenOS adapts to your workflow, making even complex routines easy to manage.
    Visual drag-and-drop editor makes workflow customization intuitive and fast.`,
    icon: "/workflows.png",
  },
];

export default function ProductPage() {
  return (
    <main className="bg-white text-gray-900">
      {/* Header / Hero */}
      <section className="relative bg-gradient-to-b from-blue-50 to-white py-24">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-4xl md:text-5xl font-bold mb-4"
          >
            Explore ZenOS — The AI Operating System Just for You
          </motion.h1>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.6 }}
            className="text-lg md:text-xl text-gray-700"
          >
            Every feature explained. Understand how ZenOS transforms your digital world, automates tasks, and keeps you focused.
          </motion.p>
        </div>
      </section>

      {/* Features */}
      <section className="max-w-6xl mx-auto px-6 py-24 space-y-24">
        {productFeatures.map((feature, idx) => (
          <motion.div
            key={idx}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: idx * 0.1 }}
            className="flex flex-col md:flex-row items-center gap-12"
          >
            {/* Bigger Icon / Visual */}
            <div className="flex-shrink-0 w-48 h-48 w-[300px] h-[450px] flex items-center justify-center rounded-2xl bg-white shadow-xl hover:shadow-2xl transition-all">
              <Image src={feature.icon} alt={feature.title} width={300} height={500} />
            </div>
            {/* Text */}
            <div className="flex-1">
              <h3 className="text-3xl font-semibold mb-4">{feature.title}</h3>
              <p className="text-gray-700 text-lg leading-relaxed">{feature.description}</p>
            </div>
          </motion.div>
        ))}
      </section>

      {/* CTA */}
      <section className="bg-gradient-to-r from-blue-500 to-purple-500 py-24">
        <div className="max-w-4xl mx-auto text-center px-6">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
            Experience ZenOS in Action
          </h2>
          <a
            href="/create-account"
            className="bg-white text-blue-600 font-semibold px-12 py-4 rounded-xl shadow-lg hover:shadow-2xl hover:bg-gray-100 transition-all"
          >
            Get Started
          </a>
        </div>
      </section>
      <div><Footer /></div>
    </main>
  );
}

