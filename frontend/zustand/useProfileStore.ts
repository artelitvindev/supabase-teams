import { create } from "zustand";
import { ProfileWithTeamResponse } from "@/types/profiles.api";

interface ProfileStore {
  profile: ProfileWithTeamResponse | null;
  setProfile: (profileRes: ProfileWithTeamResponse) => void;
  isLoading: boolean;
  setIsLoading: (isLoading: boolean) => void;
}

const useProfileStore = create<ProfileStore>((set) => ({
  profile: null,
  setProfile: (profile) => set({ profile }),
  isLoading: true,
  setIsLoading: (isLoading) => set({ isLoading }),
}));

export default useProfileStore;
