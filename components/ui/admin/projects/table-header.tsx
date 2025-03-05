"use client";

import { useRouter } from "next/navigation";
import DataTableHeader from "../../general/data-table-components/table-header";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { VscListSelection } from "react-icons/vsc";
import { PiCardsThreeLight } from "react-icons/pi";
import { AddBtn, Button } from "../../button";

interface ProjectsTableHeaderActionsProps {
  activeTab: string;
  setActiveTab: (value: string) => void;
}

export default function ProjectsTableHeaderActions({
  activeTab,
  setActiveTab,
}: ProjectsTableHeaderActionsProps) {
  const router = useRouter();

  // tabslist for project view
  const tabsElement = (
    <>
      {/* add project button */}
      <AddBtn
        label={`Add Project`}
        href={"/admin/projects/create"}
        dark={true}
      />
      <TabsList className="flex h-full">
        <TabsTrigger
          value="list"
          className=""
          onClick={() => setActiveTab("list")}
        >
          <VscListSelection className="h-5 w-5 text-gray-500 " />
        </TabsTrigger>
        <TabsTrigger
          value="card"
          className=""
          onClick={() => setActiveTab("card")}
        >
          <PiCardsThreeLight className="h-5 w-5 text-gray-500" />
        </TabsTrigger>
      </TabsList>
    </>
  );

  return (
    <DataTableHeader
      tableName="Project"
      onArchive={{ fn: () => {}, archiveDialogContent: <></> }}
      onShowArchive={true}
      onGenerateReport={true}
      additionalElement={tabsElement}
    />
  );
}
