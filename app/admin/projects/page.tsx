import ProjectList from "@/components/ui/admin/projects/project-list";
import { SidebarTrigger } from "@/components/ui/sidebar";

export default async function Page({
  searchParams,
}: {
  searchParams: Promise<{
    archived?: "true" | "false";
  }>;
}) {
  const { archived } = await searchParams;
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
