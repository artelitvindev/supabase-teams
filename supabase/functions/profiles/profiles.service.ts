import { SupabaseClient } from "npm:@supabase/supabase-js@2.81.1";
import {
  ProfilesListReponse,
  ProfileWithTeamResponse,
} from "./profiles.dto.ts";

export class ProfilesService {
  constructor(
    private readonly supabase: SupabaseClient,
    private readonly supabaseAdmin: SupabaseClient
  ) {}

  async getProfile(userId: string): Promise<ProfileWithTeamResponse> {
    const { data, error } = await this.supabase
      .from("profiles")
      .select(`*, team:team_id (*)`)
      .eq("id", userId)
      .single();

    if (error) {
      throw error;
    }
    return data;
  }

  async getAllProfilesInTeam(teamId: string): Promise<ProfilesListReponse[]> {
    const { data, error } = await this.supabase
      .from("profiles")
      .select("*")
      .eq("team_id", teamId);

    console.log(data, error);

    if (error) {
      throw error;
    }
    return data;
  }

  async updateProfile(
    req: Request,
    userId: string
  ): Promise<ProfileWithTeamResponse> {
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
      .select(`*, team:team_id (*)`)
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

    const {
      data: { publicUrl },
    } = this.supabase.storage.from("avatars").getPublicUrl(fileName);

    return publicUrl;
  }
}
