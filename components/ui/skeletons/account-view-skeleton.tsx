"use client";

import { Skeleton } from "@/components/ui/skeleton";
import { Separator } from "@/components/ui/separator";
import { Card, CardContent } from "@/components/ui/card";

export function AccountViewSkeleton() {
  return (
    <div className="container mx-auto px-4 py-8 overflow-y-auto min-h-0 flex-1">
      <div className="max-w-5xl mx-auto">
        <Card className="border-none shadow-md">
          <CardContent className="p-6">
            <div className="space-y-8">
              {/* Header */}
              <div className="flex flex-col md:flex-row justify-between gap-4 mb-6">
                <div className="flex flex-col md:flex-row items-start gap-6">
                  {/* Profile Image */}
                  <Skeleton className="w-[100px] h-[100px] rounded-lg" />

                  <div className="flex flex-col justify-center">
                    {/* Name */}
                    <Skeleton className="h-8 w-48 mb-1" />

                    {/* Contact Info */}
                    <div className="text-slate-600 text-sm space-y-1">
                      <div className="flex items-center">
                        <Skeleton className="h-3 w-3 mr-2" />
                        <Skeleton className="h-4 w-40" />
                      </div>
                      <div className="flex items-center">
                        <Skeleton className="h-3 w-3 mr-2" />
                        <Skeleton className="h-4 w-60" />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Edit Button */}
                <Skeleton className="h-9 w-32 self-start" />
              </div>

              <Separator className="my-6" />

              {/* Personal Details Header */}
              <div className="flex items-center mb-4">
                <Skeleton className="h-5 w-5 mr-2" />
                <Skeleton className="h-6 w-40" />
              </div>

              {/* Personal Details */}
              <div className="grid lg:grid-cols-4 md:grid-cols-2 grid-cols-1 gap-4">
                {[1, 2, 3, 4].map((i) => (
                  <div key={`personal-${i}`}>
                    <Skeleton className="h-4 w-24 mb-1" />
                    <Skeleton className="h-6 w-full" />
                  </div>
                ))}

                {/* Address Section */}
                <div className="lg:col-span-4 md:col-span-2 col-span-1">
                  <Separator className="my-4" />
                  <div className="flex items-center mb-4">
                    <Skeleton className="h-5 w-5 mr-2" />
                    <Skeleton className="h-6 w-24" />
                  </div>
                </div>

                {[1, 2, 3, 4].map((i) => (
                  <div key={`address-${i}`}>
                    <Skeleton className="h-4 w-24 mb-1" />
                    <Skeleton className="h-6 w-full" />
                  </div>
                ))}

                {/* Other Details Section */}
                <div className="lg:col-span-4 md:col-span-2 col-span-1">
                  <Separator className="my-4" />
                  <div className="flex items-center mb-4">
                    <Skeleton className="h-5 w-5 mr-2" />
                    <Skeleton className="h-6 w-32" />
                  </div>
                </div>

                <div className="lg:col-span-2">
                  <Skeleton className="h-4 w-24 mb-1" />
                  <Skeleton className="h-6 w-full" />
                </div>
                <div className="lg:col-span-2">
                  <Skeleton className="h-4 w-24 mb-1" />
                  <Skeleton className="h-6 w-full" />
                </div>
              </div>

              <Separator className="my-6" />

              {/* Ongoing Projects */}
              <div className="flex items-center mb-4">
                <Skeleton className="h-5 w-5 mr-2" />
                <Skeleton className="h-6 w-40" />
              </div>

              <div className="w-full grid md:grid-cols-2 grid-cols-1 gap-4">
                {[1, 2].map((i) => (
                  <ProjectCardSkeleton key={`ongoing-${i}`} />
                ))}
              </div>

              <Separator className="my-6" />

              {/* Finished Projects */}
              <div className="flex items-center mb-4">
                <Skeleton className="h-5 w-5 mr-2" />
                <Skeleton className="h-6 w-40" />
              </div>

              <div className="w-full grid lg:grid-cols-3 md:grid-cols-2 grid-cols-1 gap-4">
                {[1, 2, 3].map((i) => (
                  <ProjectCardSkeleton key={`finished-${i}`} />
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

function ProjectCardSkeleton() {
  return (
    <Card className="overflow-hidden">
      <div className="relative h-32 bg-gray-100">
        <Skeleton className="absolute inset-0" />
      </div>
      <CardContent className="p-4">
        <Skeleton className="h-5 w-3/4 mb-2" />
        <div className="flex items-center mb-2">
          <Skeleton className="h-4 w-4 mr-2" />
          <Skeleton className="h-4 w-40" />
        </div>
        <div className="flex items-center">
          <Skeleton className="h-4 w-4 mr-2" />
          <Skeleton className="h-4 w-24" />
        </div>
        <div className="mt-3 flex justify-between items-center">
          <Skeleton className="h-6 w-16 rounded-full" />
          <Skeleton className="h-8 w-8 rounded-md" />
        </div>
      </CardContent>
    </Card>
  );
}
