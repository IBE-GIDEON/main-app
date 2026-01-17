"use client";
import { FaXTwitter, FaInstagram, FaLinkedin, FaYoutube, FaFacebook } from "react-icons/fa6";
import Link from "next/link";

export default function Footer() {
  return (
    <footer className="bg-[#f8f9fb] text-gray-700 border-t border-gray-200 mt-20">
      <div className="max-w-7xl mx-auto px-6 py-14">
        {/* Top Grid Section */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-10">
          {/* Logo + Tagline */}
          <div className="col-span-2">
            <h2 className="text-2xl font-bold text-gray-900 tracking-tight mb-2">
              Zen<span className="text-indigo-600">OS</span>
            </h2>
            <p className="text-gray-500 text-sm leading-relaxed">
              Your AI-powered life management system — organize, automate, and
              focus on what truly matters.
            </p>
          </div>

          {/* Product Links */}
          <div>
            <h3 className="font-semibold mb-3 text-gray-900">Product</h3>
            <ul className="space-y-2 text-sm">
              <li><Link href="/products" className="hover:text-indigo-600 transition-colors">Features</Link></li>
              <li><Link href="/pricing" className="hover:text-indigo-600 transition-colors">Pricing</Link></li>
              <li><Link href="/download" className="hover:text-indigo-600 transition-colors">Download</Link></li>
            </ul>
          </div>

          {/* Company Links */}
          <div>
            <h3 className="font-semibold mb-3 text-gray-900">Company</h3>
            <ul className="space-y-2 text-sm">
              <li><Link href="/products" className="hover:text-indigo-600 transition-colors">About</Link></li>
              <li><Link href="/blog" className="hover:text-indigo-600 transition-colors">Blog</Link></li>
          
              <li><Link href="/support" className="hover:text-indigo-600 transition-colors">Contact</Link></li>
            </ul>
          </div>

          {/* Support Links */}
          <div>
            <h3 className="font-semibold mb-3 text-gray-900">Support</h3>
            <ul className="space-y-2 text-sm">
              <li><Link href="/support" className="hover:text-indigo-600 transition-colors">Help Center</Link></li>
              <li><Link href="/privacy" className="hover:text-indigo-600 transition-colors">Privacy Policy</Link></li>
              <li><Link href="/terms" className="hover:text-indigo-600 transition-colors">Terms of Service</Link></li>
          
            </ul>
          </div>
        </div>

        {/* Divider */}
        <div className="border-t border-gray-200 my-10"></div>

        {/* Bottom Section */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-4 text-sm text-gray-500">
          <p>© {new Date().getFullYear()} LifeOS. All rights reserved.</p>

          {/* Social Links */}
          <div className="flex space-x-5 text-gray-600">
            <Link href="https://x.com" target="_blank" className="hover:text-black transition-colors">
              <FaXTwitter className="text-lg" />
            </Link>
            <Link href="https://instagram.com" target="_blank" className="hover:text-pink-600 transition-colors">
              <FaInstagram className="text-lg" />
            </Link>
            <Link href="https://linkedin.com" target="_blank" className="hover:text-blue-700 transition-colors">
              <FaLinkedin className="text-lg" />
            </Link>
            <Link href="https://github.com" target="_blank" className="hover:text-gray-900 transition-colors">
              <FaYoutube className="text-lg" />
            </Link>
            <Link href="https://apply.ycombinator.com/session/new?continue=https%3A%2F%2Fapply.ycombinator.com%2F" target="_blank" className="hover:text-gray-900 transition-colors">
              <FaFacebook className="text-lg" />
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
