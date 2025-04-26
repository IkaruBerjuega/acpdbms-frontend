import { useCreateTableColumns } from "../../general/data-table-components/create-table-columns";
import { useProjectList } from "@/hooks/general/use-project";
import ProjectCards from "../../general/data-table-components/project-cards";
import { columns } from "./project-columns";
import { ProjectListResponseInterface } from "@/lib/definitions";

export default function Cards({
  isArchived,
  initialData,
}: {
  isArchived: boolean;
  initialData: ProjectListResponseInterface[];
}) {
  const transformedColumns =
    useCreateTableColumns<ProjectListResponseInterface>(columns, "Projects");

  const { data: projectList, isLoading } =
    useProjectList<ProjectListResponseInterface>({
      isArchived: isArchived,
      initialData: initialData,
    });

  if (isLoading) return <p>Loading...</p>;
  if (!projectList) return <>No Projects Yet</>;
  return <ProjectCards columns={transformedColumns} data={projectList} />;
}
