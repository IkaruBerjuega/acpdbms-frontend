"use client";

import { Skeleton } from "@/components/ui/skeleton";
import { Separator } from "@/components/ui/separator";

interface TaskCardSkeletonProps {
  count?: number;
  className?: string;
}

export function TaskCardSkeleton({
  count = 1,
  className = "",
}: TaskCardSkeletonProps) {
  return (
    <>
      {Array.from({ length: count }).map((_, index) => (
        <div
          key={index}
          className={`bg-white-primary system-padding shadow-md min-h-[250px] transition-all duration-300 rounded-sm flex-col-start gap-2 ${className} `}
        >
          {/* Header with badges */}
          <div className="w-full flex-row-between-center">
            <div className="flex-row-start-center gap-2">
              <Skeleton className="h-6 w-24 rounded-full" />
            </div>

            {/* Menu button */}
            <Skeleton className="h-8 w-8 rounded-md" />
          </div>

          {/* Task name and description */}
          <div className="flex-col-start w-full mt-2 space-y-1">
            <Skeleton className="h-5 w-3/4" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-2/3" />
          </div>

          {/* Duration info */}
          <div className="flex-row-start w-full gap-2 text-base mt-4">
            <Skeleton className="h-5 w-32 rounded-md" />
          </div>

          {/* Spacer */}
          <div className="flex-grow" />

          <Separator className="mt-2" />

          {/* Footer with team members and counts */}
          <div className="w-full flex-row-between-center lg:text-base">
            <div className="flex-row-start-center gap-1">
              {/* Team members - show 0-3 randomly */}
              {Array.from([1, 2]).map((_, memberIndex) => (
                <Skeleton key={memberIndex} className="h-8 w-8 rounded-full" />
              ))}
            </div>

            <div className="flex-row-start-center gap-2">
              {/* Comment count */}
              <div className="flex-row-start-center gap-1">
                <Skeleton className="h-4 w-4 rounded-full" />
                <Skeleton className="h-4 w-4" />
              </div>

              {/* File count */}
              <div className="flex-row-start-center gap-1">
                <Skeleton className="h-4 w-4 rounded-full" />
                <Skeleton className="h-4 w-4" />
              </div>
            </div>
          </div>
        </div>
      ))}
    </>
  );
}
