export interface UpdateProfileDto {
  name?: string;
  avatar?: File;
}

export interface ProfileWithTeamResponse {
  id: string;
  name: string;
  avatar_url: string;
  team_id: string;
  team: {
    id: string;
    name: string;
    slug: string;
    invite_code: string;
    created_at: string;
  };
}
