import ProjectList from "@/components/ui/admin/projects/project-list";
import { SidebarTrigger } from "@/components/ui/sidebar";
import serverRequestAPI from "@/hooks/server-request";
import { ProjectListResponseInterface } from "@/lib/definitions";
import {
  dehydrate,
  HydrationBoundary,
  QueryClient,
} from "@tanstack/react-query";

export default async function Page({
  searchParams,
}: {
  searchParams: Promise<{
    archived?: "true" | "false";
  }>;
}) {
  const { archived } = await searchParams;
  const isArchived = archived === "true";

  const url = isArchived ? "/projects/archived" : "/project-list";
  const queryKey = isArchived ? ["projects-archived"] : ["projects"];

  const queryClient = new QueryClient();

  // Fetch initial data on the server
  const initialData: ProjectListResponseInterface[] =
    (await serverRequestAPI({
      url: url,
      auth: true,
    })) || [];

  // Prefill the query cache
  await queryClient.prefetchQuery({
    queryKey,
    queryFn: () => serverRequestAPI({ url, auth: true }), // Pass a function, not a resolved Promise
    initialData, // Set initialData to avoid refetching
  });

  const breadCrumbs = [
    {
      href: "/admin/projects/",
      pageName: "Projects",
      active: true,
    },
  ];

  // Dehydrate the query cache for client-side hydration
  const dehydratedState = dehydrate(queryClient);

  return (
    <>
      <SidebarTrigger breadcrumbs={breadCrumbs} />
      <HydrationBoundary state={dehydratedState}>
        <ProjectList isArchived={isArchived} initialData={initialData} />
      </HydrationBoundary>
    </>
  );
}
