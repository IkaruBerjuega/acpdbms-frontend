import { useCreateTableColumns } from "../../general/data-table-components/create-table-columns";
import { useProjectList } from "@/hooks/general/use-project";
import ProjectCards from "../../general/data-table-components/project-cards";
import { columns } from "./project-columns";
import {
  ProjectListResponseInterface,
  RevisionInterface,
} from "@/lib/definitions";

export default function Cards<T extends ProjectListResponseInterface>({
  isArchived,
  initialData,
}: {
  isArchived: boolean;
  initialData: T[];
}) {
  const transformedColumns = useCreateTableColumns<RevisionInterface>(
    columns,
    "Projects"
  );

  const { data: projectList, isLoading } = useProjectList<T>({
    isArchived: isArchived,
    initialData: initialData,
  });

  //transform the data so that the project revisions can be in the main display
  const transformedProjectList =
    projectList?.flatMap((project) => {
      const { revisions, ...mainProjectWithoutRevisions } = project;

      // Just return the revisions as-is; they already don't have the `revisions` field
      const flattenedRevisions = revisions ?? [];

      return [mainProjectWithoutRevisions, ...flattenedRevisions];
    }) || [];

  if (isLoading) return <p>Loading...</p>;
  if (!projectList) return <>No Projects Yet</>;
  return (
    <ProjectCards columns={transformedColumns} data={transformedProjectList} />
  );
}
