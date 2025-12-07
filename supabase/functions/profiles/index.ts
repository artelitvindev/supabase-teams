import { corsHeaders } from "../_shared/cors.ts";
import {
  createSupabaseClient,
  createSupabaseAdmin,
} from "../_shared/supabaseClient.ts";

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const supabase = createSupabaseClient(req);
    const supabaseAdmin = createSupabaseAdmin();

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      throw new Error("Unauthorized");
    }

    // Parse FormData instead of JSON
    const formData = await req.formData();
    const username = formData.get("username") as string;
    const avatar = formData.get("avatar") as File | null;

    if (!username) {
      throw new Error("Username is required");
    }

    let avatarUrl: string | null = null;

    // Handle avatar upload if provided
    if (avatar) {
      // Extract file extension from the file
      const fileExt = avatar.name.split(".").pop() || "png";
      const fileName = `avatars/${user.id}.${fileExt}`;

      // Upload the file
      const { error: uploadError } = await supabaseAdmin.storage
        .from("avatars")
        .upload(fileName, avatar, {
          upsert: true,
          contentType: avatar.type,
        });

      if (uploadError) throw uploadError;

      const {
        data: { publicUrl },
      } = supabaseAdmin.storage.from("avatars").getPublicUrl(fileName);

      avatarUrl = publicUrl;
    }

    // Update profile
    const { error: updateError } = await supabaseAdmin
      .from("profiles")
      .update({
        name: username,
        ...(avatarUrl && { avatar_url: avatarUrl }),
        profile_completed: true,
      })
      .eq("id", user.id);

    if (updateError) throw updateError;

    return new Response(
      JSON.stringify({
        message: "Profile updated successfully",
        profile: { username, avatar_url: avatarUrl },
      }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  } catch (error) {
    return new Response(
      JSON.stringify({
        error: error instanceof Error ? error.message : String(error),
      }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 400,
      }
    );
  }
});
