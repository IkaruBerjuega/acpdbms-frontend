"use client";
import {
  ColumnInterfaceProp,
  TASK_STATUSES,
  TaskItem,
  TaskItemProps,
  TaskStatuses,
} from "@/lib/definitions";
import React from "react";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import TaskColumn from "./task-columns";
import { useProjectSelectStore } from "@/hooks/states/create-store";
import { useGetTasks } from "@/hooks/api-calls/employee/use-tasks";
import { useCreateTableColumns } from "../../general/data-table-components/create-table-columns";
import { useSearchParams } from "next/navigation";
import { useCustomTable } from "../../general/data-table-components/custom-tanstack";
import { getPhaseBadgeColor } from "@/lib/utils";
import FilterPopOver from "../../general/data-table-components/filter-components/filter-popover";
import { LuFilter } from "react-icons/lu";

export default function TasksDND() {
  //get selected project id
  const { data: projectSelected } = useProjectSelectStore();

  //tasks
  const { data: tasks, isLoading } = useGetTasks({
    projectId: projectSelected[0]?.projectId,
    initialData: { tasks: [] },
  });

  const phases = [
    ...new Set(tasks?.tasks?.map((task) => task.phase_category) ?? []),
  ];

  const columns: ColumnInterfaceProp[] = [
    { id: "id", filterFn: false },
    {
      accessorKey: "phase_category",
      meta: {
        filter_name: "Phase",
        filter_type: "select",
        filter_options: phases,
        filter_columnAccessor: "phase_category",
      },
    },
    {
      accessorKey: "task_name",
      meta: {
        filter_name: "Task Name",
        filter_type: "text",
        filter_columnAccessor: "task_name",
      },
    },
    {
      accessorKey: "task_description",
      meta: {
        filter_name: "Task Description",
        filter_type: "text",
        filter_columnAccessor: "task_description",
      },
    },
    {
      accessorKey: "status",
      meta: {
        filter_name: "Status",
        filter_type: "select",
        filter_options: [
          "To Do",
          "In Progress",
          "Paused",
          "Needs Review",
          "Done",
        ],
        filter_columnAccessor: "status",
      },
    },
    {
      accessorKey: "total_duration",
      meta: {
        filter_name: "Total Duration",
        filter_type: "number",
        filter_columnAccessor: "total_duration",
      },
    },
    {
      accessorKey: "remaining_duration",
      meta: {
        filter_name: "Remaining Duration",
        filter_type: "number",
        filter_columnAccessor: "remaining_duration",
      },
    },
    {
      accessorKey: "task_comments_count",
      filterFn: false,
    },
    {
      accessorKey: "versions",
      filterFn: false,
    },
  ];

  const transformedColumns = useCreateTableColumns<TaskItem>(
    columns,
    "Projects"
  );

  const searchParams = useSearchParams();
  const query = searchParams.get("query") || "";

  const { table, filterComponents, filters } = useCustomTable<TaskItem>(
    query,
    tasks?.tasks ?? [],
    transformedColumns,
    undefined,
    searchParams
  );

  let plainTasks = table.getRowModel().rows.map((row) => row.original);
  let phaseColors = getPhaseBadgeColor(phases);

  let convertedTasks: TaskItemProps[] = plainTasks.map((task) => ({
    ...task,
    phaseColor: phaseColors[task.phase_category], // Explicitly add phaseColor
  }));

  const moveTask = ({
    id,
    droppedStatus,
  }: {
    id: number;
    droppedStatus: string;
  }) => {
    console.log(id);
    console.log(droppedStatus);

    alert(`id: ${id}, droppedStatus: ${droppedStatus}`);
  };

  if (isLoading) {
    return <>Loading Tasks...</>;
  }

  if (tasks?.tasks.length === 0) {
    return <>No Tasks for project selected {projectSelected[0]?.projectId}</>;
  }

  return (
    <DndProvider backend={HTML5Backend}>
      <div className="w-full flex-grow flex-col-start">
        <div className="flex flex-wrap flex-col w-full h-auto gap-2">
          <div>
            <FilterPopOver
              width="w-auto"
              content={filters}
              popoverName="+"
              icon={<LuFilter className="text-xs md:text-lg" />}
            />
          </div>

          <div className="flex flex-wrap flex-row gap-2 w-full h-auto transition-all duration-200 ease-in-out">
            {filterComponents}
          </div>
        </div>
        <div className="flex-grow flex-row-start mt-4">
          {" "}
          {TASK_STATUSES.map((status) => {
            if (status === "cancelled") return;
            return (
              <TaskColumn
                key={status}
                columnStatus={status}
                tasks={
                  convertedTasks.filter((task) => task.status === status) ?? []
                }
                moveTask={moveTask}
              />
            );
          })}
        </div>
      </div>
    </DndProvider>
  );
}
