"use client";

import { useState, useMemo } from "react";
import { motion } from "framer-motion";

// Support Categories
const supportCategories = [
  {
    title: "Getting Started",
    description: "Learn how to set up your ZenOS account, connect your apps, and get started in minutes.",
    icon: "/icons/getting-started.png",
    visual: "/visuals/getting-started.gif",
  },
  {
    title: "Account & Billing",
    description: "Manage your subscription, payment methods, and plan upgrades or cancellations easily.",
    icon: "/icons/account-billing.png",
    visual: "/visuals/account-billing.gif",
  },
  {
    title: "Integrations",
    description: "Connect Gmail, Notion, Slack, Google Calendar, TikTok, and more — automate your workflow seamlessly.",
    icon: "/icons/integrations.png",
    visual: "/visuals/integrations.gif",
  },
  {
    title: "AI Assistant",
    description: "Learn how to use ZenOS voice commands, task suggestions, summaries, and LifeFlows efficiently.",
    icon: "/icons/ai.png",
    visual: "/visuals/ai.gif",
  },
  {
    title: "Troubleshooting",
    description: "Find solutions to common issues, error messages, or technical problems quickly.",
    icon: "/icons/troubleshooting.png",
    visual: "/visuals/troubleshooting.gif",
  },
  {
    title: "Privacy & Security",
    description: "Understand how ZenOS protects your data, manages permissions, and offers user-owned vaults.",
    icon: "/icons/security.png",
    visual: "/visuals/security.gif",
  },
];

// FAQs
const faqs = [
  {
    question: "How do I connect Gmail or Notion to ZenOS?",
    answer: "Go to the Integrations section in your ZenOS dashboard, select the app you want to connect, and follow the OAuth prompts. Your data syncs automatically.",
  },
  {
    question: "Can I use ZenOS offline?",
    answer: "ZenOS core productivity tools can be used offline, but AI suggestions and integrations require internet access.",
  },
  {
    question: "How is my data secured?",
    answer: "All data is encrypted in transit and at rest. You have full control via user-owned vaults and granular app permissions.",
  },
  {
    question: "How can I reset my account or password?",
    answer: "Go to your account settings and select 'Reset Password'. Follow the instructions sent to your registered email.",
  },
  {
    question: "Can I switch plans anytime?",
    answer: "Yes! You can upgrade, downgrade, or cancel your subscription anytime via your account dashboard.",
  },
  {
    question: "Does ZenOS work on mobile devices?",
    answer: "ZenOS is fully responsive and works on all modern mobile devices and tablets.",
  },
  {
    question: "Who can I contact if I encounter a bug?",
    answer: "Contact our support team directly via the 'Email Support' or 'Live Chat' options below.",
  },
];

export default function SupportPage() {
  const [activeFAQ, setActiveFAQ] = useState<number | null>(null);
  const [search, setSearch] = useState("");

  // Filter categories and FAQs dynamically
  const filteredCategories = useMemo(
    () =>
      supportCategories.filter((cat) =>
        cat.title.toLowerCase().includes(search.toLowerCase()) ||
        cat.description.toLowerCase().includes(search.toLowerCase())
      ),
    [search]
  );

  const filteredFAQs = useMemo(
    () =>
      faqs.filter((faq) =>
        faq.question.toLowerCase().includes(search.toLowerCase()) ||
        faq.answer.toLowerCase().includes(search.toLowerCase())
      ),
    [search]
  );

  return (
    <main className="bg-white text-gray-900 relative">
      {/* Hero Section */}
      <section className="py-24 bg-gradient-to-b from-blue-50 to-white">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-4xl md:text-5xl font-bold mb-4"
          >
            ZenOS Support
          </motion.h1>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.6 }}
            className="text-lg md:text-xl text-gray-700 mb-8"
          >
            We’re here to help you make the most of your digital life.
          </motion.p>

          {/* Search Bar */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4, duration: 0.6 }}
          >
            <input
              type="text"
              placeholder="Search for help, guides, or FAQs..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full md:w-2/3 lg:w-1/2 px-6 py-3 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-sm bg-white"
            />
          </motion.div>
        </div>
      </section>

      {/* Support Categories with Animated Visuals */}
      <section className="py-24 max-w-6xl mx-auto px-6">
        <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">
          Support Categories
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredCategories.map((cat, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: idx * 0.1 }}
              className="p-6 rounded-2xl shadow-lg hover:shadow-2xl transition-all cursor-pointer bg-white flex flex-col items-center text-center group"
            >
              <div className="relative w-20 h-20 mb-4">
                <img
                  src={cat.visual}
                  alt={`${cat.title} visual`}
                  className="absolute w-full h-full object-contain opacity-0 group-hover:opacity-100 transition-all duration-500"
                />
                <img
                  src={cat.icon}
                  alt={cat.title}
                  className="absolute w-full h-full object-contain group-hover:opacity-0 transition-all duration-500"
                />
              </div>
              <h3 className="text-xl font-semibold mb-2">{cat.title}</h3>
              <p className="text-gray-600">{cat.description}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* FAQs Section */}
      <section className="py-24 max-w-4xl mx-auto px-6">
        <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">
          Frequently Asked Questions
        </h2>
        <div className="space-y-4">
          {filteredFAQs.map((faq, idx) => (
            <div
              key={idx}
              className="border rounded-xl overflow-hidden shadow-sm"
            >
              <button
                onClick={() =>
                  setActiveFAQ(activeFAQ === idx ? null : idx)
                }
                className="w-full flex justify-between items-center px-6 py-4 bg-gray-50 hover:bg-gray-100 transition-all text-left font-medium text-gray-800"
              >
                {faq.question}
                <span className="text-gray-500">{activeFAQ === idx ? "-" : "+"}</span>
              </button>
              {activeFAQ === idx && (
                <div className="px-6 py-4 bg-white text-gray-700">{faq.answer}</div>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* Contact / Support */}
      <section className="py-24 bg-gradient-to-r from-blue-500 to-purple-600 text-white relative">
        <div className="max-w-4xl mx-auto px-6 text-center space-y-6">
          <h2 className="text-3xl md:text-4xl font-bold">
            Still need help?
          </h2>
          <p className="text-lg md:text-xl">
            Contact us directly or request a live demo of ZenOS.
          </p>
          <div className="flex flex-col md:flex-row justify-center gap-4 mt-6">
            <a
              href="mailto:support@zenos.ai"
              className="px-8 py-3 rounded-xl bg-white text-blue-600 font-semibold hover:bg-gray-100 transition-all"
            >
              Email Support
            </a>
            <a
              href="/create-account"
              className="px-8 py-3 rounded-xl border border-white font-semibold hover:bg-white hover:text-blue-600 transition-all"
            >
              Request a Demo
            </a>
            <a
              href="/live-chat"
              className="px-8 py-3 rounded-xl border border-white font-semibold hover:bg-white hover:text-blue-600 transition-all"
            >
              Live Chat
            </a>
          </div>
        </div>
        {/* Floating Sticky CTA */}
        <a
          href="#contact"
          className="fixed bottom-6 right-6 bg-blue-600 text-white px-6 py-3 rounded-full shadow-xl hover:bg-blue-700 transition-all z-50"
        >
          Need Help?
        </a>
      </section>
    </main>
  );
}
