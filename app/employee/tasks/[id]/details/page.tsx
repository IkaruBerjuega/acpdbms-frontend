import Tasks from "@/components/ui/employee/tasks/task-details/task-view";
import { ProjectSelector } from "@/components/ui/general/project-selector";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { Breadcrumbs } from "@/lib/definitions";

export default async function Page({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{
    sheet: "files" | "comments" | undefined;
    version: string | null;
    projectId: string | null;
  }>;
}) {
  const { id: taskId } = await params;
  const { sheet, version, projectId } = await searchParams;

  const breadcrumbs: Breadcrumbs[] = [
    {
      href: "/employee/tasks",
      pageName: "Tasks",
      active: false,
    },
    {
      href: `/employee/tasks/${taskId}/details`,
      pageName: "Task Details",
      active: true,
    },
  ];

  const _projectId = projectId?.split("_")[0];

  return (
    <main className="relative min-h-full w-full ">
      <div className="absolute inset-0 flex flex-col space-y-2">
        <div className="flex-row-between-center w-full">
          <SidebarTrigger breadcrumbs={breadcrumbs} />
          <ProjectSelector role="employee" projId={projectId} />
        </div>

        <>
          {_projectId ? (
            <Tasks
              taskId={taskId}
              activeSheet={sheet}
              version={version}
              projectId={_projectId}
            />
          ) : (
            <div className="flex-grow bg-white-primary rounded-md shadow-md">
              Select a project...
            </div>
          )}
        </>
      </div>
    </main>
  );
}
