import { corsHeaders } from "../_shared/cors.ts";
import {
  createSupabaseClient,
  createSupabaseAdmin,
} from "../_shared/supabaseClient.ts";

interface RequestBody {
  username: string;
  avatar?: File | null;
}

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

    const { username, avatar }: RequestBody = await req.json();

    if (!username) {
      throw new Error("Username is required");
    }

    let avatarUrl: string | null = null;

    // Handle avatar upload if provided
    if (avatar) {
      // Convert base64 or blob to file
      const fileExt = "png"; // You can extract from avatar data if needed
      const fileName = `avatars/${user.id}.${fileExt}`;

      // Assuming avatar is base64 string or blob
      const { error: uploadError } = await supabaseAdmin.storage
        .from("avatars")
        .upload(fileName, avatar, {
          upsert: true,
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
