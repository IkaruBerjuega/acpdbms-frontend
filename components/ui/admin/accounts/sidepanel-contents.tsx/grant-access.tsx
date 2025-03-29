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
import { useEffect, useState } from "react";
import { useFieldArray, useForm } from "react-hook-form";
import { SubmitHandler } from "react-hook-form";
import { useCheckboxStore } from "@/hooks/states/create-store";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import Image from "next/image";

export default function GrantProjectAccess({ isOpen }: { isOpen: boolean }) {
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
      project_id: "",
      project_name: "",
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

  const projectManager = TeamDetails?.managers?.find(
    (manager) => manager.role === "Project Manager"
  );

  const viceManager = TeamDetails?.managers?.find(
    (manager) => manager.role === "Vice Manager"
  );

  const { data, setData, resetData } = useCheckboxStore();

  const selectedMembers = data as AccountsTableType[];

  const removeMember = (id: number) => {
    const newData = selectedMembers.filter((emp) => emp.id !== id);
    setData(newData);
  };

  // Get QueryClient from the context
  const queryClient = useQueryClient();

  //api call to add project
  const [projectId, setProjectId] = useState<string>("");
  const projectName = watch("project_name");
  const { addTeamToProjects } = useProjectActions(projectId);

  const { mutate, isLoading } = addTeamToProjects;

  const processSubmit: SubmitHandler<grantProjectAccess> = async (data) => {
    const transformedSelectedMembers: employeesToAssign[] =
      selectedMembers
        .filter((emp) => Boolean(emp.id)) // Ensure only valid employees are mapped
        .map((emp) => ({
          employee_id: String(emp.id), // Ensure this is cast to a string
          employee_name: emp.full_name,
          role: "Member" as const, // Explicitly type the role as "Member"
        })) || [];

    const managers = data.team.filter((emp) => emp.employee_id !== undefined);

    const body = {
      team: [...managers, ...transformedSelectedMembers],
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
        },
        onError: (error: { message?: string }) => {
          toast({
            variant: "destructive",
            title: "Grant Access",
            description:
              error.message || "There was an error submitting the form",
          });
        },
      }
    );
    reset({
      project_id: undefined,
      project_name: undefined,
      team: [],
    });
    resetData();
  };

  const setEmployeeOptionsForStep2 = (
    projectManagerId: string,
    viceManagerId: string
  ) => {
    let employeesToSet = TeamDetails?.activated_accounts.filter(
      (employee) =>
        employee.id !== Number(projectManagerId) &&
        employee.id !== Number(viceManagerId)
    );
    queryClient.setQueryData(["employees"], employeesToSet);
  };

  let projectManagerId = watch(`team.${0}.employee_id`);
  let viceManagerId = watch(`team.${1}.employee_id`);

  useEffect(() => {
    setEmployeeOptionsForStep2(projectManagerId, viceManagerId);
  }, [projectManagerId, viceManagerId]);

  const next = async (step: number) => {
    if (step === 1) {
      const isValid = await trigger("project_id");

      if (!isValid) {
        return;
      }

      setProjectId(watch("project_id"));

      setValue(`team.${0}.employee_id`, String(projectManager?.id));
      setValue(`team.${0}.employee_name`, projectManager?.name ?? "");
      setValue(`team.${0}.role`, projectManager?.role);

      setValue(`team.${1}.employee_id`, String(viceManager?.id));
      setValue(`team.${1}.employee_name`, viceManager?.name ?? "");
      setValue(`team.${1}.role`, viceManager?.role);

      setStep(step + 1);
    } else if (step === 2) {
      const isValid = await trigger("team");
      console.log(projectId);
      if (!isValid) {
        return;
      }

      let employeesToSet = TeamDetails?.other_employees.filter(
        (employee) =>
          employee.id !== Number(projectManagerId) &&
          employee.id !== Number(viceManagerId)
      );

      queryClient.setQueryData(["employees"], employeesToSet);
      setStep(step + 1);
    }
  };

  const prev = async (step: number) => {
    resetData();
    if (step - 1 === 1) {
      queryClient.invalidateQueries({ queryKey: ["employees"] });
      reset({
        project_id: undefined,
        project_name: undefined,
        team: [],
      });
      setStep(1);
    } else if (step - 1 === 2) {
      setEmployeeOptionsForStep2(projectManagerId, viceManagerId);
      setStep(2);
    }
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

  let canSubmit = isProjectManagerPopulated;

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
              setValue("project_id", item.value as string);
            }}
            clearFn={() => {
              setValue("project_name", "");
              setValue("project_id", "");
            }}
          />
          <div className="flex-row-end-start mt-4 ">
            <Button onClick={() => next(step)} type="button">
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
              setValue(`team.${0}.employee_id`, item.value as string);
              setValue(`team.${0}.role`, "Project Manager");
            }}
            clearFn={() => {
              remove(0);
            }}
          />

          <FormInput<grantProjectAccess>
            name={`team.${1}.employee_name`}
            label="Vice Manager"
            placeholder={""}
            required={false}
            inputType={"search"}
            control={control}
            items={availableEmployees}
            onSelect={(item) => {
              setValue(`team.${1}.employee_name`, item.label);
              setValue(`team.${1}.employee_id`, item.value as string);
              setValue(`team.${1}.role`, "Vice Manager");
            }}
            clearFn={() => {
              remove(1);
            }}
          />

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
            <Button onClick={() => next(step)} type="button">
              Next
            </Button>
          </div>
        </>
      )}

      {step === 3 && (
        <div className="flex-col-start w-full">
          <h1 className="text-xs font-bold">
            Members<span className="text-red-500">*</span>
          </h1>
          <h2 className="text-xs">(Select employees from the table)</h2>
          <div className="w-full flex-col-center-start text-sm mt-4 space-y-2 flex-grow">
            {selectedMembers.map((employee, index) => {
              const number = index + 1;
              const initials = `${employee.first_name[0]} ${employee.last_name[0]}`;

              return (
                <div
                  key={index}
                  className="text-sm flex-row-between-center w-full"
                >
                  <div className="flex-row-start-center gap-2">
                    <span> {number}. </span>
                    <Avatar>
                      <AvatarImage
                        src={employee.profile_picture_url}
                        alt="@shadcn"
                      />
                      <AvatarFallback>{initials}</AvatarFallback>
                    </Avatar>
                    <span>{employee.full_name}</span>
                  </div>
                  <Button
                    variant={"ghost"}
                    type="button"
                    className="p-2 h-9"
                    onClick={() => removeMember(employee.id)}
                  >
                    <Image
                      src={"/button-svgs/table-action-remove.svg"}
                      alt={`Remove Selected Employee: ${employee.full_name}`}
                      width={20}
                      height={20}
                    />
                  </Button>
                </div>
              );
            })}
          </div>
          <div className="flex-row-end-start mt-10 gap-2">
            <Button
              variant={"ghost"}
              onClick={() => {
                prev(step);
              }}
              type="button"
            >
              Prev
            </Button>
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
        </div>
      )}
    </form>
  );
}
