"use client";
import { useForm, type SubmitHandler, FormProvider } from "react-hook-form";
import { MdEmail } from "react-icons/md";
import { CardFooter } from "../../card";
import { Input } from "../../input";
import { ConfirmDialog } from "./confirm-dialog";
import { ContactSection } from "./contact-section";
import type { ContactDetails } from "@/lib/definitions";
import { toast } from "@/hooks/use-toast";
import { useQueryParams } from "@/hooks/use-query-params";
import { usePathname, useRouter } from "next/navigation";
import { useQueryClient } from "@tanstack/react-query";

interface EmailFormData {
  email: string;
}

interface ApiMutationResult<T> {
  mutate: (
    body?: T,
    options?: {
      onSuccess?: (data: any) => void;
      onError?: (error: any) => void;
    }
  ) => void;
  isLoading: boolean;
}

export function EmailSettings({
  storeContactDetails,
  email,
}: {
  storeContactDetails: ApiMutationResult<{ contact_details: ContactDetails[] }>;
  email: ContactDetails[];
}) {
  const queryClient = useQueryClient();
  const { paramsKey, params } = useQueryParams();
  const pathname = usePathname();
  const { replace } = useRouter();

  const methods = useForm<EmailFormData>({
    mode: "onBlur",
    defaultValues: { email: email[0]?.value || "" },
  });

  const {
    handleSubmit,
    register,
    formState: { errors },
    reset,
  } = methods;

  const isEditing = paramsKey["edit_email"] === "true";
  const isSubmitting = storeContactDetails.isLoading;

  const toggleEdit = (enable: boolean) => {
    if (enable) {
      params.set("edit_email", "true");
      reset({ email: email[0]?.value || "" });
    } else {
      params.delete("edit_email");
    }
    replace(`${pathname}?${params.toString()}`);
  };

  const handleMutationResponse = (
    response: { contact_details: ContactDetails[]; message?: string },
    title: string,
    successMessage: string
  ) => {
    toast({ title, description: response.message || successMessage });
    queryClient.invalidateQueries({ queryKey: ["siteContactDetails"] });
    toggleEdit(false);
    reset({ email: response.contact_details[0]?.value || "" });
  };

  const processForm: SubmitHandler<EmailFormData> = (data) => {
    storeContactDetails.mutate(
      {
        contact_details: [
          { id: email[0]?.id, type: "email", value: data.email },
        ],
      },
      {
        onSuccess: (response) =>
          handleMutationResponse(
            response,
            "Success",
            "Email address updated successfully"
          ),
        onError: (error) =>
          toast({
            title: "Error",
            description: error.message || "Failed to update email",
            variant: "destructive",
          }),
      }
    );
  };

  return (
    <FormProvider {...methods}>
      <form onSubmit={handleSubmit(processForm)}>
        <ContactSection
          title="Email Address"
          onEdit={() => toggleEdit(!isEditing)}
          isEditing={isEditing}
          isEmpty={!email?.length}
        >
          {!isEditing ? (
            <div className="flex items-center gap-2 text-sm">
              <MdEmail className="h-4 w-4 text-muted-foreground" />
              <span>{email[0]?.value || "No email set"}</span>
            </div>
          ) : (
            <>
              <Input
                placeholder="Enter email address"
                {...register("email", {
                  required: "Email is required",
                  pattern: {
                    value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                    message: "Invalid email address",
                  },
                })}
                disabled={isSubmitting}
              />
              {errors.email && (
                <p className="text-sm text-destructive">
                  {errors.email.message}
                </p>
              )}
              <CardFooter className="px-0 pt-4">
                <ConfirmDialog
                  title="Update Email"
                  description="Do you confirm to update the email address?"
                  onConfirm={handleSubmit(processForm)}
                  disabled={isSubmitting}
                />
              </CardFooter>
            </>
          )}
        </ContactSection>
      </form>
    </FormProvider>
  );
}
