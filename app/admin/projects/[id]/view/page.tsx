import ProjectView from "@/components/ui/general/project-view";
import { SidebarTrigger } from "@/components/ui/sidebar";

interface PageProps {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ edit?: string }>;
}

export default async function Page({ params, searchParams }: PageProps) {
  //await params and search params to destructure it
  const { id } = await params;
  const { edit = "false" } = await searchParams;

  return (
    <>
      <SidebarTrigger
        breadcrumbs={[
          {
            pageName: "Projects",
            href: "/admin/projects",
            active: false,
          },
          {
            pageName: "View Project Details",
            href: `/admin/projects/${id}/view`,
            active: true,
          },
        ]}
      />

      <ProjectView id={id} edit={edit} />
    </>
  );
}
