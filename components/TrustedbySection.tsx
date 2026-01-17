"use client";
import Link from "next/link";
import { motion } from "framer-motion";

// Example trusted companies with icon URLs (can be local or remote)
const trustedCompanies = [
  {
    name: "Dave martin",
    icon: "/dave.webp",
  },
  {
    name: "Jim soft",
    icon: "/jim.webp",
  },
  {
    name: "Garry",
    icon: "/garry.webp",
  },
  {
    name: "Tessa",
    icon: "/tessa.webp",
  },
  {
    name: "Jude luke",
    icon: "/jude.webp",
  },
  {
    name:  <Link href="/" className="text-2xl font-bold text-gray-900 tracking-tight">
              Zen<span className="text-blue-600">OS</span>
            </Link>,
    icon: "/zen.webp" 
  },
];

export default function TrustedBySection() {
  return (
    <section className="w-full py-16 bg-gray-50 flex flex-col items-center">
      {/* Heading */}
      <h3 className="text-xl md:text-2xl font-semibold text-gray-700 mb-8">
        Trusted by
      </h3>

      {/* Horizontal line with logos */}
      <div className="w-full max-w-6xl flex items-center justify-between border-t border-gray-300 pt-8 space-x-6 overflow-x-auto scrollbar-hide">
        {trustedCompanies.map((company, idx) => (
          <motion.div
            key={idx}
            className="flex items-center flex-shrink-0 space-x-3"
            whileHover={{ scale: 1.05 }}
            transition={{ type: "spring", stiffness: 200 }}
          >
            {/* Circle Icon */}
            <img
              src={company.icon}
              alt={company.name}
              className="w-10 h-10 rounded-full object-cover shadow-md"
            />
            {/* Company Name */}
            <span className="text-gray-900 font-bold text-lg md:text-xl">
              {company.name}
            </span>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
