"use client";

import { BtnDialog } from "@/components/ui/button";
import FormInput from "@/components/ui/general/form-components/form-input";
import {
  useAccountActions,
  useUniquePositions,
} from "@/hooks/api-calls/admin/use-account";
import { toast } from "@/hooks/use-toast";
import { ItemInterface } from "@/lib/filter-types";
import { addEmpAccountRequest } from "@/lib/form-constants/form-constants";
import { requireError } from "@/lib/utils";
import { useQueryClient } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { SubmitHandler } from "react-hook-form";

export default function AddEmployee() {
  const {
    register,
    reset,
    handleSubmit,
    watch,
    control,
    formState: { errors, isValid },
  } = useForm<addEmpAccountRequest>({
    defaultValues: {
      email: "",
      first_name: "",
      middle_name: "",
      last_name: "",
      position: "",
    },
  });

  //api
  const { addEmployee } = useAccountActions({ userId: "" });

  const { mutate, isLoading } = addEmployee;

  // Get QueryClient from the context
  const queryClient = useQueryClient();

  const processSubmit: SubmitHandler<addEmpAccountRequest> = async (data) => {
    //send the form
    mutate(
      data, // Actual request body
      {
        onSuccess: async (response: { message?: string }) => {
          toast({
            variant: "default",
            title: "Add Employee",
            description: response.message || "Added Employee Successfully",
          });

          await Promise.all([
            queryClient.invalidateQueries({ queryKey: ["employees"] }),
            queryClient.invalidateQueries({ queryKey: ["unique-positions"] }),
          ]);

          reset(); // Reset form fields
        },
        onError: (error: { message?: string }) => {
          toast({
            variant: "destructive",
            title: "Add Employee",
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
  const position = watch("position");

  const { data: positions } = useUniquePositions();

  const uniquePositionItems: ItemInterface[] =
    positions?.map((position) => ({
      value: position,
      label: position,
    })) || [];

  return (
    <form
      onSubmit={handleSubmit(processSubmit)}
      className="w-full mt-10 flex-grow flex-col-start gap-2 px-1"
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
      <FormInput
        name={"position"}
        label="Position"
        placeholder={""}
        control={control}
        required
        inputType={"search"}
        items={uniquePositionItems}
        allowedNewValue={true}
        errorMessage={errors.last_name?.message}
        validationRules={{ required: requireError("Position") }}
      />
      <div className="flex-row-end-start mt-4 ">
        <BtnDialog
          btnTitle={"Submit"}
          isLoading={isLoading}
          alt={"Add Employee Button"}
          dialogTitle={"Add Employee"}
          dialogDescription={
            "Are you sure you want to create this employee account?"
          }
          dialogContent={
            <div className="w-full flex-col-center-start text-sm">
              <div>Email: {email}</div> <div>Name: {name}</div>{" "}
              <div>Position: {position}</div>
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
