"use client";

import { useState } from "react";
import { 
  Search, ChevronDown, Mail, LayoutGrid, Bug, Smile, 
  ShieldAlert, Snowflake, Flame, Activity, Database, 
  Triangle, Cloud, RefreshCcw, Link2, FileText, 
  CreditCard, Share2, Key, Megaphone, Ticket, 
  Globe, Hexagon, Dna, LayoutTemplate 
} from "lucide-react";
import clsx from "clsx";

// Mock data to replicate the exact grid in the screenshot
const CONNECTORS = [
  { id: 1, name: "Gmail with Calendar", desc: "Search, create, and manage your emails and calendar events", icon: Mail, color: "text-red-400", bg: "bg-red-500/10", status: "available" },
  { id: 2, name: "Outlook", desc: "Search your emails and calendar events", icon: Mail, color: "text-blue-400", bg: "bg-blue-500/10", status: "available" },
  { id: 3, name: "HubSpot", desc: "Retrieve, create, and update CRM objects; manage contacts, companies,...", icon: Share2, color: "text-orange-400", bg: "bg-orange-500/10", status: "available" },
  { id: 4, name: "Monday.com", desc: "Manage boards, items, and groups; create updates and sub-items; automat...", icon: LayoutGrid, color: "text-rose-400", bg: "bg-rose-500/10", status: "available" },
  { id: 5, name: "Supabase", desc: "Build and manage your app's database, auth, and storage", icon: Database, color: "text-emerald-400", bg: "bg-emerald-500/10", status: "available" },
  { id: 6, name: "Stytch", desc: "Authenticate and secure users with Stytch, unifying login, authorization, an...", icon: Key, color: "text-slate-300", bg: "bg-slate-500/10", status: "available" },
  { id: 7, name: "Jam", desc: "Access bug recordings with video, console logs, errors, network requests,...", icon: Bug, color: "text-pink-400", bg: "bg-pink-500/10", status: "available" },
  { id: 8, name: "Vercel", desc: "Manage teams, projects, and deployments; search documentation an...", icon: Triangle, color: "text-zinc-200", bg: "bg-zinc-500/10", status: "available" },
  { id: 9, name: "Klaviyo", desc: "Manage profiles, lists, segments, campaigns, flows, events, metrics, and...", icon: Megaphone, color: "text-cyan-400", bg: "bg-cyan-500/10", status: "available" },
  { id: 10, name: "Hugging Face", desc: "Search and explore models, datasets, spaces, papers, and collections on the...", icon: Smile, color: "text-yellow-400", bg: "bg-yellow-500/10", status: "available" },
  { id: 11, name: "Cloudinary", desc: "Organize, transform, and deliver images and videos in Cloudinary with centralize...", icon: Cloud, color: "text-blue-500", bg: "bg-blue-600/10", status: "available" },
  { id: 12, name: "Ticket Tailor", desc: "Connect to Ticket Tailor", icon: Ticket, color: "text-indigo-400", bg: "bg-indigo-500/10", status: "available" },
  { id: 13, name: "Sentry", desc: "Access issues, errors, and projects; analyze stack traces and performance...", icon: ShieldAlert, color: "text-purple-400", bg: "bg-purple-500/10", status: "available" },
  { id: 14, name: "Circleback", desc: "Connect to Circleback.ai", icon: RefreshCcw, color: "text-orange-500", bg: "bg-orange-600/10", status: "available" },
  { id: 15, name: "WordPress.com", desc: "Create and publish websites, blogs, and stores with customizable designs, built-...", icon: Globe, color: "text-sky-400", bg: "bg-sky-500/10", status: "available" },
  { id: 16, name: "Snowflake", desc: "Ask questions about your Snowflake data", icon: Snowflake, color: "text-sky-300", bg: "bg-sky-400/10", status: "available" },
  { id: 17, name: "Bitly", desc: "Shorten, brand, and track links with Bitly to manage URL sharing, QR codes, and...", icon: Link2, color: "text-orange-400", bg: "bg-orange-500/10", status: "available" },
  { id: 18, name: "Honeycomb", desc: "Query and analyze Honeycomb observability data, like traces, boards,...", icon: Hexagon, color: "text-yellow-500", bg: "bg-yellow-600/10", status: "available" },
  { id: 19, name: "Fireflies", desc: "Access meeting transcripts, summaries, speaker information, and metadata", icon: Flame, color: "text-purple-500", bg: "bg-purple-600/10", status: "available" },
  { id: 20, name: "Jotform", desc: "Access and manage forms, submissions, and survey responses; create and updat...", icon: FileText, color: "text-blue-400", bg: "bg-blue-500/10", status: "available" },
  { id: 21, name: "BioRender", desc: "Create professional scientific figures, diagrams, and posters in BioRender usi...", icon: Dna, color: "text-indigo-500", bg: "bg-indigo-600/10", status: "available" },
  { id: 22, name: "Datadog", desc: "Monitor infrastructure, applications, and logs; analyze performance metrics and...", icon: Activity, color: "text-purple-400", bg: "bg-purple-500/10", status: "available" },
  { id: 23, name: "Stripe", desc: "Manage payments, subscriptions, customers, and invoices; process...", icon: CreditCard, color: "text-indigo-400", bg: "bg-indigo-500/10", status: "available" },
  { id: 24, name: "Wix", desc: "Manage your Wix website, e-commerce, bookings, and marketing campaigns", icon: LayoutTemplate, color: "text-zinc-200", bg: "bg-zinc-500/10", status: "available" },
];

