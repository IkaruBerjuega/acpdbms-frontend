import TasksHeaderActions from "@/components/ui/employee/tasks/dnd-header";
import TaskSheetContainer from "@/components/ui/employee/tasks/task-sheet-container";
import TasksDND from "@/components/ui/employee/tasks/tasks-dnd";
import { ProjectSelector } from "@/components/ui/general/project-selector";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { Breadcrumbs } from "@/lib/definitions";

export default async function Page({
  searchParams,
}: {
  searchParams: Promise<{
    sheet: "comments" | "files" | "phases" | "phases_archived" | undefined;
    taskId: string | undefined;
  }>;
}) {
  const { sheet, taskId } = await searchParams;
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
    <>
      <div className="flex-row-between-center w-full">
        <SidebarTrigger breadcrumbs={breadcrumbs} />
        <ProjectSelector />
      </div>
      <TasksHeaderActions />
      <TasksDND />
      <TaskSheetContainer sheetParamValue={sheet} taskId={taskId} />
    </>
  );
}
