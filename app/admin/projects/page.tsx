import ProjectList from "@/components/ui/admin/projects/project-list";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { authRequestAPI } from "@/hooks/server-request";
import { ProjectListResponseInterface } from "@/lib/definitions";

export default async function Page({
  searchParams,
}: {
  searchParams: Promise<{
    archived?: "true" | "false";
  }>;
}) {
  const { archived } = await searchParams;
  const isArchived = archived === "true";

  const url = isArchived ? "/projects/archived" : "/project-list";

  const initialData =
    (await authRequestAPI<ProjectListResponseInterface[]>({
      url: url,
    })) || [];

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
      <ProjectList isArchived={isArchived} initialData={initialData} />
    </>
  );
}
