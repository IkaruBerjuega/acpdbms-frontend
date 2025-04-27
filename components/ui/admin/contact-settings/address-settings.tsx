"use client";
import { useForm, type SubmitHandler, FormProvider } from "react-hook-form";
import { CardFooter } from "../../card";
import { Input } from "../../input";
import { ConfirmDialog } from "./confirm-dialog";
import { ContactSection } from "./contact-section";
import type { ContactDetails } from "@/lib/definitions";
import { toast } from "@/hooks/use-toast";
import { useQueryParams } from "@/hooks/use-query-params";
import { usePathname, useRouter } from "next/navigation";
import { useQueryClient } from "@tanstack/react-query";
import { useSettingsActions } from "@/hooks/general/use-admin-settings";
import { PiAddressBookTabsFill } from "react-icons/pi";

interface AddressFormData {
  address: string;
}

export function Address({ address }: { address: ContactDetails[] }) {
  const queryClient = useQueryClient();
  const { paramsKey, params } = useQueryParams();
  const pathname = usePathname();
  const { replace } = useRouter();

  const methods = useForm<AddressFormData>({
    mode: "onBlur",
    defaultValues: { address: address[0]?.value || "" },
  });

  const { storeContactDetails } = useSettingsActions();

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
      reset({ address: address[0]?.value || "" });
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

    const address = response.contact_details.find(
      (contactDetail) => contactDetail.type === "email"
    );
    reset({
      address: address?.value,
    });
  };

  const processForm: SubmitHandler<AddressFormData> = (data) => {
    storeContactDetails.mutate(
      {
        contact_details: [
          { id: address[0]?.id, type: "address", value: data.address },
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
          title="Address"
          onEdit={() => toggleEdit(!isEditing)}
          isEditing={isEditing}
          isEmpty={!address?.length}
        >
          {!isEditing ? (
            <div className="flex items-center gap-2 text-sm">
              <PiAddressBookTabsFill className="h-4 w-4 text-muted-foreground" />
              <span>{address[0]?.value || "No address set"}</span>
            </div>
          ) : (
            <>
              <Input
                placeholder="Enter address address"
                {...register("address", {
                  required: "Address is required",
                })}
                disabled={isSubmitting}
              />
              {errors.address && (
                <p className="text-sm text-destructive">
                  {errors.address.message}
                </p>
              )}
              <CardFooter className="px-0 pt-4">
                <ConfirmDialog
                  title="Update Address"
                  description="Do you confirm to update the business address?"
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
