"use client";

import Files from "@/components/ui/general/file-management/files";
import type { Breadcrumbs } from "@/lib/definitions";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { FilesPageProps } from "@/lib/files-definitions";
import { ProjectSelector } from "@/components/ui/general/project-selector";
import { Suspense } from "react";
import { useQueryParams } from "@/hooks/use-query-params";

export default function Page() {
  const { paramsKey } = useQueryParams();
  const queries: FilesPageProps = paramsKey;
  const breadcrumbs: Breadcrumbs[] = [
    {
      href: `/employee/files?projectId=${queries.projectId}`,
      pageName: "Files",
      active: true,
    },
  ];

  return (
    <>
      <div className="flex-row-between-center w-full">
        <SidebarTrigger breadcrumbs={breadcrumbs} />
        <ProjectSelector role="employee" />
      </div>

      <Suspense fallback={<></>}>
        <Files {...queries} role="employee" />
      </Suspense>
    </>
  );
}
