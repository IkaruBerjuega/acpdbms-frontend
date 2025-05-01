"use client";

//update task form to be added in task sheet container

import { UpdateTaskRequest } from "@/lib/tasks-definitions";
import { SubmitHandler, useForm } from "react-hook-form";
import FormInput from "../form-components/form-input";
import { BtnDialog } from "../../button";
import { useTaskActions } from "@/hooks/api-calls/employee/use-tasks";
import { useQueryClient } from "@tanstack/react-query";
import { useEffect } from "react";
import { useTaskToUpdateDetails } from "@/hooks/states/create-store";
import { toast } from "@/hooks/use-toast";
import { requireError } from "@/lib/utils";

export default function UpdateTaskForm({
  projectId,
  taskId,
}: {
  projectId: string | null;
  taskId: string | undefined;
}) {
  const methods = useForm<UpdateTaskRequest>({
    mode: "onSubmit",
    defaultValues: {
      task_name: null,
      task_description: null,
      duration: null,
    },
  });

  const { data: toPopulate } = useTaskToUpdateDetails();
  const dataToPopulate = toPopulate[0];

  const {
    register,
    reset,
    handleSubmit,
    formState: { errors },
  } = methods;

  useEffect(() => {
    reset({
      task_name: dataToPopulate?.task_name,
      task_description: dataToPopulate?.task_description,
      ...(dataToPopulate?.status === "to do"
        ? { duration: String(dataToPopulate?.remaining_duration) }
        : {}),
    });
  }, [dataToPopulate]);

  const queryClient = useQueryClient();

  const { updateTask } = useTaskActions({
    projectId: projectId ?? "",
    taskId: taskId ?? "",
  });

  const processForm: SubmitHandler<UpdateTaskRequest> = (data) => {
    updateTask.mutate(data, {
      onSuccess: async (response: { message: string }) => {
        toast({
          title: "Update Task",
          description: response.message || "Task updated successfully",
        });

        await Promise.all([
          queryClient.invalidateQueries({ queryKey: ["tasks", projectId] }),
          queryClient.invalidateQueries({ queryKey: ["my-tasks", projectId] }),
        ]);
      },
      onError: (error: { message: string }) => {
        toast({
          variant: "destructive",
          title: "Update Task",
          description:
            error.message || "There was an error processing the request",
        });
      },
    });
  };

  return (
    <form
      onSubmit={handleSubmit(processForm)}
      className="w-full flex-grow  min-h-0 overflow-y-auto space-y-2 px-1"
    >
      <FormInput
        name={"task_name"}
        label={"Task Name"}
        register={register}
        inputType={"default"}
        validationRules={{ required: requireError("Task Name") }}
        required={true}
        errorMessage={errors.task_name?.message}
      />
      <FormInput
        name={"task_description"}
        label={"Task Description"}
        register={register}
        inputType={"default"}
        validationRules={{ required: requireError("Task Description") }}
        required={true}
        errorMessage={errors.task_description?.message}
      />

      {dataToPopulate?.status === "to do" && (
        <FormInput
          name={"duration"}
          label={"Duration"}
          register={register}
          dataType="number"
          inputType={"default"}
          validationRules={{ required: requireError("Duration") }}
          required={true}
          errorMessage={errors.duration?.message}
        />
      )}

      <div className="flex-row-end-start mt-4 ">
        <BtnDialog
          btnTitle={"Submit"}
          isLoading={updateTask.isLoading}
          alt={"Update Task Button"}
          dialogTitle={"Update Task"}
          dialogDescription={
            "Do you confirm on updating the selected task's details?"
          }
          dialogContent={<></>}
          onClick={handleSubmit(processForm)}
          submitType={"submit"}
          submitTitle="Confirm"
        />
      </div>
    </form>
  );
}
