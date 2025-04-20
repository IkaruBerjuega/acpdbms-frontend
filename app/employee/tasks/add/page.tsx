import AddPhasesTask from "@/components/ui/employee/tasks/add-task-phases/add-phases-task";
import { ProjectSelector } from "@/components/ui/general/project-selector";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { Breadcrumbs } from "@/lib/definitions";

export default async function Page({
  searchParams,
}: {
  searchParams: Promise<{
    show_phases: "true" | null;
    add_phases: "true" | null;
    projectId: string | null;
  }>;
}) {
  const { show_phases, add_phases, projectId } = await searchParams;

  const isShowPhases = show_phases === "true";
  const isAddPhases = add_phases === "true";

  const activeTab: "Add Phases" | "Phases" =
    isShowPhases && !isAddPhases ? "Phases" : "Add Phases";

  const breadcrumbs: Breadcrumbs[] = [
    {
      href: "",
      pageName: "Project Name",
      active: false,
    },
    {
      href: "/employee/tasks",
      pageName: "Tasks",
      active: false,
    },
    {
      href: "/employee/tasks/add",
      pageName: "Add Tasks",
      active: true,
    },
  ];

  const _projectId = projectId?.split("_")[0];
  return (
    <main className="relative h-full w-full ">
      <div className="absolute inset-0 flex flex-col space-y-2">
        <div className="flex-row-between-center w-full">
          <SidebarTrigger breadcrumbs={breadcrumbs} />
          <ProjectSelector role="employee" projId={projectId} />
        </div>
        <>
          {_projectId ? (
            <AddPhasesTask activeTab={activeTab} projectId={_projectId} />
          ) : (
            <div className="flex-grow bg-white-primary rounded-md shadow-md system-padding">
              Select a project...
            </div>
          )}
        </>
      </div>
    </main>
  );
}
