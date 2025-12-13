"use client";

import { ROUTES } from "@/lib/routes";
import { cn } from "@/lib/utils";
import useProfileStore from "@/zustand/useProfileStore";
import { HomeIcon, SettingsIcon, ShoppingBagIcon } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

function Sidebar() {
  const profile = useProfileStore((state) => state.profile);
  const pathname = usePathname();

  console.log(profile?.team_id);

  const navLinkClassName = () =>
    cn(
      "h-12 px-3 flex items-center gap-3 rounded-md text-xl border transition-colors border-transparent hover:bg-gray-200",
      {
        "border-emerald-500 text-emerald-500 hover:bg-emerald-50!":
          pathname === "",
      }
    );

  return (
    <div className="basis-[300px] flex flex-col gap-2 py-6 px-4 bg-gray-50 border-gray-200 border rounded-md min-h-[calc(100vh-90px)]">
      <Link className={navLinkClassName()} href={ROUTES.TEAM("profile")}>
        <HomeIcon className="size-6" /> Home
      </Link>
      <Link
        className={navLinkClassName()}
        href={ROUTES.TEAM_PRODUCTS("profile")}>
        <ShoppingBagIcon className="size-6" /> Products
      </Link>
      <Link className={navLinkClassName()} href={ROUTES.PROFILE("profile")}>
        <SettingsIcon className="size-6" /> Profile
      </Link>
    </div>
  );
}

export default Sidebar;
