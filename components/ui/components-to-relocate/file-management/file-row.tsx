"use client";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import type { File, FileUIProps } from "@/lib/files-definitions";
import { FileIcon } from "../../general/file-icon";
import { FileActionWrapper } from "./file-actions";
import { useCheckboxStore } from "@/hooks/states/create-store";
import { SetStateAction, useState } from "react";

export default function FileRow({
  file,
  projectId,
  filteredFiles,
  firstIndex,
  setFirstIndex,
  secondIndex,
  setSecondIndex,
}: FileUIProps) {
  const { data, setData } = useCheckboxStore();

  const isSelected = (data as string[]).includes(file.file_id);

  const handleSelectFiles = (event: React.MouseEvent<HTMLDivElement>) => {
    const ctrl = event.metaKey || event.ctrlKey;
    const shift = event.shiftKey;

    const currentIndex = filteredFiles.findIndex(
      (filteredFile) => filteredFile.file_id === file.file_id
    );

    if (firstIndex === -1) {
      setFirstIndex(currentIndex);
    }

    if (shift && firstIndex >= 0) {
      const [start, end] = [
        Math.min(firstIndex, currentIndex),
        Math.max(firstIndex, currentIndex),
      ];

      const newSelectedFileIds = filteredFiles
        .slice(start, end + 1)
        .map((filteredFile) => filteredFile.file_id);

      setData((prev) => Array.from(new Set([...prev, ...newSelectedFileIds])));
      setSecondIndex(currentIndex);
    } else if (ctrl) {
      setData((prev) => Array.from(new Set([...prev, file.file_id])));
      setFirstIndex(currentIndex);
      setSecondIndex(-1);
    } else if (event.button === 2) {
      if (data.length > 1) {
        return;
      }

      setData([file.file_id]);
    } else {
      setData([file.file_id]);
      setFirstIndex(currentIndex);
      setSecondIndex(-1);
    }
  };

  return (
    <FileActionWrapper
      projectId={projectId}
      elementTrigger={
        <Card
          className={`${
            isSelected && "bg-gray-200"
          } hover:shadow-md transition-all duration-200 hover:translate-y-[-1px] border-gray-200 group cursor-pointer w-full`}
          onClick={handleSelectFiles}
          onContextMenu={handleSelectFiles}
        >
          <CardContent className="p-3 flex items-center gap-2 sm:gap-4 overflow-visible">
            {/* File Icon */}
            <div className="relative bg-gray-50 p-2 sm:p-3 rounded-md flex justify-center items-center group-hover:bg-gray-100 transition-colors shrink-0">
              <FileIcon fileType={file.type} />
            </div>

            <div className="flex-col-start lg:flex-row-start-center gap-2">
              {/* File Name */}
              <h3 className="text-sm font-medium leading-tight min-w-0 flex-shrink line-clamp-2 break-words">
                {file.name}
              </h3>
              <div className="flex-row-start-center gap-2">
                {/* Phase Category Badge */}
                {file.phase_category && (
                  <Badge
                    variant="secondary"
                    className="text-xs scale-90 whitespace-nowrap shrink-0  inline-flex"
                  >
                    {file.phase_category}
                  </Badge>
                )}
                {/* Task Name Badge */}
                {file.task_name && (
                  <Badge
                    variant="outline"
                    className="text-xs scale-90 whitespace-nowrap shrink-0  inline-flex"
                  >
                    {file.task_name}
                  </Badge>
                )}
                {/* Archived Badge */}
                {file.is_archived && (
                  <Badge className="text-xs scale-90 shrink-0  inline-flex">
                    Archived
                  </Badge>
                )}
              </div>
            </div>

            {/* Version Badge - Always visible */}
            {file.task_version_number && (
              <div className=" text-xs text-gray-500 shrink-0 ml-auto sm:ml-0 p-2 sm:p-3">
                <span>v{file.task_version_number}</span>
              </div>
            )}
          </CardContent>
        </Card>
      }
    />
  );
}
