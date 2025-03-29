"use client";
import { useAdminSettings } from "@/hooks/general/use-admin-settings";
import type { Project } from "../components-to-relocate/AdminTools";
import { ProjectCarousel } from "../components-to-relocate/recent-project-carousel";

export default function RecentProjects() {
  const { recentImagesQuery } = useAdminSettings<any>();
  const { data: recentProjectsData } = recentImagesQuery;
  const projects: Project[] = recentProjectsData?.recent_project_images || [];
  const recentProjectsMessage =
    recentProjectsData?.message || "No recent projects yet.";

  return (
    <section
      id="recent-projects"
      className="w-full h-[110vh] homepage-padding flex flex-col bg-black-primary"
    >
      {/* Heading in original position with background */}
      <h1 className="text-2xl lg:text-5xl 2xl:text-7xl font-bold text-white-secondary">
        Recent Projects
      </h1>

      {/* Full-page carousel */}
      <div className="h-full flex justify-center">
        {projects.length > 0 ? (
          <ProjectCarousel projects={projects} />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-white-secondary text-xl">
            {recentProjectsMessage}
          </div>
        )}
      </div>
    </section>
  );
}
