import { Profile, Team } from "../_shared/types.ts";

export interface UpdateProfileDto {
  name?: string;
  avatar?: File;
}

export interface ProfileWithTeamResponse extends Profile {
  team: Team;
}

export type ProfilesListReponse = Profile[];
