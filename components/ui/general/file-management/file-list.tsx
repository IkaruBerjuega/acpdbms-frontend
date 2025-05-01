"use client";

import { File, FilesPageProps } from "@/lib/files-definitions";
import { Fragment, useEffect, useState } from "react";
import FileCard from "./file-card";
import FileRow from "./file-row";

interface FileListProps<T> extends FilesPageProps {
  projectFiles: T[] | undefined;
  phaseFiles: T[] | undefined;
  taskFiles: T[] | undefined;
  versionFiles: T[] | undefined;
  isLoading: boolean;
  role: "admin" | "employee" | "client";
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

  const [firstIndex, setFirstIndex] = useState<number>(-1);
  const [secondIndex, setSecondIndex] = useState<number>(-1);

  return (
    <div
      className={`flex-grow  ${
        isCardView
          ? " grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6  gap-4 auto-rows-max "
          : "flex-col-start gap-2"
      } bg-white-primary rounded-b-md system-padding overflow-y-auto shadow-md`}
    >
      {!props.isLoading ? (
        <>
          {!!props.projectId ? (
            <>
              {filteredFiles.length > 0 ? (
                <>
                  {filteredFiles.map((file, index) => {
                    return (
                      <Fragment key={index}>
                        {isCardView ? (
                          <FileCard
                            projectId={props.projectId!}
                            file={file}
                            filteredFiles={filteredFiles}
                            firstIndex={firstIndex}
                            secondIndex={secondIndex}
                            setFirstIndex={setFirstIndex}
                            setSecondIndex={setSecondIndex}
                            role={props.role}
                          />
                        ) : (
                          <FileRow
                            projectId={props.projectId!}
                            file={file}
                            filteredFiles={filteredFiles}
                            firstIndex={firstIndex}
                            secondIndex={secondIndex}
                            setFirstIndex={setFirstIndex}
                            setSecondIndex={setSecondIndex}
                            role={props.role}
                          />
                        )}
                      </Fragment>
                    );
                  })}
                </>
              ) : (
                <p className="text-slate-500">No Files </p>
              )}
            </>
          ) : (
            <>Set Filters</>
          )}
        </>
      ) : (
        "Loading files..."
      )}
    </div>
  );
}
