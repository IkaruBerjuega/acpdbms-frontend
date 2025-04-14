import { Suspense } from "react";
import Files from "@/components/ui/components-to-relocate/file-management/files";
import { Skeleton } from "@/components/ui/skeleton";
import type { Breadcrumbs } from "@/lib/definitions";
import { SidebarTrigger } from "@/components/ui/sidebar";
import serverRequestAPI from "@/hooks/server-request";
import { FilesPageProps } from "@/lib/files-definitions";

export default async function Page({
  searchParams,
}: {
  //gets states archived, projectId, phaseId, taskId, taskVersionId, tab
  searchParams: Promise<FilesPageProps>;
}) {
  const queries = await searchParams;
  const breadcrumbs: Breadcrumbs[] = [
    {
      href: "/admin",
      pageName: "Admin",
      active: false,
    },
    {
      href: "/admin/files",
      pageName: "Files",
      active: true,
    },
  ];

  return (
    <>
      <SidebarTrigger breadcrumbs={breadcrumbs} />
      <Files {...queries} isAdmin={true} />
    </>
  );
}
