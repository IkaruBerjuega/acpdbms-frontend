"use client";
import Link from "next/link";
import { IconType } from "react-icons";
import { AiOutlineProject } from "react-icons/ai";
import { MdOutlineDashboard, MdPeopleOutline } from "react-icons/md";
import { RiAccountCircleLine, RiInfoCardLine } from "react-icons/ri";
import { LiaFileSolid } from "react-icons/lia";
import { BiNews } from "react-icons/bi";
import { usePathname } from "next/navigation";

const isActive = (pathname: string, navUrl: string) => {
  // Remove leading/trailing slashes and split into segments
  const pathSegments = pathname.split("/").filter(Boolean);
  const navSegments = navUrl.split("/").filter(Boolean);

  // If navUrl has fewer segments than pathname, it could still be a parent route
  if (navSegments.length > pathSegments.length) return false;

  // Compare segments
  return navSegments.every((segment, index) => {
    // If the segment is dynamic (e.g., [id]), it matches any value in pathname
    if (segment.startsWith("[") && segment.endsWith("]")) {
      return true; // Dynamic param, so this segment is a match
    }
    // Otherwise, segments must match exactly
    return segment === pathSegments[index];
  });
};

import {
  SidebarGroup,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { useProjectSelectStore } from "@/hooks/states/create-store";
import { VscGithubProject } from "react-icons/vsc";

interface NavigationInterface {
  title: string;
  url: string;
  icon: IconType;
  isActive?: boolean;
  query?: string;
}

export function NavMain({ role }: { role: string }) {
  const pathname = usePathname();
  let navs: NavigationInterface[];

  const { data } = useProjectSelectStore();

  const adminNavs: NavigationInterface[] = [
    {
      title: "Dashboard",
      url: "/admin/dashboard",
      icon: MdOutlineDashboard,
      isActive: true,
    },
    {
      title: "Projects",
      url: "/admin/projects",
      icon: VscGithubProject,
    },
    {
      title: "Accounts",
      url: "/admin/accounts",
      query: "role=employee",
      icon: RiAccountCircleLine,
    },
    {
      title: "Files",
      url: "/admin/files",
      icon: LiaFileSolid,
    },
  ];

  const employeeNavs = [
    {
      title: "Project Details",
      url: `/employee/project-details/${data[0]?.projectId}/view/`,
      icon: RiInfoCardLine,
    },
    {
      title: "Tasks",
      url: "/employee/tasks",
      icon: AiOutlineProject,
    },
    {
      title: "Feed",
      url: "/employee/feed",
      icon: BiNews,
    },
    {
      title: "Files",
      url: "/employee/files",
      icon: LiaFileSolid,
    },
  ];

  const clientNavs = [
    {
      title: "FEEDS",
      url: "/client/feeds",
      icon: BiNews,
    },
    {
      title: "FILES",
      url: "/client/files",
      icon: LiaFileSolid,
    },
  ];

  if (role === "admin") navs = adminNavs;
  else if (role === "employee") navs = employeeNavs;
  else if (role === "client") navs = clientNavs;
  else navs = [];

  return (
    <SidebarGroup className="">
      <SidebarMenu className=" ">
        {navs.map((nav) => {
          const active = isActive(pathname, nav.url);
          const { query } = nav;
          return (
            <SidebarMenuItem key={nav.title}>
              <Link href={`${nav.url}${query ? `?${query}` : ""}`}>
                <SidebarMenuButton
                  asChild
                  tooltip={nav.title}
                  size="lg"
                  className="[&>svg]:size-6 group-data-[collapsible=icon]:[&>svg]:ml-1"
                >
                  <div
                    className={`flex rounded-md ${
                      active
                        ? "bg-black-secondary text-primary-foreground  hover:bg-black-primary"
                        : "text-primary-foreground"
                    }`}
                  >
                    <nav.icon />

                    <span>{nav.title}</span>
                  </div>
                </SidebarMenuButton>
              </Link>
            </SidebarMenuItem>
          );
        })}
      </SidebarMenu>
    </SidebarGroup>
  );
}
