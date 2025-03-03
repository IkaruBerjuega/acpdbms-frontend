"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { ButtonIconTooltipDialog, ButtonTooltip } from "../../button";
import { Search } from "./search";
import { useCallback } from "react";
import { useQueryParams } from "@/hooks/use-query-params";

interface onArchiveInterface {
  fn: () => void;
  archiveDialogContent: React.JSX.Element;
}

interface DataTableHeaderInterface {
  tableName: string;
  onArchive?: onArchiveInterface;
  onShowArchive?: boolean;
  onGenerateReport?: boolean;
  additionalElement?: JSX.Element;
}

export default function DataTableHeader({
  tableName = "Items",
  onArchive,
  onShowArchive,
  onGenerateReport,
  additionalElement,
}: DataTableHeaderInterface) {
  const { paramsKey, params } = useQueryParams();
  const pathname = usePathname();
  const { replace } = useRouter();

  const isArchived = paramsKey["archived"] === "true";
  2;
  const toggleArchived = useCallback(() => {
    if (isArchived) {
      params.delete("archived"); // Remove param when toggled to false
    } else {
      params.set("archived", "true"); // Set param when toggled to true
    }

    const queryString = params.toString();
    const newUrl = queryString ? `${pathname}?${queryString}` : pathname;

    replace(newUrl);
  }, [params, pathname, isArchived, replace]);

  return (
    <div className="system-padding bg-white-primary w-full lg:w-full flex-row-between-center rounded-t-lg shadow-md">
      <Search
        className={"w-full xl:w-1/2"}
        placeholder={`Search ${tableName}`}
      />
      <div className="flex-grow flex justify-end h-full gap-2">
        {onArchive && (
          <ButtonIconTooltipDialog
            iconSrc={"/button-svgs/table-header-archive.svg"}
            alt={"Archive many accounts button"}
            tooltipContent={"Archive Accounts"}
            dialogTitle={"Archive Accounts"}
            dialogDescription={
              "Do you confirm on archiving the selected accounts?"
            }
            dialogContent={onArchive.archiveDialogContent}
            submitType={"button"}
            submitTitle="Confirm"
            onClick={() => onArchive.fn()}
            className="bg-black-secondary hover:!bg-black-primary"
          />
        )}
        {onShowArchive && (
          <ButtonTooltip
            tooltip={`Show Archived ${tableName}s`}
            className={`${isArchived && "bg-green-200"}`}
            iconSrc="/button-svgs/table-header-show-archive.svg"
            onClick={toggleArchived}
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
