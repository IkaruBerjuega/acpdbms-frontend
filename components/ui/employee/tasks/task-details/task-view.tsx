import TaskMembers from "./task-members-sidepanel";
import TaskDetailsVersions from "./task-details-with-versions";
import TaskSheetContainer from "../task-sheet-container";

export default function Tasks({
  taskId,
  activeSheet,
  version,
}: {
  taskId: string;
  activeSheet: "files" | "comments" | undefined;
  version: string | undefined;
}) {
  return (
    <div className="w-full flex flex-row gap-2 flex-1 min-h-0">
      <TaskDetailsVersions taskId={taskId} />
      <TaskSheetContainer
        sheetParamValue={activeSheet ?? undefined}
        taskId={taskId ?? ""}
        version={version}
      />
    </div>
  );
}
