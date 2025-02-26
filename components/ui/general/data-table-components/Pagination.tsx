"use client";
import { ButtonLink } from "@/components/ui/button";
import { PaginationState, Table } from "@tanstack/react-table";
import {
  MdKeyboardDoubleArrowLeft,
  MdKeyboardDoubleArrowRight,
} from "react-icons/md";

export function Pagination<T>({
  table,
  pagination,
}: {
  table: Table<T>;
  pagination: PaginationState;
}) {
  return (
    <div className="flex items-center flex-col md:flex-row h-auto gap-3 mt-2">
      <div className="flex justify-between flex-grow w-full">
        <div className="flex text-xs md:text-sm flex-row gap-1 justify-start w-full">
          {table.getFilteredSelectedRowModel().rows.length} of{" "}
          {table.getFilteredRowModel().rows.length} row(s) selected.
        </div>
        <div className="flex text-xs md:text-sm flex-row gap-1 justify-end w-full">
          <p>Page</p>
          <div>
            <strong>
              {pagination.pageIndex + 1} of{" "}
              {table.getPageCount().toLocaleString()}
            </strong>
          </div>
        </div>
      </div>
      <div className="flex flex-row gap-2 justify-end w-full md:w-auto">
        <ButtonLink
          variant="outline"
          onClick={() => table.setPageIndex(0)}
          href=""
          id="first"
          disabled={!table.getCanPreviousPage()}
        >
          <MdKeyboardDoubleArrowLeft className="text-xs md:text-lg" />
        </ButtonLink>
        <ButtonLink
          variant="outline"
          href=""
          onClick={() => table.previousPage()}
          id="previous"
          disabled={!table.getCanPreviousPage()}
          className="text-xs md:text-sm"
        >
          Previous
        </ButtonLink>
        <ButtonLink
          variant="outline"
          href=""
          onClick={() => table.nextPage()}
          id="next"
          disabled={!table.getCanNextPage()}
          className="text-xs md:text-sm"
        >
          Next
        </ButtonLink>
        <ButtonLink
          variant="outline"
          href=""
          onClick={() => table.setPageIndex(table.getPageCount() - 1)}
          id="last"
          disabled={!table.getCanNextPage()}
        >
          <MdKeyboardDoubleArrowRight className="text-xs md:text-lg" />
        </ButtonLink>
      </div>
    </div>
  );
}
