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
import { useLogin, useLogout } from "@/hooks/api-calls/use-login";
import { useToken } from "@/hooks/api-calls/use-token";
import { useEffect, useState } from "react";
import { LoginResponseInterface } from "@/lib/definitions";
import { useRouter } from "next/navigation";

export function NavUser({
  role = "admin",
}: {
  role: "admin" | "employee" | "client";
}) {
  const { isMobile } = useSidebar();

  const { mutate } = useLogout();

  const [userDetails, setUserDetails] = useState<
    LoginResponseInterface["user"] | null
  >();

  const { getToken, deleteToken } = useToken();

  useEffect(() => {
    const fetchData = async () => {
      const data = await getToken();
      setUserDetails(data?.user);
    };
    fetchData();
  }, []);

  const router = useRouter();

  const handleLogout = () => {
    mutate(null, {
      onSuccess: async (response: { message?: string }) => {
        await deleteToken();
        router.push("/login");
      },
    });
  };

  const name = role === "admin" ? "Admin" : userDetails?.name;
  const profileSrc =
    userDetails?.profile_picture ||
    "/system-component-images/avatar-placeholder.webp";
  const email = userDetails?.email;

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
                <AvatarFallback className="rounded-full">CN</AvatarFallback>
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
                  <AvatarFallback className="rounded-full">CN</AvatarFallback>
                </Avatar>
                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate font-semibold">{name}</span>
                  <span className="truncate text-xs">{email}</span>
                </div>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuGroup>
              <Link href="/admin/settings/account-settings">
                <DropdownMenuItem>
                  <IoSettings />
                  Account Settings
                </DropdownMenuItem>
              </Link>
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
