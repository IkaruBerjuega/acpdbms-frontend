"use client";

import AddPhase from "./add-phase";
import AddTask from "./add-task";

export default function AddPhasesTask({
  activeTab,
}: {
  activeTab: "Phases" | "Add Phases";
}) {
  const paramKey = activeTab === "Add Phases" ? "add_phases" : "show_phases";

  return (
    <div className="w-full flex flex-row gap-2 flex-1 min-h-0">
      <AddTask paramKey={paramKey} />
      <AddPhase activeTab={activeTab} activeParamKey={paramKey} />
    </div>
  );
}
