import { useQueryParams } from "@/hooks/use-query-params";
import SidepanelDrawerComponent from "../../../general/sidepanel-drawer";
import { useCallback, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { useFieldArray, useForm } from "react-hook-form";
import { AddPhaseShortcut, PhaseRequest } from "@/lib/definitions";
import { usePhaseTransfer } from "@/hooks/states/create-store";
import { SubmitHandler } from "react-hook-form";
import { AddBtn, BtnDialog, Button } from "../../../button";
import FormInput from "../../../general/form-components/form-input";
import Image from "next/image";
import { toast } from "@/hooks/use-toast";
import { usePhases, useProjectActions } from "@/hooks/general/use-project";
import { useQueryClient } from "@tanstack/react-query";
import { requireError } from "@/lib/utils";
import { Input } from "../../../input";

import * as React from "react";

import { Combobox } from "../../../combobox";
import { ItemInterface } from "@/lib/filter-types";

function AddPhasesForm({ projectId }: { projectId: string }) {
  const {
    control,
    reset,
    handleSubmit,
    formState: { errors },
  } = useForm<PhaseRequest>({
    defaultValues: {
      phases: [
        {
          category: "",
        },
      ],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: "phases",
  });

  const btnRemoveField = "/button-svgs/sidepanel-close.svg";

  const queryClient = useQueryClient();

  const { addPhases } = useProjectActions(projectId);

  const { mutate, isLoading } = addPhases;

  const processSubmit: SubmitHandler<PhaseRequest> = (data) => {
    //send the form
    mutate(
      { phases: data.phases }, // Actual request body
      {
        onSuccess: (response: { message?: string }) => {
          toast({
            variant: "default",
            title: "Add Phases",
            description: response.message || "Phases Added Successfully",
          });
          queryClient.invalidateQueries({
            queryKey: ["phases-to-add", projectId],
          });
        },
        onError: (error: { message?: string }) => {
          toast({
            variant: "destructive",
            title: "Add Phases",
            description:
              error.message || "There was an error submitting the form",
          });
        },
      }
    );
    reset({
      phases: [{ category: "" }],
    });
  };

  return (
    <form
      onSubmit={handleSubmit(processSubmit)}
      className="w-full flex-grow transition-all duration-200 flex flex-col justify-between space-y-4"
    >
      <div className="space-y-4">
        <div className="w-full flex-row-end-start">
          <AddBtn
            onClick={() =>
              append({
                category: "",
              })
            }
            label={"Add Field"}
            dark={true}
          />
        </div>
        {fields.map((field, index) => {
          return (
            <div
              key={field.id}
              className="flex-row-start w-full gap-2 transition-all duration-200"
            >
              <p className="text-sm text-slate-500">{index + 1}.</p>
              <div className="flex-row-start-center flex-grow ">
                <FormInput
                  name={`phases.${index}.category`}
                  label={"Phase"}
                  inputType={"default"}
                  control={control}
                  className="w-full"
                  validationRules={{ required: requireError("This field") }}
                  errorMessage={
                    errors?.phases?.[index]?.category?.message ?? ""
                  }
                />
                <Button
                  onClick={() => {
                    if (fields.length === 1) {
                      toast({
                        title: "Warning",
                        description: "Can't remove last add phase field",
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
                    alt={"remove add phase field button"}
                  />
                </Button>
              </div>
            </div>
          );
        })}
      </div>

      <div className="w-full flex-row-end-start">
        <BtnDialog
          btnTitle={"Submit"}
          isLoading={isLoading}
          alt={"Submit Phases"}
          dialogTitle={"Add Phases"}
          dialogDescription={
            "Do  you confirm on submitting the inputted phases?"
          }
          onClick={handleSubmit(processSubmit)}
          submitType={"submit"}
          submitTitle="Confirm"
        />
      </div>
    </form>
  );
}

function ShowPhases({ projectId }: { projectId: string }) {
  //stores
  const { setData } = usePhaseTransfer();

  //setup
  const { data: phases } = usePhases(projectId);
  const [noOfFieldsToAdd, setNoOfFieldsToAdd] = useState<number>(0);
  const [phase, setPhase] = useState<AddPhaseShortcut>();

  //function to store
  const store = (phase: AddPhaseShortcut) => {
    const phaseContainer = [...Array(noOfFieldsToAdd)].map(() => phase);

    setData(phaseContainer);
  };

  const isValidAmount = noOfFieldsToAdd <= 50; // Adjusted to <= 50 for clarity

  const transformedPhasesList: ItemInterface[] =
    phases?.map((phase) => ({
      value: phase.id,
      label: phase.category,
    })) || [];

  return (
    <div className="w-full flex-grow mt-2 space-y-4">
      <div className="flex-col-start gap-2">
        <Combobox
          placeholder={"Select Phase/Category"}
          emptyMessage={"No Categories"}
          items={transformedPhasesList}
          onSelect={(item) =>
            setPhase({ id: item.value as string, category: item.label })
          }
          clearFn={() => {
            setPhase(undefined);
          }}
        />
        <Input
          placeholder="No. of tasks to be added"
          onChangeCapture={(e) => {
            const value = Number(e.currentTarget.value);
            setNoOfFieldsToAdd(value);
          }}
        />
        {!isValidAmount && (
          <div className="text-red-500 text-xs">
            You can only add up to 50 groups of fields.
          </div>
        )}
      </div>

      <div className="flex-row-end-center  ">
        <AddBtn
          label={"Add Fields"}
          dark={true}
          onClick={() => {
            if (phase) store(phase);
          }}
        />
      </div>
    </div>
  );
}

export default function AddPhase({
  activeTab,
  activeParamKey,
  projectId,
}: {
  activeTab: "Add Phases" | "Phases";
  activeParamKey: "show_phases" | "add_phases";
  projectId: string;
}) {
  const { params } = useQueryParams();
  const pathname = usePathname();
  const { replace } = useRouter();

  // Function to update query parameters without modifying params directly
  const createQueryString = useCallback(
    (parameter: string, value: string) => {
      if (parameter === "show_phases") {
        params.delete("add_phases");
      } else {
        params.delete("show_phases");
      }

      params.set(parameter, value);
      replace(`${pathname}?${params.toString()}`);
    },
    [pathname, params, replace]
  );

  const tabs = {
    activeTab: activeTab,
    tabItems: [
      {
        item: "Phases",
        action: () => {
          createQueryString("show_phases", "true");
        },
      },
      {
        item: "Add Phases",
        action: () => {
          createQueryString("add_phases", "true");
        },
      },
    ],
  };

  const titleAndDescription = {
    show_phases: {
      title: "Phases",
      description: "Select a phase/category and the no of fields to add tasks ",
      content: <ShowPhases projectId={projectId} />,
    },
    add_phases: {
      title: "Add Phases",
      description: "Add multiple phases/category",
      content: <AddPhasesForm projectId={projectId} />,
    },
  };

  return (
    <SidepanelDrawerComponent
      paramKey={activeParamKey}
      content={titleAndDescription[activeParamKey].content}
      title={titleAndDescription[activeParamKey].title}
      description={titleAndDescription[activeParamKey].description}
      tabs={tabs}
    />
  );
}
