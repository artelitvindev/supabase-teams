import { corsHeaders } from "../_shared/cors.ts";
import { createSupabaseClient } from "../_shared/supabaseClient.ts";
import { toSlug } from "../_shared/utils.ts";

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    // 2. Initialize Client (DRY)
    const supabase = createSupabaseClient(req);

    // 3. Auth Check
    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser();
    if (userError || !user) throw new Error("Unauthorized");

    // --- Business Logic Start ---
    const { name, slug: providedSlug } = await req.json();
    if (!name) throw new Error("Team name is required");

    let finalSlug = providedSlug ? toSlug(providedSlug) : toSlug(name);

    if (!finalSlug || finalSlug.length < 3) {
      // Фолбек: якщо слаг не вдався, генеруємо рандомний
      finalSlug = `team-${Math.random().toString(36).substring(2, 8)}`;
    }

    // Check existing team
    const { data: profile } = await supabase
      .from("profiles")
      .select("team_id")
      .eq("id", user.id)
      .single();

    if (profile?.team_id) throw new Error("User already belongs to a team");

    const inviteCode = Math.random().toString(36).substring(2, 8).toUpperCase();

    const { data: team, error: teamError } = await supabase
      .from("teams")
      .insert({ name, slug: finalSlug, invite_code: inviteCode })
      .select()
      .single();

    if (teamError) {
      if (teamError.code === "23505" && teamError.message.includes("slug")) {
        throw new Error(
          `Team link "${finalSlug}" is already taken. Please choose another one.`
        );
      }
      throw teamError;
    }

    const { error: updateError } = await supabase
      .from("profiles")
      .update({ team_id: team.id })
      .eq("id", user.id);

    if (updateError) throw updateError;
    // --- Business Logic End ---

    return new Response(
      JSON.stringify({ team, message: "Team created successfully" }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 200,
      }
    );
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : "An unknown error occurred";
    return new Response(JSON.stringify({ error: errorMessage }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 400,
    });
  }
});
