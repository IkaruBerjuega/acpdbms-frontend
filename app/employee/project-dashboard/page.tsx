"use client";

import ProjectView from "@/components/ui/general/project-view";
import { ProjectSelector } from "@/components/ui/general/project-selector";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { useQueryParams } from "@/hooks/use-query-params";

interface PageProps {
  edit?: string;
  projectId?: string;
}

export default function Page() {
  const { paramsKey } = useQueryParams();

  const _params = paramsKey;

  const params: PageProps = _params;

  const { edit = "false", projectId = "" } = params;

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
        <ProjectSelector role="employee" />
      </div>
    );
  }

  return (
    <>
      <div className="flex-row-between-center w-full">
        <SidebarTrigger breadcrumbs={breadcrumbs} />
        <ProjectSelector role="employee" />
      </div>
      {_projectId ? (
        <ProjectView id={_projectId} edit={edit} isAdmin={false} />
      ) : (
        "Select a project"
      )}
    </>
  );
}
