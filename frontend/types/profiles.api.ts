export interface Team {
  id: string;
  name: string;
  slug: string;
  invite_code: string;
  created_at: string;
}

export interface Profile {
  id: string;
  name: string;
  avatar_url: string;
  team_id: string;
}

export interface ProfileWithTeamResponse extends Profile {
  team: Team;
}

export type ProfilesListReponse = Profile[];
