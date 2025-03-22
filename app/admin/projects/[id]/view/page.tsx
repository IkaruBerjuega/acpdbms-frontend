import ProjectView from "@/components/ui/general/data-table-components/project-view";
import { SidebarTrigger } from "@/components/ui/sidebar";
import serverRequestAPI from "@/hooks/server-request";
import {
  ProjectDetailsInterface,
  TeamMemberDashboardResponse,
} from "@/lib/definitions";
import { z } from "zod";

type PageProps = {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ edit?: string }>;
};

export default async function Page({ params, searchParams }: PageProps) {
  //await params and search params to destructure it
  const { id } = await params;
  const { edit = "false" } = await searchParams;

  //server request for initial data, pass it to project view then pass the useApiQuery hook as argument.
  const initialData: ProjectDetailsInterface = await serverRequestAPI({
    url: `/projects/${id}`,
    auth: true,
  });

  //server request for initial data, pass it to project view then pass the useApiQuery hook as argument.
  const teamMembers: TeamMemberDashboardResponse = await serverRequestAPI({
    url: `/projects/${id}`,
    auth: true,
  });

  return (
    <main className="w-full h-auto flex justify-center flex-col">
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
      <ProjectView
        id={id}
        edit={edit}
        projectDetailsInitialData={initialData}
        teamInitialData={teamMembers}
      />
    </main>
  );
}
