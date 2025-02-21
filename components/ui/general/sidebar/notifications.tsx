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
import Image from "next/image";
import { IoIosNotifications, IoIosNotificationsOutline } from "react-icons/io";

export function Notifications() {
  const { isMobile } = useSidebar();

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <SidebarMenuButton
              asChild
              tooltip={"Notifications"}
              size="lg"
              className="[&>svg]:size-6 group-data-[collapsible=icon]:[&>svg]:ml-1"
            >
              {/* <Avatar className="h-8 w-8 rounded-lg bg-transparent">
                <AvatarImage
                  src={"/sidebar/notifications.svg"}
                  alt={"Notification Icon"}
                  className="bg-transparent"
                />
                <AvatarFallback className="rounded-lg">CN</AvatarFallback>
              </Avatar> */}
              <div className={`flex rounded-md `}>
                <IoIosNotificationsOutline />
                <span>Notifications</span>
              </div>
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
                {/* <Avatar className="h-8 w-8 rounded-lg">
                  <AvatarImage src={user.avatar} alt={user.name} />
                  <AvatarFallback className="rounded-lg">CN</AvatarFallback>
                </Avatar> */}
                {/* <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate font-semibold">{user.name}</span>
                  <span className="truncate text-xs">{user.email}</span>
                </div>   */}
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
            <Link href="/login">
              <DropdownMenuItem>
                <LogOut />
                Log out
              </DropdownMenuItem>
            </Link>
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarMenuItem>
    </SidebarMenu>
  );
}
