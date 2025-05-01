"use client";

import Files from "@/components/ui/general/file-management/files";

import type { Breadcrumbs } from "@/lib/definitions";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { FilesPageProps } from "@/lib/files-definitions";
import { useQueryParams } from "@/hooks/use-query-params";

export default function Page() {
  const { paramsKey } = useQueryParams();
  const queries: FilesPageProps = paramsKey;
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
