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

// Menu items.
const data = {
  user: {
    name: "Larry",
    email: "larry@example.com",
    avatar: "/boy.png",
  },
  info: {
    name: "Larry's Home Designs",
    logo: "/logo.svg",
    plan: "Company",
  },
};

export function AppSidebar() {
  return (
    <Sidebar collapsible="icon">
      <SidebarContent>
        <SidebarHeader>
          <TeamHeader info={data.info} />
        </SidebarHeader>
        <NavMain role="admin" />
      </SidebarContent>
      <SidebarFooter>
        <Notifications />
        <NavUser user={data.user} />
      </SidebarFooter>
    </Sidebar>
  );
}
