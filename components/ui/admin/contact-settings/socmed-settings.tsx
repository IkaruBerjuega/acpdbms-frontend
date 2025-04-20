"use client";
import { useForm, type SubmitHandler, FormProvider } from "react-hook-form";
import { FaFacebookF, FaInstagram, FaLinkedin } from "react-icons/fa6";
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

interface SocialMediaFormData {
  facebook: { id?: number; value: string };
  instagram: { id?: number; value: string };
  linkedin: { id?: number; value: string };
}

export function SocMedSettings({
  facebook,
  instagram,
  linkedIn,
}: {
  facebook: ContactDetails[];
  instagram: ContactDetails[];
  linkedIn: ContactDetails[];
}) {
  const methods = useForm<SocialMediaFormData>({
    mode: "onBlur",
    defaultValues: {
      facebook: { id: facebook[0]?.id, value: facebook[0]?.value || "" },
      instagram: { id: instagram[0]?.id, value: instagram[0]?.value || "" },
      linkedin: { id: linkedIn[0]?.id, value: linkedIn[0]?.value || "" },
    },
  });

  const {
    handleSubmit,
    register,
    reset,
    formState: { errors },
  } = methods;

  const { storeContactDetails } = useSettingsActions();

  const { paramsKey, params } = useQueryParams();
  const pathname = usePathname();
  const { replace } = useRouter();
  const queryClient = useQueryClient();

  const isEditing = paramsKey["edit_social_media"] === "true";

  const toggleEdit = (enable: boolean) => {
    if (enable) {
      params.set("edit_social_media", "true");
      reset({
        facebook: { id: facebook[0]?.id, value: facebook[0]?.value || "" },
        instagram: { id: instagram[0]?.id, value: instagram[0]?.value || "" },
        linkedin: { id: linkedIn[0]?.id, value: linkedIn[0]?.value || "" },
      }); // Reset when entering edit mode
    } else {
      params.delete("edit_social_media");
    }
    replace(`${pathname}?${params.toString()}`);
  };

  const onSuccess = (
    response: { message?: string; contact_details?: ContactDetails[] },
    title: string,
    placeholderMessage: string,
    queryKey: string
  ) => {
    toast({
      variant: "default",
      title,
      description: response.message || placeholderMessage,
    });
    queryClient.invalidateQueries({ queryKey: [queryKey] });
    toggleEdit(false);
    reset({
      facebook: {
        id: response.contact_details?.find((d) => d.type === "facebook")?.id,
        value:
          response.contact_details?.find((d) => d.type === "facebook")?.value ||
          "",
      },
      instagram: {
        id: response.contact_details?.find((d) => d.type === "instagram")?.id,
        value:
          response.contact_details?.find((d) => d.type === "instagram")
            ?.value || "",
      },
      linkedin: {
        id: response.contact_details?.find((d) => d.type === "linkedin")?.id,
        value:
          response.contact_details?.find((d) => d.type === "linkedin")?.value ||
          "",
      },
    });
  };

  const onError = (
    error: { message?: string },
    title: string,
    placeholderMessage: string,
    queryKey: string
  ) => {
    toast({
      variant: "destructive",
      title,
      description: error.message || placeholderMessage,
    });
    queryClient.invalidateQueries({ queryKey: [queryKey] });
  };

  const processForm: SubmitHandler<SocialMediaFormData> = (data) => {
    const formattedContactDetails: ContactDetails[] = [
      { id: data.facebook.id, type: "facebook", value: data.facebook.value },
      { id: data.instagram.id, type: "instagram", value: data.instagram.value },
      { id: data.linkedin.id, type: "linkedin", value: data.linkedin.value },
    ].filter((contact) => contact.value.trim() !== "");

    storeContactDetails.mutate(
      { contact_details: formattedContactDetails },
      {
        onSuccess: (response) =>
          onSuccess(
            response,
            "Success",
            "Social media links updated successfully",
            "siteContactDetails"
          ),
        onError: (error) =>
          onError(
            error,
            "Error",
            "Failed to update social media links",
            "siteContactDetails"
          ),
      }
    );
  };

  const getSocialIcon = (type: string) => {
    switch (type) {
      case "facebook":
        return <FaFacebookF className="h-4 w-4 text-[#1877F2]" />;
      case "instagram":
        return <FaInstagram className="h-4 w-4 text-[#E4405F]" />;
      case "linkedin":
        return <FaLinkedin className="h-4 w-4 text-[#0A66C2]" />;
      default:
        return null;
    }
  };

  const allSocialMedia = [
    ...(facebook[0]?.value ? facebook : []),
    ...(instagram[0]?.value ? instagram : []),
    ...(linkedIn[0]?.value ? linkedIn : []),
  ];

  const isSubmitting = storeContactDetails.isLoading;

  return (
    <FormProvider {...methods}>
      <form onSubmit={handleSubmit(processForm)}>
        <ContactSection
          title="Social Media"
          onEdit={() => toggleEdit(!isEditing)}
          isEditing={isEditing}
          isEmpty={allSocialMedia.length === 0}
          description="Connect your social media accounts"
        >
          {!isEditing ? (
            <div className="space-y-2">
              {allSocialMedia.map((contact, index) => (
                <div
                  key={contact.id || index}
                  className="flex items-center gap-2 text-sm"
                >
                  {getSocialIcon(contact.type)}
                  <span>{contact.value}</span>
                </div>
              ))}
              {allSocialMedia.length === 0 && (
                <p className="text-sm text-muted-foreground">
                  No social media accounts connected
                </p>
              )}
            </div>
          ) : (
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <div className="w-[130px] flex items-center gap-2 text-[#1877F2]">
                  <FaFacebookF className="h-4 w-4" />
                  <span>Facebook</span>
                </div>
                <Input
                  placeholder="Enter Facebook link"
                  {...register("facebook.value", {
                    pattern: {
                      value: /^(https?:\/\/)?(www\.)?facebook\.com\/.+$/i,
                      message: "Enter a valid Facebook URL",
                    },
                  })}
                  className="flex-1"
                  disabled={isSubmitting}
                />
              </div>
              <div className="flex items-center gap-2">
                <div className="w-[130px] flex items-center gap-2 text-[#E4405F]">
                  <FaInstagram className="h-4 w-4" />
                  <span>Instagram</span>
                </div>
                <Input
                  placeholder="Enter Instagram link"
                  {...register("instagram.value", {
                    pattern: {
                      value: /^(https?:\/\/)?(www\.)?instagram\.com\/.+$/i,
                      message: "Enter a valid Instagram URL",
                    },
                  })}
                  className="flex-1"
                  disabled={isSubmitting}
                />
              </div>
              <div className="flex items-center gap-2">
                <div className="w-[130px] flex items-center gap-2 text-[#0A66C2]">
                  <FaLinkedin className="h-4 w-4" />
                  <span>LinkedIn</span>
                </div>
                <Input
                  placeholder="Enter LinkedIn link"
                  {...register("linkedin.value", {
                    pattern: {
                      value: /^(https?:\/\/)?(www\.)?linkedin\.com\/.+$/i,
                      message: "Enter a valid LinkedIn URL",
                    },
                  })}
                  className="flex-1"
                  disabled={isSubmitting}
                />
              </div>
              {(errors.facebook?.value ||
                errors.instagram?.value ||
                errors.linkedin?.value) && (
                <p className="text-sm text-destructive">
                  {errors.facebook?.value?.message ||
                    errors.instagram?.value?.message ||
                    errors.linkedin?.value?.message ||
                    "Please check social media links"}
                </p>
              )}
              <CardFooter className="px-0 pt-4">
                <ConfirmDialog
                  title="Update Social Media Links"
                  description="Do you confirm to update the social media links?"
                  onConfirm={handleSubmit(processForm)}
                  disabled={isSubmitting}
                />
              </CardFooter>
            </div>
          )}
        </ContactSection>
      </form>
    </FormProvider>
  );
}
