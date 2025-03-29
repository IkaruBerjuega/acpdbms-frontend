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
import { getPhaseBadgeColor, requireError } from "@/lib/utils";
import FilterPopOver from "../../general/data-table-components/filter-components/filter-popover";
import { LuFilter } from "react-icons/lu";
import { DialogNoBtn } from "../../dialog";
import { toast } from "@/hooks/use-toast";
import { useQueryClient } from "@tanstack/react-query";
import { ColumnInterfaceProp } from "@/lib/definitions";
import {
  ReviewTaskRequest,
  TASK_STATUSES,
  TaskItem,
  TaskItemProps,
  TaskStatuses,
} from "@/lib/tasks-definitions";
import { useQueryParams } from "@/hooks/use-query-params";
import { SubmitHandler, useForm } from "react-hook-form";
import FormInput from "../../general/form-components/form-input";

const isReviewTaskRequest = (obj: any): obj is ReviewTaskRequest => {
  return (
    obj &&
    "approved" in obj &&
    "new_task_description" in obj &&
    "new_duration" in obj
  );
};

export default function TasksDND() {
  //get selected project id
  const { data: projectSelected } = useProjectSelectStore();

  const { params, paramsKey } = useQueryParams();

  const isGeneral = paramsKey["view"] === "general";

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
  const { startTask, pauseTask, setTaskToNeedsReview, reviewTask } =
    useTaskActions<ReviewTaskRequest | null>({
      taskId: String(taskId),
      projectId: projectSelected[0]?.projectId,
    });

  //for making a new version when the recent status is in needs review
  const {
    register,
    reset,
    handleSubmit,
    watch,
    control,
    trigger,
    setValue,
    formState: { errors },
  } = useForm<ReviewTaskRequest>({
    defaultValues: {
      approved: undefined,
      new_task_description: undefined,
      new_duration: undefined,
    },
  });

  //ui for setting new task description and duration
  const CreateNewVersion = () => {
    return (
      <form>
        <FormInput
          name={"new_task_description"}
          label={"New Task Description"}
          inputType={"textArea"}
          validationRules={{ required: requireError("New Task Description") }}
          register={register}
        />
        <FormInput
          name={"new_duration"}
          label={"New Task Duration"}
          dataType="number"
          inputType={"default"}
          validationRules={{ required: requireError("New Duration") }}
          register={register}
        />
      </form>
    );
  };

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
      content: <></>,
    },
    paused: {
      action: pauseTask,
      title: "Pause Task",
      desc: "Do you confirm on pausing the selected/dragged task?",
      successMessagePlaceholder: "Task paused successfully",
      content: <></>,
    },
    "needs review": {
      action: setTaskToNeedsReview,
      title: "Set to Needs Review",
      desc: "Do you confirm on setting to needs review the selecteqd/dragged task?",
      successMessagePlaceholder: "Task is now set to needs review",
      content: <></>,
    },
    "to do": {
      action: reviewTask,
      title: "Create New Version",
      desc: "Enter the new Task Description and Duration",
      successMessagePlaceholder: "Task is now set to needs review",
      content: <CreateNewVersion />,
    },
    done: {
      action: reviewTask,
      title: "Finish Task",
      desc: "Do you confirm on finishing the selected/dragged task?",
      successMessagePlaceholder: "Task is now finished",
      content: <></>,
    },
    cancelled: {
      action: setTaskToNeedsReview,
      title: "Set to Needs Review",
      desc: "Do you confirm on setting to needs review the selected/dragged task?",
      successMessagePlaceholder: "Task is now set to needs review",
      content: <></>,
    },
  };

  const queryClient = useQueryClient();

  const getFormData = (): ReviewTaskRequest => {
    return {
      approved: watch("approved"),
      new_task_description: watch("new_task_description"),
      new_duration: watch("new_duration"),
    };
  };

  const action = (droppedStatus: TaskStatuses) => {
    const actionFn = dialogConfig[droppedStatus]?.action?.mutate;
    if (!actionFn) {
      console.error(`Mutation function not found for status: ${droppedStatus}`);
      return;
    }

    const title = dialogConfig[droppedStatus].title;
    const successMessagePlaceholder =
      dialogConfig[droppedStatus].successMessagePlaceholder;
    const body =
      droppedStatus === "to do" || droppedStatus === "done"
        ? getFormData()
        : null;

    // Execute the mutation
    actionFn(body, {
      onSuccess: async (response: { message?: string }) => {
        toast({
          variant: "default",
          title,
          description: response.message || successMessagePlaceholder,
        });

        const projectId = projectSelected[0]?.projectId;
        if (projectId) {
          queryClient.invalidateQueries({
            queryKey: isGeneral
              ? ["tasks", projectId]
              : ["my-tasks", projectId],
          });
        }
      },
      onError: (error: { message?: string }) => {
        toast({
          variant: "destructive",
          title,
          description:
            error.message || "There was an error submitting the form",
        });
      },
    });

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
    if (droppedStatus === recentStatus) return;
    if (droppedStatus === "in progress" && recentStatus === "needs review") {
      toast({
        title: "Warning",
        description:
          "Tasks that are being reviewed cannot be set to in progress",
        variant: "destructive",
      });

      return;
    }

    if (droppedStatus === "to do" && recentStatus === "done") {
      toast({
        title: "Warning",
        description: "Tasks that are finished cannot be moved",
        variant: "destructive",
      });

      return;
    }

    if (droppedStatus === "paused" && recentStatus === "needs review") {
      toast({
        title: "Warning",
        description: "Tasks that are being reviewed cannot be directly paused",
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
          "Tasks to do cannot be finished without being manager approval",
        variant: "destructive",
      });
      return;
    }

    if (droppedStatus === "to do" && recentStatus === "needs review") {
      setValue("approved", false);
    }
    if (droppedStatus === "done" && recentStatus === "needs review") {
      setValue("approved", true);
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
          content={dialogConfig[droppedStatus].content}
          onClick={() => action(droppedStatus)}
          onOpen={open}
          onClose={() => setOpen(false)}
        />
      )}
    </DndProvider>
  );
}
