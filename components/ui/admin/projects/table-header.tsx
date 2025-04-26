"use client";

import { requestAPI } from "@/hooks/tanstack-query";
import { BtnGenerateCSVReport } from "../../general/btn-reports";
import DataTableHeader from "../../general/data-table-components/table-header";
import { useQueryParams } from "@/hooks/use-query-params";

interface ProjectsTableHeaderActionsProps {
  components: JSX.Element;
}

export default function ProjectsTableHeaderActions({
  components,
}: ProjectsTableHeaderActionsProps) {
  const { paramsKey } = useQueryParams();
  const isArchived = paramsKey["archived"] === "true";

  return (
    <DataTableHeader
      tableName="Project"
      onArchive={{ fn: () => {}, archiveDialogContent: <></> }}
      onShowArchive={true}
      onGenerateReportElement={
        <BtnGenerateCSVReport
          onClick={async () => {
            const projects = await requestAPI({
              url: !isArchived ? "/project-list" : "/projects/archived",
              body: null,
              contentType: "application/json",
              auth: true,
              method: "GET",
            });

            return projects;
          }}
          label={isArchived ? "Archived Projects List" : "Active Projects List"}
        />
      }
      additionalElement={components}
    />
  );
}
