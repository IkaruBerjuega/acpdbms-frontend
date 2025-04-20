"use client";

import { toast } from "@/hooks/use-toast";
import type { UploadRecentProjectsType } from "@/lib/definitions";
import { Upload } from "lucide-react";
import { Button } from "@/components/ui/button";
import Dropzone from "../../general/drop-zone";
import {
  useForm,
  type SubmitHandler,
  FormProvider,
  Controller,
} from "react-hook-form";
import { DialogFooter } from "@/components/ui/dialog";
import { UploadDialog } from "./upload-dialog";
import { useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { useSettingsActions } from "@/hooks/general/use-admin-settings";

type BrowserFile = File;

export function RecentProjectsUpload() {
  const queryClient = useQueryClient();

  const methods = useForm<UploadRecentProjectsType>({
    mode: "onSubmit",
    defaultValues: {
      project_titles: [],
      project_images: [],
    },
  });

  const { uploadRecentProjectImage } = useSettingsActions();

  const {
    handleSubmit,
    control,
    register,
    reset,
    formState: { errors },
    watch,
    setValue,
  } = methods;

  const [isOpen, setisOpen] = useState<boolean>(false);

  const toggleUpload = (open: boolean) => {
    if (!open) {
      setisOpen(false);
      reset();

      return;
    }

    setisOpen(true);
  };
  const onSuccess = (response: { message?: string }) => {
    toast({
      title: "Upload Successful",
      description: response.message || "Recent projects uploaded successfully.",
    });
    queryClient.invalidateQueries({ queryKey: ["recentProjects"] });
    reset();
    toggleUpload(false);
  };

  const onError = (error: { message?: string }) => {
    console.error("Recent projects upload error:", error);
    toast({
      variant: "destructive",
      title: "Upload Failed",
      description:
        error.message ||
        "An error occurred while uploading projects. Please try again.",
    });
  };

  const handleFileDrop = (files: File[]) => {
    const browserFiles = files as unknown as BrowserFile[];
    setValue("project_images", browserFiles, { shouldValidate: true });

    const currentTitles = watch("project_titles") || [];
    if (currentTitles.length > files.length) {
      setValue("project_titles", currentTitles.slice(0, files.length), {
        shouldValidate: true,
      });
    }
    if (currentTitles.length < files.length) {
      setValue(
        "project_titles",
        [
          ...currentTitles,
          ...Array(files.length - currentTitles.length).fill(""),
        ],
        { shouldValidate: true }
      );
    }
  };

  const processForm: SubmitHandler<UploadRecentProjectsType> = (data) => {
    if (!data.project_images || !data.project_images.length) {
      toast({
        variant: "destructive",
        title: "Upload Failed",
        description: "Please upload at least one project image.",
      });
      return;
    }

    if (
      data.project_images.length !== data.project_titles.length ||
      data.project_titles.some((title) => !title || title.trim() === "")
    ) {
      toast({
        variant: "destructive",
        title: "Upload Failed",
        description: "Please provide a non-empty title for each project image.",
      });
      return;
    }

    const oversizedFiles = data.project_images.filter(
      (file) => file.size > 2 * 1024 * 1024
    );
    if (oversizedFiles.length > 0) {
      toast({
        variant: "destructive",
        title: "Upload Failed",
        description: "One or more files exceed the 2MB size limit.",
      });
      return;
    }

    const formData = new FormData();
    data.project_titles.forEach((title, index) => {
      const file = data.project_images[index];
      formData.append(`projects[${index}][project_title]`, title.trim());
      formData.append(`projects[${index}][image]`, file);
    });

    console.log("processForm - Submitting", {
      titles: data.project_titles,
      imageCount: data.project_images.length,
    });

    uploadRecentProjectImage.mutate(formData, {
      onSuccess,
      onError,
    });
  };

  const isSubmitting = uploadRecentProjectImage.isLoading;

  return (
    <UploadDialog
      title="Upload Recent Projects"
      description="Add images and titles for your recent projects. Recommended image size: 800x600px. Maximum file size: 2MB."
      open={isOpen}
      onOpenChange={(open) => {
        if (!isSubmitting) {
          toggleUpload(open);
        }
      }}
      trigger={
        <Button onClick={() => toggleUpload(true)} className="gap-2">
          <Upload className="h-4 w-4" />
          Upload Projects
        </Button>
      }
    >
      <FormProvider {...methods}>
        <form onSubmit={handleSubmit(processForm)} className="space-y-4">
          <div className="space-y-2">
            <Controller
              name="project_images"
              control={control}
              rules={{ required: "Please upload at least one image" }}
              render={() => (
                <Dropzone
                  onDrop={handleFileDrop}
                  accept={{
                    "image/jpeg": [],
                    "image/png": [],
                    "image/svg+xml": [],
                  }}
                  showImages={true}
                  formInput={{ name: "project_titles", register }}
                  maxSize={2 * 1024 * 1024}
                />
              )}
            />
            {errors.project_images && (
              <p className="text-sm text-destructive">
                {errors.project_images.message ||
                  "Please upload at least one image"}
              </p>
            )}
            {errors.project_titles && (
              <p className="text-sm text-destructive">
                {errors.project_titles.message ||
                  "Please provide valid project titles"}
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
              {isSubmitting ? "Uploading..." : "Upload Projects"}
            </Button>
          </DialogFooter>
        </form>
      </FormProvider>
    </UploadDialog>
  );
}
