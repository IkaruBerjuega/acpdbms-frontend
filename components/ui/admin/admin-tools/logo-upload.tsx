"use client";

import { toast } from "@/hooks/use-toast";
import type { UploadLogoType } from "@/lib/definitions";
import { Upload } from "lucide-react";
import { Button } from "@/components/ui/button";
import Dropzone from "../../general/drop-zone";
import {
  useForm,
  type SubmitHandler,
  FormProvider,
  Controller,
} from "react-hook-form";
import { DialogFooter } from "../../dialog";
import { UploadDialog } from "./upload-dialog";
import { useQueryClient } from "@tanstack/react-query";
import { useSettingsActions } from "@/hooks/general/use-admin-settings";
import { useState } from "react";

export function LogoUpload() {
  const queryClient = useQueryClient();

  const [isOpen, setIsOpen] = useState<boolean>(false);
  const { uploadLogo } = useSettingsActions();

  const methods = useForm<UploadLogoType>({
    mode: "onSubmit",
    defaultValues: { logo: undefined },
  });

  const {
    handleSubmit,
    control,
    reset,
    formState: { errors },
  } = methods;

  const toggleUpload = (open: boolean) => {
    if (!open) {
      reset();
      setIsOpen(false);
    } else {
      setIsOpen(open);
    }
  };

  const onSuccess = (response: { message?: string }) => {
    toast({
      title: "Upload Successful",
      description: response.message || "Logo uploaded successfully.",
    });
    queryClient.invalidateQueries({ queryKey: ["logo"] });
    reset();
    toggleUpload(false);
  };

  const onError = (error: { message?: string }) => {
    toast({
      variant: "destructive",
      title: "Upload Failed",
      description:
        error.message ||
        "An error occurred while uploading the logo. Please try again.",
    });
    queryClient.invalidateQueries({ queryKey: ["site-logo"] });
  };

  const processForm: SubmitHandler<UploadLogoType> = (data) => {
    if (!data.logo || data.logo.length === 0) {
      toast({
        variant: "destructive",
        title: "Upload Failed",
        description: "Please select a logo file to upload.",
      });
      return;
    }

    const formData = new FormData();
    formData.append("logo", data.logo[0]);

    console.log("processForm - Uploading logo", { formData });

    uploadLogo.mutate(formData, {
      onSuccess,
      onError,
    });
  };

  const isSubmitting = uploadLogo.isLoading;

  return (
    <UploadDialog
      title="Upload Logo"
      description="Update your site's logo. Recommended size: 200x60px."
      open={isOpen}
      onOpenChange={(open) => {
        if (!isSubmitting) {
          toggleUpload(open);
        }
      }}
      trigger={
        <Button onClick={() => toggleUpload(true)} className="gap-2">
          <Upload className="h-4 w-4" />
          Upload Logo
        </Button>
      }
    >
      <FormProvider {...methods}>
        <form onSubmit={handleSubmit(processForm)} className="space-y-4">
          <div className="space-y-2">
            <Controller
              name="logo"
              control={control}
              rules={{ required: "Please select a logo file." }}
              render={({ field: { onChange } }) => (
                <Dropzone
                  onDrop={(acceptedFiles) => onChange(acceptedFiles)}
                  accept={{
                    "image/jpeg": [],
                    "image/png": [],
                    "image/webp": [],
                  }}
                  showImages={true}
                />
              )}
            />
            {errors.logo && (
              <p className="text-sm text-destructive">
                {errors.logo.message || "Please provide a valid logo file."}
              </p>
            )}
          </div>
          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => toggleUpload(false)}
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Uploading..." : "Upload Logo"}
            </Button>
          </DialogFooter>
        </form>
      </FormProvider>
    </UploadDialog>
  );
}
