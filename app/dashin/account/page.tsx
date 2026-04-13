"use client";

import { useSession, signOut } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useState, useRef, useEffect } from "react";
import { X, Loader2, Upload } from "lucide-react";
import clsx from "clsx";

export default function AccountPage() {
  const { data: session } = useSession();
  const router = useRouter();

  // --- REAL-TIME STATE MANAGEMENT ---
  const [localName, setLocalName] = useState("GIDEON IBE");
  const [localHandle, setLocalHandle] = useState("shytersnic11985");
  const [localImage, setLocalImage] = useState("https://api.dicebear.com/7.x/avataaars/svg?seed=Gideon");
  const [localEmail, setLocalEmail] = useState("shytersnicks@gmail.com");

  // Modal State
  const [editModal, setEditModal] = useState<{ type: "name" | "username"; value: string } | null>(null);
  const [isUpdating, setIsUpdating] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Sync with session if it exists
  useEffect(() => {
    if (session?.user) {
      if (session.user.name) setLocalName(session.user.name);
      if (session.user.email) {
        setLocalEmail(session.user.email);
        if (!editModal) setLocalHandle(session.user.email.split("@")[0]);
      }
      if (session.user.image) setLocalImage(session.user.image);
    }
  }, [session]);

  // --- HANDLERS ---
  const handleAvatarSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // 1. Instantly show the image in the UI (Optimistic Update)
    const tempUrl = URL.createObjectURL(file);
    setLocalImage(tempUrl);

    // 2. TODO: Send file to your backend/cloud storage here
    console.log("Uploading new avatar:", file.name);
  };

  const handleSaveEdit = async () => {
    if (!editModal || !editModal.value.trim()) return;
    setIsUpdating(true);

    // Simulate an API call to your backend
    await new Promise((resolve) => setTimeout(resolve, 600));

    // Optimistically update the UI
    if (editModal.type === "name") setLocalName(editModal.value.trim());
    if (editModal.type === "username") setLocalHandle(editModal.value.trim());

    setIsUpdating(false);
    setEditModal(null);
  };

  // Shared ghost button style
  const ghostButtonClass =
    "rounded-full border border-zinc-200 dark:border-white/10 bg-transparent px-4 py-1.5 text-[13px] font-medium text-zinc-600 dark:text-zinc-300 transition-colors hover:bg-zinc-100 dark:hover:bg-white/5 hover:text-zinc-900 dark:hover:text-white";

  return (
    <div className="animate-in fade-in duration-500 max-w-3xl relative">
      
      {/* HIDDEN FILE INPUT FOR AVATAR */}
      <input
        type="file"
        ref={fileInputRef}
        accept="image/*"
        className="hidden"
        onChange={handleAvatarSelect}
      />

      <h1 className="mb-8 text-[20px] font-semibold text-zinc-900 dark:text-zinc-100 tracking-tight transition-colors">
        Account
      </h1>

      {/* --- PROFILE INFORMATION SECTION --- */}
      <div className="flex flex-col gap-6 mb-12">
        {/* Avatar Row */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="h-[42px] w-[42px] shrink-0 overflow-hidden rounded-full border border-zinc-200 dark:border-white/10 bg-zinc-100 dark:bg-[#2A2A2A]">
              <img src={localImage} alt="Profile" className="h-full w-full object-cover" />
            </div>
            <div className="flex flex-col">
              <span className="text-[14px] font-medium text-zinc-900 dark:text-zinc-100 uppercase tracking-wide transition-colors">
                {localName}
              </span>
              <span className="text-[13px] text-zinc-500 dark:text-zinc-400 transition-colors">
                {localHandle}
              </span>
            </div>
          </div>
          <button onClick={() => fileInputRef.current?.click()} className={ghostButtonClass}>
            Change avatar
          </button>
        </div>

        {/* Full Name Row */}
        <div className="flex items-center justify-between">
          <div className="flex flex-col">
            <span className="text-[14px] font-medium text-zinc-900 dark:text-zinc-100 transition-colors">
              Full Name
            </span>
            <span className="text-[13px] text-zinc-500 dark:text-zinc-400 uppercase transition-colors">
              {localName}
            </span>
          </div>
          <button
            onClick={() => setEditModal({ type: "name", value: localName })}
            className={ghostButtonClass}
          >
            Change full name
          </button>
        </div>

        {/* Username Row */}
        <div className="flex items-center justify-between">
          <div className="flex flex-col">
            <span className="text-[14px] font-medium text-zinc-900 dark:text-zinc-100 transition-colors">
              Username
            </span>
            <span className="text-[13px] text-zinc-500 dark:text-zinc-400 transition-colors">
              {localHandle}
            </span>
          </div>
          <button
            onClick={() => setEditModal({ type: "username", value: localHandle })}
            className={ghostButtonClass}
          >
            Change username
          </button>
        </div>

        {/* Email Row */}
        <div className="flex items-center justify-between">
          <div className="flex flex-col">
            <span className="text-[14px] font-medium text-zinc-900 dark:text-zinc-100 transition-colors">
              Email
            </span>
            <span className="text-[13px] text-zinc-500 dark:text-zinc-400 transition-colors">
              {localEmail}
            </span>
          </div>
        </div>
      </div>

      {/* --- SUBSCRIPTION SECTION --- */}
      <h2 className="mb-6 text-[18px] font-semibold text-zinc-900 dark:text-zinc-100 tracking-tight transition-colors">
        Your Subscription
      </h2>
      <div className="flex items-start md:items-center justify-between mb-12 flex-col md:flex-row gap-4 md:gap-0">
        <div className="flex flex-col gap-1">
          <div className="text-[14px] font-medium text-zinc-900 dark:text-zinc-100 flex items-center gap-2 transition-colors">
            Unlock the most powerful decision engine with Three AI
            <span className="text-[10px] font-bold uppercase tracking-wider text-purple-600 bg-purple-50 border-purple-200 dark:text-purple-400 dark:bg-purple-400/10 border dark:border-purple-400/20 px-1.5 py-0.5 rounded-md transition-colors">
              MVP
            </span>
          </div>
          <div className="text-[13px] text-zinc-500 dark:text-zinc-400 transition-colors">
            Get the most out of Three AI with the MVP Plan.{" "}
            <button
              onClick={() => router.push("/dashin/upgrade")}
              className="text-purple-600 hover:text-purple-700 dark:text-purple-400 dark:hover:text-purple-300 transition-colors"
            >
              Learn more
            </button>
          </div>
        </div>
        <button
          onClick={() => router.push("/dashin/upgrade")}
          className="shrink-0 rounded-full bg-zinc-900 text-white dark:bg-zinc-100 px-5 py-2 text-[13px] font-semibold dark:text-zinc-900 transition-all hover:bg-zinc-800 dark:hover:bg-white active:scale-95 shadow-sm"
        >
          Upgrade plan
        </button>
      </div>

      {/* --- SYSTEM SECTION --- */}
      <h2 className="mb-6 text-[18px] font-semibold text-zinc-900 dark:text-zinc-100 tracking-tight transition-colors">
        System
      </h2>
      <div className="flex flex-col gap-6 pb-20">
        <div className="flex items-center justify-between">
          <div className="text-[14px] font-medium text-zinc-900 dark:text-zinc-100 transition-colors">
            Support
          </div>
          <button onClick={() => router.push("/help")} className={ghostButtonClass}>
            Contact
          </button>
        </div>

        <div className="flex items-center justify-between">
          <div className="text-[14px] font-medium text-zinc-900 dark:text-zinc-100 transition-colors">
            You are signed in as {localHandle}
          </div>
          <button onClick={() => signOut({ callbackUrl: "/signin" })} className={ghostButtonClass}>
            Sign out
          </button>
        </div>

        <div className="flex items-center justify-between mt-2">
          <div className="flex flex-col">
            <span className="text-[14px] font-medium text-zinc-900 dark:text-zinc-100 transition-colors">
              Delete account
            </span>
            <span className="text-[13px] text-zinc-500 dark:text-zinc-400 transition-colors">
              Permanently delete your account and data
            </span>
          </div>
          <button
            className={clsx(
              ghostButtonClass,
              "hover:text-rose-600 hover:bg-rose-50 dark:hover:text-rose-400 dark:hover:bg-rose-500/10 border-rose-100 dark:border-rose-500/20"
            )}
          >
            Learn more
          </button>
        </div>
      </div>

      {/* --- EDIT MODAL OVERLAY --- */}
      {editModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-zinc-900/40 dark:bg-black/60 backdrop-blur-sm p-4 animate-in fade-in duration-200">
          <div className="w-full max-w-md rounded-2xl bg-white dark:bg-[#121212] border border-zinc-200 dark:border-white/10 shadow-2xl p-6 relative animate-in zoom-in-95 duration-200">
            <button
              onClick={() => setEditModal(null)}
              className="absolute top-4 right-4 p-1 rounded-md text-zinc-400 hover:bg-zinc-100 dark:hover:bg-white/5 transition-colors"
            >
              <X size={18} />
            </button>
            
            <h3 className="text-[18px] font-semibold text-zinc-900 dark:text-white mb-1">
              Change {editModal.type === "name" ? "Full Name" : "Username"}
            </h3>
            <p className="text-[13px] text-zinc-500 dark:text-zinc-400 mb-6">
              Enter your new {editModal.type === "name" ? "name" : "username"} below.
            </p>

            <input
              type="text"
              autoFocus
              value={editModal.value}
              onChange={(e) => setEditModal({ ...editModal, value: e.target.value })}
              onKeyDown={(e) => e.key === "Enter" && handleSaveEdit()}
              className="w-full px-4 py-2.5 rounded-xl border border-zinc-300 dark:border-white/10 bg-transparent text-zinc-900 dark:text-white focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500 transition-all mb-6"
            />

            <div className="flex justify-end gap-3">
              <button
                onClick={() => setEditModal(null)}
                className="px-4 py-2 rounded-xl text-[13px] font-semibold text-zinc-600 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-white/5 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleSaveEdit}
                disabled={isUpdating || !editModal.value.trim()}
                className="flex items-center gap-2 px-5 py-2 rounded-xl bg-zinc-900 dark:bg-white text-white dark:text-black text-[13px] font-semibold hover:bg-zinc-800 dark:hover:bg-zinc-200 transition-all disabled:opacity-50"
              >
                {isUpdating ? <Loader2 size={14} className="animate-spin" /> : null}
                Save changes
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}