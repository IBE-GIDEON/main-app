"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { isOnboardingComplete } from "@/services/chatApi";

/**
 * Drop this hook into your dashboard layout or page.
 * If the user hasn't completed onboarding, they get redirected.
 *
 * Usage:
 *   import { useOnboardingGuard } from "@/hooks/useOnboardingGuard";
 *   export default function DashboardPage() {
 *     useOnboardingGuard();
 *     ...
 *   }
 */
export function useOnboarding() {
  const router = useRouter();

  useEffect(() => {
    if (!isOnboardingComplete()) {
      router.replace("/onboarding");
    }
  }, [router]);
}