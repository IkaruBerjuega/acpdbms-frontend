"use client";

import { useQueryParams } from "@/hooks/use-query-params";
import { AddBtn, BtnDialog, Button } from "../../../button";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import { StoreTaskRequest } from "@/lib/form-constants/form-constants";
import { SubmitHandler, useFieldArray, useForm } from "react-hook-form";
import { toast } from "@/hooks/use-toast";
import FormInput from "@/components/ui/general/form-components/form-input";
import { requireError } from "@/lib/utils";
import { usePhases } from "@/hooks/general/use-project";
import {
  usePhaseTransfer,
  useProjectSelectStore,
} from "@/hooks/states/create-store";
import { ItemInterface } from "@/lib/filter-types";
import { useEffect, useState } from "react";
import { Phase } from "@/lib/definitions";
import { useTaskActions } from "@/hooks/api-calls/employee/use-tasks";
export default function AddTask({
  paramKey,
}: {
  paramKey: "show_phases" | "add_phases";
}) {
  // setup for adding params when the button for viewing  the phases is the one used
  const { paramsKey, params } = useQueryParams();
  const { replace } = useRouter();

  const isOpen = paramsKey[paramKey] === "true";
  const pathname = usePathname();

  const open = () => {
    params.set(paramKey, "true");
    replace(`${pathname}?${params.toString()}`);
  };
  const btnOpenSrc = "/button-svgs/sidepanel-collapse.svg";

  //get phases list for phases input
  let { data: projectSelected } = useProjectSelectStore();
  let projectId = projectSelected[0]?.projectId;
  const { data: phases } = usePhases(projectId);

  const transformedPhasesList: ItemInterface[] =
    phases?.map((phase) => ({
      value: phase.id,
      label: phase.category,
    })) || [];

  //get newly set phase from clicking from phases view
  const { data: phasesToStore } = usePhaseTransfer();

  const [recentAddedPopulatedTasks, setRecentAddedPopulatedTasks] = useState<
    Phase[]
  >([]);

  //form setup here
  const {
    register,
    control,
    watch,
    reset,
    handleSubmit,
    setValue,
    formState: { errors, isValid },
  } = useForm<StoreTaskRequest>({
    mode: "onBlur",
    defaultValues: {
      tasks: [
        {
          phase_id: "",
          phase_name: "",
          task_name: "",
          task_description: "",
          duration: "",
        },
      ],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: "tasks",
  });

  const { addTasks } = useTaskActions({ projectId: projectId });

  const processSubmit: SubmitHandler<StoreTaskRequest> = async (data) => {
    console.log(data);
    addTasks.mutate(data, {
      onSuccess: (response: { message: string }) => {
        toast({
          variant: "default",
          title: "Add Tasks",
          description: response.message || "Tasks added successfully",
        });
        reset();
        setRecentAddedPopulatedTasks([]);
      },
      onError: (response: { message: string }) => {
        toast({
          variant: "destructive",
          title: "Add Tasks",
          description:
            response.message || "There was an error processing the request",
        });
      },
    });
  };

  const btnRemoveField = "/button-svgs/sidepanel-close.svg";

  useEffect(() => {
    if (phasesToStore.length === 0) return;
    phasesToStore.map((phase) => {
      setRecentAddedPopulatedTasks(phasesToStore);
      append({
        phase_id: phase.id,
        phase_name: phase.category,
        task_name: "",
        task_description: "",
        duration: "",
      });
    });
  }, [phasesToStore]);

  const handleUndoRecentlyPopulatedTasks = () => {
    recentAddedPopulatedTasks.forEach((task) => {
      const indexToRemove = fields.findIndex(
        (field) => field.phase_id === task.id
      );
      console.log(indexToRemove);

      if (indexToRemove !== -1) {
        // -1 means not found
        remove(indexToRemove);
      }
    });
    setRecentAddedPopulatedTasks([]);
  };

  return (
    <form
      onSubmit={handleSubmit(processSubmit)}
      className=" flex-grow system-padding bg-white-primary shadow-md rounded-md flex-col-start"
    >
      <div className="flex-1 overflow-y-auto min-h-0 transition-all duration-200 space-y-2">
        <div className="flex-grow space-y-4">
          <div className="w-full flex-row-end-start gap-2">
            {!isOpen && (
              <AddBtn label={"Add/View Phases"} dark={false} onClick={open} />
            )}
            <AddBtn
              label={"Add Task"}
              dark={true}
              onClick={() => {
                append({
                  phase_id: "",
                  phase_name: "",
                  task_name: "",
                  task_description: "",
                  duration: "",
                });
              }}
            />
          </div>
          <div className="flex-col-start space-y-2">
            {fields.map((field, index) => {
              return (
                <div
                  key={field.id}
                  className="flex-col-start w-full p-2 border-[1px] rounded-md text-xs"
                >
                  <div className="w-full flex-row-between-center">
                    <span className="font-semibold"> {index + 1}.</span>
                    <Button
                      onClick={() => {
                        if (fields.length === 1) {
                          toast({
                            title: "Warning",
                            description: "Can't remove last add task field",
                            variant: "destructive",
                          });
                          return;
                        }
                        remove(index);
                      }}
                      className="p-0 h-8 px-2"
                      variant={"ghost"}
                      type="button"
                    >
                      <Image
                        src={btnRemoveField}
                        width={16}
                        height={16}
                        alt={"remove add task field button"}
                      />
                    </Button>
                  </div>
                  <div className="w-full grid grid-cols-4 gap-2">
                    <FormInput
                      name={`tasks.${index}.phase_name`}
                      label={"Phase/Category"}
                      inputType={"search"}
                      validationRules={{
                        required: requireError("This field"),
                      }}
                      items={transformedPhasesList}
                      control={control}
                      onSelect={(item) => {
                        setValue(
                          `tasks.${index}.phase_id`,
                          item.value as string
                        );
                        setValue(
                          `tasks.${index}.phase_name`,
                          item.label as string
                        );
                      }}
                      clearFn={() => {
                        setValue(`tasks.${index}.phase_id`, "");
                        setValue(`tasks.${index}.phase_name`, "");
                      }}
                      errorMessage={errors.tasks?.[0]?.phase_name?.message}
                    />
                    <FormInput
                      name={`tasks.${index}.task_name`}
                      label={"Task Name"}
                      inputType={"default"}
                      validationRules={{
                        required: requireError("This field"),
                      }}
                      errorMessage={errors.tasks?.[0]?.task_name?.message}
                      register={register}
                    />
                    <FormInput
                      name={`tasks.${index}.task_description`}
                      label={"Task Description"}
                      inputType={"default"}
                      validationRules={{
                        required: requireError("This field"),
                      }}
                      errorMessage={
                        errors.tasks?.[0]?.task_description?.message
                      }
                      register={register}
                    />
                    <FormInput
                      name={`tasks.${index}.duration`}
                      label={"Task Duration"}
                      dataType="number"
                      validationRules={{
                        valueAsNumber: true,
                        required: requireError("This field"),
                        validate: (value: number) => {
                          const isValid = value > 0;
                          return isValid || "Duration should be more than 0";
                        },
                      }}
                      register={register}
                      inputType={"default"}
                      errorMessage={errors.tasks?.[0]?.duration?.message}
                    />
                  </div>
                </div>
              );
            })}
            <div className="flex justify-end gap-2 ">
              {recentAddedPopulatedTasks.length > 0 && (
                <Button
                  onClick={handleUndoRecentlyPopulatedTasks}
                  className="p-0 h-8 px-2 flex-row-center gap-2 transition-all duration-200 ease-out"
                  variant={"ghost"}
                  type="button"
                >
                  Undo Recent
                </Button>
              )}
              <BtnDialog
                dialogDescription="Do you confirm on creating the inputted tasks?"
                dialogTitle="Add Tasks"
                variant="default"
                submitType="submit"
                submitTitle="Submit"
                btnTitle="Submit"
                onClick={handleSubmit(processSubmit)}
                alt={"edit project save button"}
              />
            </div>
          </div>
        </div>
      </div>
    </form>
  );
}
