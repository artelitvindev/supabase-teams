"use client";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";
import React from "react";
import { Button } from "./ui/button";
import Link from "next/link";
import { ProfileWithTeamResponse } from "@/types/profiles.api";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";

function Header() {
  const [isLoading, setIsLoading] = React.useState(true);
  const [profile, setProfile] = React.useState<ProfileWithTeamResponse | null>(
    null
  );
  const router = useRouter();

  React.useEffect(() => {
    async function fetchUser() {
      const supabase = createClient();

      const { data } = await supabase.functions.invoke("profiles", {
        method: "GET",
      });

      setProfile(data);
      setIsLoading(false);
    }
    fetchUser();
  }, []);

  const onLogout = async () => {
    const supabase = createClient();

    await supabase.auth.signOut();
    router.push("/auth/login");
  };

  return (
    <header className="fixed top-0 left-0 bg-white shadow h-16 w-full px-8">
      <div className="flex justify-between items-center h-full">
        <p>Supabase Teams</p>
        <div>
          {!isLoading && (
            <>
              {profile && !isLoading ? (
                <DropdownMenu>
                  <DropdownMenuTrigger className="cursor-pointer focus:outline-0">
                    <div className="flex gap-2 items-center">
                      <Avatar className="size-10">
                        <AvatarImage
                          src={profile.avatar_url}
                          alt={profile.name}
                        />
                        <AvatarFallback>{profile.name[0]}</AvatarFallback>
                      </Avatar>
                      <span>{profile.name}</span>
                    </div>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent>
                    <DropdownMenuLabel>My Account</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem
                      onClick={onLogout}
                      className="text-red-500 hover:text-red-500!">
                      Logout
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              ) : (
                <div className="flex gap-3">
                  <Button asChild>
                    <Link href="/auth/login">Login</Link>
                  </Button>
                  <Button asChild variant="ghost">
                    <Link href="/auth/sign-up">Create account</Link>
                  </Button>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </header>
  );
}

export default Header;
