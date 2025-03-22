import { Row } from "@tanstack/react-table";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function requireError(name: string) {
  return `${name} is Required`;
}

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const multiFilter = <T>(
  row: Row<T>,
  columnId: string, // Ensure columnId matches a valid key in T
  filterValues: string[]
) => {
  if (!filterValues || filterValues.length === 0) {
    return true;
  }

  const checkValue = (value: unknown) => {
    const stringValue = Array.isArray(value) ? value.join(" ") : String(value);

    return filterValues.some((filterValue) => {
      // Handle range filtering (e.g., "10-20")
      const rangeMatch = filterValue.match(/^(\d+)-(\d+)$/);
      if (rangeMatch) {
        const [start, end] = rangeMatch.map(Number);
        const numericValue = parseFloat(stringValue);
        return numericValue >= start && numericValue <= end;
      }

      // Fallback to substring matching
      return stringValue.toLowerCase().includes(filterValue.toLowerCase());
    });
  };

  // Check the parent row value
  const parentRowValue = row.getValue(columnId);
  if (checkValue(parentRowValue)) {
    return true;
  }

  // Check subrows
  const subRows = row.subRows || [];
  for (const subRow of subRows) {
    const subRowValue = subRow.getValue(columnId);
    if (checkValue(subRowValue)) {
      return true;
    }
  }

  return false; // No matches found
};

export const getFileExtension = (mimeType: string): string => {
  switch (mimeType.toLowerCase()) {
    // PDF File
    case "application/pdf":
      return "pdf";

    // Image Files
    case "image/jpeg":
      return "jpg";
    case "image/png":
      return "png";
    case "image/gif":
      return "gif";
    case "image/bmp":
      return "bmp";
    case "image/tiff":
      return "tiff";
    case "image/webp":
      return "webp";

    // Video Files
    case "video/mp4":
      return "mp4";
    case "video/avi":
      return "avi";
    case "video/mkv":
      return "mkv";
    case "video/mov":
      return "mov";
    case "video/webm":
      return "webm";

    // Audio Files
    case "audio/mpeg":
      return "mp3";
    case "audio/ogg":
      return "ogg";
    case "audio/wav":
      return "wav";
    case "audio/mp3":
      return "mp3";
    case "audio/flac":
      return "flac";

    // Word Document Files
    case "application/msword":
      return "doc";
    case "application/vnd.openxmlformats-officedocument.wordprocessingml.document":
      return "docx";

    // Excel Spreadsheet Files
    case "application/vnd.ms-excel":
      return "xls";
    case "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet":
      return "xlsx";

    // PowerPoint Files
    case "application/vnd.ms-powerpoint":
      return "ppt";
    case "application/vnd.openxmlformats-officedocument.presentationml.presentation":
      return "pptx";

    // Plain Text Files
    case "text/plain":
      return "txt";

    // HTML Files
    case "text/html":
      return "html";

    // JSON Files
    case "application/json":
      return "json";

    // JavaScript Files
    case "application/javascript":
    case "text/javascript":
      return "js";

    // CSS Files
    case "text/css":
      return "css";

    // Zip Files
    case "application/zip":
    case "application/x-zip-compressed":
      return "zip";

    // JSON-LD Files
    case "application/ld+json":
      return "json-ld";

    // 🏗️ CAD Files
    case "application/acad":
    case "application/x-dwg":
    case "image/vnd.dwg":
      return "dwg";

    case "application/dxf":
    case "image/vnd.dxf":
    case "application/x-dxf":
      return "dxf";

    case "model/vnd.dwf":
    case "application/x-dwf":
      return "dwf";

    case "model/iges":
      return "iges";

    case "model/step":
    case "model/stp":
      return "step";

    case "model/stl":
    case "application/sla":
      return "stl";

    // Default Fallback
    default:
      return "file";
  }
};

export function titleCase(str: string | null) {
  if (!str) return;
  return str
    .toLowerCase()
    .split(" ")
    .map(function (word) {
      return word.charAt(0).toUpperCase() + word.slice(1);
    })
    .join(" ");
}

// Task phase badge colors
export const tailwindColors = [
  "slate",
  "gray",
  "stone",
  "red",
  "orange",
  "amber",
  "yellow",
  "lime",
  "green",
  "emerald",
  "teal",
  "cyan",
  "sky",
  "blue",
  "indigo",
  "violet",
  "purple",
  "fuchsia",
  "pink",
  "rose",
];

// Generate safelist patterns for bg-[color]-200 and text-[color]-600
export const safelist = tailwindColors.flatMap((color) => [
  `bg-${color}-50`, // For light background
  `text-${color}-600`, // For dark text
]);

export const getPhaseBadgeColor = (phases: string[]) => {
  const usedColors = new Set<string>();

  return phases.reduce((acc, phase) => {
    let color;
    do {
      color = tailwindColors[Math.floor(Math.random() * tailwindColors.length)];
    } while (usedColors.has(color)); // Ensure uniqueness

    usedColors.add(color);

    acc[phase] = {
      light: `bg-${color}-50`,
      dark: `text-${color}-600`,
    };

    console.log(acc);

    return acc;
  }, {} as Record<string, { light: string; dark: string }>);
};

//for avatar fallback
export function getInitialsFallback(name: string) {
  const initialsAsProfileSrcFallback =
    name !== "Admin"
      ? name
          ?.split(" ")
          .map((part, index, arr) =>
            index === 0 || index === arr.length - 1 ? part[0] : null
          )
          .filter(Boolean)
          .join("")
      : "A";
  return initialsAsProfileSrcFallback;
}

export function bytesToMb(
  bytes: number,
  decimals: number = 2,
  base10: boolean = false
): number {
  if (typeof bytes !== "number" || isNaN(bytes)) {
    throw new Error("Input must be a valid number");
  }
  if (bytes < 0) {
    throw new Error("Input cannot be negative");
  }
  const divisor = base10 ? 1000 * 1000 : 1024 * 1024; // Bytes to MB directly
  const mb = bytes / divisor;
  return Number(mb.toFixed(decimals));
}

//REGEX PATTERNS

// Reusable email validation regex
export const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
