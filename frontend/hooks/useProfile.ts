import { createClient } from "@/lib/supabase/client";
import { ProfileWithTeamResponse } from "@/types/profiles.api";
import { toastSupabaseError } from "@/utils/toastSupabaseError";
import { useEffect, useState } from "react";

export function useProfile() {
  const [isLoading, setIsLoading] = useState(true);
  const [profile, setProfile] = useState<ProfileWithTeamResponse | null>(null);

  useEffect(() => {
    async function fetchUser() {
      const supabase = createClient();

      const { data, error } = await supabase.functions.invoke("profilesf", {
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
  }, []);

  return { profile, isLoading };
}
