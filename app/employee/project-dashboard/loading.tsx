import { Skeleton } from "@/components/ui/skeleton";
import ProjectViewSkeleton from "@/components/ui/skeletons/project-view-skeleton";

export default function Loading() {
  return (
    <>
      <div className="flex-row-start-center gap-2">
        <Skeleton className="h-8 w-8 shadow-sm bg-white-primary rounded-lg" />
        <Skeleton className="h-8 w-44 shadow-sm bg-white-primary rounded-lg" />
      </div>
      <ProjectViewSkeleton />
    </>
  );
}
