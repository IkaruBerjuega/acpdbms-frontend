"use client";

import { ChevronsUpDown, LogOut } from "lucide-react";
import { IoSettings } from "react-icons/io5";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import Link from "next/link";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";
import { useLogout } from "@/hooks/general/use-login";
import { useRole, useToken } from "@/hooks/general/use-token";

import { useRouter } from "next/navigation";
import { useUserBasicInfo } from "@/hooks/api-calls/admin/use-account";
import { getInitialsFallback } from "@/lib/utils";
import { useProjectSelectStore } from "@/hooks/states/create-store";

export function NavUser({
  role = "admin",
}: {
  role: "admin" | "employee" | "client";
}) {
  const { isMobile } = useSidebar();

  const { mutate } = useLogout();

  const { deleteToken } = useToken();
  const { deleteRole } = useRole();

  const router = useRouter();

  const { data } = useUserBasicInfo();
  const { resetData } = useProjectSelectStore();

  const name = data?.full_name || "Admin";
  const profileSrc = data?.profile_picture_url;
  const email = data?.email;
  const initialsAsProfileSrcFallback = getInitialsFallback(name);

  const settingsMap = {
    admin: { href: "/admin/settings", label: "Admin Settings" },
    employee: { href: "/employee/settings", label: "Account Settings" },
    client: { href: "/client/settings", label: "Account Settings" },
  };

  const handleLogout = () => {
    mutate(null, {
      onSuccess: async () => {
        await deleteToken();
        await deleteRole();

        router.push("/login");
        resetData();
        localStorage.removeItem("projectSelected");
      },
    });
  };

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <SidebarMenuButton
              size="lg"
              className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
            >
              <Avatar className="h-8 w-8 rounded-full">
                <AvatarImage src={profileSrc} alt={name} />
                <AvatarFallback className="rounded-full text-black-primary">
                  {initialsAsProfileSrcFallback}
                </AvatarFallback>
              </Avatar>
              <div className="grid flex-1 text-left text-sm leading-tight">
                <span className="truncate font-semibold">{name}</span>
                <span className="truncate text-xs">{email}</span>
              </div>
              <ChevronsUpDown className="ml-auto size-4" />
            </SidebarMenuButton>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            className="w-[--radix-dropdown-menu-trigger-width] min-w-56 rounded-lg"
            side={isMobile ? "bottom" : "right"}
            align="end"
            sideOffset={4}
          >
            <DropdownMenuLabel className="p-0 font-normal">
              <div className="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
                <Avatar className="h-8 w-8 rounded-full">
                  <AvatarImage src={profileSrc} alt={name} />
                  <AvatarFallback className="rounded-full">
                    {initialsAsProfileSrcFallback}
                  </AvatarFallback>
                </Avatar>
                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate font-semibold">{name}</span>
                  <span className="truncate text-xs">{email}</span>
                </div>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuGroup>
              {settingsMap[role] && (
                <Link href={settingsMap[role].href}>
                  <DropdownMenuItem>
                    <IoSettings />
                    {settingsMap[role].label}
                  </DropdownMenuItem>
                </Link>
              )}
            </DropdownMenuGroup>
            <DropdownMenuItem onClick={handleLogout}>
              <LogOut />
              Log out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarMenuItem>
    </SidebarMenu>
  );
}
