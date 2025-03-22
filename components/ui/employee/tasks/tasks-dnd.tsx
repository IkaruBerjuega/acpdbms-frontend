"use client";

import React, { useState } from "react";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import TaskColumn from "./task-columns";
import { useProjectSelectStore } from "@/hooks/states/create-store";
import {
  useGetTasks,
  useTaskActions,
} from "@/hooks/api-calls/employee/use-tasks";
import { useCreateTableColumns } from "../../general/data-table-components/create-table-columns";
import { useSearchParams } from "next/navigation";
import { useCustomTable } from "../../general/data-table-components/custom-tanstack";
import { getPhaseBadgeColor } from "@/lib/utils";
import FilterPopOver from "../../general/data-table-components/filter-components/filter-popover";
import { LuFilter } from "react-icons/lu";
import { DialogNoBtn } from "../../dialog";
import { toast } from "@/hooks/use-toast";
import { useQueryClient } from "@tanstack/react-query";
import { ColumnInterfaceProp } from "@/lib/definitions";
import {
  TASK_STATUSES,
  TaskItem,
  TaskItemProps,
  TaskStatuses,
} from "@/lib/tasks-definitions";
import { useQueryParams } from "@/hooks/use-query-params";

export default function TasksDND() {
  //get selected project id
  const { data: projectSelected } = useProjectSelectStore();

  const { params, paramsKey } = useQueryParams();

  const isGeneral = paramsKey["view"] !== "assigned";

  //tasks
  const { data: taskList, isLoading } = useGetTasks({
    projectId: projectSelected[0]?.projectId,
    initialData: { tasks: [] },
    isGeneral,
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
    tasks ?? [],
    transformedColumns,
    undefined,
    searchParams
  );

  const plainTasks = table.getRowModel().rows.map((row) => row.original);
  const phaseColors = getPhaseBadgeColor(phases);

  const convertedTasks: TaskItemProps[] = plainTasks.map((task) => ({
    ...task,
    phaseColor: phaseColors[task.phase_category], // Explicitly add phaseColor
  }));

  //actions

  const [open, setOpen] = useState<boolean>(false);
  const [taskId, setTaskId] = useState<number>();
  const [droppedStatus, setDroppedByStatus] = useState<TaskStatuses>("to do");
  const [recentStatus, setRecentStatus] = useState<TaskStatuses>("to do");
  const { startTask, pauseTask, setTaskToNeedsReview } = useTaskActions({
    taskId: String(taskId),
    projectId: projectSelected[0]?.projectId,
  });

  const fromPausedOrReview =
    recentStatus === "paused" || recentStatus === "needs review";

  const dialogConfig = {
    "in progress": {
      action: startTask,
      title: fromPausedOrReview ? "Continue" : "Start Task",
      desc: fromPausedOrReview
        ? "Do you confirm on continuing the selected/dragged task?"
        : "Do you confirm on starting the selected/dragged task?",
      successMessagePlaceholder: fromPausedOrReview
        ? "taskContinuedSuccessfully"
        : "Task started successfully",
    },
    paused: {
      action: pauseTask,
      title: "Pause Task",
      desc: "Do you confirm on pausing the selected/dragged task?",
      successMessagePlaceholder: "Task paused successfully",
    },
    "needs review": {
      action: setTaskToNeedsReview,
      title: "Set to Needs Review",
      desc: "Do you confirm on setting to needs review the selecteqd/dragged task?",
      successMessagePlaceholder: "Task is now set to needs review",
    },
    "to do": {
      action: setTaskToNeedsReview,
      title: "Set to Needs Review",
      desc: "Do you confirm on setting to needs review the selected/dragged task?",
      successMessagePlaceholder: "Task is now set to needs review",
    },
    done: {
      action: setTaskToNeedsReview,
      title: "Finish Task",
      desc: "Do you confirm on finishing the selected/dragged task?",
      successMessagePlaceholder: "Task is now finished",
    },
    cancelled: {
      action: setTaskToNeedsReview,
      title: "Set to Needs Review",
      desc: "Do you confirm on setting to needs review the selected/dragged task?",
      successMessagePlaceholder: "Task is now set to needs review",
    },
  };

  const queryClient = useQueryClient();

  const action = (droppedStatus: TaskStatuses) => {
    const actionFn = dialogConfig[droppedStatus].action.mutate;
    const title = dialogConfig[droppedStatus].title;
    const successMessagePlaceholder =
      dialogConfig[droppedStatus].successMessagePlaceholder;

    //send the form
    actionFn(
      null, // Actual request body
      {
        onSuccess: async (response: { message?: string }) => {
          toast({
            variant: "default",
            title: title,
            description: response.message || successMessagePlaceholder,
          });

          queryClient.invalidateQueries({
            queryKey: ["tasks", projectSelected[0]?.projectId],
          });
        },
        onError: (error: { message?: string }) => {
          toast({
            variant: "destructive",
            title: title,
            description:
              error.message || "There was an error submitting the form",
          });
        },
      }
    );
    setOpen(false);
  };

  const moveTask = ({
    id,
    droppedStatus,
    recentStatus,
  }: {
    id: number;
    droppedStatus: TaskStatuses;
    recentStatus: TaskStatuses;
  }) => {
    if (droppedStatus === "in progress" && recentStatus === "needs review") {
      toast({
        title: "Warning",
        description:
          "Tasks that are being reviewed cannot be directly set to in progress, wait for the approval of project manager",
        variant: "destructive",
      });

      return;
    }

    if (droppedStatus === "to do" && recentStatus === "done") {
      toast({
        title: "Warning",
        description: "Tasks that are finished cannot be reversed",
        variant: "destructive",
      });

      return;
    }

    if (droppedStatus === "to do" && recentStatus === "needs review") {
      toast({
        title: "Warning",
        description: "Tasks that are being reviewed cannot be set to do",
        variant: "destructive",
      });

      return;
    }

    if (droppedStatus === "paused" && recentStatus === "needs review") {
      toast({
        title: "Warning",
        description:
          "Tasks that are being reviewed cannot be directly paused, wait for the approval of project manager",
        variant: "destructive",
      });

      return;
    }

    if (droppedStatus === "done" && recentStatus === "in progress") {
      toast({
        title: "Warning",
        description:
          "Tasks in progress cannot be finished without being reviewed and manager approval",
        variant: "destructive",
      });
      return;
    }

    if (droppedStatus === "done" && recentStatus === "to do") {
      toast({
        title: "Warning",
        description:
          "Tasks to do cannot be finished without being reviewed and manager approval",
        variant: "destructive",
      });
      return;
    }

    setTaskId(id);
    setOpen(true);
    setDroppedByStatus(droppedStatus);
    setRecentStatus(recentStatus);
  };

  if (isLoading) {
    return <>Loading Tasks...</>;
  }

  if (tasks?.length === 0) {
    return <>No Tasks for project selected {projectSelected[0]?.projectId}</>;
  }

  return (
    <DndProvider backend={HTML5Backend}>
      <div className="w-full flex-col-start overflow-x-auto min-h-0 ">
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
        <div className="flex-grow flex-row-start mt-4 ">
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
      {open && (
        <DialogNoBtn
          title={dialogConfig[droppedStatus].title}
          description={dialogConfig[droppedStatus].desc}
          content={<></>}
          onClick={() => action(droppedStatus)}
          onOpen={open}
          onClose={() => setOpen(false)}
        />
      )}
    </DndProvider>
  );
}
