import FileReview from "@/components/ui/general/file-review";
import { ProjectSelector } from "@/components/ui/general/project-selector";
import { SidebarTrigger } from "@/components/ui/sidebar";
import serverRequestAPI from "@/hooks/server-request";
import { Breadcrumbs } from "@/lib/definitions";
import { TaskVersionsResponse } from "@/lib/tasks-definitions";

export default async function Page({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{
    version: string | null;
    projectId: string | null;
    view_files: "true" | null;
    view_comments: "true" | null;
  }>;
}) {
  const { id: taskId } = await params;
  const { version, projectId, view_files, view_comments } = await searchParams;

  //for initial data
  const initialData: TaskVersionsResponse = await serverRequestAPI({
    url: `/tasks/${taskId}/versions`,
    auth: true,
  });

  const breadcrumbs: Breadcrumbs[] = [
    {
      href: "",
      pageName: "Tasks",
      active: false,
    },
    {
      href: `/employee/tasks/${taskId}/review-files?view_files=true`,
      pageName: "Files Review",
      active: true,
    },
  ];

  const _projectId = projectId?.split("_")[0];

  return (
    <div className="w-full h-full min-h-0 min-w-0 flex-col-start gap-4">
      <div className="flex-col-start gap-4 sm:flex-row-between-center sm:gap-0 w-full">
        <SidebarTrigger breadcrumbs={breadcrumbs} />
        <div className="flex-1 sm:flex-none flex-row-start pointer-events-none">
          <ProjectSelector role="employee" projId={projectId} />
        </div>
      </div>
      {_projectId ? (
        <FileReview
          taskId={taskId}
          initialData={initialData}
          role="manager"
          version={version}
          reviewMode={true}
          projectId={_projectId}
          view_files={view_files}
          view_comments={view_comments}
        />
      ) : (
        "Select a project..."
      )}
    </div>
  );
}
