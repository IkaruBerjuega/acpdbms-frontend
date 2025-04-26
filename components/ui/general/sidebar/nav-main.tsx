"use client";
import Link from "next/link";
import { IconType } from "react-icons";
import { AiOutlineProject } from "react-icons/ai";
import { MdOutlineDashboard, MdOutlineRateReview } from "react-icons/md";
import { RiAccountCircleLine } from "react-icons/ri";
import { LiaFileSolid } from "react-icons/lia";
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
import { VscGithubProject } from "react-icons/vsc";
import { useQueryParams } from "@/hooks/use-query-params";

interface NavigationInterface {
  title: string;
  url: string;
  icon: IconType;
  isActive?: boolean;
  query?: string;
}

export function NavMain({ role }: { role: "admin" | "employee" | "client" }) {
  const pathname = usePathname();
  let navs: NavigationInterface[];

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
      query: "tab=row",
    },
  ];

  const employeeNavs = [
    {
      title: "Project Dashboard",
      url: `/employee/project-dashboard`,
      icon: MdOutlineDashboard,
    },
    {
      title: "Tasks",
      url: "/employee/tasks",
      icon: AiOutlineProject,
      query: "view=assigned",
    },
    {
      title: "Files",
      url: "/employee/files",
      icon: LiaFileSolid,
      query: "tab=row",
    },
  ];

  const clientNavs = [
    {
      title: "Approval",
      url: "/client/approval",
      icon: MdOutlineRateReview,
      query: "view=to review",
    },
    {
      title: "Files",
      url: "/client/files",
      icon: LiaFileSolid,
      query: "tab=row",
    },
  ];

  if (role === "admin") navs = adminNavs;
  else if (role === "employee") navs = employeeNavs;
  else if (role === "client") navs = clientNavs;
  else navs = [];

  //for employee and client users
  const { paramsKey } = useQueryParams();
  const projectId = paramsKey["projectId"] || null;

  return (
    <SidebarGroup className="">
      <SidebarMenu className=" ">
        {navs.map((nav) => {
          const active = isActive(pathname, nav.url);
          const { query } = nav;

          const hasSearchParams =
            Boolean(query) ||
            Boolean(projectId) ||
            Object.keys(paramsKey).length > 0;

          return (
            <SidebarMenuItem key={nav.title}>
              <Link
                href={`${nav.url}${hasSearchParams ? "?" : ""}${
                  query ? `${query}` : ""
                }${hasSearchParams ? "&" : ""}${
                  projectId && role !== "admin" ? `projectId=${projectId}` : ""
                }`}
              >
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
