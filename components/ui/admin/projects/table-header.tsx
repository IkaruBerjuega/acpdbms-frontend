"use client";

import DataTableHeader from "../../general/data-table-components/table-header";

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
