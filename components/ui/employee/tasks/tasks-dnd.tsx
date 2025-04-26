"use client";

import React, { useMemo, useState } from "react";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import TaskColumn from "./task-columns";
import {
  useGetTasks,
  useTaskActions,
} from "@/hooks/api-calls/employee/use-tasks";
import { getPhaseBadgeColor, requireError } from "@/lib/utils";
import { DialogNoBtn } from "../../dialog";
import { toast } from "@/hooks/use-toast";
import { useQueryClient } from "@tanstack/react-query";
import {
  ReviewTaskRequest,
  TASK_STATUSES,
  TaskItem,
  TaskItemProps,
  TaskStatuses,
} from "@/lib/tasks-definitions";
import { useForm } from "react-hook-form";
import FormInput from "../../general/form-components/form-input";
import { ButtonTasksDndFilter } from "./tasks-dnd-filters";

export default function TasksDND({
  projectId,
  view,
  query,
  phaseFilters,
  memberFilters,
  dateFilter,
}: {
  projectId: string;
  view: "general" | "assigned" | null;
  query: string | null;
  phaseFilters: string | null;
  memberFilters: string | null;
  dateFilter: string | null;
}) {
  const isGeneral = view === "general";

  //tasks
  const { data: taskList, isLoading } = useGetTasks({
    projectId: projectId,
    initialData: { tasks: [] },
    isGeneral,
  });

  const tasks = useMemo(() => {
    let tasks: TaskItem[] = taskList?.tasks || [];
    if (query) {
      const filteredList =
        tasks.filter((task) =>
          Object.values(task).some((value) =>
            String(value).toLowerCase().includes(query.toLowerCase())
          )
        ) || [];
      tasks = filteredList;
    }

    if (phaseFilters) {
      const filters = phaseFilters.split("_");

      const filteredList =
        tasks.filter((task) => filters.includes(task.phase_category)) || [];

      tasks = filteredList;
    }

    if (memberFilters) {
      const filters = memberFilters.split("_");

      const filteredList =
        tasks.filter((task) =>
          task.assigned_team_members.some((member) =>
            filters.includes(member.full_name)
          )
        ) || [];

      tasks = filteredList;
    }

    if (dateFilter) {
      const filteredList = tasks.filter((task) => {
        if (dateFilter === "due_today") {
          return task.remaining_duration <= 1;
        }

        if (dateFilter === "due_in_3_days") {
          return task.remaining_duration <= 3;
        }

        if (dateFilter === "due_in_7_days") {
          return task.remaining_duration <= 7;
        }

        if (dateFilter === "due_in_14_days") {
          return task.remaining_duration <= 14;
        }

        if (dateFilter === "due_in_30_days") {
          return task.remaining_duration <= 30;
        }
      });

      tasks = filteredList;
    }

    return tasks;
  }, [taskList, query, phaseFilters, memberFilters, dateFilter]);

  const phases: string[] = [
    ...new Set(
      tasks
        ?.map((task) => task.phase_category)
        .filter((phase): phase is string => phase !== null) ?? []
    ),
  ];

  const phaseColors = getPhaseBadgeColor(phases);

  const convertedTasks: TaskItemProps[] =
    tasks?.map((task) => ({
      ...task,
      phaseColor: phaseColors[task.phase_category], // Explicitly add phaseColor
    })) || [];

  //actions
  const [open, setOpen] = useState<boolean>(false);
  const [taskId, setTaskId] = useState<number>();
  const [droppedStatus, setDroppedByStatus] = useState<TaskStatuses>("to do");
  const [recentStatus, setRecentStatus] = useState<TaskStatuses>("to do");
  const { startTask, pauseTask, setTaskToNeedsReview, reviewTask } =
    useTaskActions<ReviewTaskRequest | null>({
      taskId: String(taskId),
      projectId: projectId,
    });

  //for making a new version when the recent status is in needs review
  const { register, watch, setValue } = useForm<ReviewTaskRequest>({
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

    if (droppedStatus === "needs review" && recentStatus === "to do") {
      toast({
        title: "Warning",
        description: "Tasks that are to do cannot be set to needs review",
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

    if (
      droppedStatus === "to do" &&
      (recentStatus === "needs review" || recentStatus === "done")
    ) {
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
    return <div className="py-2">Loading Tasks...</div>;
  }

  if (tasks?.length === 0) {
    return <div className="py-2">No Tasks </div>;
  }

  return (
    <DndProvider backend={HTML5Backend}>
      <div className="w-full">
        <ButtonTasksDndFilter />
      </div>
      <div className="w-full flex-col-start overflow-x-auto min-h-0 flex-grow">
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
