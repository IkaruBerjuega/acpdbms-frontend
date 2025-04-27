"use client";

import { toast } from "@/hooks/use-toast";
import { Upload } from "lucide-react";
import { Button } from "@/components/ui/button";
import Dropzone from "../../general/drop-zone";
import { DialogFooter } from "../../dialog";
import { UploadDialog } from "./upload-dialog";
import { useQueryClient } from "@tanstack/react-query";
import { useSettingsActions } from "@/hooks/general/use-admin-settings";
import { useEffect, useState } from "react";
import Cropper from "../../general/cropper";
import { base64ToFile, urlToFile } from "@/lib/utils";
import Image from "next/image";
import { LoadingCircle } from "../../general/loading-circle";

export function LogoUpload({ logoUrl }: { logoUrl: string | undefined }) {
  const queryClient = useQueryClient();

  const [isOpen, setIsOpen] = useState<boolean>(false);
  const { uploadLogo } = useSettingsActions();

  const isSubmitting = uploadLogo.isLoading;

  //recently uploaded logo

  const [openCropper, setOpenCropper] = useState<boolean>(false);
  const [initialImage, setInitialImage] = useState<File | undefined>();
  const [image, setImage] = useState<File | undefined>();

  const setImageStateContainersToUploadedLogoUrl = () => {
    if (logoUrl) {
      urlToFile(logoUrl, "logo")
        .then((file) => {
          setInitialImage(file);
          setImage(file);
        })
        .catch(() => {
          setInitialImage(undefined);
          setImage(undefined);
        });
    }
  };

  useEffect(() => {
    setImageStateContainersToUploadedLogoUrl();
  }, [logoUrl]);

  const onImageDropdown = (fileImage: File) => {
    setImage(fileImage);
    setInitialImage(fileImage);
    setOpenCropper(true);
  };

  const handleSetCroppedImage = (imageUrl: string) => {
    const imageFile = base64ToFile(imageUrl, "logo");
    setImage(imageFile);
    setOpenCropper(false);
  };

  const closeUpload = (open: boolean) => {
    if (!open) {
      setIsOpen(false);
      setOpenCropper(false);
      setImageStateContainersToUploadedLogoUrl();
    } else {
      setIsOpen(true);
    }
  };

  const onSuccess = (response: { message?: string }) => {
    toast({
      title: "Upload Successful",
      description: response.message || "Logo uploaded successfully.",
    });
    queryClient.invalidateQueries({ queryKey: ["logo"] });
    closeUpload(false);
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

  const handleUploadLogo = () => {
    if (!image) {
      toast({
        variant: "destructive",
        title: "Upload Failed",
        description: "Please select a logo file to upload.",
      });
      return;
    }
    const formData = new FormData();
    formData.append("logo", image);
    console.log("processForm - Uploading logo", { formData });
    uploadLogo.mutate(formData, {
      onSuccess,
      onError,
    });
  };

  return (
    <>
      <UploadDialog
        showCloseButton={false}
        title="Update Logo"
        description="Recommended size: 512x512"
        open={isOpen}
        onOpenChange={(open) => {
          if (open) {
            if (!isSubmitting) {
              closeUpload(open);
            }
          }
        }}
        trigger={
          <Button onClick={() => closeUpload(true)} className="gap-2">
            <Upload className="h-4 w-4" />
            Update Logo
          </Button>
        }
      >
        <div className="space-y-4">
          <div className="space-y-2">
            <Dropzone
              onDrop={(acceptedFiles) => {
                onImageDropdown(acceptedFiles[0]);
              }}
              accept={{
                "image/jpeg": [],
                "image/png": [],
                "image/webp": [],
              }}
              showImages={false}
              showList={false}
            />
            {image && initialImage && (
              <div
                className="w-full relative transition-all aspect-square duration-200 cursor-pointer hover:scale-95 "
                onClick={() => {
                  onImageDropdown(initialImage);
                }}
              >
                <Image
                  src={URL.createObjectURL(image)}
                  className="aspect-square w-full"
                  width={1000}
                  height={1000}
                  alt={"logo image"}
                />

                <div className="absolute text-white-primary transition-all top-0 r-0 w-full h-full bg-black-primary/20 flex-col-center">
                  Click to crop
                </div>
              </div>
            )}
          </div>
          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => closeUpload(false)}
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button
              disabled={isSubmitting}
              onClick={handleUploadLogo}
              className="w-fit"
            >
              {isSubmitting ? (
                <>
                  {" "}
                  <span className="w-fit">Uploading </span>
                  <LoadingCircle size={16} />
                </>
              ) : (
                "Upload Logo"
              )}
            </Button>
          </DialogFooter>
        </div>

        {openCropper && (
          <Cropper
            image={initialImage}
            open={openCropper}
            onSave={(imageUrl: string) => handleSetCroppedImage(imageUrl)}
            dialogTitle={"Cropper"}
            dialogDesc={"Maintain an aspect ratio 1:1 for a better logo"}
            onClose={() => {
              setOpenCropper(false);
            }}
          />
        )}
      </UploadDialog>
    </>
  );
}
