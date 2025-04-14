"use client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tag } from "lucide-react";
import { File, FileUIProps } from "@/lib/files-definitions";
import { FileIcon } from "../../general/file-icon";
import { FaDeleteLeft } from "react-icons/fa6";
import { FileActionWrapper } from "./file-actions";
import { useCheckboxStore } from "@/hooks/states/create-store";
import { useState } from "react";

export default function FileCard({
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
          onClick={handleSelectFiles}
          onContextMenu={handleSelectFiles}
          className={`${
            isSelected && "bg-gray-200"
          } overflow-hidden  hover:shadow-md transition-all duration-200 hover:translate-y-[-1px] border-gray-200 group max-w-xs cursor-pointer flex-col-start h-[175px]`}
        >
          <div className="relative bg-gray-50 p-8 flex justify-center items-center group-hover:bg-gray-100 transition-colors">
            <FileIcon fileType={file.type} />
            {file.is_archived && (
              <Badge className="absolute top-1 left-0 ml-auto shrink-0 text-xs scale-75">
                Archived
              </Badge>
            )}
            {file.task_version_number && (
              <div className="absolute top-2 right-2 flex items-center text-xs">
                <Tag className="h-3 w-3 mr-1" />
                <span>v{file.task_version_number}</span>
              </div>
            )}
          </div>
          <CardHeader className="p-2 pb-0 flex items-start">
            <div className="flex justify-center items-start w-full">
              <CardTitle className="text-sm font-medium truncate pr-1 leading-tight text-start">
                {file.name}
              </CardTitle>
            </div>
          </CardHeader>
          <CardContent className="p-2 pt-1 text-xs flex justify-center  flex-grow">
            <div className="flex  gap-1 justify-center items-end flex-grow ">
              {/* Phase Category Badge */}
              {file.phase_category && (
                <Badge
                  variant="secondary"
                  className="text-xs scale-90 whitespace-nowrap shrink-0  inline-flex"
                >
                  {file.phase_category}
                </Badge>
              )}
              {file.task_name && (
                <Badge
                  variant="outline"
                  className="text-xs scale-90 whitespace-nowrap"
                >
                  {file.task_name}
                </Badge>
              )}
            </div>
          </CardContent>
        </Card>
      }
    />
  );
}
