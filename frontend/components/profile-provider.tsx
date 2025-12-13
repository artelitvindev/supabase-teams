"use client";

import { useProfile } from "@/hooks/useProfile";

export function ProfileProvider({ children }: { children: React.ReactNode }) {
  useProfile();

  return <>{children}</>;
}
