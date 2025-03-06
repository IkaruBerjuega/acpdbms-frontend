"use client";

import { LogOut } from "lucide-react";
import { IoSettings } from "react-icons/io5";
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
import { IoIosNotificationsOutline } from "react-icons/io";

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
            <DropdownMenuLabel>Notifications</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem>No Notifications</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarMenuItem>
    </SidebarMenu>
  );
}
