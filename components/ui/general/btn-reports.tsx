"use client";

import Papa from "papaparse";
import { ButtonTooltip } from "../button";

function toSentenceCase(str: string): string {
  return str
    .replace(/_/g, " ") // Replace underscores with spaces
    .toLowerCase() // Convert the entire string to lower case
    .split(" ") // Split into words
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1)) // Capitalize first letter of each word
    .join(" "); // Join back into a single string
}

function flattenData(
  data: Record<string, unknown>[]
): Record<string, unknown>[] {
  return data.map((item) => {
    const flatItem: Record<string, unknown> = {};

    function recurse(obj: Record<string, unknown>, parentKey: string) {
      Object.keys(obj).forEach((key) => {
        const fullKey = parentKey ? `${parentKey}_${key}` : key;
        const formattedKey = toSentenceCase(fullKey); // Format the key to sentence case
        const value = obj[key]; // value is unknown

        if (
          typeof value === "object" &&
          value !== null &&
          !Array.isArray(value)
        ) {
          recurse(value as Record<string, unknown>, fullKey);
        } else {
          flatItem[formattedKey] = value;
        }
      });
    }

    recurse(item, "");
    return flatItem;
  });
}

export function BtnGenerateCSVReport({
  onClick,
  label,
}: {
  onClick: () => Promise<unknown[]>;  
  label: string;
}) {
  const date = new Date();
  const formattedDate = `${String(date.getMonth() + 1).padStart(
    2,
    "0"
  )}-${String(date.getDate()).padStart(2, "0")}-${String(
    date.getFullYear()
  ).slice(2)}`;

  const generateCSVReport = (data: unknown[]) => {
    const flattenedData = flattenData(data as Record<string, unknown>[]);
    const csv = Papa.unparse(flattenedData);
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = label + " - " + formattedDate + ".csv";
    link.click();
  };

  return (
    <ButtonTooltip
      tooltip={"Generate CSV"}
      iconSrc="/button-svgs/table-header-generate-report.svg"
      onClick={async () => {
        const data: unknown[] = await onClick();

        generateCSVReport(data);
      }}
    />
  );
}
