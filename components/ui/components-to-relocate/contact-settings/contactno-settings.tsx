"use client";
import {
  useForm,
  type SubmitHandler,
  FormProvider,
  useFieldArray,
} from "react-hook-form";
import { IoMdRemoveCircleOutline } from "react-icons/io";
import { MdPhone } from "react-icons/md";
import { Button } from "@/components/ui/button";
import { CardFooter } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { ConfirmDialog } from "./confirm-dialog";
import { ContactSection } from "./contact-section";
import type { ContactDetails, DynamicContactSchema } from "@/lib/definitions";
import { toast } from "@/hooks/use-toast";
import { useQueryParams } from "@/hooks/use-query-params";
import { usePathname, useRouter } from "next/navigation";
import { useQueryClient } from "@tanstack/react-query";

interface DeleteContactPayload {
  ids: number[];
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
  data: any;
  error: string | undefined;
}

export function ContactNoSettings({
  storeContactDetails,
  deleteContactDetail,
  contactNumbers,
}: {
  storeContactDetails: ApiMutationResult<{ contact_details: ContactDetails[] }>;
  deleteContactDetail: ApiMutationResult<DeleteContactPayload>;
  contactNumbers: ContactDetails[];
}) {
  const methods = useForm<DynamicContactSchema>({
    mode: "onBlur",
    defaultValues: {
      contact_details: contactNumbers || [],
      removedIds: [],
    },
  });

  const {
    handleSubmit,
    control,
    register,
    reset,
    watch,
    setValue,
    formState: { errors },
  } = methods;
  const { fields, append, remove } = useFieldArray({
    control,
    name: "contact_details",
  });

  const { paramsKey, params } = useQueryParams();
  const pathname = usePathname();
  const { replace } = useRouter();
  const queryClient = useQueryClient();

  const isEditing = paramsKey["edit_contact_numbers"] === "true";

  const toggleEdit = (enable: boolean) => {
    if (enable) {
      params.set("edit_contact_numbers", "true");
      reset({ contact_details: contactNumbers || [], removedIds: [] });
    } else {
      params.delete("edit_contact_numbers");
    }
    replace(`${pathname}?${params.toString()}`);
  };

  const handleRemoveContact = (index: number) => {
    const currentRemovedIds = watch("removedIds") || [];
    const contact = watch(`contact_details.${index}`);

    if (contact?.id && typeof contact.id === "number") {
      setValue("removedIds", [...new Set([...currentRemovedIds, contact.id])]); // Ensure unique IDs
    }

    remove(index);
  };

  const processForm: SubmitHandler<DynamicContactSchema> = (data) => {
    const removedIds = (data.removedIds || []).filter(
      (id) => typeof id === "number"
    );
    const formattedContactDetails = data.contact_details
      .filter((contact) => contact.value.trim() !== "")
      .map((contact) => ({
        id: typeof contact.id === "number" ? contact.id : undefined,
        type: "contact_number",
        value: contact.value || "",
      }));

    const onSuccess = (response: { message?: string }, title: string) => {
      toast({ title, description: response.message || "Operation successful" });
      queryClient.invalidateQueries({ queryKey: ["siteContactDetails"] });
      toggleEdit(false);
    };

    const onError = (error: { message?: string }, title: string) => {
      toast({
        variant: "destructive",
        title,
        description: error.message || "Operation failed",
      });
    };

    if (removedIds.length > 0) {
      deleteContactDetail.mutate(
        { ids: removedIds },
        {
          onSuccess: (response) =>
            onSuccess(response, "Contacts deleted successfully"),
          onError: (error) => onError(error, "Error deleting contacts"),
        }
      );
    }

    storeContactDetails.mutate(
      { contact_details: formattedContactDetails },
      {
        onSuccess: (response) =>
          onSuccess(response, "Contacts updated successfully"),
        onError: (error) => onError(error, "Error updating contacts"),
      }
    );
  };

  const isSubmitting =
    storeContactDetails.isLoading || deleteContactDetail.isLoading;

  return (
    <form onSubmit={handleSubmit(processForm)}>
      <ContactSection
        title="Contact Numbers"
        onEdit={() => toggleEdit(!isEditing)}
        onAdd={() => append({ type: "contact_number", value: "" })}
        isEditing={isEditing}
        isEmpty={!contactNumbers?.length}
      >
        {!isEditing ? (
          <div className="space-y-2">
            {contactNumbers.length ? (
              contactNumbers.map((contact, index) => (
                <div
                  key={contact.id ?? `contact-${index}`}
                  className="flex items-center gap-2 text-sm"
                >
                  <MdPhone className="h-4 w-4 text-muted-foreground" />
                  <span>{contact.value}</span>
                </div>
              ))
            ) : (
              <p className="text-sm text-muted-foreground">
                No contact numbers added
              </p>
            )}
          </div>
        ) : (
          <div className="space-y-3">
            {fields.map((field, index) => (
              <div key={field.id} className="flex items-center gap-2">
                <Input
                  placeholder="Enter contact number"
                  {...register(`contact_details.${index}.value`, {
                    required: "Contact number is required",
                    pattern: {
                      value: /^\+?[1-9]\d{1,14}$/,
                      message: "Enter a valid phone number",
                    },
                  })}
                  className="flex-1"
                  disabled={isSubmitting}
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  onClick={() => handleRemoveContact(index)}
                  className="h-9 w-9 text-destructive hover:text-destructive/90 hover:bg-destructive/10"
                  disabled={isSubmitting}
                >
                  <IoMdRemoveCircleOutline className="h-5 w-5" />
                </Button>
              </div>
            ))}
            {errors.contact_details && (
              <p className="text-sm text-destructive">
                {errors.contact_details.message ||
                  "Please check contact numbers"}
              </p>
            )}
            {fields.length > 0 && (
              <CardFooter className="px-0 pt-4">
                <ConfirmDialog
                  title="Update Contact Numbers"
                  description="Do you confirm to update the list of contact numbers?"
                  onConfirm={handleSubmit(processForm)}
                  disabled={isSubmitting}
                />
              </CardFooter>
            )}
          </div>
        )}
      </ContactSection>
    </form>
  );
}
