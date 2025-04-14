"use client";

import { BtnDialog } from "@/components/ui/button";
import FormInput from "@/components/ui/general/form-components/form-input";
import { useAccountActions } from "@/hooks/api-calls/admin/use-account";
import { toast } from "@/hooks/use-toast";
import { addClientAccountRequest } from "@/lib/form-constants/form-constants";
import { requireError } from "@/lib/utils";
import { useQueryClient } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { SubmitHandler } from "react-hook-form";

export default function AddClient({ isOpen }: { isOpen: boolean }) {
  const {
    register,
    reset,
    handleSubmit,
    watch,
    formState: { errors, isValid },
  } = useForm<addClientAccountRequest>({
    defaultValues: {
      email: "",
      first_name: "",
      middle_name: "",
      last_name: "",
      street: "",
      city_town: "",
      state: "",
      zip_code: "",
    },
  });

  //api
  const { addClient } = useAccountActions();

  const { mutate, isLoading } = addClient;

  // Get QueryClient from the context
  const queryClient = useQueryClient();

  const processSubmit: SubmitHandler<addClientAccountRequest> = async (
    data
  ) => {
    //send the form
    mutate(
      data, // Actual request body
      {
        onSuccess: (response: { message?: string }) => {
          toast({
            variant: "default",
            title: "Add Client",
            description: response.message || "Added Client Successfully",
          });
          queryClient.invalidateQueries({ queryKey: ["clients"] });
          reset(); // Reset form fields
        },
        onError: (error: { message?: string }) => {
          toast({
            variant: "destructive",
            title: "Add Client",
            description:
              error.message || "There was an error submitting the form",
          });
          reset(); // Reset form fields
        },
      }
    );
  };

  const name = `${watch("first_name")} ${watch("middle_name")} ${watch(
    "last_name"
  )}`;
  const email = watch("email");

  return (
    <form
      onSubmit={handleSubmit(processSubmit)}
      className="w-full mt-10 flex-grow flex-col-start gap-2"
    >
      <FormInput
        name={"email"}
        label="Email"
        placeholder={""}
        register={register}
        required
        inputType={"default"}
        errorMessage={errors?.email?.message}
        validationRules={{ required: requireError("Email") }}
      />
      <FormInput
        name={"first_name"}
        label="First Name"
        placeholder={""}
        register={register}
        required
        inputType={"default"}
        errorMessage={errors?.first_name?.message}
        validationRules={{ required: requireError("First Name") }}
      />
      <FormInput
        name={"middle_name"}
        label="Middle Name"
        placeholder={""}
        register={register}
        required={false}
        inputType={"default"}
      />
      <FormInput
        name={"last_name"}
        label="Last Name"
        placeholder={""}
        register={register}
        required
        inputType={"default"}
        errorMessage={errors.last_name?.message}
        validationRules={{ required: requireError("Last Name") }}
      />
      <div className="flex-row-end-start mt-4 ">
        <BtnDialog
          btnTitle={"Submit"}
          isLoading={isLoading}
          alt={"Add Client Button"}
          dialogTitle={"Add Client"}
          dialogDescription={
            "Are you sure you want to create this client account?"
          }
          dialogContent={
            <div className="w-full flex-col-center-start text-sm">
              <div>Email: {email}</div> <div>Name: {name}</div>
            </div>
          }
          onClick={handleSubmit(processSubmit)}
          disabled={!isValid}
          submitType={"submit"}
          submitTitle="Confirm"
        />
      </div>
    </form>
  );
}
