"use client";

import React, { useState, useEffect } from "react";
import { signIn } from "next-auth/react";
import { Loader2, Sparkles, AlertCircle } from "lucide-react";
import { cn } from "@/lib/utils";
import Image from "next/image";
import { useSearchParams } from "next/navigation";

export default function AuthPage() {
  const searchParams = useSearchParams();
  // Changed default to login for better UX
  const [mode, setMode] = useState<"login" | "signup">("login");
  const [isLoading, setIsLoading] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const errorParam = searchParams.get("error");
    if (errorParam) setError("Authentication failed. Please try again.");
  }, [searchParams]);

  const handleSocialAuth = async (provider: string) => {
    try {
      setIsLoading(provider);
      setError(null);
      await signIn(provider, { 
        callbackUrl: "/dashboard",
        redirect: true 
      });
    } catch (err) {
      setError("An unexpected error occurred.");
      setIsLoading(null);
    }
  };

  return (
    <div className="min-h-screen bg-[#0a0a0a] flex flex-col items-center justify-center p-4 selection:bg-blue-500/30 overflow-hidden relative">
      
      {/* Premium Background Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-blue-600/10 rounded-full blur-[120px] -z-10" />

      {/* Brand Header */}
      <div className="mb-10 flex flex-col items-center gap-4">
        <div className="flex items-center justify-center">
          <Image 
            className="bg-black/100"
            src="/tw.png" 
            alt="Think AI Logo" 
            width={120} // Adjusted for better visibility
            height={40} 
            priority
          />
        </div>
      </div>

      {/* Auth Card */}
      <div className="w-full max-w-[400px] p-10">
        
        {/* Mode Toggle - FIXED LOGIC */}
        <div className="flex bg-black/40 p-1.5 rounded-2xl mb-10 border border-zinc-800/50">
          <button 
            onClick={() => setMode("login")} 
            className={cn("flex-1 py-2.5 text-[10px] font-bold uppercase tracking-[0.2em] rounded-xl transition-all duration-300", 
            mode === "login" ? "bg-zinc-800 text-blue-400 shadow-lg" : "text-zinc-500 hover:text-zinc-300")}
          >
            Login
          </button>
          <button 
            onClick={() => setMode("signup")} 
            className={cn("flex-1 py-2.5 text-[10px] font-bold uppercase tracking-[0.2em] rounded-xl transition-all duration-300", 
            mode === "signup" ? "bg-zinc-800 text-blue-400 shadow-lg" : "text-zinc-500 hover:text-zinc-300")}
          >
            Signup
          </button>
        </div>

        <div className="space-y-8">
          <header className="text-center">
            <h2 className="text-2xl font-medium text-white tracking-tight animate-in fade-in slide-in-from-bottom-2 duration-700">
              {mode === "login" ? "Welcome Back" : "Create Account"}
            </h2>
            <p className="text-zinc-500 text-sm mt-3 leading-relaxed">
              Make faster decisions with Think AI. 
            </p>
          </header>

          {error && (
            <div className="flex items-center gap-2 p-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-xs animate-in zoom-in-95 duration-300">
              <AlertCircle size={14} />
              {error}
            </div>
          )}

          {/* Social Providers */}
          <div className="flex flex-col gap-3">
            <button 
              disabled={!!isLoading}
              onClick={() => handleSocialAuth("google")} 
              className="group flex items-center justify-center gap-3 bg-white text-black font-bold py-4 rounded-2xl hover:bg-zinc-200 transition-all active:scale-[0.98] disabled:opacity-50"
            >
              {isLoading === "google" ? <Loader2 className="animate-spin text-black" size={20} /> : (
                <>
                  <svg className="w-5 h-5" viewBox="0 0 24 24">
                    <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                    <path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                    <path fill="currentColor" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" />
                    <path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                  </svg>
                  Continue with Google
                </>
              )}
            </button>

            <button 
              disabled={!!isLoading}
              onClick={() => handleSocialAuth("apple")} 
              className="group flex items-center justify-center gap-3 bg-zinc-800/50 border border-zinc-700/50 text-white font-bold py-4 rounded-2xl hover:bg-zinc-800 transition-all active:scale-[0.98] disabled:opacity-50"
            >
              {isLoading === "apple" ? <Loader2 className="animate-spin" size={20} /> : (
                <>
                  <svg className="w-5 h-5 mb-1" viewBox="0 0 384 512" fill="currentColor">
                    <path d="M318.7 268.7c-.2-36.7 16.4-64.4 50-84.8-18.8-26.9-47.2-41.7-84.7-44.6-35.5-2.8-74.3 21.8-88.5 21.8-11.4 0-51.1-20.8-82.3-20.1-41.2.9-79.1 24.7-100.2 61.5-42.5 74.2-10.9 184.4 30.1 244.2 20 29 43.6 61.4 75 61 30.2-.5 41.8-18.6 78.3-18.6 36.3 0 46.9 18.6 78.8 17.9 32.7-.8 52.8-29.3 72.8-58.4 23.2-33.8 32.7-66.6 33.1-68.2-.7-.3-64-24.7-64.3-97.7zM286.7 71.7c16.2-19.7 27.2-47.2 24.3-74.7-23.7 1-52.6 15.8-69.6 35.6-15.1 17.7-28.3 45.4-24.7 72.3 26.2 2 53.8-13.5 70-33.2z"/>
                  </svg>
                  Continue with Apple
                </>
              )}
            </button>
          </div>

          <footer className="pt-4 flex flex-col items-center gap-4 border-t border-white/5">
            <div className="flex items-center gap-2 text-[10px] text-zinc-600 font-bold uppercase tracking-[0.25em]">
              <Sparkles size={12} className="text-blue-500" />
              Privacy First Decision Engine
            </div>
          </footer>
        </div>
      </div>
    </div>
  );
}