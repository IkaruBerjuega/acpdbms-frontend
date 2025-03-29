import FileReview from "@/components/ui/general/file-review";
import { ProjectSelector } from "@/components/ui/general/project-selector";
import { SidebarTrigger } from "@/components/ui/sidebar";
import serverRequestAPI from "@/hooks/server-request";
import { Breadcrumbs } from "@/lib/definitions";
import { TaskVersionsResponse } from "@/lib/tasks-definitions";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

export default async function Page({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id: taskId } = await params;

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
      href: `/client/approval/${taskId}/review-files?view_files=true`,
      pageName: "Files Review",
      active: true,
    },
  ];

  return (
    <div className="w-full h-full min-h-0 min-w-0 flex-col-start gap-4">
      <div className="flex-col-start gap-4 sm:flex-row-between-center sm:gap-0 w-full">
        <SidebarTrigger breadcrumbs={breadcrumbs} />
        <div className="flex-1 sm:flex-none flex-row-start pointer-events-none">
          <ProjectSelector role="employee" />
        </div>
      </div>
      <FileReview
        taskId={taskId}
        initialData={initialData}
        role="client"
        reviewMode={true}
      />
    </div>
  );
}
