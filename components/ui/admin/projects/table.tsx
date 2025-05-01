"use client";

import { ProjectComponentProps } from "@/lib/definitions";
import DataTable from "../../general/data-table-components/data-table";

export default function Table({ columns, projectList }: ProjectComponentProps) {
  if (!projectList) return null;
  return (
    <DataTable
      columns={columns}
      data={projectList}
      tableClassName="min-w-[1600px]"
    />
  );
}
