import { useCreateTableColumns } from "../../general/data-table-components/create-table-columns";
import { useProjectList } from "@/hooks/general/use-project";
import ProjectCards from "../../general/data-table-components/project-cards";
import { columns } from "./project-columns";
import { ProjectListResponseInterface } from "@/lib/definitions";

export default function Cards<T extends ProjectListResponseInterface>({
  isArchived,
  initialData,
}: {
  isArchived: boolean;
  initialData: T[];
}) {
  const transformedColumns = useCreateTableColumns<T>(columns, "Projects");

  const { data: ProjectList, isLoading } = useProjectList<T>({
    isArchived: isArchived,
    initialData: initialData,
  });

  if (isLoading) return <p>Loading...</p>;
  if (!ProjectList) return <>No Projects Yet</>;
  return <ProjectCards columns={transformedColumns} data={ProjectList} />;
}
