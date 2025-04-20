"use client";
import { type ColumnDef, flexRender } from "@tanstack/react-table";
import { Button } from "@/components/ui/button";
import {
  Table as TableRoot,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import FilterPopOver from "./filter-components/filter-popover";
import { LuFilter } from "react-icons/lu";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { PiDotsThreeVerticalBold } from "react-icons/pi";
import { TiPin } from "react-icons/ti";
import { IoArrowUpOutline } from "react-icons/io5";
import { useCustomTable } from "./custom-tanstack";
import { Pagination } from "./Pagination";

export default function DataTable<T>({
  columns,
  data,
  tableClassName,
  hidden,
  id = "data-table",
}: {
  columns: ColumnDef<T>[];
  data: T[];
  tableClassName?: string;
  hidden?: boolean;
  id?: string;
}) {
  const { table, filterComponents, filters, pagination } = useCustomTable<T>(
    data,
    columns,
    10
  );

  return (
    <div
      className={`flex w-full flex-col gap-2 ${hidden && "hidden"} min-w-0 `}
    >
      <div className="flex flex-wrap flex-col w-full h-auto gap-2">
        <div>
          <FilterPopOver
            width="w-auto"
            content={filters}
            popoverName="+"
            icon={<LuFilter className="text-xs md:text-lg" />}
          />
        </div>

        <div className="flex flex-wrap flex-row gap-2 w-full h-auto">
          {filterComponents}
        </div>
      </div>
      <div className="rounded-lg border min-w-0">
        <TableRoot id={id} className={`w-full table-auto ${tableClassName} ]`}>
          <TableHeader>
            {table?.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup?.id} className="text-sm">
                {headerGroup?.headers.map((header) => {
                  const { column } = header;
                  return (
                    <TableHead
                      key={header?.id}
                      id={header?.id}
                      style={{
                        height: 15,
                        // ...getCommonPinningStyles(column),
                        padding: header.column.getCanPin() ? 8 : 0,
                      }}
                      className={`py-1  ${
                        column.getIsPinned() === "right" &&
                        "border-l-[1px] border-r-0 "
                      } ${
                        header.column.id === "select" && "w-[15px] px-2"
                      } border-r-[1px] relative`}
                    >
                      <div
                        className={`flex  items-center h-full px-4  ${
                          header.column.id === "select"
                            ? "justify-start"
                            : " w-full"
                        }`}
                      >
                        <div className=" font-semibold w-full text-xs ">
                          {header.isPlaceholder
                            ? null
                            : flexRender(
                                header.column.columnDef.header,
                                header.getContext()
                              )}
                        </div>

                        {!header.isPlaceholder &&
                          header.column.getCanPin() &&
                          header.id != "select" && (
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button variant="ghost" className="p-0">
                                  <PiDotsThreeVerticalBold className="h-4 w-4" />
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent
                                side="bottom"
                                align="end"
                                sideOffset={8}
                                className="text-xs md:text-sm"
                              >
                                <DropdownMenuItem
                                  onClick={() =>
                                    column.toggleSorting(
                                      column.getIsSorted() === "asc"
                                    )
                                  }
                                  className="text-xs md:text-sm"
                                >
                                  {column.getIsSorted() ? (
                                    column.getIsSorted() === "desc" ? (
                                      <>
                                        Sort ascending{" "}
                                        <IoArrowUpOutline className="ml-5 text-lg text-maroon-600" />
                                      </>
                                    ) : (
                                      <>
                                        Sort descending
                                        <IoArrowUpOutline className="ml-5 text-lg rotate-180 text-maroon-600" />
                                      </>
                                    )
                                  ) : (
                                    <>
                                      Sort ascending{" "}
                                      <IoArrowUpOutline className="ml-5 text-lg text-maroon-600" />
                                    </>
                                  )}
                                </DropdownMenuItem>
                                {column.getIsSorted() && (
                                  <DropdownMenuItem
                                    onClick={() => column.clearSorting()}
                                    className="text-xs md:text-sm"
                                  >
                                    Unsort
                                  </DropdownMenuItem>
                                )}

                                <DropdownMenuSeparator />
                                {header.column.getIsPinned() !== "left" ? (
                                  <DropdownMenuItem
                                    className="rounded p-2 flex text-xs md:text-sm  justify-between"
                                    onClick={() => {
                                      header.column.pin("left");
                                    }}
                                  >
                                    Pin to the left
                                    <TiPin className="ml-4 text-xl text-maroon-600" />
                                  </DropdownMenuItem>
                                ) : null}
                                {header.column.getIsPinned() ? (
                                  <DropdownMenuItem
                                    className="rounded text-xs md:text-sm px-2"
                                    onClick={() => {
                                      header.column.pin(false);
                                    }}
                                  >
                                    Unpin
                                  </DropdownMenuItem>
                                ) : null}
                                {header.column.getIsPinned() !== "right" ? (
                                  <DropdownMenuItem
                                    className="rounded px-2 flex text-xs md:text-sm justify-between"
                                    onClick={() => {
                                      header.column.pin("right");
                                    }}
                                  >
                                    Pin to the right
                                    <TiPin className=" ml-4  -rotate-90 text-xl text-maroon-600" />
                                  </DropdownMenuItem>
                                ) : null}
                              </DropdownMenuContent>
                            </DropdownMenu>
                          )}
                      </div>
                    </TableHead>
                  );
                })}
              </TableRow>
            ))}
            {}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && "selected"}
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell
                      key={cell.id}
                      id={cell.id}
                      style={{
                        // width: `${cell.column.getSize()}px`,
                        height: 50,
                        padding: cell.column.getCanPin() ? 8 : 0,
                      }}
                    >
                      <div
                        className={`flex  items-center h-full px-4  ${
                          cell.column.id === "select"
                            ? "justify-start"
                            : " w-full"
                        }   header.column.id === "select" && "w-[15px] px-2 text-sm`}
                      >
                        {flexRender(
                          cell.column.columnDef.cell,
                          cell.getContext()
                        )}
                      </div>
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-24 text-center"
                >
                  No results.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </TableRoot>
      </div>
      <Pagination table={table} pagination={pagination} />
    </div>
  );
}
