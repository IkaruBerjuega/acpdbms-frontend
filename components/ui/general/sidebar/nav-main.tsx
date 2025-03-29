"use client";
import Link from "next/link";
import { IconType } from "react-icons";
import { AiOutlineProject } from "react-icons/ai";
import {
  MdOutlineDashboard,
  MdOutlineRateReview,
  MdPeopleOutline,
} from "react-icons/md";
import { RiAccountCircleLine, RiInfoCardLine } from "react-icons/ri";
import { LiaFileSolid } from "react-icons/lia";
import { BiNews } from "react-icons/bi";
import { usePathname } from "next/navigation";

const isActive = (pathname: string, navUrl: string) => {
  // Split pathname and navUrl into path and query parts
  const [pathPart, pathQuery] = pathname.split("?");
  const [navPathPart, navQuery] = navUrl.split("?");

  if (pathPart.startsWith(navPathPart)) {
    return true;
  }

  // Remove leading/trailing slashes and split into segments
  const pathSegments = pathPart.split("/").filter(Boolean);
  const navSegments = navPathPart.split("/").filter(Boolean);

  // If navUrl has more segments than pathname, it can't be active
  if (navSegments.length > pathSegments.length) return false;

  // Compare path segments
  const isPathMatch = navSegments.every((segment, index) => {
    // If the segment is dynamic (e.g., [id]), it matches any value in pathname
    if (segment.startsWith("[") && segment.endsWith("]")) {
      return true;
    }
    // Otherwise, segments must match exactly
    return segment === pathSegments[index];
  });

  // If there's no query in navUrl, don't check query parameters
  if (!navQuery) return isPathMatch;

  // Compare query parameters if they exist in navUrl
  if (!pathQuery) return false;

  // Parse query parameters into key-value pairs
  const pathParams = new URLSearchParams(pathQuery);
  const navParams = new URLSearchParams(navQuery);

  // Check if all navUrl params exist in pathname with same values
  for (const [key, value] of navParams) {
    if (pathParams.get(key) !== value) {
      return false;
    }
  }

  return isPathMatch;
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
      url: "/employee/tasks?view=assigned",
      icon: AiOutlineProject,
    },
    {
      title: "Files",
      url: "/employee/files",
      icon: LiaFileSolid,
    },
  ];

  const clientNavs = [
    {
      title: "Approval",
      url: "/client/approval?view=to review",
      icon: MdOutlineRateReview,
    },
    {
      title: "Files",
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