export default function ConnectorsPage() {
  const [activeTab, setActiveTab] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");

  const filteredConnectors = CONNECTORS.filter(c => 
    (activeTab === "All" || (activeTab === "Connected" && c.status === "connected") || (activeTab === "Available" && c.status === "available")) &&
    c.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="animate-in fade-in duration-500 w-full max-w-6xl pb-20">
      
      {/* HEADER SECTION */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <h1 className="text-[20px] font-semibold text-zinc-100 tracking-tight">Connectors</h1>
        
        <div className="relative w-full md:w-[280px]">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500" size={16} />
          <input 
            type="text" 
            placeholder="Search all connectors" 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full rounded-full border border-white/10 bg-[#1A1A1A] py-1.5 pl-9 pr-4 text-[13px] text-zinc-200 placeholder:text-zinc-500 focus:border-white/20 focus:outline-none transition-colors"
          />
        </div>
      </div>

      {/* SUB-HEADER */}
      <p className="mb-6 text-[14px] text-zinc-300">
        Connect your tools to three AI to search across them and take action. Your permissions are always respected.
      </p>

      {/* FILTERS & TABS SECTION */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8 border-b border-white/5 pb-6">
        
        {/* Pills */}
        <div className="flex items-center gap-2">
          {["All", "Connected", "Available"].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={clsx(
                "rounded-full px-4 py-1.5 text-[13px] font-medium transition-colors",
                activeTab === tab 
                  ? "bg-[#2A2A2A] text-zinc-100 border border-white/10" 
                  : "bg-transparent text-zinc-400 hover:text-zinc-200 border border-transparent"
              )}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* Categories Dropdown */}
        <button className="flex items-center gap-2 rounded-lg border border-white/10 bg-transparent px-4 py-1.5 text-[13px] font-medium text-zinc-300 transition-colors hover:bg-white/5 hover:text-white w-fit">
          All categories
          <ChevronDown size={14} className="text-zinc-500" />
        </button>
      </div>

      {/* GRID SECTION */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {filteredConnectors.map((connector) => {
          const Icon = connector.icon;
          return (
            <button 
              key={connector.id} 
              className="flex items-start gap-4 rounded-xl border border-white/5 bg-[#121212] p-4 text-left transition-all hover:border-white/20 hover:bg-[#161616] group"
            >
              {/* App Icon Mockup */}
              <div className={clsx("flex h-10 w-10 shrink-0 items-center justify-center rounded-lg shadow-sm", connector.bg)}>
                <Icon className={connector.color} size={20} />
              </div>
              
              {/* Text Content */}
              <div className="flex flex-col overflow-hidden">
                <span className="mb-1 text-[14px] font-semibold text-zinc-100 group-hover:text-white transition-colors">
                  {connector.name}
                </span>
                <span className="text-[12px] text-zinc-500 leading-snug line-clamp-3">
                  {connector.desc}
                </span>
              </div>
            </button>
          );
        })}
      </div>

      {/* Empty State (if search yields no results) */}
      {filteredConnectors.length === 0 && (
        <div className="py-20 text-center">
          <p className="text-[14px] text-zinc-500">No connectors found matching "{searchQuery}"</p>
        </div>
      )}

    </div>
  );
}
