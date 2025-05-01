import ProjectView from "@/components/ui/general/project-view";
import { ProjectSelector } from "@/components/ui/general/project-selector";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { authRequestAPI } from "@/hooks/server-request";
import {
  Phase,
  ProjectDetailsInterface,
  TeamMemberDashboardResponse,
} from "@/lib/definitions";

interface PageProps {
  searchParams: Promise<{ edit?: string; projectId: string | null }>;
}

export default async function Page({ searchParams }: PageProps) {
  //await search params to destructure it

  const { edit = "false", projectId } = await searchParams;

  const pageRoute = `/employee/project-dashboard?projectId=${projectId}`;

  const breadcrumbs = [
    {
      pageName: "View Project Details",
      href: pageRoute,
      active: true,
    },
  ];

  const _projectId = projectId?.split("_")[0];

  if (!_projectId) {
    return (
      <div className="flex-row-between-center w-full">
        <SidebarTrigger breadcrumbs={breadcrumbs} />
        <ProjectSelector role="employee" projId={projectId} />
      </div>
    );
  }

  //server request for initial data, pass it to project view then pass the useApiQuery hook as argument.
  const initialData = await authRequestAPI<ProjectDetailsInterface>({
    url: `/project-view/${_projectId}`,
  });

  //server request for initial data, pass it to project view then pass the useApiQuery hook as argument.
  const teamMembers = await authRequestAPI<TeamMemberDashboardResponse>({
    url: `/projects/${_projectId}/team-members`,
  });

  const activePhases = await authRequestAPI<Phase[]>({
    url: `/phases-active/${_projectId}`,
  });

  const archivedPhases = await authRequestAPI<Phase[]>({
    url: `/phases-archived/${_projectId}`,
  });

  return (
    <>
      <div className="flex-row-between-center w-full">
        <SidebarTrigger breadcrumbs={breadcrumbs} />
        <ProjectSelector role="employee" projId={projectId} />
      </div>
      {_projectId ? (
        <ProjectView
          id={_projectId}
          edit={edit}
          projectDetailsInitialData={initialData}
          teamInitialData={teamMembers}
          activePhaseInitialData={activePhases}
          archivedPhasesInitialData={archivedPhases}
          isAdmin={false}
        />
      ) : (
        "Select a project"
      )}
    </>
  );
}
