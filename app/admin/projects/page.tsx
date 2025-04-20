import ProjectList from "@/components/ui/admin/projects/project-list";
import { SidebarTrigger } from "@/components/ui/sidebar";
import serverRequestAPI from "@/hooks/server-request";
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

  const url = isArchived ? "/projects-archived" : "/project-list";

  const initialData: ProjectListResponseInterface[] = await serverRequestAPI({
    url: url,
    auth: true,
  });

  const breadCrumbs = [
    {
      href: "",
      pageName: "Admin",
      active: false,
    },
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
