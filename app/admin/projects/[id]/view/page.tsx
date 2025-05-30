import ProjectView from "@/components/ui/general/project-view";
import { SidebarTrigger } from "@/components/ui/sidebar";
import serverRequestAPI from "@/hooks/server-request";
import {
  Phase,
  ProjectDetailsInterface,
  TeamMemberDashboardResponse,
} from "@/lib/definitions";

interface PageProps {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ edit?: string }>;
}

export default async function Page({ params, searchParams }: PageProps) {
  //await params and search params to destructure it
  const { id } = await params;
  const { edit = "false" } = await searchParams;

  //server request for initial data, pass it to project view then pass the useApiQuery hook as argument.
  const initialData: ProjectDetailsInterface = await serverRequestAPI({
    url: `/project-view/${id}`,
    auth: true,
  });

  //server request for initial data, pass it to project view then pass the useApiQuery hook as argument.
  const teamMembers: TeamMemberDashboardResponse = await serverRequestAPI({
    url: `/projects/${id}/team-members`,
    auth: true,
  });

  const activePhases: Phase[] = await serverRequestAPI({
    url: `/phases-active/${id}`,
    auth: true,
  });

  const archivedPhases: Phase[] = await serverRequestAPI({
    url: `/phases-archived/${id}`,
    auth: true,
  });

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

      <ProjectView
        id={id}
        edit={edit}
        projectDetailsInitialData={initialData}
        teamInitialData={teamMembers}
        activePhaseInitialData={activePhases}
        archivedPhasesInitialData={archivedPhases}
      />
    </>
  );
}
