"use client";
import { TaskFile } from "@/lib/files-definitions";
import { getFileExtension } from "@/lib/utils";
import Image from "next/image";
import { Button } from "./button";
import Link from "next/link";
import { useState } from "react";
import { MdOutlineZoomIn, MdOutlineZoomOut } from "react-icons/md";

interface FileViewerProps {
  file: TaskFile | undefined;
}

//dwg, dxf, dwf, iges, step, and stl. - cad files

export default function FileViewer({ file }: FileViewerProps) {
  const [zoom, setZoom] = useState<number>(100);

  if (!file) {
    return <div className="w-full flex-row-center">No File Selected</div>;
  }

  const fileType = getFileExtension(file.type);
  const imageFormats = ["jpg", "png", "webp", "gif"];
  const isImage = imageFormats.includes(fileType);
  const cadFormats = ["dwg", "dxf", "dwf", "iges", "step", "stl"];
  const isCad = cadFormats.includes(fileType);

  const isDocx = fileType === "docx" || fileType === "doc";

  const fileUrl = isCad
    ? `http://sharecad.org/cadframe/load?url=${file.path}`
    : file.path;

  if (isDocx) {
    return (
      <div className="flex-col-center gap-4">
        <span>Can't view docx files. Download the file instead</span>
        <Link
          href={file.path}
          className="bg-black-primary text-white-primary text-sm hover:!bg-black-secondary rounded-md p-2"
        >
          Download File
        </Link>
      </div>
    );
  }

  if (isCad) {
    return (
      <>
        {" "}
        <div className="w-full h-full flex-col-center ">
          <iframe
            src={`https://sharecad.org/cadframe/load?url=${file.path}`}
            className="w-full h-full"
          >
            asdsadas
          </iframe>
        </div>
      </>
    );
  }

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
