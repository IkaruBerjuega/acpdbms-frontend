import Files from "@/components/ui/general/file-management/files";
import type { Breadcrumbs } from "@/lib/definitions";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { FilesPageProps } from "@/lib/files-definitions";
import { ProjectSelector } from "@/components/ui/general/project-selector";
import { Suspense } from "react";

export default async function Page({
  searchParams,
}: {
  //gets states archived, projectId, phaseId, taskId, taskVersionId, tab
  searchParams: Promise<FilesPageProps>;
}) {
  const queries = await searchParams;
  const breadcrumbs: Breadcrumbs[] = [
    {
      href: "/employee",
      pageName: "Admin",
      active: false,
    },
    {
      href: "/employee/files",
      pageName: "Files",
      active: true,
    },
  ];

  return (
    <>
      <div className="flex-row-between-center w-full">
        <SidebarTrigger breadcrumbs={breadcrumbs} />
        <ProjectSelector role="client" projId={queries.projectId} />
      </div>
      <Suspense fallback={<></>}>
        <Files {...queries} isAdmin={false} />
      </Suspense>
    </>
  );
}
