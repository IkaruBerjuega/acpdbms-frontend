"use client";

import { Skeleton } from "@/components/ui/skeleton";
import { Separator } from "@/components/ui/separator";
import { Card, CardContent } from "@/components/ui/card";

export default function ProjectViewSkeleton() {
  return (
    <div className="flex-col-start xl:flex-row-start gap-2 min-h-0 overflow-y-auto relative transition-all duration-200 overflow-visible">
      {/* Left column - Project Details and Phases */}
      <div className="w-full xl:w-[75%] space-y-2 xl:h-full overflow-visible">
        {/* Project Details Card */}
        <ProjectDetailsSkeleton />

        {/* Phases Card */}
        <PhasesSkeleton />
      </div>

      {/* Right column - Team Members */}
      <div className="xl:flex-grow xl:h-full">
        <TeamMembersSkeleton />
      </div>
    </div>
  );
}

function ProjectDetailsSkeleton() {
  return (
    <Card className="border-none shadow-md h-fit">
      <CardContent className="system-padding">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between gap-4 mb-6">
          <div className="flex flex-col md:flex-row items-start gap-6">
            {/* Project Image */}
            <Skeleton className="h-[125px] w-[125px] rounded-lg" />

            <div className="flex flex-col justify-center">
              {/* Project Title */}
              <Skeleton className="h-8 w-64 mb-1" />

              {/* Project Description */}
              <Skeleton className="h-4 w-80 mb-1" />

              {/* Project Location */}
              <div className="flex items-center text-slate-600 mb-3">
                <Skeleton className="h-4 w-4 mr-1" />
                <Skeleton className="h-4 w-40" />
              </div>

              {/* Project Status */}
              <div className="flex-row-start">
                <Skeleton className="h-6 w-20 rounded-full" />
              </div>
            </div>
          </div>

          {/* Edit Button */}
          <Skeleton className="h-9 w-32 self-start" />
        </div>

        <Separator className="my-6" />

        {/* Basic Details Section */}
        <div>
          <div className="flex items-center mb-4">
            <Skeleton className="h-5 w-5 mr-2" />
            <Skeleton className="h-6 w-32" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 ml-6 gap-6">
            {[1, 2, 3].map((i) => (
              <div key={`basic-${i}`} className="space-y-1">
                <div className="flex items-center">
                  <Skeleton className="h-4 w-4 mr-2" />
                  <Skeleton className="h-4 w-24" />
                </div>
                <Skeleton className="h-6 w-full pl-6" />
              </div>
            ))}
          </div>
        </div>

        <Separator className="my-6" />

        {/* Location Section */}
        <div>
          <div className="flex items-center mb-4">
            <Skeleton className="h-5 w-5 mr-2" />
            <Skeleton className="h-6 w-40" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 ml-6 gap-6">
            {[1, 2, 3, 4].map((i) => (
              <div key={`location-${i}`} className="space-y-1">
                <div className="flex items-center">
                  <Skeleton className="h-4 w-4 mr-2" />
                  <Skeleton className="h-4 w-24" />
                </div>
                <Skeleton className="h-6 w-full pl-6" />
              </div>
            ))}
          </div>
        </div>

        <Separator className="my-6" />

        {/* Duration Section */}
        <div>
          <div className="flex items-center mb-4">
            <Skeleton className="h-5 w-5 mr-2" />
            <Skeleton className="h-6 w-40" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 ml-6 gap-6">
            {[1, 2, 3].map((i) => (
              <div key={`duration-${i}`} className="space-y-1">
                <div className="flex items-center">
                  <Skeleton className="h-4 w-4 mr-2" />
                  <Skeleton className="h-4 w-24" />
                </div>
                <Skeleton className="h-6 w-full pl-6" />
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

function PhasesSkeleton() {
  return (
    <Card className="shadow-md h-fit border-none">
      <CardContent className="p-6 flex-col-start gap-4">
        {/* Header */}
        <div className="flex-row-start-center gap-2">
          <Skeleton className="h-5 w-5" />
          <Skeleton className="h-6 w-40" />
        </div>

        <div className="w-full flex-col-start gap-8">
          {/* Active Phases */}
          <div className="flex-col-start xl:mx-6">
            <div className="flex-col-start gap-4">
              <Skeleton className="h-6 w-32 rounded-full" />

              <div className="grid grid-cols-2 w-full gap-4">
                {[1, 2, 3, 4].map((i) => (
                  <div
                    key={`active-phase-${i}`}
                    className="system-padding border-[1px] col-span-1 rounded-md"
                  >
                    <div className="flex-row-start-center gap-2">
                      <Skeleton className="h-4 w-4" />
                      <Skeleton className="h-5 w-32" />
                      <Skeleton className="h-5 w-20 rounded-full" />
                    </div>
                    <div className="xl:ml-6 mt-2 flex-row-start-center gap-2">
                      <div className="flex-row-start-center gap-2">
                        <Skeleton className="h-4 w-4" />
                        <Skeleton className="h-4 w-24" />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Archived Phases */}
          <div className="flex-col-start xl:mx-6">
            <div className="flex-col-start gap-4">
              <Skeleton className="h-6 w-32 rounded-full" />

              <div className="grid grid-cols-2 w-full gap-4">
                {[1, 2].map((i) => (
                  <div
                    key={`archived-phase-${i}`}
                    className="system-padding border-[1px] col-span-1 rounded-md"
                  >
                    <div className="flex-row-start-center gap-2">
                      <Skeleton className="h-4 w-4" />
                      <Skeleton className="h-5 w-32" />
                      <Skeleton className="h-5 w-20 rounded-full" />
                    </div>
                    <div className="xl:ml-6 mt-2 flex-row-start-center gap-2">
                      <div className="flex-row-start-center gap-2">
                        <Skeleton className="h-4 w-4" />
                        <Skeleton className="h-4 w-24" />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

function TeamMembersSkeleton() {
  return (
    <div className="w-full h-full space-y-2">
      {/* Team Header */}
      <Card className="border-none shadow-md">
        <CardContent className="system-padding py-2">
          <div className="flex items-center">
            <Skeleton className="h-5 w-5 mr-2" />
            <Skeleton className="h-6 w-20" />
          </div>
        </CardContent>
      </Card>

      {/* Team Members */}
      <div className="grid md:grid-cols-2 xl:grid-cols-1 gap-2">
        {/* Project Manager */}
        <MemberCardSkeleton />

        {/* Vice Manager */}
        <MemberCardSkeleton />

        {/* Regular Members */}
        {[1, 2, 3].map((i) => (
          <MemberCardSkeleton key={`member-${i}`} />
        ))}
      </div>
    </div>
  );
}

function MemberCardSkeleton() {
  return (
    <Card>
      <CardContent className="p-6 h-full xl:min-h-[200px] shadow-md border-none flex-col-between-start relative">
        <div className="mb-5 w-full">
          <div>
            <div className="flex-row-start-center gap-2">
              {/* Profile Picture */}
              <Skeleton className="h-10 w-10 rounded-full" />

              <div className="flex-col-start">
                <div className="flex-row-start-center gap-2">
                  <Skeleton className="h-4 w-32" />
                  <Skeleton className="h-4 w-24 rounded-full" />
                </div>
                <Skeleton className="h-3 w-20 mt-1" />
              </div>
            </div>

            <Separator className="my-2" />

            {/* Contact Info */}
            <div className="flex items-center mb-1">
              <Skeleton className="h-4 w-4 mr-2" />
              <Skeleton className="h-4 w-40" />
            </div>
            <div className="flex items-center">
              <Skeleton className="h-4 w-4 mr-2" />
              <Skeleton className="h-4 w-32" />
            </div>
          </div>
        </div>

        {/* Accordion Placeholder */}
        <div className="w-full">
          <Skeleton className="h-8 w-full mb-2" />
          <div className="px-2 space-y-2">
            {[1, 2, 3].map((i) => (
              <div
                key={`task-${i}`}
                className="flex justify-between items-center"
              >
                <Skeleton className="h-4 w-24" />
                <Skeleton className="h-4 w-8" />
              </div>
            ))}
          </div>
        </div>

        {/* Action Button */}
        <Skeleton className="h-8 w-8 absolute top-2 right-2 rounded-md" />
      </CardContent>
    </Card>
  );
}
