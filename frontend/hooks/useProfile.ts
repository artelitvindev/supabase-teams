import { createClient } from "@/lib/supabase/client";
import { toastSupabaseError } from "@/utils/toastSupabaseError";
import useProfileStore from "@/zustand/useProfileStore";
import { useEffect } from "react";

export function useProfile() {
  const { setProfile, setIsLoading } = useProfileStore();

  useEffect(() => {
    async function fetchUser() {
      const supabase = createClient();

      const { data, error } = await supabase.functions.invoke("profiles", {
        method: "GET",
      });

      if (error) {
        setIsLoading(false);
        return toastSupabaseError(error);
      }

      setProfile(data);
      setIsLoading(false);
    }

    fetchUser();
  }, [setIsLoading, setProfile]);
}
