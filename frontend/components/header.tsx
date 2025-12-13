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
import { Button } from "./ui/button";
import Link from "next/link";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import useProfileStore from "@/zustand/useProfileStore";
import { HeaderProfileSkeleton } from "@/components/skeletons/header-profile-skeleton";

function Header() {
  const { profile, isLoading } = useProfileStore();
  const router = useRouter();

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
          {isLoading ? (
            <HeaderProfileSkeleton />
          ) : (
            <>
              {profile ? (
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
