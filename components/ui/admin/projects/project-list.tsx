"use client";

import { useState } from "react";
import ProjectsTableHeaderActions from "@/components/ui/admin/projects/table-header";
import { Tabs, TabsContent } from "@/components/ui/tabs";
import Table from "@/components/ui/admin/projects/table";
import ProjectCards from "../../general/data-table-components/project-cards";
import { ProjectListResponseInterface } from "@/lib/definitions";

export default function ProjectList<T extends ProjectListResponseInterface>({
  isArchived,
  initialData,
}: {
  isArchived: boolean;
  initialData: T[];
}) {
  const [activeTab, setActiveTab] = useState("list");

  return (
    <Tabs
      defaultValue={activeTab}
      onValueChange={setActiveTab}
      className="flex flex-col flex-grow gap-2 "
    >
      {/* header actions */}
      <ProjectsTableHeaderActions
        activeTab={activeTab}
        setActiveTab={setActiveTab}
      />

      {/* main content view table */}
      <main className="w-full h-full flex-col-start gap-2 bg-white-primary  rounded-b-lg shadow-md system-padding">
        <TabsContent value="list">
          <div className="flex-grow">
            <Table isArchived={isArchived} initialData={initialData} />
          </div>
        </TabsContent>
        {/* main content view cards */}
        <TabsContent value="card">
          <div className="flex-grow">
            <ProjectCards query={""} />
          </div>
        </TabsContent>
      </main>
    </Tabs>
  );
}
