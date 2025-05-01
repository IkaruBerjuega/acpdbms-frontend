"use client";
import { TaskFile } from "@/lib/files-definitions";
import { getFileExtension } from "@/lib/utils";
import { ButtonLink } from "./button";
import { Download } from "lucide-react";
import { ImageZoom } from "./general/image-zoom";

interface FileViewerProps {
  file: TaskFile | undefined;
}

const DownloadFileOption = ({
  fileUrl,
  fileName,
}: {
  fileUrl: string;
  fileName: string;
}) => {
  return (
    <div className="flex-col-center gap-4 relative flex-grow w-full">
      <div className="absolute top-4 left-4 text-sm">{fileName}</div>
      <div>Cannot View. Download File Instead </div>
      <ButtonLink
        variant={"default"}
        size={"sm"}
        href={fileUrl}
        target="_blank"
      >
        <Download /> Download
      </ButtonLink>
    </div>
  );
};
//dwg, dxf, dwf, iges, step, and stl. - cad files

export default function FileViewer({ file }: FileViewerProps) {
  if (!file) {
    return (
      <div className=" flex-row-center flex-grow  bg-white-primary rounded-md shadow-md">
        No File Selected
      </div>
    );
  }

  const fileType = getFileExtension(file.type);
  const imageFormats = ["jpg", "png", "webp", "gif"];
  const isImage = imageFormats.includes(fileType);
  const isPdf = fileType === "pdf";
  // const cadFormats = ["dwg", "dxf", "dwf", "iges", "step", "stl"];
  // const isCad = cadFormats.includes(fileType);

  const isNotViewable = !isPdf && !isImage;

  const fileUrl = file.path;

  if (isNotViewable) {
    return (
      <div className="flex-row-center flex-grow  bg-white-primary rounded-md shadow-md">
        <DownloadFileOption fileName={file.name} fileUrl={file.path} />
      </div>
    );
  }

  if (isImage) {
    return <ImageZoom src={file.path} alt={file.name} className="flex-grow" />;
  }

  return (
    <div className="flex-grow flex-col-center ">
      <iframe src={fileUrl} className="w-full h-full" />
    </div>
  );
}
