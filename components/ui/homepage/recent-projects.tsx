"use client";
import { ProjectCarousel } from "./recent-project-carousel";
import { RecentProjectsResponse } from "@/lib/definitions";

export default function RecentProjects({
  images,
}: {
  images: RecentProjectsResponse["recent_project_images"];
}) {
  return (
    <section
      id="recent-projects"
      className="w-full h-[150vh] homepage-padding flex flex-col bg-black-primary py-32 space-y-2"
    >
      {/* Heading in original position with background */}
      <h1 className="text-2xl lg:text-5xl 2xl:text-7xl font-bold text-white-secondary">
        Recent Projects
      </h1>

      {/* Full-page carousel */}
      <div className="flex-grow flex justify-center">
        {!images || images.length > 0 ? (
          <ProjectCarousel projects={images!} />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-white-secondary text-xl">
            No uploaded images yet
          </div>
        )}
      </div>
    </section>
  );
}
