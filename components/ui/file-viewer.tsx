"use client";
import { TaskFile } from "@/lib/files-definitions";
import { getFileExtension } from "@/lib/utils";
import Image from "next/image";
import { ButtonLink } from "./button";
import { useState } from "react";
import { MdOutlineZoomIn, MdOutlineZoomOut } from "react-icons/md";
import { Download } from "lucide-react";

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
  const [zoom, setZoom] = useState<number>(100);

  if (!file) {
    return <div className="w-full flex-row-center">No File Selected</div>;
  }

  const fileType = getFileExtension(file.type);
  const imageFormats = ["jpg", "png", "webp", "gif"];
  const isImage = imageFormats.includes(fileType);
  const isPdf = fileType === "pdf";
  const cadFormats = ["dwg", "dxf", "dwf", "iges", "step", "stl"];
  const isCad = cadFormats.includes(fileType);

  const isNotViewable = !isPdf && !isImage;

  const fileUrl = file.path;

  const handleZoom = ({ mode }: { mode: "out" | "in" }) => {
    const interval = 25;

    if (mode === "in" && zoom + interval > 150) {
      return;
    }
    if (mode === "out" && zoom - interval < 50) return;

    if (mode === "in") {
      setZoom((prev) => prev + interval);
      return;
    }
    setZoom((prev) => prev - interval);
  };

  if (isNotViewable) {
    return <DownloadFileOption fileName={file.name} fileUrl={file.path} />;
  }

  if (isImage) {
    return (
      <div className="w-full h-full flex-col-center bg-black-primary overflow-auto">
        <div className="flex-row-end-center w-full gap-2 text-4xl absolute z-50 top-4 px-4">
          <MdOutlineZoomIn
            className="text-white-primary hover:text-slate-400 cursor-pointer"
            onClick={() => handleZoom({ mode: "in" })}
          />
          <MdOutlineZoomOut
            className="text-white-primary hover:text-slate-400 cursor-pointer"
            onClick={() => handleZoom({ mode: "out" })}
          />
        </div>

        <Image
          width={1000}
          height={1000}
          style={{
            height: "100%",
            objectFit: "contain",
            userSelect: "none",
            transition: "transform 200ms ease-in-out",
            transform: `scale(${zoom / 100})`,
            transformOrigin: "center",
          }}
          alt={file.name}
          src={fileUrl}
          draggable={false}
        />
      </div>
    );
  }

  return (
    <div className="w-full h-full flex-col-center ">
      <iframe src={fileUrl} className="w-full h-full" />
    </div>
  );
}
