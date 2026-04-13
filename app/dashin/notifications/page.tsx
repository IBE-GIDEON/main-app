"use client";

import { useState } from "react";
import clsx from "clsx";
import { useSettings } from "@/contexts/SettingsContext"; // Make sure path matches your project!

// Reusable Toggle Component for the clean UI
function Toggle({ enabled, onChange, disabled = false }: { enabled: boolean; onChange: () => void; disabled?: boolean }) {
  return (
    <button
      onClick={disabled ? undefined : onChange}
      disabled={disabled}
      className={clsx(
        "relative inline-flex h-5 w-9 shrink-0 items-center rounded-full transition-colors duration-200 ease-in-out focus:outline-none",
        enabled ? "bg-purple-500" : "bg-zinc-300 dark:bg-zinc-700",
        disabled && "opacity-50 cursor-not-allowed"
      )}
    >
      <span
        className={clsx(
          "inline-block h-3.5 w-3.5 transform rounded-full bg-white transition duration-200 ease-in-out shadow-sm",
          enabled ? "translate-x-4" : "translate-x-1"
        )}
      />
    </button>
  );
}

export default function NotificationsPage() {
  // Grab real global settings for the core features
  const { emailUpdates, appDecisions, updateSetting, isLoaded } = useSettings();
  
  // Local state for marketing (usually handled via external mailing list API anyway)
  const [emailMarketing, setEmailMarketing] = useState(false);

  // Prevent hydration flash
  if (!isLoaded) return null;

  return (
    <div className="animate-in fade-in duration-500 w-full max-w-3xl pb-20">
      
      {/* ==================== EMAIL NOTIFICATIONS ==================== */}
      <h1 className="mb-6 text-[18px] font-semibold text-zinc-900 dark:text-zinc-100 tracking-tight transition-colors">
        Email Notifications
      </h1>
      
      <div className="flex flex-col gap-8 mb-12 border-b border-zinc-200 dark:border-white/5 pb-10 transition-colors">
        
        {/* Row 1 */}
        <div className="flex items-center justify-between gap-4">
          <div className="flex flex-col max-w-[85%]">
            <span className="text-[14px] font-medium text-zinc-900 dark:text-zinc-100 transition-colors">Product updates</span>
            <span className="mt-0.5 text-[13px] text-zinc-500 dark:text-zinc-400 leading-relaxed transition-colors">
              Receive emails about new features, model upgrades, and Three AI platform improvements.
            </span>
          </div>
          <Toggle 
            enabled={emailUpdates} 
            onChange={() => updateSetting("emailUpdates", !emailUpdates)} 
          />
        </div>

        {/* Row 2 */}
        <div className="flex items-center justify-between gap-4">
          <div className="flex flex-col max-w-[85%]">
            <span className="text-[14px] font-medium text-zinc-900 dark:text-zinc-100 transition-colors">Tips & Marketing</span>
            <span className="mt-0.5 text-[13px] text-zinc-500 dark:text-zinc-400 leading-relaxed transition-colors">
              Receive promotional offers, decision-making frameworks, and workflow tips.
            </span>
          </div>
          <Toggle 
            enabled={emailMarketing} 
            onChange={() => setEmailMarketing(!emailMarketing)} 
          />
        </div>
      </div>

      {/* ==================== IN-APP NOTIFICATIONS ==================== */}
      <h1 className="mb-6 text-[18px] font-semibold text-zinc-900 dark:text-zinc-100 tracking-tight transition-colors">
        In-App Alerts
      </h1>
      
      <div className="flex flex-col gap-8">
        
        {/* Row 1 */}
        <div className="flex items-center justify-between gap-4">
          <div className="flex flex-col max-w-[85%]">
            <span className="text-[14px] font-medium text-zinc-900 dark:text-zinc-100 transition-colors">Decision completion</span>
            <span className="mt-0.5 text-[13px] text-zinc-500 dark:text-zinc-400 leading-relaxed transition-colors">
              Get an alert when a complex recursive refinement process finishes generating outcomes.
            </span>
          </div>
          <Toggle 
            enabled={appDecisions} 
            onChange={() => updateSetting("appDecisions", !appDecisions)} 
          />
        </div>

        {/* Row 2 */}
        <div className="flex items-center justify-between gap-4">
          <div className="flex flex-col max-w-[85%]">
            <span className="flex items-center gap-2 text-[14px] font-medium text-zinc-900 dark:text-zinc-100 transition-colors">
              Security alerts
              <span className="text-[9px] font-bold uppercase tracking-widest text-zinc-400 dark:text-zinc-500 border border-zinc-200 dark:border-white/10 px-1.5 py-0.5 rounded-md">Required</span>
            </span>
            <span className="mt-0.5 text-[13px] text-zinc-500 dark:text-zinc-400 leading-relaxed transition-colors">
              Get notified about new logins, password changes, and API key generation.
            </span>
          </div>
          {/* Security alerts are forced ON for enterprise apps */}
          <Toggle 
            enabled={true} 
            onChange={() => {}} 
            disabled={true} 
          />
        </div>
      </div>

    </div>
  );
}