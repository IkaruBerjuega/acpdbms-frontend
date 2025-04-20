import { BtnDialog } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import FormInput from "@/components/ui/general/form-components/form-input";
import { useProjectActions, useProjectList } from "@/hooks/general/use-project";
import { toast } from "@/hooks/use-toast";
import {
  DuplicatedProjectResponse,
  DuplicateProjectForm,
} from "@/lib/definitions";
import { ItemInterface } from "@/lib/filter-types";
import { requireError } from "@/lib/utils";
import { useRouter } from "next/navigation";
import { SubmitHandler, useForm } from "react-hook-form";

export default function DuplicateProject() {
  const methods = useForm<DuplicateProjectForm>({
    mode: "onSubmit",
    defaultValues: {
      project_id: "",
      duplicate_phases: false,
      duplicate_team_members: false,
      project_description: undefined,
    },
  });

  const router = useRouter();

  const { data } = useProjectList({ isArchived: false });

  const finishedProjects = data?.filter(
    (project) => project.status === "finished"
  );

  const projectItems: ItemInterface[] =
    finishedProjects?.map((project) => {
      return {
        value: project.id,
        label: project.project_title,
      };
    }) || [];

  const { watch, setValue, handleSubmit, register, control } = methods;
  const { duplicateProject } = useProjectActions(watch("project_id"));

  const isDuplicatePhasesChecked = watch("duplicate_phases");
  const isDuplicateTeamMemebersChecked = watch("duplicate_team_members");

  const processForm: SubmitHandler<DuplicateProjectForm> = (data) => {
    const formattedData = {
      duplicate_phases: data.duplicate_phases,
      duplicate_team_members: data.duplicate_team_members,
      project_description: data.project_description,
    };
    duplicateProject.mutate(
      formattedData,

      {
        onSuccess: (response: DuplicatedProjectResponse) => {
          toast({
            title: "Duplicate Project",
            description:
              response.message ||
              `Created a new version for project ${watch("project_name")}`,
          });
          router.push("/admin/projects");
        },
        onError: (error: { message: string }) => {
          toast({
            title: "Duplicate Project",
            description:
              error.message || "There was an error processing the request",
            variant: "destructive",
          });
        },
      }
    );
  };

  return (
    <form
      onSubmit={handleSubmit(processForm)}
      className="system-padding flex-col-start gap-4 flex-grow"
    >
      <FormInput
        name={"project_name"}
        label={"Project To Duplicate"}
        inputType={"search"}
        control={control}
        className="lg:w-1/2"
        required={true}
        validationRules={{ required: requireError("Project to duplicate") }}
        items={projectItems}
        onSelect={(item) => {
          setValue("project_id", item.value as string);
          setValue("project_name", item.label);
        }}
      />
      <FormInput
        name={"project_description"}
        label={"New Project Description"}
        inputType={"textArea"}
        register={register}
        className="lg:w-1/2"
        required={false}
      />
      <div className="flex-row-start gap-4">
        <div className="flex-row-start-center gap-2">
          <Checkbox
            checked={isDuplicatePhasesChecked}
            onCheckedChange={(value) => setValue("duplicate_phases", !!value)}
          />
          <span className="text-xs">Duplicate Phases</span>
        </div>
        <div className="flex-row-start-center gap-2">
          <Checkbox
            checked={isDuplicateTeamMemebersChecked}
            onCheckedChange={(value) =>
              setValue("duplicate_team_members", !!value)
            }
          />
          <span className="text-xs">Duplicate Team Members</span>
        </div>
      </div>

      <div className="flex-grow flex-row-end-end ">
        <BtnDialog
          btnTitle={"Submit"}
          isLoading={duplicateProject.isLoading}
          alt={"Submit Button"}
          dialogTitle={"Duplicate Project"}
          dialogDescription={"Are you sure you want to duplicate this project?"}
          dialogContent={
            <div className="w-full flex-col-start">
              <span>Project Name: {watch("project_name")}</span>
            </div>
          }
          onClick={handleSubmit(processForm)}
          disabled={!methods.formState.isValid}
          submitType={"submit"}
          submitTitle="Confirm"
        />
      </div>
    </form>
  );
}
