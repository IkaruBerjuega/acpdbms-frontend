import TaskMembers from "./task-members-sidepanel";
import TaskDetailsVersions from "./task-details-with-versions";
import TaskSheetContainer from "../task-sheet-container";

export default function Tasks({
  taskId,
  activeTab,
  activeSheet,
}: {
  taskId: string;
  activeTab: "Members" | "Assign Members";
  activeSheet: "files" | "comments" | undefined;
}) {
  const paramKey =
    activeTab === "Assign Members" ? "assign_members" : "members";
  return (
    <div className="w-full flex flex-row gap-2 flex-1 min-h-0">
      <TaskDetailsVersions taskId={taskId} paramKey={paramKey} />
      <TaskMembers
        taskId={taskId}
        activeTab={activeTab}
        activeParamKey={paramKey}
      />
      <TaskSheetContainer
        sheetParamValue={activeSheet ?? undefined}
        taskId={taskId ?? ""}
      />
    </div>
  );
}
