import { Skeleton } from "@/components/ui/skeleton";
import { DataTableSkeleton } from "@/components/ui/skeletons/data-table-skeleton";

export default function Loading() {
  return (
    <>
      <div className="flex-row-start-center gap-2">
        <Skeleton className="h-8 w-8 shadow-sm bg-white-primary rounded-lg" />
        <Skeleton className="h-8 w-44 shadow-sm bg-white-primary rounded-lg" />
      </div>
      <Skeleton className="h-16 w-full shadow-sm bg-white-primary  rounded-none !rounded-t-lg " />
      <div className="flex-grow bg-white-primary rounded-b-md system-padding shadow-md">
        <DataTableSkeleton rowCount={4} />
      </div>
    </>
  );
}
