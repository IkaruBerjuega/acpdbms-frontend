"use client";
import { ButtonTooltip } from "../../button";
import { Search } from "./search";

interface DataTableHeaderInterface {
  tableName: string;
  onArchive?: () => void;
  onShowArchive?: () => void;
  onGenerateReport?: () => void;
  additionalElement?: JSX.Element;
}

export default function DataTableHeader({
  tableName = "Items",
  onArchive,
  onShowArchive,
  onGenerateReport,
  additionalElement,
}: DataTableHeaderInterface) {
  return (
    <div className="system-padding bg-white-primary w-full lg:w-full flex-row-between-center rounded-t-lg shadow-md">
      <Search
        className={"w-full xl:w-1/2"}
        placeholder={`Search ${tableName}`}
      />
      <div className="flex-grow flex justify-end h-full gap-2">
        {onArchive && (
          <ButtonTooltip
            tooltip={`Archive ${tableName}s`}
            className={"bg-black-primary"}
            iconSrc="/button-svgs/table-header-archive.svg"
          />
        )}
        {onShowArchive && (
          <ButtonTooltip
            tooltip={`Show Archived ${tableName}s`}
            iconSrc="/button-svgs/table-header-show-archive.svg"
          />
        )}
        {onGenerateReport && (
          <ButtonTooltip
            tooltip={`Generate ${tableName}s Report`}
            iconSrc="/button-svgs/table-header-generate-report.svg"
          />
        )}
        {additionalElement && additionalElement}
      </div>
    </div>
  );
}
