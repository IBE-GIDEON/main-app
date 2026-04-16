"use client";

import React, { createContext, useContext, useState, useSyncExternalStore } from "react";

interface SettingsState {
  autosuggest: boolean;
  aiDataRetention: boolean;
  emailUpdates: boolean;
  appDecisions: boolean;
  verdictEmailEnabled: boolean;
  verdictEmailAddress: string;
}

interface SettingsContextType extends SettingsState {
  updateSetting: <K extends keyof SettingsState>(key: K, value: SettingsState[K]) => void;
  isLoaded: boolean; // Tells the UI when it's safe to render
}

const defaultSettings: SettingsState = {
  autosuggest: true,
  aiDataRetention: true,
  emailUpdates: true,
  appDecisions: true,
  verdictEmailEnabled: false,
  verdictEmailAddress: "",
};

const SettingsContext = createContext<SettingsContextType | undefined>(undefined);

export function SettingsProvider({ children }: { children: React.ReactNode }) {
  const [settings, setSettings] = useState<SettingsState>(() => {
    if (typeof window === "undefined") return defaultSettings;

    const saved = localStorage.getItem("three_ai_settings");
    if (!saved) return defaultSettings;

    try {
      const parsed = JSON.parse(saved);
      delete parsed.theme;
      return { ...defaultSettings, ...parsed };
    } catch {
      console.error("Failed to parse settings");
      return defaultSettings;
    }
  });
  const isLoaded = useSyncExternalStore(
    () => () => undefined,
    () => true,
    () => false
  );

  // THE FIX 2: Only save to local storage when the user ACTUALLY clicks a button
  const updateSetting = <K extends keyof SettingsState>(key: K, value: SettingsState[K]) => {
    setSettings((prev) => {
      const newSettings = { ...prev, [key]: value };
      localStorage.setItem("three_ai_settings", JSON.stringify(newSettings));
      return newSettings;
    });
  };

  return (
    <SettingsContext.Provider value={{ ...settings, updateSetting, isLoaded }}>
      {children}
    </SettingsContext.Provider>
  );
}

export function useSettings() {
  const context = useContext(SettingsContext);
  if (!context) throw new Error("useSettings must be used within a SettingsProvider");
  return context;
}
