"use client";

import { Skeleton } from "@/components/ui/skeleton";

interface NotificationItemSkeletonProps {
  count?: number;
  seenVariations?: boolean;
}

export function NotificationItemSkeleton({
  count = 1,
  seenVariations = true,
}: NotificationItemSkeletonProps) {
  return (
    <>
      {Array.from({ length: count }).map((_, index) => {
        // Randomly determine if this skeleton represents a seen or unseen notification
        const isSeen = seenVariations ? Math.random() > 0.5 : false;

        return (
          <div
            key={index}
            className="rounded-md border-[1px] p-3 w-full flex-row-start gap-3"
          >
            {/* Avatar */}
            <div className="h-full">
              <Skeleton className="h-8 w-8 rounded-full" />
            </div>

            <div className="flex-col-start gap-2 flex-grow">
              <div className="flex-col-start w-full">
                {/* User name */}
                <Skeleton
                  className={`h-4 w-24 mb-1 ${
                    isSeen ? "bg-gray-200" : "bg-gray-300"
                  }`}
                />

                {/* Notification content */}
                <div className="space-y-1 w-full">
                  <Skeleton
                    className={`h-4 w-full ${
                      isSeen ? "bg-gray-200" : "bg-gray-300"
                    }`}
                  />
                  <Skeleton
                    className={`h-4 w-3/4 ${
                      isSeen ? "bg-gray-200" : "bg-gray-300"
                    }`}
                  />
                </div>
              </div>

              {/* Metadata */}
              <div className="flex-row-start gap-2">
                <Skeleton
                  className={`h-3 w-16 ${
                    isSeen ? "bg-gray-200" : "bg-blue-200"
                  }`}
                />
                <Skeleton className="h-3 w-3 rounded-full" />
                <Skeleton
                  className={`h-3 w-20 ${
                    isSeen ? "bg-gray-200" : "bg-blue-200"
                  }`}
                />

                {/* Seen timestamp (only for "seen" notifications) */}
                {isSeen && (
                  <>
                    <Skeleton className="h-3 w-3 rounded-full" />
                    <Skeleton className="h-3 w-24 bg-gray-200" />
                  </>
                )}
              </div>
            </div>

            {/* Dropdown menu */}
            <div className="flex-1 flex-row-end-center min-w-10">
              <Skeleton className="h-8 w-8 rounded-md" />
            </div>
          </div>
        );
      })}
    </>
  );
}
