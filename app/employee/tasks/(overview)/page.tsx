import TasksHeaderActions from "@/components/ui/employee/tasks/dnd-header";
import TaskSheetContainer from "@/components/ui/employee/tasks/task-sheet-container";
import TasksDND from "@/components/ui/employee/tasks/tasks-dnd";
import { ProjectSelector } from "@/components/ui/general/project-selector";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { Breadcrumbs } from "@/lib/definitions";
import { CiNoWaitingSign } from "react-icons/ci";

export default async function Page({
  searchParams,
}: {
  searchParams: Promise<{
    sheet: "comments" | "files" | "phases" | "phases_archived" | undefined;
    taskId: string | undefined;
    version: number | undefined;
  }>;
}) {
  const { sheet, taskId, version } = await searchParams;
  const breadcrumbs: Breadcrumbs[] = [
    {
      href: "",
      pageName: "Project Name",
      active: false,
    },
    {
      href: "/employee/tasks",
      pageName: "Tasks",
      active: true,
    },
  ];

  return (
    <div className="w-full h-full flex-col-start min-h-0 min-w-0 overflow-x-auto space-y-4">
      <div className="flex-col-start gap-4 sm:flex-row-between-center sm:gap-0 w-full">
        <SidebarTrigger breadcrumbs={breadcrumbs} />
        <div className="flex-1 sm:flex-none flex-row-start">
          <ProjectSelector />
        </div>
      </div>
      <TasksHeaderActions />
      <TasksDND />
      <TaskSheetContainer
        sheetParamValue={sheet}
        taskId={taskId}
        version={undefined}
      />
    </div>
  );
}
