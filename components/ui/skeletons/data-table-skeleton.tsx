"use client";

import { Skeleton } from "@/components/ui/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

export function DataTableSkeleton({
  columnCount = 5,
  rowCount = 10,
  showFilters = true,
  showPagination = true,
  className,
}: {
  columnCount?: number;
  rowCount?: number;
  showFilters?: boolean;
  showPagination?: boolean;
  className?: string;
}) {
  return (
    <div className={`flex w-full flex-col gap-2 min-w-0 ${className}`}>
      {showFilters && (
        <div className="flex flex-wrap flex-col w-full h-auto gap-2">
          <div>
            <Skeleton className="h-9 w-14 rounded-md" />
          </div>
        </div>
      )}

      <div className="rounded-lg border min-w-0">
        <Table className="w-full table-auto">
          <TableHeader>
            <TableRow className="text-sm">
              {Array.from({ length: columnCount }).map((_, index) => (
                <TableHead
                  key={index}
                  className="py-1 border-r-[1px] relative h-[40px]"
                >
                  <div className="flex items-center h-full px-4 w-full">
                    <Skeleton className="h-4 w-full" />
                  </div>
                </TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            {Array.from({ length: rowCount }).map((_, rowIndex) => (
              <TableRow key={rowIndex}>
                {Array.from({ length: columnCount }).map((_, colIndex) => (
                  <TableCell
                    key={`${rowIndex}-${colIndex}`}
                    className="h-[50px] p-0"
                  >
                    <div className="flex items-center h-full px-4 w-full">
                      <Skeleton className="h-4 w-full" />
                    </div>
                  </TableCell>
                ))}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {showPagination && (
        <div className="flex items-center justify-between py-2">
          <div className="flex items-center gap-2">
            <Skeleton className="h-8 w-20 rounded-md" />
            <Skeleton className="h-8 w-16 rounded-md" />
          </div>
          <div className="flex items-center gap-1">
            <Skeleton className="h-8 w-8 rounded-md" />
            <Skeleton className="h-8 w-8 rounded-md" />
            <Skeleton className="h-8 w-8 rounded-md" />
            <Skeleton className="h-8 w-8 rounded-md" />
            <Skeleton className="h-8 w-8 rounded-md" />
          </div>
        </div>
      )}
    </div>
  );
}
