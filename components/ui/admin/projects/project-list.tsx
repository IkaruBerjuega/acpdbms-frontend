"use client";

import ProjectsTableHeaderActions from "@/components/ui/admin/projects/table-header";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Table from "@/components/ui/admin/projects/table";
import {
  ColumnInterfaceProp,
  ProjectListResponseInterface,
} from "@/lib/definitions";
import { AddBtn } from "../../button";
import { VscListSelection } from "react-icons/vsc";
import { PiCardsThreeLight } from "react-icons/pi";
import Cards from "./project-cards-wrapper";
import { useCreateTableColumns } from "../../general/data-table-components/create-table-columns";
import { useProjectList } from "@/hooks/general/use-project";
import { DataTableSkeleton } from "../../general/skeletons/data-table-skeleton";

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
    meta: {
      filter_name: "Start Date",
      filter_type: "date",
      filter_columnAccessor: "start_date",
    },
  },
  {
    accessorKey: "end_date",
    header: "End Date",
    meta: {
      filter_name: "End Date",
      filter_type: "date",
      filter_columnAccessor: "end_date",
    },
  },
  {
    accessorKey: "finish_date",
    header: "Finish Date",
    meta: {
      filter_name: "Finish Date",
      filter_type: "date",
      filter_columnAccessor: "finish_date",
    },
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

export default function ProjectList({ isArchived }: { isArchived: boolean }) {
  const transformedColumns =
    useCreateTableColumns<ProjectListResponseInterface>(columns, "Projects");

  const { data: projectList, isLoading } =
    useProjectList<ProjectListResponseInterface>({
      isArchived: isArchived,
    });

  return (
    <Tabs
      defaultValue={"list"}
      className="flex flex-col flex-grow gap-2 h-screen  min-h-0"
    >
      <ProjectsTableHeaderActions
        components={
          <>
            {/* add project button */}
            <AddBtn
              label={`Add Project`}
              href={"/admin/projects/create"}
              dark={true}
            />
            <TabsList className="flex h-full">
              <TabsTrigger value="list">
                <VscListSelection className="h-5 w-5 text-gray-500 " />
              </TabsTrigger>
              <TabsTrigger value="card">
                <PiCardsThreeLight className="h-5 w-5 text-gray-500" />
              </TabsTrigger>
            </TabsList>
          </>
        }
      />

      {/* header actions */}

      {/* main content view table */}
      <main className="w-full  flex-col-start gap-2 bg-white-primary rounded-b-lg shadow-md system-padding overflow-y-auto flex-1 ">
        {/* Table View */}
        <TabsContent value="list" className="flex-grow">
          {isLoading ? (
            <DataTableSkeleton />
          ) : (
            <Table columns={transformedColumns} projectList={projectList} />
          )}
        </TabsContent>
        {/* Card View */}
        <TabsContent value="card" className="flex-grow">
          {isLoading ? (
            <></>
          ) : (
            <Cards columns={transformedColumns} projectList={projectList} />
          )}
        </TabsContent>
      </main>
    </Tabs>
  );
}
