"use client";

import { useGetTasks } from "@/hooks/api-calls/employee/use-tasks";
import { useProjectSelectStore } from "@/hooks/states/create-store";
import { TaskItem, TaskItemProps } from "@/lib/tasks-definitions";
import { useCustomTable } from "../general/data-table-components/custom-tanstack";
import { useCreateTableColumns } from "../general/data-table-components/create-table-columns";
import { ColumnInterfaceProp } from "@/lib/definitions";
import { getPhaseBadgeColor } from "@/lib/utils";
import FilterPopOver from "../general/data-table-components/filter-components/filter-popover";
import { LuFilter } from "react-icons/lu";
import TaskCard from "../general/tasks/task-card";

export default function ClientTasksView({ view }: { view: string | null }) {
  //get selected project id
  const { data: projectSelected } = useProjectSelectStore();

  //tasks
  const { data: taskList, isLoading } = useGetTasks({
    projectId: projectSelected[0]?.projectId,
    initialData: { tasks: [] },
    isGeneral: true,
  });

  const tasks = taskList?.tasks;

  const phases: string[] = [
    ...new Set(
      tasks
        ?.map((task) => task.phase_category)
        .filter((phase): phase is string => phase !== null) ?? []
    ),
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
        filter_options: ["Needs Review", "Done"],
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

  const activeTabIsToReview = view === "to review";

  const { table, filterComponents, filters } = useCustomTable<TaskItem>(
    tasks ?? [],
    transformedColumns,
    undefined
  );

  const plainTasks = table.getRowModel().rows.map((row) => row.original);
  const phaseColors = getPhaseBadgeColor(phases);

  const convertedTasks: TaskItemProps[] = plainTasks.map((task) => ({
    ...task,
    phaseColor: phaseColors[task.phase_category], // Explicitly add phaseColor
  }));

  const tasksInNeedsReview = convertedTasks.filter(
    (convertedTask) => convertedTask.status === "needs review"
  );
  const tasksDone = convertedTasks.filter(
    (convertedTask) => convertedTask.status === "done"
  );

  return (
    <div className="w-full flex-grow flex-col-start  overflow-x-auto min-h-0">
      <div className="flex flex-wrap flex-col w-full h-auto gap-2">
        <div className="w-full flex-row-between-center">
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
      <div className="mt-4 flex-grow grid grid-cols-4 gap-2 ">
        {!isLoading ? (
          <>
            {activeTabIsToReview ? (
              <>
                {tasksInNeedsReview.length > 0 ? (
                  <>
                    {tasksInNeedsReview.map((taskToReview) => {
                      return (
                        <TaskCard
                          key={taskToReview.id}
                          className={""}
                          {...taskToReview}
                        />
                      );
                    })}
                  </>
                ) : (
                  <>No Tasks to Review </>
                )}
              </>
            ) : (
              <>
                {tasksDone.length > 0 ? (
                  <>
                    {tasksDone.map((taskToReview) => {
                      return (
                        <TaskCard
                          key={taskToReview.id}
                          className={""}
                          {...taskToReview}
                        />
                      );
                    })}
                  </>
                ) : (
                  <>No Tasks Done Yet </>
                )}
              </>
            )}
          </>
        ) : (
          <>Loading....</>
        )}
      </div>
    </div>
  );
}
