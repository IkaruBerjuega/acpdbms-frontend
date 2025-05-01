import Files from "@/components/ui/general/file-management/files";

import type { Breadcrumbs } from "@/lib/definitions";
import { SidebarTrigger } from "@/components/ui/sidebar";
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
      href: "/admin/files",
      pageName: "Files",
      active: true,
    },
  ];

  return (
    <>
      <SidebarTrigger breadcrumbs={breadcrumbs} />
      <Files {...queries} role={"admin"} />
    </>
  );
}
