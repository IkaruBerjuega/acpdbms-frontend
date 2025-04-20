'use client';

import DataTableHeader from '../../general/data-table-components/table-header';

interface ProjectsTableHeaderActionsProps {
  components: JSX.Element;
}

export default function FilesTableHeaderActions({
  components,
}: ProjectsTableHeaderActionsProps) {
  return (
    <DataTableHeader
      tableName='File'
      onArchive={{ fn: () => {}, archiveDialogContent: <></> }}
      onShowArchive={true}
      onGenerateReport={true}
      additionalElement={components}
    />
  );
}
