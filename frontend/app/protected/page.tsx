import { LogoutButton } from "@/components/auth/logout-button";
import { createClient } from "@/lib/supabase/server";

export default async function ProtectedPage() {
  const supabase = await createClient();

  const { data } = await supabase.auth.getClaims();

  return (
    <div className="flex h-svh w-full items-center justify-center gap-2">
      <p>
        Hello <span>{data?.claims?.email || "User"}</span>
      </p>
      <LogoutButton />
    </div>
  );
}
