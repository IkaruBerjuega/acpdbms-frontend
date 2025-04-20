"use client";
import { ItemTypes } from "@/lib/definitions";
import { titleCase } from "@/lib/utils";
import { useDrop } from "react-dnd";
import TaskCard from "../../general/tasks/draggable-task-card";
import { TaskItemProps, TaskStatuses } from "@/lib/tasks-definitions";

export default function TaskColumn({
  columnStatus,
  tasks,
  moveTask,
}: {
  columnStatus: TaskStatuses;
  tasks: TaskItemProps[] | undefined;
  moveTask: ({
    id,
    droppedStatus,
    recentStatus,
  }: {
    id: number;
    droppedStatus: TaskStatuses;
    recentStatus: TaskStatuses;
  }) => void;
}) {
  const [{ isOver, draggedTask }, drop] = useDrop<
    TaskItemProps,
    { columnStatus: string }, // Updated drop result type
    { isOver: boolean; draggedTask: TaskItemProps | null }
  >(() => ({
    accept: ItemTypes.TASK,
    drop: () => ({ columnStatus }), // Updated
    collect: (monitor) => ({
      isOver: monitor.isOver(),
      draggedTask: monitor.getItem(),
    }),
  }));

  function getStatusBgColor(status: string) {
    if (status === "to do") return "bg-orange-400";
    if (status === "in progress") return "bg-yellow-400";
    if (status === "paused") return "bg-gray-400";
    if (status === "needs review") return "bg-blue-400";
    if (status === "done" || "finished") return "bg-green-400";
  }

  return (
    <div
      className={`min-w-[250px] xl:min-w-0 xl:w-1/5 flex-col-start gap-1 overflow-y-auto`}
      ref={drop as unknown as React.RefObject<HTMLDivElement>}
    >
      <div className="flex-row-start-center gap-2 px-2">
        <div
          className={`w-[10px] h-[10px] rounded-full ${getStatusBgColor(
            columnStatus
          )}`}
        ></div>
        <h3 className="font-semibold text-sm">{titleCase(columnStatus)}</h3>
      </div>
      <div
        className={`rounded-md border-[1px] p-1 space-y-2 transition-all w-full duration-300 ${
          isOver ? "bg-black-secondary bg-opacity-50" : "border-none"
        }`}
      >
        {tasks?.map((task) => {
          const className =
            isOver && draggedTask ? "opacity-60" : "opacity-100";
          return (
            <TaskCard
              className={className}
              key={task.id}
              moveTask={moveTask}
              {...task}
            />
          );
        })}
        {isOver && draggedTask && (
          <TaskCard
            className={"opacity-100"}
            moveTask={moveTask}
            {...draggedTask}
          />
        )}
      </div>
    </div>
  );
}
