import TasksHeaderActions from "@/components/ui/employee/tasks/dnd-header";
import TaskSheetContainer from "@/components/ui/employee/tasks/task-sheet-container";
import TasksDND from "@/components/ui/employee/tasks/tasks-dnd";
import { ProjectSelector } from "@/components/ui/general/project-selector";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { Breadcrumbs } from "@/lib/definitions";
import { Suspense } from "react";

export default async function Page({
  searchParams,
}: {
  searchParams: Promise<{
    sheet:
      | "comments"
      | "files"
      | "phases"
      | "phases_archived"
      | "members"
      | "assign_members"
      | "update_task"
      | undefined;
    taskId: string | undefined;
    version: number | undefined;
    projectId: string | null;
    view: "general" | "assigned" | null;
    query: string | null;
    phases_filters: string | null;
    member_filters: string | null;
    date_filter: string | null;
  }>;
}) {
  const {
    sheet,
    taskId,
    projectId,
    view,
    query,
    phases_filters,
    member_filters,
    date_filter,
  } = await searchParams;

  const breadcrumbs: Breadcrumbs[] = [
    {
      href: "/employee/tasks",
      pageName: "Tasks",
      active: true,
    },
  ];

  const _projectId = projectId?.split("_")[0];

  return (
    <div className="w-full h-full flex-col-start min-h-0 min-w-0 overflow-x-auto space-y-4">
      <div className="flex-col-start gap-4 sm:flex-row-between-center sm:gap-0 w-full">
        <SidebarTrigger breadcrumbs={breadcrumbs} />
        <div className="flex-1 sm:flex-none flex-row-start">
          <ProjectSelector role="employee" projId={projectId} />
        </div>
      </div>

      <TasksHeaderActions isEmployee={true} />

      {_projectId ? (
        <>
          <TasksDND
            projectId={_projectId}
            view={view}
            query={query}
            phaseFilters={phases_filters}
            dateFilter={date_filter}
            memberFilters={member_filters}
          />
          <Suspense>
            <TaskSheetContainer
              sheetParamValue={sheet}
              taskId={taskId}
              version={""}
              projectId={_projectId}
            />
          </Suspense>
        </>
      ) : (
        "Select a project"
      )}
    </div>
  );
}
