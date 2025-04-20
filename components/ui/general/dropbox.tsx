import { bytesToMb } from "@/lib/utils";
import { Dispatch, SetStateAction } from "react";
import { useDropzone, DropzoneOptions } from "react-dropzone";
import { FileIcon } from "./file-icon";
import { ButtonTooltip } from "../button";
import { LuUpload } from "react-icons/lu";

interface DropboxProps {
  accept?: DropzoneOptions["accept"];
  multiple?: boolean;
  showFiles?: boolean;
  state: {
    attachedFiles: File[];
    setAttachedFiles: Dispatch<SetStateAction<File[]>>;
  };
  description?: string;
}

export default function Dropbox({
  accept = undefined,
  multiple = true,
  showFiles = true,
  state,
  description,
}: DropboxProps) {
  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    accept,
    multiple: multiple,
    onDrop: (droppedFiles) => {
      state.setAttachedFiles((prevFiles) => [...prevFiles, ...droppedFiles]);
    },
  });

  const removeFile = (index: number) => {
    const newFiles = state.attachedFiles.filter((_, i) => i !== index);
    state.setAttachedFiles(newFiles);
  };

  return (
    <div className="w-full flex-col-start gap-4">
      <div
        {...getRootProps()}
        className="w-full rounded-md border-dashed border-slate-500  border-[2px] min-h-[100px] flex-row-center cursor-pointer hover:bg-white-secondary flex-col-center gap-4"
      >
        <LuUpload className="text-2xl" />
        <input {...getInputProps()} />
        {isDragActive ? (
          <p>Drop the files here ...</p>
        ) : (
          <p className="text-sm">{description}</p>
        )}
      </div>
      {showFiles && (
        <div className="flex-col-center gap-2 w-full ">
          {state.attachedFiles.map((attachedFile, index) => {
            return (
              <div
                key={index}
                className="border-[1px] rounded-md text-sm p-1 w-full flex-row-between-center "
              >
                <div className="flex-row-start-center gap-2">
                  <div className="h-full p-1 text-2xl">
                    <FileIcon fileType={attachedFile.type} />
                  </div>
                  <div className="flex-col-start">
                    <div className="text-slate-600 text-xs">
                      {attachedFile.name}
                    </div>
                    <div className="text-slate-500 text-xs">
                      {bytesToMb(attachedFile.size)} mb
                    </div>
                  </div>
                </div>
                <div className="h-full flex-row-center  min-w-10">
                  <ButtonTooltip
                    tooltip={"remove attached file"}
                    iconSrc="/button-svgs/table-action-remove.svg"
                    className="border-none"
                    onClick={() => removeFile(index)}
                  />
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
