"use client";

import { DialogNoBtn } from "../dialog";
import React, { useMemo, useRef } from "react";
import { default as ReactCropper, ReactCropperElement } from "react-cropper";
import "cropperjs/dist/cropper.css";

interface CropperProps {
  open: boolean;
  image: File | undefined;
  onSave: (imageUrl: string) => void;
  dialogTitle: string;
  dialogDesc: string;
  onClose: () => void;
}

export default function Cropper({
  image,
  onSave,
  dialogTitle,
  dialogDesc,
  open,
  onClose,
}: CropperProps) {
  const cropperRef = useRef<ReactCropperElement>(null);

  const imageUrl = useMemo(() => {
    if (image) {
      return URL.createObjectURL(image);
    }
    return null;
  }, [image]);

  const handleSave = () => {
    const cropper = cropperRef.current?.cropper;
    if (cropper) {
      const base64 = cropper.getCroppedCanvas().toDataURL("image/png");
      onSave(base64); // ✅ pass cropped image to parent
    }
  };

  return (
    <>
      {imageUrl && (
        <DialogNoBtn
          title={dialogTitle}
          description={dialogDesc}
          showCloseButton={false}
          content={
            <ReactCropper
              src={imageUrl}
              className="object-contain max-h-[300px]"
              ref={cropperRef}
              guides={false}
              aspectRatio={1}
              viewMode={1} // Important for restricting crop outside image
              cropBoxResizable={true} // Optional: prevent resizing the crop box
              dragMode="move" // Optional: move image instead of crop box
            />
          }
          onClick={handleSave} // ✅ Save when user clicks
          onOpen={open}
          onClose={onClose}
        />
      )}
    </>
  );
}
