"use client";

import {
  ColumnInterfaceProp,
  ProjectListResponseInterface,
} from "@/lib/definitions";
import { useProjectList } from "@/hooks/general/use-project";
import { useCreateTableColumns } from "../../general/data-table-components/create-table-columns";
import DataTable from "../../general/data-table-components/data-table";

export default function Table<T extends ProjectListResponseInterface>({
  isArchived,
  initialData,
}: {
  isArchived: boolean;
  initialData: T[];
}) {
  const columns: ColumnInterfaceProp[] = [
    {
      id: "select",
      filterFn: false,
    },
    {
      accessorKey: "id",
      enableHiding: true,
    },

    {
      accessorKey: "project_title",
      header: "Project Title",
      meta: {
        filter_name: "Project Title",
        filter_type: "text",
        filter_columnAccessor: "project_title",
      },
      filterFn: true,
    },
    {
      accessorKey: "location",
      header: "Location",
      meta: {
        filter_name: "Location",
        filter_type: "text",
        filter_columnAccessor: "location",
      },
      filterFn: true,
    },
    {
      accessorKey: "client_name",
      header: "Client Name",
      meta: {
        filter_name: "Client Name",
        filter_type: "text",
        filter_columnAccessor: "client_name",
      },
      filterFn: true,
    },
    {
      accessorKey: "project_manager",
      header: "Project Manager",
      meta: {
        filter_name: "Project Manager",
        filter_type: "text",
        filter_columnAccessor: "project_manager",
      },
      filterFn: true,
    },
    {
      accessorKey: "start_date",
      header: "Start Date",
    },

    {
      accessorKey: "end_date",
      header: "End Date",
    },
    {
      accessorKey: "finish_date",
      header: "Finish Date",
    },
    {
      accessorKey: "status",
      header: "Status",
      meta: {
        filter_name: "Status",
        filter_type: "select",
        filter_columnAccessor: "status",
        filter_options: [
          "finished",
          "on-hold",
          "ongoing",
          "cancelled",
          "archived",
        ],
      },
      filterFn: true,
    },
    {
      accessorKey: "image_url",
      header: "Image",
      enableHiding: true,
    },
    {
      id: "actions",
      header: "Actions",
    },
  ];
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

  return (
    <DataTable
      columns={transformedColumns}
      data={projectList}
      tableClassName="min-w-[1600px]"
    />
  );
}
