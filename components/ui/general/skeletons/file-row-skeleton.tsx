"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

interface FileRowSkeletonProps {
  count?: number;
}

export function FileRowSkeleton({ count = 1 }: FileRowSkeletonProps) {
  return (
    <>
      {Array.from({ length: count }).map((_, index) => (
        <Card key={index} className="w-full">
          <CardContent className="p-3 flex items-center gap-2 sm:gap-4 overflow-visible">
            {/* File Icon */}
            <div className="relative bg-gray-50 p-2 sm:p-3 rounded-md flex justify-center items-center shrink-0">
              <Skeleton className="h-8 w-8" />
            </div>

            <div className="flex-col-start lg:flex-row-start-center gap-2 flex-grow">
              {/* File Name */}
              <Skeleton className="h-4 w-40 sm:w-60" />

              <div className="flex-row-start-center gap-2">
                {/* Badges */}
                <Skeleton className="h-5 w-20 rounded-full" />
                <Skeleton className="h-5 w-16 rounded-full" />

                {/* Archived Badge (random appearance) */}
                {index % 3 === 0 && (
                  <Skeleton className="h-5 w-16 rounded-full" />
                )}
              </div>
            </div>

            {/* Version Badge (random appearance) */}
            {index % 2 === 0 && (
              <Skeleton className="h-4 w-8 shrink-0 ml-auto sm:ml-0" />
            )}
          </CardContent>
        </Card>
      ))}
    </>
  );
}
