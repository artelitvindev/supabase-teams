import { useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

export const useAuthCallbackCleanup = (redirectPath: string = "/") => {
  const router = useRouter();
  const supabase = createClient();

  const cleanupUrlAndRedirect = useCallback(async () => {
    if (typeof window === "undefined") return;

    const currentUrl = new URL(window.location.href);
    const hasCode = currentUrl.searchParams.has("code");

    if (!hasCode) return;

    await new Promise((resolve) => setTimeout(resolve, 100));

    const {
      data: { session },
    } = await supabase.auth.getSession();

    if (session) {
      currentUrl.searchParams.delete("code");

      router.replace(redirectPath);
    } else {
      console.error("Supabase failed to establish session after callback.");
      router.replace(currentUrl.pathname);
    }
  }, [router, supabase, redirectPath]);

  useEffect(() => {
    cleanupUrlAndRedirect();
  }, [cleanupUrlAndRedirect]);
};
