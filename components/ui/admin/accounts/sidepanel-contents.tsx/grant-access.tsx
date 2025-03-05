"use client";

import { BtnDialog, Button } from "@/components/ui/button";
import FormInput from "@/components/ui/general/form-components/form-input";
import { useAccounts } from "@/hooks/api-calls/admin/use-account";
import {
  useProjectActions,
  useProjectList,
  useTeamDetails,
} from "@/hooks/general/use-project";
import { toast } from "@/hooks/use-toast";
import {
  AccountsTableType,
  EmployeeInterface,
  ProjectListResponseInterface,
} from "@/lib/definitions";
import { ItemInterface } from "@/lib/filter-types";
import {
  employeesToAssign,
  grantProjectAccess,
} from "@/lib/form-constants/form-constants";
import { requireError } from "@/lib/utils";
import { useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { useFieldArray, useForm } from "react-hook-form";
import { SubmitHandler } from "react-hook-form";
import { useCheckboxStore } from "@/hooks/states/create-store";
import { CiCircleMinus } from "react-icons/ci";

export default function AddEmployee({ isOpen }: { isOpen: boolean }) {
  const {
    register,
    reset,
    handleSubmit,
    watch,
    control,
    trigger,
    setValue,
    formState: { errors },
  } = useForm<grantProjectAccess>({
    defaultValues: {
      project_id: undefined,
      project_name: undefined,
      team: [],
    },
  });

  //state to track steps
  const [step, setStep] = useState<number>(1);

  const { remove } = useFieldArray({
    control,
    name: "team",
  });

  const { data: employees } = useAccounts<EmployeeInterface>({
    role: "employee",
    isArchived: false,
  });

  const { data: projectList } = useProjectList<ProjectListResponseInterface>({
    isArchived: false,
  });

  const selectedProjectId = watch("project_id");
  const { data: TeamDetails } = useTeamDetails(selectedProjectId);

  const { data, setData, resetData } = useCheckboxStore();

  const selectedMembers = data as AccountsTableType[];

  const removeMember = (id: number) => {
    const newData = selectedMembers.filter((emp) => emp.id !== id);
    setData(newData);
  };

  // Get QueryClient from the context
  const queryClient = useQueryClient();

  //api call to add project
  const projectId = watch("project_id");
  const projectName = watch("project_name");
  const { addTeamToProjects } = useProjectActions(projectId);

  const { mutate, isLoading } = addTeamToProjects;

  const processSubmit: SubmitHandler<grantProjectAccess> = async (data) => {
    const transformedSelectedMembers: employeesToAssign[] =
      selectedMembers.map((emp) => ({
        employee_id: String(emp.id), // Ensure this is cast to a string
        employee_name: emp.full_name,
        role: "Member" as const, // Explicitly type the role as "Member"
      })) || [];

    const body = {
      team: [...data.team, ...transformedSelectedMembers],
    };

    //send the form
    mutate(
      body, // Actual request body
      {
        onSuccess: (response: { message?: string }) => {
          toast({
            variant: "default",
            title: "Grant Access",
            description: response.message || "Employees Added Successfully",
          });
          queryClient.invalidateQueries({ queryKey: ["employees"] });
          setStep(1);
          reset(); // Reset form fields
          resetData();
        },
        onError: (error: { message?: string }) => {
          toast({
            variant: "destructive",
            title: "Grant Access",
            description:
              error.message || "There was an error submitting the form",
          });
          reset(); // Reset form fields
        },
      }
    );
  };

  const checkIfValidToStep2 = async (step: number) => {
    const isValid = await trigger("project_id");

    if (!isValid) {
      console.log("Validation failed:", errors); // Log validation errors
      return;
    }

    queryClient.setQueryData(["employees"], TeamDetails?.other_employees);
    setStep(step + 1);
  };

  const prev = async (step: number) => {
    if (step - 1 === 1) {
      queryClient.invalidateQueries({ queryKey: ["employees"] });
      reset();
      resetData();
      setStep(1);
    }
  };

  const excludeExstMembersFromTable = (idToExclude: string) => {
    const employees = TeamDetails?.other_employees.filter(
      (emp) => String(emp.id) !== idToExclude
    );
    queryClient.setQueryData(["employees"], employees);
  };

  const projects: ItemInterface[] =
    projectList?.map((project) => ({
      value: project.id,
      label: project.project_title,
    })) || [];

  const availableEmployees: ItemInterface[] =
    employees
      ?.filter((employee) => {
        // Filter out employees who are already in selectedMembers
        return !selectedMembers.some((member) => member.id === employee.id);
      })
      .map((employee) => {
        // Transform the remaining employees into the ItemInterface structure
        return {
          value: String(employee.id),
          label: employee.full_name,
        };
      }) || [];

  const isProjectManagerPopulated = watch("team").some(
    (team) => team.role === "Project Manager"
  );

  let canSubmit = isProjectManagerPopulated || selectedMembers.length > 0;

  return (
    <form
      onSubmit={handleSubmit(processSubmit)}
      className="w-full mt-10 flex-grow flex-col-start gap-2"
    >
      {step === 1 && (
        <>
          <FormInput<grantProjectAccess>
            name={`project_name`}
            label="Project"
            placeholder={""}
            register={register}
            required
            inputType={"search"}
            errorMessage={errors?.project_name?.message}
            control={control}
            items={projects}
            validationRules={{
              required: requireError("Project"),
            }}
            onSelect={(item) => {
              setValue("project_name", item.label);
              setValue("project_id", item.value);
            }}
            clearFn={() => {
              setValue("project_name", "");
              setValue("project_id", "");
            }}
          />
          <div className="flex-row-end-start mt-4 ">
            <Button onClick={() => checkIfValidToStep2(step)} type="button">
              Next
            </Button>
          </div>
        </>
      )}
      {step === 2 && (
        <>
          <FormInput<grantProjectAccess>
            name={`team.${0}.employee_name`}
            label="Project Manager"
            placeholder={""}
            register={register}
            required
            inputType={"search"}
            errorMessage={errors?.team?.[0]?.employee_name?.message}
            control={control}
            items={availableEmployees}
            validationRules={{
              required: requireError("Project Manager"),
            }}
            onSelect={(item) => {
              setValue(`team.${0}.employee_name`, item.label);
              setValue(`team.${0}.employee_id`, item.value);
              setValue(`team.${0}.role`, "Project Manager");
              excludeExstMembersFromTable(item.value);
            }}
            clearFn={() => {
              remove(0);
            }}
          />
          {canSubmit && (
            <div className="flex-col-start mt-4">
              <h1 className="text-xs font-bold">
                Members<span className="text-red-500">*</span>
              </h1>
              <h2 className="text-xs">(Select employees from the table)</h2>
              <div className="w-full flex-col-center-start text-sm mt-2 space-y-2">
                {selectedMembers.map((employee, index) => {
                  const number = index + 1;
                  return (
                    <div
                      key={index}
                      className="text-sm flex-row-between-start w-full"
                    >
                      <div>
                        {number}. {employee.full_name}
                      </div>
                      <CiCircleMinus
                        className="text-red-700 text-xl"
                        onClick={() => removeMember(employee.id)}
                      />
                    </div>
                  );
                })}
              </div>
            </div>
          )}
          <div className="flex-row-end-start mt-10 gap-2">
            <BtnDialog
              btnTitle={"Go Back"}
              isLoading={isLoading}
              alt={"Submit Button"}
              dialogTitle={"Grant Access"}
              dialogDescription={
                "Are you sure you want to go back to step 1? All the selected employees will be reset."
              }
              onClick={() => prev(step)}
              submitType={"button"}
              submitTitle="Yes"
              variant={"ghost"}
            />
            <BtnDialog
              btnTitle={"Submit"}
              isLoading={isLoading}
              alt={"Submit Button"}
              dialogTitle={"Grant Access"}
              dialogDescription={
                "Are you sure you want grant access the selected team to this project?"
              }
              dialogContent={
                <div className="w-full">Project Name: {projectName}</div>
              }
              onClick={handleSubmit(processSubmit)}
              disabled={!canSubmit}
              submitType={"submit"}
              submitTitle="Confirm"
            />
          </div>
        </>
      )}
    </form>
  );
}
