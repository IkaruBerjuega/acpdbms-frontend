"use client";

import FileFilters from "./file-filters";
import { formatFileSize, formatFileType, formatDate } from "@/lib/utils";
import { FilesPageProps } from "@/lib/files-definitions";
import { useFileList } from "@/hooks/api-calls/employee/use-files";
import SidepanelDrawerComponent from "../../general/sidepanel-drawer";
import { ItemInterface } from "@/lib/filter-types";
import { useMemo } from "react";
import FileList from "./file-list";
import FileListHeaderActions from "./file-list-header";

interface FilesProps extends FilesPageProps {
  isAdmin: boolean;
}

export default function Files(queries: FilesProps) {
  const { projectId, phaseId, taskId, taskVersionId, tab } = queries;

  const { data: filesResponse, isLoading } = useFileList({
    projectId: projectId?.split("_")[0] ?? "",
  });

  // Format the files data before passing to child components
  const formattedFiles = filesResponse?.files.map((file) => ({
    ...file,
    uploaded_at: formatDate(file.uploaded_at),
    type: formatFileType(file.type),
    size: Number(formatFileSize(file.size)),
  }));

  //for file list
  const phaseFiles = useMemo(() => {
    const items =
      formattedFiles?.filter(
        (file) => file && String(file?.phase_id) === phaseId?.split("_")[0]
      ) || [];

    return items;
  }, [formattedFiles, phaseId]);

  const taskFiles = useMemo(() => {
    const items =
      phaseFiles?.filter(
        (file) => file && String(file?.task_id) === taskId?.split("_")[0]
      ) || [];

    return items;
  }, [phaseFiles, taskId]);

  const taskVersionFiles = useMemo(() => {
    const files =
      taskFiles?.filter(
        (file) =>
          file && String(file?.task_version_id) === taskVersionId?.split("_")[0]
      ) || [];

    return files;
  }, [taskFiles, taskVersionId]);

  //For filter options
  const _phaseItems: ItemInterface[] = useMemo(() => {
    const uniqueItems = new Map<string, ItemInterface>(); // Using Map to track uniqueness by value

    return (
      formattedFiles?.reduce((acc, file) => {
        if (!file) return acc;

        const fileToReturn = {
          value: file.phase_id as string,
          label: String(file.phase_category) ?? "",
        };

        // Check if we've already seen this combination of value and label
        if (!uniqueItems.has(fileToReturn.value)) {
          uniqueItems.set(fileToReturn.value, fileToReturn);
          acc.push(fileToReturn);
        }

        return acc;
      }, [] as ItemInterface[]) ?? []
    );
  }, [formattedFiles]);

  const _taskItems: ItemInterface[] = useMemo(() => {
    const uniqueItems = new Map<string, ItemInterface>(); // Track uniqueness by `value`

    return (
      phaseFiles?.reduce((acc, file) => {
        if (!file) return acc;

        const item = {
          value: file.task_id as string,
          label: String(file.task_name) ?? "",
        };

        if (!uniqueItems.has(item.value)) {
          // Ensure uniqueness
          uniqueItems.set(item.value, item);
          acc.push(item);
        }

        return acc;
      }, [] as ItemInterface[]) ?? []
    );
  }, [phaseFiles]);

  const _taskVersionItems: ItemInterface[] = useMemo(() => {
    const uniqueItems = new Map<string, ItemInterface>(); // Track uniqueness by `value`

    return (
      taskFiles?.reduce((acc, file) => {
        if (!file) return acc;

        const item = {
          value: file.task_version_id as string,
          label: String(file.task_version_number) ?? "",
        };

        if (!uniqueItems.has(item.value)) {
          // Ensure uniqueness
          uniqueItems.set(item.value, item);
          acc.push(item);
        }

        return acc;
      }, [] as ItemInterface[]) ?? []
    ); // Fallback to empty array
  }, [taskFiles]);

  return (
    <>
      <FileListHeaderActions tab={tab || "row"} />
      <div className="flex-grow flex-row-start gap-2 relative flex-1  min-h-0  min-w-0">
        <FileList
          projectFiles={formattedFiles}
          phaseFiles={phaseFiles}
          taskFiles={taskFiles}
          versionFiles={taskVersionFiles}
          isLoading={isLoading}
          {...queries}
        />

        <SidepanelDrawerComponent
          paramKey={"filters"}
          title="Filters"
          description="Set filters here"
          content={
            <FileFilters
              phases={_phaseItems}
              tasks={_taskItems}
              taskVersionItems={_taskVersionItems}
              {...queries}
            />
          }
        />
      </div>
    </>
  );
}
