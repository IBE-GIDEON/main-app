"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { motion, useScroll, useTransform } from "framer-motion";




export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);

  // Scalable navigation config
  const navItems = [
    { name: "Products", href: "/products" },
    { name: "Pricing", href: "/pricing" },
    { name: "Support", href: "/support" },
    { name: "Blog", href: "/blog" },
  ];

  // Scroll tracking
  const { scrollY } = useScroll();
  const navHeight = useTransform(scrollY, [0, 150], [80, 60]); 
  const bgOpacity = useTransform(scrollY, [0, 100], [0.5, 0.9]); 

  // Lock scroll for mobile
  useEffect(() => {
    document.body.style.overflow = menuOpen ? "hidden" : "auto";
  }, [menuOpen]);

  return (
    <motion.nav
      style={{ height: navHeight }}
      className="fixed top-0 left-0 w-full z-50 backdrop-blur-md bg-white/70 border-b border-gray-200 shadow-sm transition-all duration-500"
    >
      <div className="max-w-7xl mx-auto px-6 flex items-center justify-between h-full">
        
        {/* Logo */}
        <Link href="/" className="text-2xl font-bold text-gray-900 tracking-tight">
          Zen<span className="text-blue-600">OS</span>
        </Link>

        {/* Desktop Menu */}
        <div className="hidden md:flex space-x-8 text-gray-700 font-medium">
          {navItems.map((item) => (
            <Link key={item.name} href={item.href} className="hover:text-blue-600 transition">
              {item.name}
            </Link>
          ))}
        </div>

        {/* CTA Section (Desktop) */}
        <div className="hidden md:flex items-center space-x-6">
          {/* SIGN IN (text only) */}
         

          {/* GET STARTED */}
          <Link
            href="/create-account"
            className="bg-blue-600 text-white px-5 py-2 rounded-xl font-semibold shadow hover:shadow-md hover:bg-blue-700 transition-all duration-300"
          >
            Get Started
          </Link>
        </div>

        {/* Mobile Toggle */}
        <button
          onClick={() => setMenuOpen(!menuOpen)}
          className="md:hidden text-gray-700 text-3xl focus:outline-none"
        >
          ☰
        </button>
      </div>

      {/* Mobile Menu */}
      {menuOpen && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          className="md:hidden bg-white border-t border-gray-200 px-6 py-5 space-y-4 shadow-lg"
        >
          {navItems.map((item) => (
            <Link
              key={item.name}
              href={item.href}
              onClick={() => setMenuOpen(false)}
              className="block hover:text-blue-600 text-lg text-black"
            >
              {item.name}
            </Link>
          ))}


          {/* Get Started mobile */}
          <Link
            href="/create-account"
            className="block bg-blue-600 text-white px-4 py-2 rounded-lg text-center hover:bg-blue-700"
          >
            Get Started
          </Link>
        </motion.div>
      )}
    </motion.nav>
  );
}
