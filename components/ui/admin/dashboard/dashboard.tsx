// pages/dashboard.tsx
"use client";

import TaskCountLineGraph from "./line-graph-task-count";
import ProjectUpdates from "./project-component";
import ProjectLocations from "./project-locations";
import TaskCards from "./task-project-overview";
import UserComponent from "./users-component";

export default function Page() {
  return (
    <div className="overflow-y-auto flex-1 min-h-0">
      <div className="flex w-full mb-2">
        <TaskCards />
      </div>
      <div className="flex gap-4 justify-between">
        <div className="flex flex-col w-full md:w-[70%] 2xl:w-[70%] gap-4">
          <TaskCountLineGraph />
          <ProjectLocations />
        </div>
        <div className="w-full md:w-[30%] 2xl:w-[30%] flex-grow flex flex-col gap-4">
          <UserComponent />
          <ProjectUpdates />
        </div>
      </div>
    </div>
  );
}
