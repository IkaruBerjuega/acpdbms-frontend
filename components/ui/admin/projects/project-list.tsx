"use client";
import ProjectsTableHeaderActions from "@/components/ui/admin/projects/table-header";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Table from "@/components/ui/admin/projects/table";
import { ProjectListResponseInterface } from "@/lib/definitions";
import { AddBtn } from "../../button";
import { VscListSelection } from "react-icons/vsc";
import { PiCardsThreeLight } from "react-icons/pi";
import Cards from "./project-cards-wrapper";

export default function ProjectList<T extends ProjectListResponseInterface>({
  isArchived,
  initialData,
}: {
  isArchived: boolean;
  initialData: T[];
}) {
  return (
    <Tabs
      defaultValue={"list"}
      className="flex flex-col flex-grow gap-2 h-screen  min-h-0"
    >
      {/* header actions */}
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

      {/* main content view table */}
      <main className="w-full  flex-col-start gap-2 bg-white-primary rounded-b-lg shadow-md system-padding overflow-y-auto flex-1 ">
        {/* Table View */}
        <TabsContent value="list" className="flex-grow">
          <Table isArchived={isArchived} initialData={initialData} />
        </TabsContent>
        {/* Card View */}
        <TabsContent value="card" className="flex-grow">
          <Cards isArchived={isArchived} initialData={initialData} />
        </TabsContent>
      </main>
    </Tabs>
  );
}
