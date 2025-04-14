"use client";

import { File, FilesPageProps } from "@/lib/files-definitions";
import { Fragment, useEffect, useState } from "react";
import FileCard from "./file-card";
import FileRow from "./file-row";
import { Input } from "../../input";

interface FileListProps<T> extends FilesPageProps {
  projectFiles: T[] | undefined;
  phaseFiles: T[] | undefined;
  taskFiles: T[] | undefined;
  versionFiles: T[] | undefined;
}

export default function FileList<T extends File>(props: FileListProps<T>) {
  const [filteredFiles, setFilteredFiles] = useState<T[]>([]);

  useEffect(() => {
    let baseFiles: T[] = [];

    if (props.taskVersionId && props.versionFiles) {
      baseFiles = props.versionFiles;
    } else if (props.taskId && props.taskFiles) {
      baseFiles = props.taskFiles;
    } else if (props.phaseId && props.phaseFiles) {
      baseFiles = props.phaseFiles;
    } else if (props.projectFiles) {
      baseFiles = props.projectFiles;
    } else {
      baseFiles = [];
    }

    if (props.archived === "true") {
      baseFiles = baseFiles.filter((file) => file.is_archived === true);
    } else if (!props.archived) {
      baseFiles = baseFiles.filter((file) => file.is_archived === false);
    }

    if (props.query) {
      baseFiles = baseFiles.filter((file) =>
        Object.values(file).some((value) =>
          String(value).toLowerCase().includes(props.query!.toLowerCase())
        )
      );
    }

    setFilteredFiles(baseFiles);
  }, [props]);

  //get card
  const isCardView = props.tab === "card";
  const projectId = props.projectId?.split("_")[0];

  const [firstIndex, setFirstIndex] = useState<number>(-1);
  const [secondIndex, setSecondIndex] = useState<number>(-1);

  if (!projectId) {
    return (
      <div className="bg-white-primary rounded-b-md flex-grow ">
        <p className="text-slate-500">Set Filters </p>
      </div>
    );
  }

  return (
    <div
      className={`flex-grow  ${
        isCardView
          ? " grid grid-cols-6  gap-4 auto-rows-max "
          : "flex-col-start gap-2"
      } bg-white-primary rounded-b-md system-padding overflow-y-auto`}
    >
      {filteredFiles.length > 0 ? (
        <>
          {filteredFiles.map((file, index) => {
            return (
              <Fragment key={index}>
                {isCardView ? (
                  <FileCard
                    projectId={projectId!}
                    file={file}
                    filteredFiles={filteredFiles}
                    firstIndex={firstIndex}
                    secondIndex={secondIndex}
                    setFirstIndex={setFirstIndex}
                    setSecondIndex={setSecondIndex}
                  />
                ) : (
                  <FileRow
                    projectId={projectId!}
                    file={file}
                    filteredFiles={filteredFiles}
                    firstIndex={firstIndex}
                    secondIndex={secondIndex}
                    setFirstIndex={setFirstIndex}
                    setSecondIndex={setSecondIndex}
                  />
                )}
              </Fragment>
            );
          })}
        </>
      ) : (
        <p className="text-slate-500">No Files </p>
      )}
    </div>
  );
}
