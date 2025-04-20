import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarFooter,
} from "@/components/ui/sidebar";
import { NavMain } from "./nav-main";
import { NavUser } from "./nav-user";
import { TeamHeader } from "@/components/ui/general/sidebar/team-header";
import { Notifications } from "./notifications";
import { Suspense } from "react";

// Menu items.
const data = {
  info: {
    name: "Larry's Home Designs",
    logo: "/logo.svg",
    plan: "Company",
  },
};

export function AppSidebar({
  role,
}: {
  role: "admin" | "employee" | "client";
}) {
  return (
    <Sidebar collapsible="icon">
      <SidebarContent>
        <SidebarHeader>
          <TeamHeader info={data.info} />
        </SidebarHeader>
        <Suspense>
          <NavMain role={role} />
        </Suspense>
      </SidebarContent>
      <SidebarFooter>
        <Suspense>
          <Notifications role={role} />
        </Suspense>
        <NavUser role={role} />
      </SidebarFooter>
    </Sidebar>
  );
}
