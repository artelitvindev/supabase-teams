import { SupabaseClient } from "npm:@supabase/supabase-js@2.81.1";
import { ProfilesListReponse } from "./profiles.dto.ts";
import { Profile } from "../_shared/types.ts";

export class ProfilesService {
  constructor(
    private readonly supabase: SupabaseClient,
    private readonly supabaseAdmin: SupabaseClient
  ) {}

  async getProfile(userId: string): Promise<Profile> {
    const { data, error } = await this.supabase
      .from("profiles")
      .select("*")
      .eq("id", userId)
      .single();

    if (error) {
      console.log(error);
      throw error;
    }
    return data;
  }

  async getAllProfilesInTeam(teamId: string): Promise<ProfilesListReponse[]> {
    const { data, error } = await this.supabase
      .from("profiles")
      .select("*")
      .eq("team_id", teamId);

    if (error) {
      throw error;
    }
    return data;
  }

  async updateProfile(req: Request, userId: string): Promise<Profile> {
    const formData = await req.formData();

    const usernameEntry = formData.get("username");
    const username =
      typeof usernameEntry === "string" ? usernameEntry.trim() : null;

    if (!username) {
      throw new Error("Username is required");
    }

    const avatarEntry = formData.get("avatar");
    const avatar = avatarEntry instanceof File ? avatarEntry : null;

    const avatarUrl = avatar ? await this.uploadAvatar(avatar, userId) : null;

    const { data, error: updateError } = await this.supabaseAdmin
      .from("profiles")
      .update({
        name: username,
        ...(avatarUrl && { avatar_url: avatarUrl }),
        profile_completed: true,
      })
      .eq("id", userId)
      .select("*")
      .single();

    if (updateError) {
      throw updateError;
    }

    return data;
  }

  private async uploadAvatar(avatar: File, userId: string): Promise<string> {
    const fileExt = avatar.name.split(".").pop() || "png";
    const fileName = `avatars/${userId}.${fileExt}`;

    const { error: uploadError } = await this.supabase.storage
      .from("avatars")
      .upload(fileName, avatar, {
        upsert: true,
        contentType: avatar.type,
      });

    if (uploadError) {
      throw uploadError;
    }

    const envUrl = Deno.env.get("SUPABASE_URL") ?? "http://127.0.0.1:54321";

    const publicHost = envUrl.replace(
      "http://kong:8000",
      "http://127.0.0.1:54321"
    );

    const publicUrl = `${publicHost}/storage/v1/object/public/avatars/${fileName}`;

    return publicUrl;
  }
}
