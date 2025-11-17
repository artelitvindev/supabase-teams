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
import { JwtPayload } from "@supabase/supabase-js";
import { useRouter } from "next/navigation";
import React from "react";
import { Button } from "./ui/button";
import Link from "next/link";

function Header() {
  const [isLoading, setIsLoading] = React.useState(true);
  const supabase = createClient();
  const router = useRouter();
  const [claims, setClaims] = React.useState<JwtPayload | null>(null);

  const handleFetchClaims = React.useCallback(async () => {
    try {
      const { data } = await supabase.auth.getClaims();
      if (data?.claims) {
        setClaims(data.claims);
      } else {
        setClaims(null);
      }
    } catch (error) {
      console.error("Error fetching claims:", error);
      setClaims(null);
    }
  }, [supabase.auth]);

  React.useEffect(() => {
    handleFetchClaims().finally(() => {
      setIsLoading(false);
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event) => {
      if (event === "SIGNED_IN" || event === "TOKEN_REFRESHED") {
        await handleFetchClaims();
      } else if (event === "SIGNED_OUT") {
        setClaims(null);
      }
    });

    return () => subscription.unsubscribe();
  }, [handleFetchClaims, supabase.auth]);

  const onLogout = async () => {
    await supabase.auth.signOut();
    router.push("/auth/login");
  };

  return (
    <header className="fixed top-0 left-0 bg-white shadow h-16 w-full px-4">
      <div className="mx-auto max-w-[1200px] flex justify-between items-center h-full">
        <p>Supabase Teams</p>
        <div>
          {!isLoading && (
            <>
              {claims ? (
                <DropdownMenu>
                  <DropdownMenuTrigger className="cursor-pointer">
                    {claims.email}
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
