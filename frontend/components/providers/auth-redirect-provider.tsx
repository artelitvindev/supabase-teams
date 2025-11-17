"use client";
import { useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

interface AuthCallbackProviderProps {
  children: React.ReactNode;
}

export const AuthCallbackProvider = ({
  children,
}: AuthCallbackProviderProps) => {
  const router = useRouter();
  const supabase = createClient();

  const handleAuthCallback = useCallback(async () => {
    if (typeof window === "undefined") return;

    const currentUrl = new URL(window.location.href);
    const hasCode = currentUrl.searchParams.has("code");

    // Only handle OAuth callback cleanup
    if (hasCode) {
      await new Promise((resolve) => setTimeout(resolve, 100));

      const {
        data: { session },
      } = await supabase.auth.getSession();

      if (session) {
        // Clean up the URL and redirect to protected area
        router.replace("/protected");
      } else {
        console.error("Supabase failed to establish session after callback.");
        // Clean up the code parameter even if session failed
        currentUrl.searchParams.delete("code");
        router.replace(currentUrl.pathname + currentUrl.search);
      }
    }
  }, [router, supabase]);

  useEffect(() => {
    handleAuthCallback();
  }, [handleAuthCallback]);

  return <>{children}</>;
};
