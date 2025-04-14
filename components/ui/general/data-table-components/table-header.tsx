"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { ButtonIconTooltipDialog, ButtonTooltip } from "../../button";
import { Search } from "./search";
import { useCallback } from "react";
import { useQueryParams } from "@/hooks/use-query-params";
import { useCheckboxStore } from "@/hooks/states/create-store";

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
  const { data, resetData } = useCheckboxStore();

  const toggleArchived = useCallback(() => {
    resetData();
    if (isArchived) {
      params.delete("archived"); // Remove param when toggled to false
    } else {
      params.set("archived", "true"); // Set param when toggled to true
    }

    const queryString = params.toString();
    const newUrl = queryString ? `${pathname}?${queryString}` : pathname;

    replace(newUrl);
  }, [params, pathname, isArchived, replace]);

  const archiveUnarchiveImgSrc = isArchived
    ? "/button-svgs/table-header-unarchive.svg"
    : "/button-svgs/table-header-archive.svg";

  const archiveUnarchiveImgAlt = isArchived
    ? "unarchive many accounts button"
    : "archive many accounts button";

  const archiveUnarchiveTitle = isArchived
    ? "Unarchive Accounts"
    : "Archive Accounts";

  const archiveUnarchiveDesc = isArchived
    ? "Do you confirm on unarchiving the accounts"
    : "Do you confirm on archiving the accounts";

  let isBtnArchiveUnarchiveDisabled =
    data.length > 0 &&
    data.some(
      (item) => item.status === "deactivated" || item.status === "finished"
    );

  return (
    <div className="system-padding bg-white-primary w-full lg:w-full flex-col-start lg:flex-row-between-center  rounded-t-lg shadow-md gap-2 ">
      <Search
        className={"w-full lg:w-1/2"}
        placeholder={`Search ${tableName}`}
      />
      <div className="  flex-1  min-w-0 overflow-x-auto lg:flex-grow h-full flex justify-end gap-2">
        {onArchive && (
          <ButtonIconTooltipDialog
            iconSrc={archiveUnarchiveImgSrc}
            alt={archiveUnarchiveImgAlt}
            tooltipContent={archiveUnarchiveTitle}
            dialogTitle={archiveUnarchiveTitle}
            dialogDescription={archiveUnarchiveDesc}
            dialogContent={onArchive.archiveDialogContent}
            submitType={"button"}
            submitTitle="Confirm"
            onClick={() => onArchive.fn()}
            className={`${
              isArchived
                ? "bg-green-600 hover:!bg-green-900"
                : "bg-black-primary hover:!bg-black-secondary"
            } `}
            disabled={!isBtnArchiveUnarchiveDisabled}
          />
        )}
        {onShowArchive && (
          <ButtonTooltip
            tooltip={`Show Archived ${tableName}`}
            className={`${isArchived && "bg-gray-100 hover:!bg-gray-200"}`}
            iconSrc="/button-svgs/table-header-show-archive.svg"
            onClick={toggleArchived}
          />
        )}
        {onGenerateReport && (
          <ButtonTooltip
            tooltip={`Generate ${tableName} Report`}
            iconSrc="/button-svgs/table-header-generate-report.svg"
          />
        )}
        {additionalElement && additionalElement}
      </div>
    </div>
  );
}
