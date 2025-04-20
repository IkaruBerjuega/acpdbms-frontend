import ClientTasksView from "@/components/ui/client/client-tasks-view";
import TasksHeaderActions from "@/components/ui/employee/tasks/dnd-header";
import { ProjectSelector } from "@/components/ui/general/project-selector";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { Suspense } from "react";

export default async function Page({
  searchParams,
}: {
  searchParams: Promise<{ view: string | null; projectId: string | null }>;
}) {
  const { view, projectId } = await searchParams;
  const breadcrumbs = [
    { pageName: "Client", href: "", active: false },
    { pageName: "Approval", href: "/client/approval", active: true },
  ];
  return (
    <>
      <div className="flex-col-start gap-4 sm:flex-row-between-center sm:gap-0 w-full">
        <SidebarTrigger breadcrumbs={breadcrumbs} />
        <div className="flex-1 sm:flex-none flex-row-start">
          <ProjectSelector role="client" projId={projectId} />
        </div>
      </div>
      <Suspense>
        <TasksHeaderActions isEmployee={false} />
      </Suspense>
      <ClientTasksView view={view} />
    </>
  );
}
