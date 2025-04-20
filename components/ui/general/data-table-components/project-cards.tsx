"use client";

import FilterPopOver from "./filter-components/filter-popover";
import { LuFilter } from "react-icons/lu";
import Card from "../../project-card";
import { useCustomTable } from "./custom-tanstack";
import { useRouter } from "next/navigation";
import { Pagination } from "./Pagination";
import { ColumnDef } from "@tanstack/react-table";
import { ProjectListResponseInterface } from "@/lib/definitions";

export default function ProjectCards<T extends ProjectListResponseInterface>({
  columns,
  data,
}: {
  columns: ColumnDef<T>[];
  data: T[];
}) {
  const { table, filterComponents, filters, pagination } = useCustomTable<T>(
    data,
    columns,
    12
  );

  const router = useRouter();

  return (
    <div className="flex flex-grow w-full flex-col gap-2">
      <div className="flex flex-wrap flex-col w-full h-auto gap-2">
        <div>
          <FilterPopOver
            width="w-auto"
            content={filters}
            popoverName="Add Filter"
            icon={<LuFilter className="text-xs md:text-lg" />}
          />
        </div>
        <div className="flex flex-wrap flex-row gap-2 w-full h-auto">
          {filterComponents}
        </div>
      </div>
      <div className="w-full grid grid-cols-1 sm:grid-cols-2 2xl:grid-cols-4 lg:grid-cols-3 gap-12 sm:gap-4 ">
        {table.getRowModel().rows.length ? (
          table.getRowModel().rows.map((row) => {
            const projectId = row.getValue("id") as string | undefined;
            return (
              <Card
                key={projectId ?? row.id}
                row={row}
                isClient={false}
                fn={() =>
                  projectId && router.push(`/admin/projects/${projectId}/view`)
                }
              />
            );
          })
        ) : (
          <div className="w-full h-full col-span-full flex justify-center items-center">
            No projects.
          </div>
        )}
      </div>
      <Pagination table={table} pagination={pagination} />
    </div>
  );
}
