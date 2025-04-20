"use client";

import TaskCountAreaChart from "./area-graph-task-count";
import EmployeeHours from "./employee-work-hours";
import ProjectUpdates from "./system-updates";
import ProjectLocations from "./project-locations";
import TaskCards from "./task-project-cards";
import UserComponent from "./online-users";

export default function Dashboard() {
  return (
    <div className="w-full p-4 space-y-4 min-h-0 overflow-y-auto">
      {/* Header */}
      <h1 className="text-2xl font-bold text-primary">Hi, Welcome back! 👋</h1>

      {/* Task Overview Cards */}
      <TaskCards />

      {/* First row: TaskCountAreaChart + UserComponent */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="lg:col-span-2">
          <TaskCountAreaChart />
        </div>
        <div className="lg:col-span-1">
          <UserComponent />
        </div>
      </div>

      {/* Second row: ProjectLocations, EmployeePerformance, ProjectUpdates */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <ProjectLocations />
        <EmployeeHours />
        <ProjectUpdates />
      </div>
    </div>
  );
}
