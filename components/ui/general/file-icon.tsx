import { FaFileImage, FaFilePdf, FaFileAlt } from "react-icons/fa";
import { SiAutodesk } from "react-icons/si"; // For CAD files

export const FileIcon = ({ fileType }: { fileType: string }) => {
  const typeMapping: Record<string, JSX.Element> = {
    "image/jpeg": <FaFileImage className="text-blue-500" />,
    "image/png": <FaFileImage className="text-blue-500" />,
    "image/gif": <FaFileImage className="text-blue-500" />,
    "image/bmp": <FaFileImage className="text-blue-500" />,
    "image/webp": <FaFileImage className="text-blue-500" />,
    "application/pdf": <FaFilePdf className="text-red-500" />,
    "application/vnd.dwg": <SiAutodesk className="text-green-500" />,
    "application/dxf": <SiAutodesk className="text-green-500" />,
  };

  return typeMapping[fileType] || <FaFileAlt className="text-gray-500" />;
};
