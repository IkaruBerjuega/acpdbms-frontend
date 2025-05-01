"use client";

import { useAccountActions } from "@/hooks/api-calls/admin/use-account";
import { AccountSendLinkSchemaType } from "@/lib/form-constants/form-constants";
import { useForm } from "react-hook-form";
import { SubmitHandler } from "react-hook-form";
import FormInput from "../general/form-components/form-input";
import { requireError } from "@/lib/utils";
import { useState } from "react";
import { toast } from "@/hooks/use-toast";
import { Button, ButtonLink } from "../button";
import { LoadingCircle } from "../general/loading-circle";
import { RiMailCheckFill } from "react-icons/ri";
import Link from "next/link";

export default function ForgotPasswordForm() {
  const sendLinkMethods = useForm<AccountSendLinkSchemaType>({
    defaultValues: { email: "" },
  });

  const {
    handleSubmit,
    register,
    formState: { errors },
  } = sendLinkMethods;

  const { sendReset } = useAccountActions({
    userId: "",
  });

  const [isNoticePage, setToNoticePage] = useState<boolean>(false);

  const processForm: SubmitHandler<AccountSendLinkSchemaType> = (data) => {
    sendReset.mutate(data, {
      onSuccess: () => {
        setToNoticePage(true);
      },
      onError: ({ message }: { message: string }) => {
        toast({
          title: "Forgot Password",
          description: message || "There was an error processing the request",
          variant: "destructive",
        });
      },
    });
  };

  return (
    <div className="flex-col-center">
      {!isNoticePage ? (
        <form
          onSubmit={handleSubmit(processForm)}
          className="flex-col-center gap-2 mt-10 w-full"
        >
          <FormInput
            name={"email"}
            label={"Email"}
            inputType={"default"}
            register={register}
            errorMessage={errors.email?.message}
            required
            className="w-full"
            validationRules={{ required: requireError("Email") }}
          />
          <Button
            className="font-semibold mt-4 w-full"
            type="submit"
            disabled={sendReset.isLoading}
          >
            {sendReset.isLoading ? (
              <>
                Submitting
                <LoadingCircle color="border-white-secondary" size={15} />
              </>
            ) : (
              <>Send Email</>
            )}
          </Button>
          <Link href={"/login"} className="text-xs text-slate-500 mt-10">
            Back To Login
          </Link>
        </form>
      ) : (
        <div className="flex-grow flex-col-center mt-10">
          <RiMailCheckFill className="text-7xl " />
          <div className="">
            A reset link has been sent to your email account.
          </div>
          <ButtonLink href="/login" variant={"default"} className="mt-5">
            Back To Login
          </ButtonLink>
        </div>
      )}
    </div>
  );
}
