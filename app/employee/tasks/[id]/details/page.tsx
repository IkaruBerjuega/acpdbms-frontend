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
    add_members: "true" | null;
    members: "true" | null;
  }>;
}) {
  const { id: taskId } = await params;
  const { sheet, add_members, members } = await searchParams;

  let isAddMembers = add_members === "true";
  let isMembers = members === "true";

  let activeTab: "Assign Members" | "Members" =
    isMembers && !isAddMembers ? "Members" : "Assign Members";

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
  return (
    <main className="relative h-full w-full ">
      <div className="absolute inset-0 flex flex-col space-y-2">
        <div className="flex-row-between-center w-full">
          <SidebarTrigger breadcrumbs={breadcrumbs} />
          <ProjectSelector />
        </div>
        <Tasks taskId={taskId} activeTab={activeTab} activeSheet={sheet} />
      </div>
    </main>
  );
}
