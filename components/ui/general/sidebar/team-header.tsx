"use client";

import * as React from "react";
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import Image from "next/image";

export function TeamHeader({
  info,
}: {
  info: {
    name: string;
    logo: string;
    plan: string;
  };
}) {
  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <SidebarMenuButton
          size="lg"
          className="bg-sidebar-accent text-sidebar-accent-foreground pointer-events-none"
        >
          <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-white-secondary text-sidebar-primary-foreground">
            <Image
              src={info.logo}
              alt={`${info.name} Logo`}
              width={100}
              height={100}
              className="w-full h-full p-1 object-contain"
            />
          </div>
          <div className="grid flex-1 text-left text-sm leading-tight">
            <span className="truncate font-semibold">{info.name}</span>
            <span className="truncate text-xs">{info.plan}</span>
          </div>
        </SidebarMenuButton>
      </SidebarMenuItem>
    </SidebarMenu>
  );
}
