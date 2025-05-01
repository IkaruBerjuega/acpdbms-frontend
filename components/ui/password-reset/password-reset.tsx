"use client";

import { useAccountActions } from "@/hooks/api-calls/admin/use-account";
import { useForm } from "react-hook-form";
import { SubmitHandler } from "react-hook-form";
import FormInput from "../general/form-components/form-input";
import { requireError } from "@/lib/utils";
import { useState } from "react";
import { toast } from "@/hooks/use-toast";
import { BtnDialog, ButtonLink } from "../button";
import { ChangePassByUserFormProps } from "@/lib/user-definitions";
import { IoCheckmarkCircle } from "react-icons/io5";
import Link from "next/link";
import { useRole, useToken } from "@/hooks/general/use-token";

export default function PasswordResetForm({
  token,
  email,
}: {
  token: string | null;
  email: string | null;
}) {
  const methods = useForm<ChangePassByUserFormProps>({
    mode: "onBlur",
    defaultValues: { new_pass: "", confirm_new_pass: "" },
  });

  const {
    handleSubmit,
    watch,
    register,
    formState: { errors },
  } = methods;

  const { resetPassword } = useAccountActions({ userId: "" });

  const [isNoticePage, setToNoticePage] = useState<boolean>(false);

  const { deleteToken } = useToken();
  const { deleteRole } = useRole();

  const deleteAllCookies = async () => {
    await deleteToken();
    await deleteRole();
  };

  if (!token && !email) return;

  const processForm: SubmitHandler<ChangePassByUserFormProps> = (data) => {
    resetPassword.mutate(
      {
        email: email!,
        token: token!,
        password: data.new_pass,
        password_confirmation: data.confirm_new_pass,
      },
      {
        onSuccess: async () => {
          await deleteAllCookies();
          setToNoticePage(true);
        },
        onError: ({ message }: { message: string }) => {
          toast({
            title: "Reset Password",
            description: message || "There was an error processing the request",
            variant: "destructive",
          });
        },
      }
    );
  };

  return (
    <div className="flex-col-center">
      <>
        {!isNoticePage ? (
          <form
            onSubmit={handleSubmit(processForm)}
            className="w-full flex-col-start gap-2 mt-10"
          >
            <FormInput
              name="new_pass"
              label="New Password"
              inputType="default"
              register={register}
              errorMessage={errors.new_pass?.message}
              required
              dataType="password"
              validationRules={{
                required: requireError("Field"),
                pattern: {
                  value: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{8,}$/,
                  message:
                    "Password must be at least 8 characters and include uppercase, lowercase, number, and special character.",
                },
              }}
            />

            <FormInput
              name="confirm_new_pass"
              label="Confirm New Password"
              inputType="default"
              register={register}
              errorMessage={errors.confirm_new_pass?.message}
              required
              dataType="password"
              validationRules={{
                required: requireError("Field"),
                validate: (value: string) =>
                  value === watch("new_pass") || "Password does not match",
              }}
            />

            <BtnDialog
              btnTitle={"Submit"}
              isLoading={resetPassword.isLoading}
              alt={"Submit Button"}
              dialogTitle={"Password reset"}
              dialogDescription={"Do you confirm on changing your password?"}
              onClick={handleSubmit(processForm)}
              submitType={"submit"}
              submitTitle="Confirm"
              variant={"default"}
            />

            <Link
              href={"/login"}
              className="text-xs text-slate-500 mt-10 w-full flex-col-center"
            >
              Go To Login
            </Link>
          </form>
        ) : (
          <div className="flex-grow flex-col-center mt-10">
            <IoCheckmarkCircle className="text-7xl" />
            <div className="mt-5">Reset password successful!</div>
            <ButtonLink href="/login" variant={"default"} className="mt-10">
              Go To Login
            </ButtonLink>
          </div>
        )}
      </>
    </div>
  );
}
