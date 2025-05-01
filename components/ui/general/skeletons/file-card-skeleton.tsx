"use client";

import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

interface FileCardSkeletonProps {
  count?: number;
}

export function FileCardSkeleton({ count = 1 }: FileCardSkeletonProps) {
  return (
    <>
      {Array.from({ length: count }).map((_, index) => (
        <Card
          key={index}
          className="overflow-hidden w-full flex-col-start h-[175px]"
        >
          {/* File Icon Area */}
          <div className="relative bg-gray-50 p-8 flex justify-center items-center">
            <Skeleton className="h-12 w-12" />

            {/* Archived Badge (random appearance) */}
            {index % 3 === 0 && (
              <Skeleton className="absolute top-1 left-0 h-4 w-16 rounded-full" />
            )}

            {/* Version Badge (random appearance) */}
            {index % 2 === 0 && (
              <Skeleton className="absolute top-2 right-2 h-3 w-8 rounded-md" />
            )}
          </div>

          {/* File Name */}
          <CardHeader className="p-2 pb-0 flex items-start">
            <div className="flex justify-center items-start w-full">
              <Skeleton className="h-4 w-full" />
            </div>
          </CardHeader>

          {/* Badges */}
          <CardContent className="p-2 pt-1 flex justify-center flex-grow">
            <div className="flex gap-1 justify-center items-end flex-grow">
              <Skeleton className="h-5 w-20 rounded-full" />
              <Skeleton className="h-5 w-16 rounded-full" />
            </div>
          </CardContent>
        </Card>
      ))}
    </>
  );
}
