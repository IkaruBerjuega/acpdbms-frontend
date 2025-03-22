import FileReview from "@/components/ui/general/file-review";
import { ProjectSelector } from "@/components/ui/general/project-selector";
import { SidebarTrigger } from "@/components/ui/sidebar";
import serverRequestAPI from "@/hooks/server-request";
import { Breadcrumbs } from "@/lib/definitions";
import { TaskVersionsResponse } from "@/lib/tasks-definitions";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

export default async function Page({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ view_files: "true" | null }>;
}) {
  const { id: taskId } = await params;
  const { view_files } = await searchParams;

  const isViewFilesOpen = view_files === "true";

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
      href: `/employee/tasks/${taskId}/review-files`,
      pageName: "Files Review",
      active: true,
    },
  ];

  if (!taskId || !isViewFilesOpen || !initialData) return null;

  return (
    <div className="w-full h-full min-h-0 min-w-0 flex-col-start gap-4">
      <SidebarTrigger breadcrumbs={breadcrumbs} />
      <FileReview
        taskId={taskId}
        view_files={isViewFilesOpen}
        initialData={initialData}
      />
    </div>
  );
}
