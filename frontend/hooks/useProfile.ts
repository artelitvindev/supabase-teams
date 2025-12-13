import { createClient } from "@/lib/supabase/client";
import { toastSupabaseError } from "@/utils/toastSupabaseError";
import useProfileStore from "@/zustand/useProfileStore";
import React, { useEffect } from "react";

interface UseProfileOptions {
  skip?: boolean;
}

export function useProfile(options: UseProfileOptions = {}) {
  const { skip = false } = options;
  const { setProfile, setIsLoading, isLoading } = useProfileStore();
  const [errorStatus, setErrorStatus] = React.useState<number | null>(null);

  useEffect(() => {
    // Skip fetching profile on public routes
    if (skip) {
      setIsLoading(false);
      return;
    }

    async function fetchUser() {
      setIsLoading(true);
      setErrorStatus(null); // Reset error status on each fetch

      const supabase = createClient();

      const { data, error } = await supabase.functions.invoke("profiles", {
        method: "GET",
      });

      if (error) {
        setIsLoading(false);

        const status = error?.context?.status || error?.status;
        setErrorStatus(status);

        // Only show toast for non-auth errors
        if (status !== 401 && status !== 403) {
          toastSupabaseError(error);
        }
        return;
      }

      setProfile(data);
      setIsLoading(false);
      setErrorStatus(null); // Clear any previous errors
    }

    fetchUser();
  }, [setIsLoading, setProfile, skip]);

  const isAuthError = errorStatus === 401 || errorStatus === 403;
  const isError = errorStatus !== null;

  return { isLoading, isError, isAuthError, errorStatus };
}
