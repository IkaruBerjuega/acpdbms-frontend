"use client";
import Link from "next/link";
import { IconType } from "react-icons";
import { AiOutlineProject } from "react-icons/ai";
import { MdOutlineDashboard } from "react-icons/md";
import { RiAccountCircleLine } from "react-icons/ri";
import { LiaFileSolid } from "react-icons/lia";
import { BiNews } from "react-icons/bi";
import { usePathname } from "next/navigation";

import {
  SidebarGroup,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";

interface NavigationInterface {
  title: string;
  url: string;
  icon: IconType;
  isActive?: boolean;
  query?: string;
}

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
    icon: AiOutlineProject,
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
    title: "TASKS",
    url: "/employee/tasks",
    icon: AiOutlineProject,
  },
  {
    title: "FEEDS",
    url: "/employee/feeds",
    icon: BiNews,
  },
  {
    title: "FILES",
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

export function NavMain({ role }: { role: string }) {
  const pathname = usePathname();

  let navs: NavigationInterface[];

  if (role === "admin") navs = adminNavs;
  else if (role === "employee") navs = employeeNavs;
  else if (role === "client") navs = clientNavs;
  else navs = [];

  return (
    <SidebarGroup className="">
      <SidebarMenu className=" ">
        {navs.map((nav) => {
          const isActive = pathname.startsWith(nav.url);
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
                      isActive
                        ? "bg-black-primary text-primary-foreground  hover:bg-black-primary"
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
