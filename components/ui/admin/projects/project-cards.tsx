"use client";
import { useSearchParams } from "next/navigation";

import { useEffect } from "react";

import { useCustomTable } from "../../general/data-table-components/custom-tanstack";
import FilterPopOver from "../../general/data-table-components/filter-components/filter-popover";
import { LuFilter } from "react-icons/lu";
import Card from "../../project-card";
import { Pagination } from "../../general/data-table-components/Pagination";
import { useCreateTableColumns } from "../../general/data-table-components/create-table-columns";
import { columns } from "./project-columns";
import { useProjectList } from "@/hooks/general/use-project";

export default function ProjectCards<T>({
  isArchived,
  initialData,
}: {
  isArchived: boolean;
  initialData: T[];
}) {
  const searchParams = useSearchParams();
  const query = searchParams.get("query") || "";

  const transformedColumns = useCreateTableColumns<T>(columns, "Projects");

  const { data: projectList, isLoading } = useProjectList<T>({
    isArchived: isArchived,
    initialData: initialData,
  });

  if (isLoading) {
    return <>Loading</>;
  }

  if (!projectList || projectList.length === 0) {
    return <>{isArchived ? "No Archived Projects Yet" : "No Projects Yet"} </>;
  }

  const { table, filterComponents, filters, pagination } = useCustomTable(
    query,
    projectList,
    transformedColumns,
    12,
    searchParams
  );

  //Rendered TSX after fetching
  return (
    <div className="flex w-full flex-col gap-2">
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
          {filterComponents} {/* Render FilterUi components */}
        </div>
      </div>
      <div className="w-full grid grid-cols-1 sm:grid-cols-2 2xl:grid-cols-4 lg:grid-cols-3 gap-12 sm:gap-4 ">
        {table.getRowModel().rows?.length ? (
          table
            .getRowModel()
            .rows.map((row) => <Card key={row.id} row={row} isClient={false} />)
        ) : (
          <div className="w-full h-full col-span-full flex justify-center items-center">
            No projects.
          </div>
        )}
      </div>
      {/* pagination */}
      <Pagination table={table} pagination={pagination} />
    </div>
  );
}
