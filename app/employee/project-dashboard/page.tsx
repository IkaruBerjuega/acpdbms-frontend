import ProjectView from "@/components/ui/general/project-view";
import { ProjectSelector } from "@/components/ui/general/project-selector";
import { SidebarTrigger } from "@/components/ui/sidebar";
import serverRequestAPI from "@/hooks/server-request";
import {
  ProjectDetailsInterface,
  TeamMemberDashboard,
  TeamMemberDashboardResponse,
} from "@/lib/definitions";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

interface PageProps {
  searchParams: Promise<{ edit?: string; projectId: string | null }>;
}

export default async function Page({ searchParams }: PageProps) {
  //await search params to destructure it

  const { edit = "false", projectId } = await searchParams;

  //server request for initial data, pass it to project view then pass the useApiQuery hook as argument.
  const projectDetailsInitialData: ProjectDetailsInterface =
    await serverRequestAPI({
      url: `${API_URL}/projects/${projectId}`,
      auth: true,
    });

  //server request for initial data, pass it to project view then pass the useApiQuery hook as argument.
  const teamMembers: TeamMemberDashboardResponse = await serverRequestAPI({
    url: `${API_URL}/projects/${projectId}/team-members`,
    auth: true,
  });

  const pageRoute = `/employee/project-details/${projectId}/view`;

  const breadcrumbs = [
    {
      pageName: "Employee",
      href: "",
      active: false,
    },
    {
      pageName: "View Project Details",
      href: pageRoute,
      active: true,
    },
  ];

  const _projectId = projectId?.split("_")[0];

  return (
    <>
      <div className="flex-row-between-center w-full">
        <SidebarTrigger breadcrumbs={breadcrumbs} />
        <ProjectSelector role="employee" />
      </div>
      {_projectId ? (
        <ProjectView
          id={_projectId}
          edit={edit}
          projectDetailsInitialData={projectDetailsInitialData}
          teamInitialData={teamMembers}
          isAdmin={false}
        />
      ) : (
        "Select a project"
      )}
    </>
  );
}
