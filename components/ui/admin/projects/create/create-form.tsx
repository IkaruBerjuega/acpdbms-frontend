"use client";

import { FaTriangleExclamation } from "react-icons/fa6";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { FormProvider, useForm, SubmitHandler } from "react-hook-form";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { BtnDialog, Button } from "@/components/ui/button";
import { ProjectFormSchemaType } from "@/lib/form-constants/project-constants";
import StepperIndicator from "./stepper";
import ProjectDetails from "./project-details";
import { toast } from "@/hooks/use-toast";
import { useProjectActions } from "@/hooks/general/use-project";

const defaultValues = {
  client_id: undefined,
  client_name: undefined,
  project_title: "",
  region: "",
  province: "",
  city_town: "",
  barangay: "",
  street: "",
  block: "",
  lot: "",
  zip_code: undefined,
  status: "ongoing",
  start_date: undefined,
  end_date: undefined,
  project_description: "",
};

const steps = [
  {
    id: "Step 1",
    name: "Project Details",
    fields: [
      "client_id",
      "project_title",
      "project_description",
      "state",
      "city_town",
      "street",
      "zip_code",
      "start_date",
      "end_date",
    ],
  },
];

function getStepContent(step: number) {
  if (step === 0) {
    return <ProjectDetails />;
  }
  return "Unknown step";
}

export default function AddNewProject() {
  const [currentStep, setCurrentStep] = useState(0);
  const constRouter = useRouter();

  const methods = useForm<ProjectFormSchemaType>({
    mode: "onBlur",
    defaultValues,
  });

  const {
    handleSubmit,
    trigger,
    watch,
    formState: { errors, isValid },
  } = methods;

  const { addProject } = useProjectActions();

  const { mutate, isLoading } = addProject;

  const processSubmit: SubmitHandler<ProjectFormSchemaType> = (data) => {
    const formData = new FormData();

    // append ProjectDetails (step 1) fields
    formData.append("client_id", data.client_id?.toString() || "");
    formData.append("project_title", data.project_title);
    formData.append("project_description", data.project_description || "");
    formData.append(
      "start_date",
      new Date(data.start_date || "").toLocaleDateString()
    );
    formData.append(
      "end_date",
      data.end_date ? new Date(data.end_date || "").toLocaleDateString() : ""
    );
    formData.append("street", data.street);
    formData.append("city_town", data.city_town);
    formData.append("state", data.state);
    formData.append("zip_code", data.zip_code?.toString() || "");
    formData.append("image_url", "");
    console.log("Formatted data:", Array.from(formData.entries()));

    mutate(formData, {
      onSuccess: (response: { message: string }) => {
        {
          constRouter.push("/admin/projects");
          toast({
            title: "Notification",
            description: response.message || "New Project Added.",
          });
        }
      },
      onError: (response: { message: string }) => {
        toast({
          variant: "destructive",
          title: "Notification",
          description:
            response.message || "There was an error processing the request",
        });
      },
    });
  };

  type FieldName = keyof ProjectFormSchemaType;
  type FieldPath = FieldName; // only step 1 fields are used

  const next = async () => {
    // determine fields to validate for the current step
    const fields: FieldPath[] = steps[currentStep].fields as FieldPath[];
    // const values = methods.getValues(fields);

    const output = await trigger(fields, { shouldFocus: true });

    if (!output) return;

    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      handleSubmit(processSubmit)();
    }
  };

  const prev = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const stepLabels = ["Project Details"];
  const projectName = watch("project_title");

  return (
    <FormProvider {...methods}>
      <div className="system-padding bg-white-primary rounded-lg shadow-md flex-grow">
        <StepperIndicator
          stepLabels={stepLabels}
          activeStep={currentStep + 1}
        />
        {errors.root?.formError && (
          <Alert variant="destructive" className="mt-[28px]">
            <FaTriangleExclamation className="h-4 w-4" />
            <AlertTitle>Form Error</AlertTitle>
            <AlertDescription>
              {errors.root?.formError?.message}
            </AlertDescription>
          </Alert>
        )}

        <form onSubmit={handleSubmit(processSubmit)}>
          {getStepContent(currentStep)}
          <div className="flex-row-end-center">
            {currentStep !== 0 && (
              <Button
                type="button"
                className="w-[100px]"
                variant="secondary"
                onClick={prev}
              >
                Back
              </Button>
            )}
            {currentStep === steps.length - 1 ? (
              <BtnDialog
                btnTitle={"Submit"}
                isLoading={isLoading}
                alt={"Submit Button"}
                dialogTitle={"Add Project"}
                dialogDescription={
                  "Are you sure you want to create this project?"
                }
                dialogContent={
                  <div className="w-full">Project Name: {projectName}</div>
                }
                onClick={() => next()}
                disabled={!isValid}
                submitType={"submit"}
                submitTitle="Confirm"
              />
            ) : (
              <Button
                type="button"
                className="w-[100px] bg-gray-800 hover:bg-primary text-white-primary hover:text-white-primary"
                onClick={next}
              >
                Next
              </Button>
            )}
          </div>
        </form>
      </div>
    </FormProvider>
  );
}
