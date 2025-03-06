"use client";

import { useRouter } from "next/navigation";
import DataTableHeader from "../../general/data-table-components/table-header";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { VscListSelection } from "react-icons/vsc";
import { PiCardsThreeLight } from "react-icons/pi";
import { AddBtn, Button } from "../../button";

interface ProjectsTableHeaderActionsProps {
  components: JSX.Element;
}

export default function ProjectsTableHeaderActions({
  components,
}: ProjectsTableHeaderActionsProps) {
  return (
    <DataTableHeader
      tableName="Project"
      onArchive={{ fn: () => {}, archiveDialogContent: <></> }}
      onShowArchive={true}
      onGenerateReport={true}
      additionalElement={components}
    />
  );
}
