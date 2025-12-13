import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";
import React from "react";

export function useLogout() {
  const router = useRouter();

  const logout = React.useCallback(async () => {
    const supabase = createClient();

    await supabase.auth.signOut();
    router.push("/auth/login");
  }, [router]);

  return logout;
}
