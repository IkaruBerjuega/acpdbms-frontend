"use client";

import ProjectList from "@/components/ui/admin/projects/project-list";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { useQueryParams } from "@/hooks/use-query-params";

export default function Page() {
  const { paramsKey } = useQueryParams();
  const { archived } = paramsKey;
  const isArchived = archived === "true";

  const breadCrumbs = [
    {
      href: "/admin/projects/",
      pageName: "Projects",
      active: true,
    },
  ];

  return (
    <>
      <SidebarTrigger breadcrumbs={breadCrumbs} />
      <ProjectList isArchived={isArchived} />
    </>
  );
}
