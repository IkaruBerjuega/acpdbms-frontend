"use client";

import { Button } from "@/components/ui/button";
import type React from "react";
import { useState, useEffect } from "react";
import { useDropzone, type DropzoneOptions } from "react-dropzone";
import type { UseFormRegister } from "react-hook-form";
import { IoMdClose } from "react-icons/io";
import { AlertCircle } from "lucide-react";
import FormInput from "./form-components/form-input";
import { Alert, AlertDescription } from "@/components/ui/alert";
import Image from "next/image";

interface DropzoneProps {
  onDrop: (acceptedFiles: File[]) => void; // Accept File objects directly
  accept?: DropzoneOptions["accept"];
  showImages?: boolean;
  formInput?: {
    name: string;
    register: UseFormRegister<any>; // eslint-disable-line
  };
  maxSize?: number; // Size in bytes
  showList?: boolean;
}

const Dropzone = ({
  onDrop,
  accept = {
    "image/jpeg": [],
    "image/png": [],
    "image/webp": [],
    "image/svg+xml": [], // Added SVG support
  },
  showImages = false,
  formInput,
  showList = true,
  maxSize = 2 * 1024 * 1024, // Default to 2MB to match backend
}: DropzoneProps) => {
  const [uploadedFiles, setUploadedFiles] = useState<File[]>([]);
  const [fileErrors, setFileErrors] = useState<string[]>([]);

  // Format file size for display
  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return bytes + " bytes";
    else if (bytes < 1048576) return (bytes / 1024).toFixed(1) + " KB";
    else return (bytes / 1048576).toFixed(1) + " MB";
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    accept,
    multiple: true,
    maxSize,
    onDrop: (acceptedFiles, rejectedFiles) => {
      // Filter out files that exceed the size limit
      const validFiles = acceptedFiles.filter((file) => file.size <= maxSize);
      const oversizedFiles = acceptedFiles.filter(
        (file) => file.size > maxSize
      );

      // Handle rejected files
      const errors: string[] = [];

      if (oversizedFiles.length > 0) {
        errors.push(
          `${oversizedFiles.length} file(s) exceed the 2MB size limit`
        );
      }

      if (rejectedFiles.length > 0) {
        errors.push(
          `${rejectedFiles.length} file(s) have invalid file types. Supported formats: JPG, PNG, SVG`
        );
      }

      setFileErrors(errors);

      if (validFiles.length > 0) {
        setUploadedFiles((prevFiles) => [...prevFiles, ...validFiles]);
        onDrop(validFiles); // Pass valid File objects to the parent
      }
    },
  });

  const removeFile = (index: number) => {
    const newFiles = uploadedFiles.filter((_, i) => i !== index);
    setUploadedFiles(newFiles);
    onDrop(newFiles); // Update the parent component with the new list

    // Clear errors if no files remain
    if (newFiles.length === 0) {
      setFileErrors([]);
    }
  };

  // Clean up object URLs when component unmounts
  useEffect(() => {
    return () => {
      uploadedFiles.forEach((file) => {
        if ("preview" in file && typeof file.preview === "string") {
          URL.revokeObjectURL(file.preview);
        }
      });
    };
  }, [uploadedFiles]);

  return (
    <div className="space-y-4">
      {fileErrors.length > 0 && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            {fileErrors.map((error, index) => (
              <div key={index}>{error}</div>
            ))}
          </AlertDescription>
        </Alert>
      )}

      <div
        {...getRootProps()}
        className={`border-2 border-dashed rounded-md p-6 text-center cursor-pointer ${
          isDragActive
            ? "border-primary bg-primary/10"
            : "border-muted-foreground/20"
        }`}
      >
        <input {...getInputProps()} />
        {isDragActive ? (
          <p>Drop the files here ...</p>
        ) : (
          <div className="space-y-2">
            <p>Drag and drop or click to select files</p>
            <p className="text-sm text-muted-foreground">
              Supported formats: JPG, PNG, SVG (Max size: 2MB)
            </p>
          </div>
        )}
      </div>

      {uploadedFiles.length > 0 && (
        <div className="mt-4">
          {showList ? (
            <ul className="space-y-2">
              {uploadedFiles.map((file, index) => (
                <li
                  key={index}
                  className="flex items-center justify-between p-2 border rounded"
                >
                  <div className="flex items-center gap-2">
                    <span>{file.name}</span>
                    <span className="text-xs text-muted-foreground">
                      ({formatFileSize(file.size)})
                    </span>
                  </div>
                  <Button
                    onClick={() => removeFile(index)}
                    variant="ghost"
                    size="sm"
                    className="text-destructive hover:text-destructive/90"
                  >
                    Remove
                  </Button>
                </li>
              ))}
            </ul>
          ) : showImages ? (
            <div className="flex flex-wrap justify-center">
              {uploadedFiles.map((file, index) => {
                const fileUrl = URL.createObjectURL(file);
                return (
                  <div key={index} className="mt-2 w-full relative space-y-1">
                    <div className="w-full">
                      <Image
                        src={fileUrl || "/placeholder.svg"}
                        alt={file.name}
                        width={1000}
                        height={1000}
                        className="object-contain w-full h-32 border-[1px]" // Adjust height as needed
                        style={{ maxWidth: "100%", height: "auto" }} // Contain the image within the div
                      />
                      <Button
                        onClick={() => removeFile(index)}
                        className="absolute right-[-10px] top-[-10px] bg-white-200 w-auto h-auto border-none p-0"
                        variant={"outline"}
                      >
                        <IoMdClose className="text-3xl text-black" />
                      </Button>
                    </div>
                    {formInput && (
                      <FormInput
                        name={`${formInput?.name}.${index}`}
                        label={""}
                        inputType="default"
                        placeholder="Enter Project Title" //temp solution
                        register={formInput?.register}
                        required={true}
                      />
                    )}
                  </div>
                );
              })}
            </div>
          ) : null}
        </div>
      )}
    </div>
  );
};

export default Dropzone;
