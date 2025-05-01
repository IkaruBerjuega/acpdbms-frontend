"use client";

import TasksHeaderActions from "@/components/ui/employee/tasks/dnd-header";
import TaskSheetContainer from "@/components/ui/employee/tasks/task-sheet-container";
import TasksDND from "@/components/ui/employee/tasks/tasks-dnd";
import { ProjectSelector } from "@/components/ui/general/project-selector";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { useQueryParams } from "@/hooks/use-query-params";
import { Breadcrumbs } from "@/lib/definitions";
import { Suspense } from "react";

interface PageProps {
  sheet?:
    | "comments"
    | "files"
    | "phases"
    | "phases_archived"
    | "members"
    | "assign_members"
    | "update_task";
  taskId?: string;
  version?: number;
  projectId?: string | null;
  view?: "general" | "assigned";
  query?: string;
  phases_filters?: string;
  member_filters?: string;
  date_filter?: string;
}
export default function Page() {
  const { paramsKey } = useQueryParams();
  const {
    sheet,
    taskId,
    projectId,
    view = "general",
    query = "",
    phases_filters = "",
    member_filters = "",
    date_filter = "",
  }: PageProps = paramsKey;

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
          <ProjectSelector role="employee" />
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
