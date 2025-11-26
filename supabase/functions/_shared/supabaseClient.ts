import { createClient } from "npm:@supabase/supabase-js@2.81.1";

export const createSupabaseClient = (req: Request) => {
  return createClient(
    Deno.env.get("SUPABASE_URL") ?? "",
    Deno.env.get("SUPABASE_ANON_KEY") ?? "",
    {
      global: {
        headers: { Authorization: req.headers.get("Authorization")! },
      },
    }
  );
};
